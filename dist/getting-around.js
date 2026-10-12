const transportCities = {
  sydney: {
    name: "Sydney",
    operator: "Transport for NSW",
    planner: "https://transportnsw.info/plan",
    tickets: "https://transportnsw.info/tickets-fares/fares",
    travel: "https://transportnsw.info/travel-info"
  },
  melbourne: {
    name: "Melbourne",
    operator: "Public Transport Victoria",
    planner: "https://transport.vic.gov.au/journey",
    tickets: "https://transport.vic.gov.au/tickets-and-payments/fares",
    travel: "https://transport.vic.gov.au/"
  },
  brisbane: {
    name: "Brisbane",
    operator: "Translink",
    planner: "https://translink.com.au/plan-your-journey",
    tickets: "https://translink.com.au/tickets-and-fares/tickets-and-fares",
    travel: "https://translink.com.au/service-updates"
  },
  perth: {
    name: "Perth",
    operator: "Transperth",
    planner: "https://www.transperth.wa.gov.au/Journey-Planner",
    tickets: "https://www.transperth.wa.gov.au/Tickets-Fares",
    travel: "https://www.transperth.wa.gov.au/Service-Updates"
  },
  darwin: {
    name: "Darwin",
    operator: "NT public bus services",
    planner: "https://nt.gov.au/driving/public-transport-cycling/public-buses/darwin-and-palmerston-timetables-and-maps",
    tickets: "https://nt.gov.au/driving/public-transport-cycling/public-buses/fares",
    travel: "https://nt.gov.au/driving/public-transport-cycling/public-buses"
  },
  canberra: {
    name: "Canberra",
    operator: "Transport Canberra",
    planner: "https://www.transport.act.gov.au/getting-around",
    tickets: "https://www.transport.act.gov.au/tickets-and-myway/fares",
    travel: "https://www.transport.act.gov.au/getting-around/help"
  },
  hobart: {
    name: "Hobart",
    operator: "Metro Tasmania and other local operators",
    planner: "https://www.metrotas.com.au/",
    tickets: "https://www.transport.tas.gov.au/public_transport/fares",
    travel: "https://www.metrotas.com.au/support/"
  },
  adelaide: {
    name: "Adelaide",
    operator: "Adelaide Metro",
    planner: "https://www.adelaidemetro.com.au/plan-a-trip/plan-my-journey",
    tickets: "https://www.adelaidemetro.com.au/plan-a-trip/visiting-adelaide",
    travel: "https://www.adelaidemetro.com.au/plan-a-trip"
  }
};

const cityInputs = [...document.querySelectorAll('input[name="transport-city"]')];
const selectedCity = document.querySelector("#selected-city");
const selectedCityCopy = document.querySelector("#selected-city-copy");
const plannerLink = document.querySelector("#trip-planner-link");
const ticketLink = document.querySelector("#ticket-info-link");
const travelLink = document.querySelector("#travel-info-link");

function showCity(city) {
  selectedCity.textContent = city.name;
  selectedCityCopy.textContent = `${city.operator} provides the current route planner, ticket details, and travel updates for ${city.name}. Check each before you set out.`;
  plannerLink.href = city.planner;
  ticketLink.href = city.tickets;
  travelLink.href = city.travel;
}

cityInputs.forEach((input) => {
  input.addEventListener("change", () => {
    if (input.checked) showCity(transportCities[input.value]);
  });
});

showCity(transportCities.sydney);
