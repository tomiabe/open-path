const storageKey = "open-path-pre-departure-v1";
const tasks = [...document.querySelectorAll(".travel-task")];
const filters = [...document.querySelectorAll("[data-filter]")];
const count = document.querySelector("#travel-progress-count");
const message = document.querySelector("#travel-progress-message");
const bar = document.querySelector("#travel-progress-bar");
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
  bar.setAttribute("aria-valuetext", `${reviewed} of ${tasks.length} pre-departure prompts reviewed`);
  if (storageAvailable) {
    message.textContent = reviewed === tasks.length && reviewed > 0
      ? "You have reviewed every prompt. Keep following the instructions for your circumstances."
      : "Start anywhere. Not every prompt will apply to every person.";
  }
}

function applyFilter(filter) {
  tasks.forEach((task) => {
    const checked = task.querySelector("input").checked;
    task.hidden = filter === "done" ? !checked : filter === "todo" ? checked : false;
  });
  document.querySelectorAll(".travel-group").forEach((group) => {
    group.hidden = [...group.querySelectorAll(".travel-task")].every((task) => task.hidden);
  });
  filters.forEach((button) => button.setAttribute("aria-pressed", String(button.dataset.filter === filter)));
}

document.querySelector("#travel-groups").addEventListener("change", (event) => {
  if (!event.target.matches('input[type="checkbox"]')) return;
  const task = event.target.closest(".travel-task");
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

document.querySelector("#clear-travel-progress").addEventListener("click", () => {
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
