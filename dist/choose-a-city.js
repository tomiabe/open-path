const cityInfo = {
  sydney: { name: "Sydney", transport: "Transport for NSW", url: "https://transportnsw.info/travel-info" },
  melbourne: { name: "Melbourne", transport: "Transport Victoria", url: "https://transport.vic.gov.au/Plan-a-journey" },
  brisbane: { name: "Brisbane", transport: "Translink", url: "https://translink.com.au/plan-your-journey" },
  perth: { name: "Perth", transport: "Transperth", url: "https://www.transperth.wa.gov.au/Journey-Planner" },
  adelaide: { name: "Adelaide", transport: "Adelaide Metro", url: "https://www.adelaidemetro.com.au/plan-a-trip/plan-my-journey" },
  canberra: { name: "Canberra", transport: "Transport Canberra", url: "https://www.transport.act.gov.au/getting-around/visit-canberra" },
  hobart: { name: "Hobart", transport: "Metro Tasmania", url: "https://www.metrotas.com.au/" },
  darwin: { name: "Darwin", transport: "NT public bus timetables and maps", url: "https://nt.gov.au/driving/public-transport-cycling/public-buses/darwin-and-palmerston-timetables-and-maps" }
};

const cityInputs = [...document.querySelectorAll(".city-option input")];
const status = document.querySelector("#city-selection-status");
const comparison = document.querySelector("#comparison-wrap");
const head = document.querySelector("#comparison-head");
const body = document.querySelector("#comparison-body");

const comparisonRows = [
  ["Opportunity", "Does your study, research, job, employer, or family connection lead here?"],
  ["Housing", "What current rental options are within reach of your likely destination?"],
  ["Daily travel", "Try the trip from realistic suburbs at the times you expect to travel."],
  ["People and services", "Where are the health services, schools, and community connections your household may need?"]
];

function makeSourceLink(city) {
  const link = document.createElement("a");
  const label = document.createElement("span");
  const icon = document.createElement("i");
  link.className = "city-source-link";
  link.href = city.url;
  link.target = "_blank";
  link.rel = "noreferrer";
  label.textContent = `Plan a trip with ${city.transport}`;
  icon.className = "ph-fill ph-arrow-up-right";
  icon.setAttribute("aria-hidden", "true");
  link.append(label, icon);
  return link;
}

function renderComparison(selectedCities) {
  head.replaceChildren();
  body.replaceChildren();
  comparison.hidden = selectedCities.length < 2;
  status.textContent = selectedCities.length < 2
    ? "Add another place to compare."
    : `${selectedCities.length} places selected.`;
  if (selectedCities.length < 2) return;

  const headerRow = document.createElement("tr");
  const criteriaHeading = document.createElement("th");
  criteriaHeading.scope = "col";
  criteriaHeading.textContent = "What to compare";
  headerRow.append(criteriaHeading);
  selectedCities.forEach((city) => {
    const heading = document.createElement("th");
    heading.scope = "col";
    heading.textContent = city.name;
    headerRow.append(heading);
  });
  head.append(headerRow);

  comparisonRows.forEach(([criterion, prompt], rowIndex) => {
    const row = document.createElement("tr");
    const label = document.createElement("th");
    label.scope = "row";
    label.textContent = criterion;
    row.append(label);
    selectedCities.forEach((city) => {
      const cell = document.createElement("td");
      const copy = document.createElement("p");
      copy.textContent = prompt;
      cell.append(copy);
      if (rowIndex === 2) cell.append(makeSourceLink(city));
      row.append(cell);
    });
    body.append(row);
  });
}

cityInputs.forEach((input) => {
  input.addEventListener("change", () => {
    const selected = cityInputs.filter((candidate) => candidate.checked);
    if (selected.length > 3) {
      input.checked = false;
      status.textContent = "Choose up to three places.";
      return;
    }
    renderComparison(selected.map((candidate) => cityInfo[candidate.value]));
  });
});
