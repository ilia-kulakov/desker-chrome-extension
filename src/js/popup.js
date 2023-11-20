// Saves options to chrome.storage
const saveOptions = () => {
    const deskerUrl = document.getElementById('desker-url').value;
    const reservationServiceUrl = document.getElementById('reservation-service-url').value;
    const assetIds = document.getElementById('asset-ids').value;
    const partyId = document.getElementById('party-id').value;
    const shiftDays = document.getElementById('shift-days').value;
  
    chrome.storage.sync.set(
      {
        deskerUrl: deskerUrl,
        reservationServiceUrl: reservationServiceUrl,
        assetIds: assetIds,
        partyId: partyId,
        shiftDays: shiftDays
     },
      () => {
        showMessage('save-alert', "alert alert-success", "Settings saved");
      }
    );
};
  
  // stored in chrome.storage.
const restoreOptions = () => {
    chrome.storage.sync.get(
        {
            deskerUrl: "http://localhost:8081",
            reservationServiceUrl: null,
            assetIds: null,
            partyId: null,
            shiftDays: 7
        },
        (items) => {
            document.getElementById('desker-url').value = items.deskerUrl;
            document.getElementById('reservation-service-url').value = items.reservationServiceUrl;
            document.getElementById('asset-ids').value = items.assetIds;
            document.getElementById('party-id').value = items.partyId;
            document.getElementById('shift-days').value = items.shiftDays;        
        }
    );
};

const fetchSettings = () => {
    const deskerUrl = document.getElementById('desker-url').value;
    fetch(deskerUrl + "/api/settings", {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        }
    }).then((response) => {
        response.json().then((json) => {
            document.getElementById('reservation-service-url').value = json.url;
            document.getElementById('asset-ids').value = json.assetIds.join(",");
            document.getElementById('party-id').value = json.partyId;
            document.getElementById('shift-days').value = json.shiftDays;

            showMessage('fetch-alert', "alert alert-success", "Settings fetched");
        }).catch(showFetchError);
    }).catch(showFetchError);
};

const showMessage = (id, cls, message) => {
    const alert = document.getElementById(id);
    alert.textContent = message;
    alert.className = cls;
    alert.style.visibility = "visible";
    setTimeout(() => {
        alert.textContent = '';
        alert.style.visibility = "hidden";
    }, 1000);
}

const showFetchError = () => { showMessage('fetch-alert', "alert alert-danger", "Connection issue") };


document.addEventListener('DOMContentLoaded', restoreOptions);
document.getElementById('save').addEventListener('click', saveOptions);
document.getElementById('fetch-settings').addEventListener('click', fetchSettings);