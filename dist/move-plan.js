const storageKey = "open-path-move-plan-v1";
const pathwayDetails = {
  study: {
    title: "Study or research",
    officialLabel: "Student visa information",
    officialUrl: "https://immi.homeaffairs.gov.au/visas/getting-a-visa/visa-listing/student-500",
    context: "You chose study or research. A course or research offer is one part of planning. Check visa requirements separately.",
    checks: [{ id: "family-rules", title: "If family may come with you, check the current rules for family members", description: "Requirements can depend on the main applicant and the application. Do not rely on an older guide or another person's outcome.", label: "Read family member rules", url: "https://immi.homeaffairs.gov.au/visas/getting-a-visa/visa-listing/changes-to-student-visa-application-rules-500-590/family-members" }]
  },
  "student-family": {
    title: "Accompany a student or researcher",
    officialLabel: "Student visa family member rules",
    officialUrl: "https://immi.homeaffairs.gov.au/visas/getting-a-visa/visa-listing/changes-to-student-visa-application-rules-500-590/family-members",
    context: "You chose to explore joining a student or researcher. A relationship or family connection alone does not confirm who can be included.",
    checks: [{ id: "main-applicant", title: "Check the main applicant's current visa rules and any relevant family provisions", description: "Confirm the rules for the exact application and circumstances before making plans around an assumption.", label: "Open Student visa information", url: "https://immi.homeaffairs.gov.au/visas/getting-a-visa/visa-listing/student-500" }]
  },
  work: {
    title: "Work or professional skills",
    officialLabel: "Work visa options",
    officialUrl: "https://immi.homeaffairs.gov.au/visas/getting-a-visa/visa-finder/work",
    context: "You chose work or professional skills. Skilled, nominated, and employer-sponsored routes have different checks.",
    checks: [{ id: "work-skillselect", title: "Check whether an occupation, skills assessment, SkillSelect, or employer nomination is relevant", description: "The steps depend on the visa route and role. A job offer by itself does not confirm a visa pathway.", label: "Explore SkillSelect", url: "https://immi.homeaffairs.gov.au/visas/working-in-australia/skillselect" }]
  },
  family: {
    title: "Join a partner or family member",
    officialLabel: "Join family visa options",
    officialUrl: "https://immi.homeaffairs.gov.au/visas/getting-a-visa/visa-finder/join-family",
    context: "You chose a family connection. Options depend on the relationship and the status of the person in Australia.",
    checks: [{ id: "family-partner", title: "If you are exploring a partner visa, read its current overview", description: "Partner and other family visa categories have different sponsors and requirements.", label: "About partner visas", url: "https://immi.homeaffairs.gov.au/what-we-do/family-migration-program/visa-options/about-partner-visas" }]
  },
  protection: {
    title: "Safety or humanitarian information",
    officialLabel: "Refugee and humanitarian program",
    officialUrl: "https://immi.homeaffairs.gov.au/what-we-do/refugee-and-humanitarian-program/about-the-program/resettle-in-australia",
    context: "You chose to explore protection or humanitarian information. Open Path cannot assess protection needs or individual claims.",
    checks: [{ id: "protection-help", title: "Consider qualified, independent legal help for questions about your circumstances", description: "Use official information for program details. Do not rely on this general planning list to assess an individual claim.", label: "Who can help with a visa matter", url: "https://immi.homeaffairs.gov.au/help-support/who-can-help-with-your-application/overview" }]
  },
  visit: {
    title: "Visit or spend time in Australia",
    officialLabel: "Visitor visa options",
    officialUrl: "https://immi.homeaffairs.gov.au/visas/getting-a-visa/visa-finder/visit",
    context: "You chose a temporary visit. Visitor options and conditions depend on your purpose and circumstances.",
    checks: [{ id: "visit-conditions", title: "Check the conditions on the specific visitor visa you are considering", description: "A visit is different from a plan to live, work, or study in Australia.", label: "Explore visitor visa options", url: "https://immi.homeaffairs.gov.au/visas/getting-a-visa/visa-finder/visit" }]
  },
  unsure: {
    title: "Still exploring",
    officialLabel: "Australian visa finder",
    officialUrl: "https://immi.homeaffairs.gov.au/visas/getting-a-visa/visa-finder",
    context: "You are at the beginning. Compare broad directions before investing in detailed preparation.",
    checks: [{ id: "compare-routes", title: "Choose one or two broad directions to compare first", description: "Start with your reason for moving, then check the exact official visa information for any route you want to explore.", label: "Browse official visa options", url: "https://immi.homeaffairs.gov.au/visas/getting-a-visa/visa-finder" }]
  }
};

const locationLabels = { outside: "Outside Australia", inside: "In Australia" };
const connectionLabels = {
  confirmed: "A confirmed opportunity or connection",
  early: "Some leads, still comparing",
  beginning: "At the beginning of research"
};
const emptyState = document.querySelector("#move-plan-empty");
const workspace = document.querySelector("#move-plan-workspace");
const storageStatus = document.querySelector("#storage-status");
const taskCount = document.querySelector("#task-count");
const taskProgress = document.querySelector("#task-progress");
let plan;
let storageAvailable = true;

function readPlan() {
  try {
    const saved = JSON.parse(localStorage.getItem(storageKey) || "null");
    if (!saved || !pathwayDetails[saved.answers?.reason] || !locationLabels[saved.answers?.location] || !connectionLabels[saved.answers?.connection]) return null;
    return { answers: saved.answers, completed: Array.isArray(saved.completed) ? saved.completed : [] };
  } catch {
    storageAvailable = false;
    return null;
  }
}

function makeTaskLink(task) {
  if (!task.url) return null;
  const link = document.createElement("a");
  const label = document.createElement("span");
  const icon = document.createElement("i");
  link.className = "move-plan-task-link";
  link.href = task.url;
  if (task.url.startsWith("http")) {
    link.target = "_blank";
    link.rel = "noreferrer";
  }
  label.textContent = task.label;
  icon.className = task.url.startsWith("http") ? "ph-fill ph-arrow-up-right" : "ph-fill ph-arrow-right";
  icon.setAttribute("aria-hidden", "true");
  link.append(label, icon);
  return link;
}

function getStages() {
  const direction = pathwayDetails[plan.answers.reason];
  const prepLink = "./document-planner.html";
  const budgetLink = "./moving-budget.html";
  const movingLink = plan.answers.location === "outside" ? "./before-you-travel.html" : "./settling-in.html";
  const movingLabel = plan.answers.location === "outside" ? "Open the pre-departure guide" : "Open the first-month checklist";
  const planTasks = [
    ...direction.checks,
    { id: "source-check", title: "Check where and when the application can be made", description: "Location and timing rules can differ by visa. Verify them on the official page for the route you are exploring.", label: direction.officialLabel, url: direction.officialUrl },
    { id: "questions", title: "Write a short list of questions to resolve", description: "Keep it general here. Do not add passport numbers, health details, or other sensitive information." },
    { id: "documents", title: "Organise document questions after identifying a route", description: "This planner helps organise research. It is not an official visa document checklist.", label: "Open the document planner", url: prepLink },
    { id: "budget", title: "Estimate costs for your household and plans", description: "Use your own quotes and current official charges. The estimate is not a visa cost calculation.", label: "Plan a moving budget", url: budgetLink },
    { id: "city", title: "Compare places around your study, work, or family plans", description: "Start with the location of the opportunity, then compare housing, travel, and services.", label: "Compare Australian cities", url: "./choose-a-city.html" },
    { id: "housing", title: "Explore the rental process for the state or territory you are considering", description: "Rental rules and processes are local. Check the guidance for the place you may live.", label: "Plan a rental search", url: "./find-a-rental.html" },
    { id: "moving", title: plan.answers.location === "outside" ? "Review practical questions before travel" : "Review practical questions for settling in", description: "Use only the prompts that fit where you are in the journey.", label: movingLabel, url: movingLink },
    { id: "settling", title: "Keep everyday setup in view too", description: "Housing, transport, health information, and work preparation can continue after arrival.", label: "Open the first-month guide", url: "./settling-in.html" }
  ];
  return [
    { number: "01", title: "Explore and verify", tasks: planTasks.slice(0, 3) },
    { number: "02", title: "Prepare at your own pace", tasks: planTasks.slice(3, 6) },
    { number: "03", title: "Plan the move", tasks: planTasks.slice(6, 9) }
  ];
}

function updateProgress() {
  const rows = [...document.querySelectorAll(".move-plan-task")];
  const complete = rows.filter((row) => row.querySelector("input").checked).length;
  taskCount.textContent = `${complete} of ${rows.length} steps complete`;
  taskProgress.max = Math.max(1, rows.length);
  taskProgress.value = complete;
  taskProgress.setAttribute("aria-valuetext", `${complete} of ${rows.length} suggested steps complete`);
}

function savePlan() {
  try {
    localStorage.setItem(storageKey, JSON.stringify(plan));
    storageStatus.textContent = "Saved on this device only.";
    storageAvailable = true;
  } catch {
    storageAvailable = false;
    storageStatus.textContent = "Your checkmarks are active for this visit, but could not be saved in this browser.";
  }
}

function renderPlan() {
  plan = readPlan();
  if (!plan) {
    emptyState.hidden = false;
    workspace.hidden = true;
    storageStatus.textContent = storageAvailable ? "" : "Browser storage is unavailable. You can still explore the guides.";
    return;
  }

  emptyState.hidden = true;
  workspace.hidden = false;
  const direction = pathwayDetails[plan.answers.reason];
  document.querySelector("#workspace-title").textContent = direction.title;
  document.querySelector("#workspace-context").textContent = `${locationLabels[plan.answers.location]} · ${connectionLabels[plan.answers.connection]}. ${direction.context}`;
  const stages = document.querySelector("#move-plan-stages");
  stages.replaceChildren();

  getStages().forEach((stage) => {
    const section = document.createElement("section");
    const heading = document.createElement("div");
    const number = document.createElement("span");
    const title = document.createElement("h3");
    const list = document.createElement("ul");
    section.className = "move-plan-stage";
    heading.className = "move-plan-stage-heading";
    number.textContent = stage.number;
    title.textContent = stage.title;
    list.className = "move-plan-task-list";
    heading.append(number, title);

    stage.tasks.forEach((task) => {
      const row = document.createElement("li");
      const label = document.createElement("label");
      const checkbox = document.createElement("input");
      const mark = document.createElement("span");
      const checkIcon = document.createElement("i");
      const copy = document.createElement("span");
      const taskTitle = document.createElement("strong");
      const description = document.createElement("small");
      row.className = "move-plan-task";
      row.dataset.taskId = task.id;
      label.className = "move-plan-task-label";
      checkbox.type = "checkbox";
      checkbox.checked = plan.completed.includes(task.id);
      checkbox.setAttribute("aria-label", `Mark ${task.title} complete`);
      mark.className = "move-plan-check";
      checkIcon.className = "ph-fill ph-check";
      mark.append(checkIcon);
      copy.className = "move-plan-task-copy";
      taskTitle.textContent = task.title;
      description.textContent = task.description;
      copy.append(taskTitle, description);
      label.append(checkbox, mark, copy);
      row.append(label);
      const link = makeTaskLink(task);
      if (link) row.append(link);
      checkbox.addEventListener("change", () => {
        plan.completed = rowsCompleted();
        savePlan();
        updateProgress();
      });
      list.append(row);
    });

    section.append(heading, list);
    stages.append(section);
  });
  if (!storageAvailable) storageStatus.textContent = "This plan could not be read from browser storage. Create a new one from the starting point finder.";
  updateProgress();
}

function rowsCompleted() {
  return [...document.querySelectorAll(".move-plan-task")]
    .filter((row) => row.querySelector("input").checked)
    .map((row) => row.dataset.taskId);
}

document.querySelector("#print-plan").addEventListener("click", () => window.print());
document.querySelector("#clear-plan").addEventListener("click", () => {
  try {
    localStorage.removeItem(storageKey);
    storageAvailable = true;
  } catch {
    storageAvailable = false;
  }
  renderPlan();
});

renderPlan();
