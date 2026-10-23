const weatherApi = "https://api.weather.gov/alerts/active?area=";

const stateInput = document.getElementById("state-input");
const fetchBtn = document.getElementById("fetch-alerts");
const alertsDisplay = document.getElementById("alerts-display");
const errorMessage = document.getElementById("error-message");

fetchBtn.addEventListener("click", () => {
  const stateAbbr = stateInput.value ? stateInput.value.trim().toUpperCase() : "";

  // Clear input field immediately upon clicking fetch
  stateInput.value = "";

  resetUI();

  if (!stateAbbr) {
    showError("Please enter a state abbreviation.");
    return;
  }

  fetchAlerts(stateAbbr);
});

function fetchAlerts(state) {
  fetch(`${weatherApi}${state}`)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`Unable to retrieve alerts for state: ${state}`);
      }
      return response.json();
    })
    .then((data) => {
      displayAlerts(data);
    })
    .catch((error) => {
      showError(error.message);
    });
}

function displayAlerts(data) {
  resetUI();

  const count = data.features ? data.features.length : 0;

  // Display summary heading using title and alert count
  const summaryHeader = document.createElement("h2");
  summaryHeader.textContent = `${data.title}: ${count}`;
  alertsDisplay.appendChild(summaryHeader);

  // Display list of alert headlines
  if (data.features && data.features.length > 0) {
    const list = document.createElement("ul");

    data.features.forEach((feature) => {
      const listItem = document.createElement("li");
      listItem.textContent = feature.properties.headline || "No headline available";
      list.appendChild(listItem);
    });

    alertsDisplay.appendChild(list);
  }
}

function showError(message) {
  errorMessage.textContent = message;
  errorMessage.classList.remove("hidden");
}

function resetUI() {
  alertsDisplay.innerHTML = "";
  errorMessage.textContent = "";
  errorMessage.classList.add("hidden");
}