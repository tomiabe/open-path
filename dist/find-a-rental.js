const rentalAuthorities = {
  nsw: { name: "New South Wales", url: "https://www.nsw.gov.au/housing-and-construction/renting-a-place-to-live" },
  vic: { name: "Victoria", url: "https://www.consumer.vic.gov.au/housing/renting" },
  qld: { name: "Queensland", url: "https://www.rta.qld.gov.au/before-renting" },
  wa: { name: "Western Australia", url: "https://www.consumerprotection.wa.gov.au/rental-agreements" },
  sa: { name: "South Australia", url: "https://www.sa.gov.au/topics/housing/renting-and-letting/renting-privately" },
  tas: { name: "Tasmania", url: "https://www.consumeraffairs.tas.gov.au/topics/resources-tools/rental-guide" },
  act: { name: "the Australian Capital Territory", url: "https://www.act.gov.au/housing-planning-and-property/renting" },
  nt: { name: "the Northern Territory", url: "https://consumeraffairs.nt.gov.au/for-consumers/residential-tenancies" }
};

const regionSelect = document.querySelector("#rental-region");
const sourceStatus = document.querySelector("#rental-source-status");
const sourceLink = document.querySelector("#rental-source-link");

regionSelect.addEventListener("change", () => {
  const authority = rentalAuthorities[regionSelect.value];
  sourceLink.hidden = !authority;
  if (!authority) {
    sourceStatus.textContent = "Choose a location to see its official renting guide.";
    return;
  }
  sourceLink.href = authority.url;
  sourceLink.querySelector("span").textContent = `Open the official renting guide for ${authority.name}`;
  sourceStatus.textContent = `Showing government renting information for ${authority.name}.`;
});

const storageKey = "open-path-rental-planner-v1";
const tasks = [...document.querySelectorAll(".rental-task")];
const filters = [...document.querySelectorAll("[data-filter]")];
const count = document.querySelector("#rental-progress-count");
const message = document.querySelector("#rental-progress-message");
const bar = document.querySelector("#rental-progress-bar");
let saved = {};
let storageAvailable = true;

try {
  saved = JSON.parse(localStorage.getItem(storageKey) || "{}") || {};
} catch {
  storageAvailable = false;
  message.textContent = "Progress is available for this visit, but browser storage is unavailable.";
}

tasks.forEach((task) => {
  task.querySelector("input").checked = Boolean(saved[task.dataset.taskId]);
});

function updateProgress() {
  const reviewed = tasks.filter((task) => task.querySelector("input").checked).length;
  count.textContent = `${reviewed} of ${tasks.length} reviewed`;
  bar.value = reviewed;
  bar.setAttribute("aria-valuetext", `${reviewed} of ${tasks.length} rental planning prompts reviewed`);
  if (storageAvailable) {
    message.textContent = reviewed === tasks.length && reviewed > 0
      ? "You have reviewed every prompt. Keep checking the local guidance for your arrangement."
      : "Start anywhere. Your situation may call for different steps.";
  }
}

function applyFilter(filter) {
  tasks.forEach((task) => {
    const checked = task.querySelector("input").checked;
    task.hidden = filter === "done" ? !checked : filter === "todo" ? checked : false;
  });
  document.querySelectorAll(".rental-group").forEach((group) => {
    group.hidden = [...group.querySelectorAll(".rental-task")].every((task) => task.hidden);
  });
  filters.forEach((button) => button.setAttribute("aria-pressed", String(button.dataset.filter === filter)));
}

document.querySelector("#rental-groups").addEventListener("change", (event) => {
  if (!event.target.matches('input[type="checkbox"]')) return;
  const task = event.target.closest(".rental-task");
  saved[task.dataset.taskId] = event.target.checked;
  try {
    localStorage.setItem(storageKey, JSON.stringify(saved));
  } catch {
    storageAvailable = false;
    message.textContent = "Progress is available for this visit, but could not be saved in this browser.";
  }
  updateProgress();
  const activeFilter = filters.find((button) => button.getAttribute("aria-pressed") === "true");
  applyFilter(activeFilter?.dataset.filter || "all");
});

filters.forEach((button) => button.addEventListener("click", () => applyFilter(button.dataset.filter)));

document.querySelector("#clear-rental-progress").addEventListener("click", () => {
  tasks.forEach((task) => { task.querySelector("input").checked = false; });
  saved = {};
  try {
    localStorage.removeItem(storageKey);
  } catch {
    storageAvailable = false;
    message.textContent = "Progress is available for this visit, but could not be cleared from browser storage.";
  }
  updateProgress();
  applyFilter("all");
});

updateProgress();
applyFilter("all");
