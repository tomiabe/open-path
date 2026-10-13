const storageKeys = {
  movePlan: "open-path-move-plan-v1",
  documents: "open-path-document-planner-v1",
  preDeparture: "open-path-pre-departure-v1",
  rental: "open-path-rental-planner-v1",
  settling: "open-path-settling-checklist-v1",
  workReadiness: "open-path-work-readiness-v1",
  jobSearch: "open-path-job-search-v1"
};

const routeNames = {
  study: "Study or research",
  "student-family": "Accompany a student or researcher",
  work: "Work or professional skills",
  family: "Join a partner or family member",
  protection: "Safety or humanitarian information",
  visit: "Visit or spend time in Australia",
  unsure: "Still exploring"
};

const guideCounts = {
  documents: 10,
  preDeparture: 11,
  rental: 9,
  settling: 10,
  workReadiness: 6
};

let storageAvailable = true;

function readStored(key) {
  try {
    return localStorage.getItem(key);
  } catch {
    storageAvailable = false;
    return null;
  }
}

function readObject(key) {
  const raw = readStored(key);
  if (!raw) return null;
  try {
    const value = JSON.parse(raw);
    return value && typeof value === "object" && !Array.isArray(value) ? value : null;
  } catch {
    return null;
  }
}

function readChecklist(key, total) {
  const saved = readObject(key);
  if (!saved) return { complete: 0, total, started: false };
  const complete = Object.values(saved).filter((value) => value === true).length;
  return { complete, total, started: Object.keys(saved).length > 0 };
}

function itemState(progress) {
  if (!progress.started) return "Not started";
  if (progress.complete === progress.total) return "All prompts reviewed";
  return `${progress.complete} of ${progress.total} reviewed`;
}

function makeLink(label, href) {
  const link = document.createElement("a");
  const text = document.createElement("span");
  const icon = document.createElement("i");
  link.className = "progress-item-link";
  link.href = href;
  text.textContent = label;
  icon.className = "ph-fill ph-arrow-right";
  icon.setAttribute("aria-hidden", "true");
  link.append(text, icon);
  return link;
}

function makeItem({ title, description, href, action, progress, detail }) {
  const item = document.createElement("article");
  const copy = document.createElement("div");
  const heading = document.createElement("strong");
  const summary = document.createElement("span");
  const meta = document.createElement("div");
  const state = document.createElement("strong");
  item.className = "progress-item";
  copy.className = "progress-item-copy";
  heading.textContent = title;
  summary.textContent = description;
  copy.append(heading, summary);
  meta.className = "progress-item-meta";
  state.textContent = detail || itemState(progress);
  meta.append(state);
  if (progress && progress.total > 0) {
    const count = document.createElement("span");
    count.textContent = `${progress.complete} of ${progress.total}`;
    meta.append(count);
  }
  meta.append(makeLink(action, href));
  item.append(copy, meta);
  return item;
}

function getMovePlan() {
  const saved = readObject(storageKeys.movePlan);
  if (!saved || !routeNames[saved.answers?.reason]) return null;
  const complete = Array.isArray(saved.completed) ? saved.completed.length : 0;
  return {
    route: routeNames[saved.answers.reason],
    progress: { complete: Math.min(9, complete), total: 9, started: true }
  };
}

function getJobSummary() {
  const raw = readStored(storageKeys.jobSearch);
  if (!raw) return { total: 0, interviews: 0, offers: 0 };
  try {
    const items = JSON.parse(raw);
    if (!Array.isArray(items)) return { total: 0, interviews: 0, offers: 0 };
    return {
      total: items.length,
      interviews: items.filter((item) => item?.stage === "interview").length,
      offers: items.filter((item) => item?.stage === "offer").length
    };
  } catch {
    return { total: 0, interviews: 0, offers: 0 };
  }
}

function render() {
  const plan = getMovePlan();
  const docs = readChecklist(storageKeys.documents, guideCounts.documents);
  const departure = readChecklist(storageKeys.preDeparture, guideCounts.preDeparture);
  const rental = readChecklist(storageKeys.rental, guideCounts.rental);
  const settling = readChecklist(storageKeys.settling, guideCounts.settling);
  const work = readChecklist(storageKeys.workReadiness, guideCounts.workReadiness);
  const jobs = getJobSummary();
  const groups = {
    "#direction-list": [
      plan
        ? { title: "Your move plan", description: plan.route, href: "./move-plan.html", action: "Continue your plan", progress: plan.progress }
        : { title: "Your starting point", description: "Compare broad directions and choose what to investigate first.", href: "./pathways.html", action: "Find your direction", detail: "No plan saved" }
    ],
    "#prepare-list": [
      { title: "Application document planner", description: "Keep track of research and preparation prompts.", href: "./document-planner.html", action: "Continue planner", progress: docs },
      { title: "Moving budget", description: "Build or update a household estimate using your own current figures.", href: "./moving-budget.html", action: "Open budget", detail: "Amounts are not saved" }
    ],
    "#move-list": [
      { title: "Pre-departure checklist", description: "Review travel, arrival, and practical preparation prompts.", href: "./before-you-travel.html", action: "Continue checklist", progress: departure },
      { title: "Rental planning", description: "Keep track of a search and check local renting information.", href: "./find-a-rental.html", action: "Continue rental plan", progress: rental }
    ],
    "#settle-list": [
      { title: "First month checklist", description: "Work through local setup and everyday essentials.", href: "./settling-in.html", action: "Continue checklist", progress: settling },
      { title: "Work readiness", description: "Review work rights, preparation, and local workplace questions.", href: "./starting-work.html", action: "Continue guide", progress: work },
      {
        title: "Job search tracker",
        description: "Your saved role and employer details are not shown on this page.",
        href: "./job-search.html",
        action: "Open tracker",
        detail: jobs.total === 0 ? "No opportunities saved" : `${jobs.total} ${jobs.total === 1 ? "opportunity" : "opportunities"} saved${jobs.interviews ? `, ${jobs.interviews} ${jobs.interviews === 1 ? "interview" : "interviews"}` : ""}${jobs.offers ? `, ${jobs.offers} ${jobs.offers === 1 ? "offer" : "offers"}` : ""}`
      }
    ]
  };

  let complete = 0;
  let total = 0;
  Object.entries(groups).forEach(([selector, items]) => {
    const list = document.querySelector(selector);
    list.replaceChildren(...items.map((item) => makeItem(item)));
    items.forEach((item) => {
      if (!item.progress?.started) return;
      complete += item.progress.complete;
      total += item.progress.total;
    });
  });

  const count = document.querySelector("#overview-count");
  const note = document.querySelector("#overview-note");
  const progress = document.querySelector("#overview-progress");
  count.textContent = total ? `${complete} of ${total} active steps checked` : "No saved checklist progress yet";
  note.textContent = total
    ? plan ? `Your current direction: ${plan.route}. Saved only in this browser.` : "Only lists you have started are included. Your activity stays in this browser."
    : "Checklists you use will appear here. Your activity stays in this browser.";
  progress.max = Math.max(1, total);
  progress.value = complete;
  progress.hidden = total === 0;
  progress.setAttribute("aria-valuetext", total ? `${complete} of ${total} active checklist steps checked` : "No saved checklist progress yet");
  document.querySelector("#storage-warning").hidden = storageAvailable;
}

render();
window.addEventListener("storage", render);
