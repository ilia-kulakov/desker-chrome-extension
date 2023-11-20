chrome.cookies.onChanged.addListener((changeInfo) => {
    const targetDomain = "desk.epam.com";
    if(changeInfo.cookie.domain == targetDomain) {
        onCookiesChanged(targetDomain, dumpCookies);
    }
});

const onCookiesChanged = debounce(function(targetDomain, callback) { chrome.cookies.getAll({domain: targetDomain}, callback) });

function debounce(func, timeout = 500) {
    let timer;
    return function(...args) {
        clearTimeout(timer);
        timer = setTimeout(() => { func.apply(this, args); }, timeout);
    };
}


async function dumpCookies(cookies) {
    const options = await getOptions();
    const reservationSettings = {
        "url": options.reservationServiceUrl,
        "assetIds": options.assetIds.split(","),
        "partyId": options.partyId,
        "shiftDays": options.shiftDays,
        "cookie": cookies.map(cookie => cookie.name + "=" + cookie.value).join("; ")
    };


    const response = await fetch(options.deskerUrl + "/api/settings", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
          },
        body: JSON.stringify(reservationSettings),
    });

    const result = await response.json();
    console.log(result);
}

async function readStorage(defaultObject) {
    return new Promise((resolve, reject) => {
        chrome.storage.sync.get(defaultObject, function(result) {
                if(result === undefined) {
                    reject();
                }else {
                    resolve(result);
                }
            }
        );
    })
}

async function getOptions() {
    return await readStorage({
        deskerUrl: "http://localhost:8081",
        reservationServiceUrl: null,
        assetIds: null,
        partyId: null,
        shiftDays: 7
    });
}

