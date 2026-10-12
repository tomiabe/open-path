const storageKey = "open-path-settling-checklist-v1";
const taskRows = [...document.querySelectorAll(".task-row")];
const filterButtons = [...document.querySelectorAll("[data-filter]")];
const progressCount = document.querySelector("#progress-count");
const progressMessage = document.querySelector("#progress-message");
const progressBar = document.querySelector("#progress-bar");
let saved = {};
let storageAvailable = true;

try {
  saved = JSON.parse(localStorage.getItem(storageKey) || "{}") || {};
} catch {
  saved = {};
  storageAvailable = false;
  progressMessage.textContent = "Progress cannot be saved in this browser.";
}

taskRows.forEach((row) => {
  row.querySelector("input").checked = Boolean(saved[row.dataset.taskId]);
});

function updateProgress() {
  const complete = taskRows.filter((row) => row.querySelector("input").checked).length;
  progressCount.textContent = `${complete} of ${taskRows.length} complete`;
  progressBar.value = complete;
  progressBar.setAttribute("aria-valuetext", `${complete} of ${taskRows.length} tasks complete`);
  if (storageAvailable) {
    progressMessage.textContent = complete === taskRows.length && complete > 0
      ? "You have worked through the list. Keep what is useful and leave the rest."
      : "Start anywhere. There is no required order.";
  }
}

function applyFilter(filter) {
  taskRows.forEach((row) => {
    const checked = row.querySelector("input").checked;
    row.hidden = filter === "done" ? !checked : filter === "todo" ? checked : false;
  });
  document.querySelectorAll(".task-group").forEach((group) => {
    group.hidden = [...group.querySelectorAll(".task-row")].every((row) => row.hidden);
  });
  filterButtons.forEach((button) => {
    button.setAttribute("aria-pressed", String(button.dataset.filter === filter));
  });
}

document.querySelector("#task-groups").addEventListener("change", (event) => {
  if (!event.target.matches('input[type="checkbox"]')) return;
  const row = event.target.closest(".task-row");
  saved[row.dataset.taskId] = event.target.checked;
  try {
    localStorage.setItem(storageKey, JSON.stringify(saved));
  } catch {
    storageAvailable = false;
    progressMessage.textContent = "Progress is available for this visit, but could not be saved.";
  }
  updateProgress();
  const activeFilter = filterButtons.find((button) => button.getAttribute("aria-pressed") === "true");
  applyFilter(activeFilter?.dataset.filter || "all");
});

filterButtons.forEach((button) => {
  button.addEventListener("click", () => applyFilter(button.dataset.filter));
});

document.querySelector("#clear-progress").addEventListener("click", () => {
  taskRows.forEach((row) => { row.querySelector("input").checked = false; });
  saved = {};
  try {
    localStorage.removeItem(storageKey);
  } catch {
    storageAvailable = false;
    progressMessage.textContent = "Progress is available for this visit, but could not be cleared from browser storage.";
  }
  updateProgress();
  applyFilter("all");
});

updateProgress();
applyFilter("all");
