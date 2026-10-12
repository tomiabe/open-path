const storageKey = "open-path-document-planner-v1";
const tasks = [...document.querySelectorAll(".planner-task")];
const filters = [...document.querySelectorAll("[data-filter]")];
const count = document.querySelector("#progress-count");
const message = document.querySelector("#progress-message");
const bar = document.querySelector("#progress-bar");
const pathwaySelect = document.querySelector("#pathway-select");
const routeLinks = {
  unsure: {
    url: "https://immi.homeaffairs.gov.au/visas/getting-a-visa/visa-finder",
    label: "Browse official visa options",
    familyUrl: "https://immi.homeaffairs.gov.au/visas/getting-a-visa/visa-finder",
    familyLabel: "Browse official visa options"
  },
  study: {
    url: "https://immi.homeaffairs.gov.au/visas/getting-a-visa/visa-listing/student-500",
    label: "Student visa, subclass 500",
    documentsUrl: "https://immi.homeaffairs.gov.au/visas/web-evidentiary-tool",
    documentsLabel: "Student visa document checklist tool",
    familyUrl: "https://immi.homeaffairs.gov.au/visas/getting-a-visa/visa-listing/changes-to-student-visa-application-rules-500-590/family-members",
    familyLabel: "Student visa family member rules"
  },
  "student-family": {
    url: "https://immi.homeaffairs.gov.au/visas/getting-a-visa/visa-listing/changes-to-student-visa-application-rules-500-590/family-members",
    label: "Family members of Student visa applicants",
    documentsUrl: "https://immi.homeaffairs.gov.au/visas/getting-a-visa/visa-listing/changes-to-student-visa-application-rules-500-590/family-members",
    documentsLabel: "Student visa family member information",
    familyUrl: "https://immi.homeaffairs.gov.au/visas/getting-a-visa/visa-listing/changes-to-student-visa-application-rules-500-590/family-members",
    familyLabel: "Student visa family member rules"
  },
  work: {
    url: "https://immi.homeaffairs.gov.au/visas/getting-a-visa/visa-finder/work",
    label: "Work visa options",
    familyUrl: "https://immi.homeaffairs.gov.au/visas/getting-a-visa/visa-finder/work",
    familyLabel: "Review work visa options"
  },
  family: {
    url: "https://immi.homeaffairs.gov.au/visas/getting-a-visa/visa-finder/join-family",
    label: "Partner and family visa options",
    familyUrl: "https://immi.homeaffairs.gov.au/what-we-do/family-migration-program/visa-options/about-partner-visas",
    familyLabel: "About partner visas"
  },
  humanitarian: {
    url: "https://immi.homeaffairs.gov.au/visas/getting-a-visa/visa-finder/refugee-and-humanitarian",
    label: "Refugee and humanitarian options",
    familyUrl: "https://immi.homeaffairs.gov.au/visas/getting-a-visa/visa-finder/refugee-and-humanitarian",
    familyLabel: "Review humanitarian visa options"
  },
  visit: {
    url: "https://immi.homeaffairs.gov.au/visas/getting-a-visa/visa-finder/visit",
    label: "Visitor visa options",
    familyUrl: "https://immi.homeaffairs.gov.au/visas/getting-a-visa/visa-finder/visit",
    familyLabel: "Review visitor visa options"
  }
};
const pathwayStorageKey = `${storageKey}-pathway`;
const plannerLinks = {
  instructions: document.querySelector("#visa-instructions-link"),
  documents: document.querySelector("#document-list-link"),
  family: document.querySelector("#family-rules-link"),
  translation: document.querySelector("#translation-link")
};
let saved = {};
let storageAvailable = true;

try {
  saved = JSON.parse(localStorage.getItem(storageKey) || "{}") || {};
} catch {
  storageAvailable = false;
  message.textContent = "Progress cannot be saved in this browser.";
}

function updatePathwayLinks(pathway) {
  const route = routeLinks[pathway] || routeLinks.unsure;
  plannerLinks.instructions.href = route.url;
  plannerLinks.instructions.querySelector("span").textContent = route.label;
  plannerLinks.documents.href = route.documentsUrl || route.url;
  plannerLinks.documents.querySelector("span").textContent = route.documentsLabel || `Open ${route.label.toLowerCase()}`;
  plannerLinks.family.href = route.familyUrl;
  plannerLinks.family.querySelector("span").textContent = route.familyLabel;
  plannerLinks.translation.href = route.url;
  plannerLinks.translation.querySelector("span").textContent = `Review ${route.label.toLowerCase()}`;
}

try {
  const requestedPathway = new URLSearchParams(window.location.search).get("pathway");
  const savedPathway = localStorage.getItem(pathwayStorageKey) || "unsure";
  pathwaySelect.value = routeLinks[requestedPathway] ? requestedPathway
    : routeLinks[savedPathway] ? savedPathway : "unsure";
  if (routeLinks[requestedPathway]) localStorage.setItem(pathwayStorageKey, requestedPathway);
} catch {
  storageAvailable = false;
}
updatePathwayLinks(pathwaySelect.value);
pathwaySelect.addEventListener("change", () => {
  updatePathwayLinks(pathwaySelect.value);
  try {
    localStorage.setItem(pathwayStorageKey, pathwaySelect.value);
  } catch {
    storageAvailable = false;
    message.textContent = "Your selection is active for this visit, but could not be saved.";
  }
  const url = new URL(window.location.href);
  url.searchParams.set("pathway", pathwaySelect.value);
  window.history.replaceState(null, "", url);
});

tasks.forEach((task) => {
  task.querySelector("input").checked = Boolean(saved[task.dataset.taskId]);
});

function updateProgress() {
  const complete = tasks.filter((task) => task.querySelector("input").checked).length;
  count.textContent = `${complete} of ${tasks.length} complete`;
  bar.value = complete;
  bar.setAttribute("aria-valuetext", `${complete} of ${tasks.length} planning tasks complete`);
  if (storageAvailable) {
    message.textContent = complete === tasks.length && complete > 0
      ? "You have reviewed every prompt. Keep following the instructions for your application."
      : "Start with the steps that fit your situation.";
  }
}

function applyFilter(filter) {
  tasks.forEach((task) => {
    const checked = task.querySelector("input").checked;
    task.hidden = filter === "done" ? !checked : filter === "todo" ? checked : false;
  });
  document.querySelectorAll(".planner-group").forEach((group) => {
    group.hidden = [...group.querySelectorAll(".planner-task")].every((task) => task.hidden);
  });
  filters.forEach((button) => button.setAttribute("aria-pressed", String(button.dataset.filter === filter)));
}

document.querySelector("#planner-groups").addEventListener("change", (event) => {
  if (!event.target.matches('input[type="checkbox"]')) return;
  const task = event.target.closest(".planner-task");
  saved[task.dataset.taskId] = event.target.checked;
  try {
    localStorage.setItem(storageKey, JSON.stringify(saved));
  } catch {
    storageAvailable = false;
    message.textContent = "Progress is available for this visit, but could not be saved.";
  }
  updateProgress();
  const active = filters.find((button) => button.getAttribute("aria-pressed") === "true");
  applyFilter(active?.dataset.filter || "all");
});

filters.forEach((button) => button.addEventListener("click", () => applyFilter(button.dataset.filter)));

document.querySelector("#clear-progress").addEventListener("click", () => {
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
