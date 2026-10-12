const storageKey = "open-path-job-search-v1";
const form = document.querySelector("#application-form");
const list = document.querySelector("#application-list");
const empty = document.querySelector("#tracker-empty");
const status = document.querySelector("#tracker-status");
const storageMessage = document.querySelector("#storage-message");
const filters = [...document.querySelectorAll("[data-stage-filter]")];
const stageLabels = {
  saved: "Saved",
  preparing: "Preparing",
  applied: "Applied",
  interview: "Interview",
  offer: "Offer",
  closed: "Closed"
};
let applications = [];
let filter = "all";
let storageAvailable = true;

try {
  const stored = JSON.parse(localStorage.getItem(storageKey) || "[]");
  applications = Array.isArray(stored) ? stored.filter(isValidApplication) : [];
} catch {
  storageAvailable = false;
  storageMessage.textContent = "Your entries are available for this visit, but browser storage is unavailable.";
}

function isValidApplication(item) {
  if (!item || typeof item.id !== "string" || typeof item.role !== "string" ||
    typeof item.employer !== "string" || typeof item.location !== "string" ||
    typeof item.url !== "string" || !Object.hasOwn(stageLabels, item.stage)) return false;
  if (!item.url) return true;
  try {
    const url = new URL(item.url);
    return url.protocol === "https:" || url.protocol === "http:";
  } catch {
    return false;
  }
}

function persist() {
  if (!storageAvailable) return;
  try {
    localStorage.setItem(storageKey, JSON.stringify(applications));
  } catch {
    storageAvailable = false;
    storageMessage.textContent = "Your entries are available for this visit, but could not be saved in this browser.";
  }
}

function updateSummary() {
  document.querySelector("#active-count").textContent = applications.filter((item) => item.stage !== "closed").length;
  document.querySelector("#interview-count").textContent = applications.filter((item) => item.stage === "interview").length;
  document.querySelector("#offer-count").textContent = applications.filter((item) => item.stage === "offer").length;
}

function makeElement(tag, className, text) {
  const element = document.createElement(tag);
  if (className) element.className = className;
  if (text !== undefined) element.textContent = text;
  return element;
}

function render() {
  list.replaceChildren();
  const visible = applications.filter((item) => filter === "all" || (filter === "closed" ? item.stage === "closed" : item.stage !== "closed"));
  empty.hidden = applications.length > 0;
  if (applications.length > 0 && visible.length === 0) {
    empty.hidden = false;
    empty.textContent = "No open opportunities right now. Switch to All or add another role.";
  } else if (applications.length === 0) {
    empty.textContent = "No opportunities added yet. Start with a role you want to follow up on.";
  }

  visible.forEach((item) => {
    const row = makeElement("li", "application-row");
    const details = makeElement("div", "application-details");
    details.append(makeElement("h4", "", item.role), makeElement("p", "", item.employer));
    if (item.location) details.append(makeElement("p", "application-location", item.location));
    if (item.url) {
      const link = makeElement("a", "application-url", "Open job listing");
      link.href = item.url;
      link.target = "_blank";
      link.rel = "noreferrer";
      details.append(link);
    }

    const controls = makeElement("div", "application-controls");
    const stageLabel = makeElement("label", "application-stage-label");
    const accessibleLabel = makeElement("span", "visually-hidden", `Stage for ${item.role} at ${item.employer}`);
    const selectControl = makeElement("span", "select-control");
    const stage = document.createElement("select");
    stage.dataset.action = "stage";
    stage.dataset.id = item.id;
    Object.entries(stageLabels).forEach(([value, label]) => {
      const option = document.createElement("option");
      option.value = value;
      option.textContent = label;
      option.selected = item.stage === value;
      stage.append(option);
    });
    const arrow = makeElement("i", "ph-fill ph-caret-down select-control-arrow");
    arrow.setAttribute("aria-hidden", "true");
    selectControl.append(stage, arrow);
    stageLabel.append(accessibleLabel, selectControl);
    const remove = document.createElement("button");
    remove.type = "button";
    remove.className = "application-remove";
    remove.dataset.action = "remove";
    remove.dataset.id = item.id;
    remove.setAttribute("aria-label", `Remove ${item.role} at ${item.employer}`);
    remove.title = "Remove opportunity";
    remove.innerHTML = '<i class="ph-fill ph-trash" aria-hidden="true"></i>';
    controls.append(stageLabel, remove);
    row.append(details, controls);
    list.append(row);
  });
  updateSummary();
}

form.addEventListener("submit", (event) => {
  event.preventDefault();
  if (!form.reportValidity()) return;
  const values = new FormData(form);
  const rawUrl = String(values.get("url") || "").trim();
  let url = "";
  if (rawUrl) {
    try {
      const parsed = new URL(rawUrl);
      if (parsed.protocol !== "https:" && parsed.protocol !== "http:") throw new Error("Invalid link");
      url = parsed.href;
    } catch {
      status.textContent = "Enter a complete job listing link that starts with http:// or https://.";
      return;
    }
  }
  applications.unshift({
    id: globalThis.crypto?.randomUUID?.() || `${Date.now()}-${Math.random().toString(36).slice(2)}`,
    role: String(values.get("role")).trim(),
    employer: String(values.get("employer")).trim(),
    location: String(values.get("location") || "").trim(),
    stage: String(values.get("stage")),
    url
  });
  persist();
  form.reset();
  filter = "all";
  filters.forEach((button) => button.setAttribute("aria-pressed", String(button.dataset.stageFilter === filter)));
  status.textContent = "Opportunity added to your list.";
  render();
  form.elements.role.focus();
});

filters.forEach((button) => button.addEventListener("click", () => {
  filter = button.dataset.stageFilter;
  filters.forEach((item) => item.setAttribute("aria-pressed", String(item === button)));
  render();
}));

list.addEventListener("change", (event) => {
  const control = event.target.closest('[data-action="stage"]');
  if (!control) return;
  const application = applications.find((item) => item.id === control.dataset.id);
  if (!application || !Object.hasOwn(stageLabels, control.value)) return;
  application.stage = control.value;
  persist();
  status.textContent = `Stage updated to ${stageLabels[control.value]}.`;
  render();
  const updatedControl = [...list.querySelectorAll('[data-action="stage"]')].find((item) => item.dataset.id === control.dataset.id);
  (updatedControl || status).focus();
});

list.addEventListener("click", (event) => {
  const control = event.target.closest('[data-action="remove"]');
  if (!control) return;
  const application = applications.find((item) => item.id === control.dataset.id);
  applications = applications.filter((item) => item.id !== control.dataset.id);
  persist();
  status.textContent = application ? `${application.role} removed from your list.` : "Opportunity removed.";
  render();
});

document.querySelector("#clear-applications").addEventListener("click", () => {
  applications = [];
  persist();
  filter = "all";
  filters.forEach((button) => button.setAttribute("aria-pressed", String(button.dataset.stageFilter === filter)));
  status.textContent = "All saved opportunities cleared.";
  render();
});

render();
