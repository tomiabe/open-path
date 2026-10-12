const official = {
  student: "https://immi.homeaffairs.gov.au/visas/getting-a-visa/visa-listing/student-500",
  studentChanges: "https://immi.homeaffairs.gov.au/visas/getting-a-visa/visa-listing/changes-to-student-visa-application-rules-500-590",
  studentFamily: "https://immi.homeaffairs.gov.au/visas/getting-a-visa/visa-listing/changes-to-student-visa-application-rules-500-590/family-members",
  workFinder: "https://immi.homeaffairs.gov.au/visas/getting-a-visa/visa-finder/work",
  skillSelect: "https://immi.homeaffairs.gov.au/visas/working-in-australia/skillselect",
  sponsored: "https://immi.homeaffairs.gov.au/visas/employing-and-sponsoring-someone/sponsoring-workers/learn-about-sponsoring/visa-options",
  familyFinder: "https://immi.homeaffairs.gov.au/visas/getting-a-visa/visa-finder/join-family",
  partner: "https://immi.homeaffairs.gov.au/what-we-do/family-migration-program/visa-options/about-partner-visas",
  humanitarian: "https://immi.homeaffairs.gov.au/what-we-do/refugee-and-humanitarian-program/about-the-program/resettle-in-australia",
  visitor: "https://immi.homeaffairs.gov.au/visas/getting-a-visa/visa-finder/visit",
  visaFinder: "https://immi.homeaffairs.gov.au/visas/getting-a-visa/visa-finder",
  visaList: "https://immi.homeaffairs.gov.au/visas/getting-a-visa/visa-listing"
};

const reasons = {
  study: {
    context: "You chose study or research.",
    cards: [
      {
        title: "Study or research",
        description: "The Student visa page explains the current course, enrolment, health cover, and application requirements. A scholarship or university offer is one part of planning. Check the visa requirements separately.",
        action: "Start with the current Student visa information and confirm details with your education provider.",
        links: [
          { label: "Student visa, subclass 500", url: official.student },
          { label: "Study and research guide", url: "./study-research.html", internal: true }
        ],
        update: "Rules changed on 2 October 2026, including who can apply from inside Australia and how family can be included. Read the department's update if your location or family plans matter to you."
      }
    ]
  },
  "student-family": {
    context: "You chose accompanying a student or researcher.",
    cards: [
      {
        title: "Family members of Student visa applicants",
        description: "Being a partner or family member of a student does not by itself confirm that you can be included in a visa application. The Department changed the rules for including family on Student visa applications from 2 October 2026, with exemptions and different rules for some earlier applications.",
        action: "If someone in your family is considering a course or research degree, check the current rules together before making plans.",
        links: [
          { label: "Current Student visa information", url: official.student },
          { label: "Family member rules", url: official.studentFamily },
          { label: "Study and research guide", url: "./study-research.html", internal: true }
        ],
        update: "Do not rely on older videos or application guides for this question. Confirm whether the current rules and any exemption apply to the main applicant's situation."
      }
    ]
  },
  work: {
    context: "You chose work or professional skills.",
    cards: [
      {
        title: "Skilled work options",
        description: "Some skilled visas use an occupation, skills assessment, and invitation process. The exact requirements depend on the visa and your circumstances.",
        action: "Use the official work visa finder, then check whether SkillSelect is relevant to the route you are considering.",
        links: [
          { label: "Work and skilled pathways guide", url: "./work-pathways.html", internal: true },
          { label: "Work visa finder", url: official.workFinder },
          { label: "SkillSelect", url: official.skillSelect }
        ]
      },
      {
        title: "Employer-sponsored options",
        description: "An Australian employer may be able to sponsor a worker for a nominated skilled role. The employer and role have their own requirements too.",
        action: "If you have an employer connection, read the department's sponsorship information together with the visa details.",
        links: [
          { label: "Work and skilled pathways guide", url: "./work-pathways.html", internal: true },
          { label: "Employer-sponsored visa options", url: official.sponsored }
        ]
      }
    ]
  },
  family: {
    context: "You chose joining a partner or family.",
    cards: [
      {
        title: "Partner and family options",
        description: "The available route depends on your relationship to the person in Australia and their status. Partner visas and other family visas have different requirements.",
        action: "Start with the official family visa finder. If you are joining a spouse or de facto partner, read the partner visa overview as well.",
        links: [
          { label: "Partner and family pathways guide", url: "./family-pathways.html", internal: true },
          { label: "Join family visa finder", url: official.familyFinder },
          { label: "About partner visas", url: official.partner }
        ]
      }
    ]
  },
  protection: {
    context: "You chose safety or humanitarian information.",
    cards: [
      {
        title: "Refugee and humanitarian program",
        description: "Australia's offshore program has distinct categories and specific eligibility requirements. The department explains who each category is for and how applications are made.",
        action: "Read the official program information carefully. Open Path cannot assess protection needs or individual claims.",
        links: [{ label: "Resettlement in Australia", url: official.humanitarian }]
      }
    ]
  },
  visit: {
    context: "You chose a temporary visit.",
    cards: [
      {
        title: "Visitor options",
        description: "Visitor options depend on why you are travelling and your circumstances. A temporary visit is different from a plan to live, work, or study in Australia.",
        action: "Use the official finder for visiting, then read the conditions on any visa page it points you to.",
        links: [{ label: "Visit visa finder", url: official.visitor }]
      }
    ]
  },
  unsure: {
    context: "You are still working out which direction fits.",
    cards: [
      {
        title: "Explore the broad visa categories",
        description: "Australia has many visa types. Begin with the department's finder and compare options by your main purpose for coming.",
        action: "Use the finder for an overview, then open the detailed visa page for any option you want to investigate.",
        links: [
          { label: "Explore visa options", url: official.visaFinder },
          { label: "Browse the visa list", url: official.visaList }
        ]
      }
    ]
  }
};

const form = document.querySelector("#path-form");
const steps = [...document.querySelectorAll(".question-step")];
const segments = [...document.querySelectorAll(".progress-segment")];
const stepLabel = document.querySelector("#step-label");
const stepTopic = document.querySelector("#step-topic");
const errorMessage = document.querySelector("#form-error");
const backButton = document.querySelector("#back-button");
const nextButton = document.querySelector("#next-button");
const results = document.querySelector("#results");
const topics = ["Your location", "Your reason", "Your starting point"];
const movePlanStorageKey = "open-path-move-plan-v1";
const validReasons = new Set(["study", "student-family", "work", "family", "protection", "visit", "unsure"]);
let currentStep = 0;

function showStep(index, moveFocus = true) {
  currentStep = index;
  steps.forEach((step, stepIndex) => { step.hidden = stepIndex !== index; });
  segments.forEach((segment, segmentIndex) => {
    segment.classList.toggle("is-current", segmentIndex === index);
    segment.classList.toggle("is-complete", segmentIndex < index);
  });
  stepLabel.textContent = `Step ${index + 1} of ${steps.length}`;
  stepTopic.textContent = topics[index];
  backButton.hidden = index === 0;
  nextButton.innerHTML = index === steps.length - 1
    ? 'Show my starting points <i class="ph-fill ph-arrow-right" aria-hidden="true"></i>'
    : 'Continue <i class="ph-fill ph-arrow-right" aria-hidden="true"></i>';
  errorMessage.hidden = true;
  if (moveFocus) steps[index].querySelector("legend").focus?.();
}

function readAnswers() {
  return Object.fromEntries(["location", "reason", "connection"].map((name) => {
    const selected = form.querySelector(`input[name="${name}"]:checked`);
    return [name, selected?.value ?? ""];
  }));
}

function makeSourceLink(link) {
  const anchor = document.createElement("a");
  const icon = document.createElement("i");
  anchor.className = "source-link";
  anchor.href = link.url;
  if (!link.internal) {
    anchor.target = "_blank";
    anchor.rel = "noreferrer";
  }
  const label = document.createElement("span");
  label.className = "source-link-label";
  label.textContent = link.label;
  anchor.append(label);
  icon.className = "ph-fill ph-arrow-up-right";
  icon.setAttribute("aria-hidden", "true");
  anchor.append(icon);
  return anchor;
}

function makeResultCard(card, pathway) {
  const article = document.createElement("article");
  const title = document.createElement("h3");
  const description = document.createElement("p");
  const action = document.createElement("p");
  const sources = document.createElement("div");
  article.className = "result-card";
  title.textContent = card.title;
  description.textContent = card.description;
  action.className = "result-action";
  action.textContent = card.action;
  sources.className = "source-links";
  sources.setAttribute("aria-label", "Official information");
  card.links.forEach((link) => sources.append(makeSourceLink(link)));
  article.append(title, description, action, sources);

  const nextStep = makeSourceLink({
    label: "Organize your document questions",
    url: `./document-planner.html?pathway=${encodeURIComponent(pathway)}`,
    internal: true
  });
  nextStep.classList.add("planner-next-link");
  nextStep.querySelector("i").className = "ph-fill ph-arrow-right";
  article.append(nextStep);

  if (card.update) {
    const update = document.createElement("p");
    const icon = document.createElement("i");
    const link = makeSourceLink({ label: "Read the change notice", url: official.studentChanges });
    update.className = "rule-update";
    icon.className = "ph-fill ph-warning-circle";
    icon.setAttribute("aria-hidden", "true");
    const copy = document.createElement("span");
    copy.textContent = `${card.update} `;
    copy.append(link);
    update.append(icon, copy);
    article.append(update);
  }
  return article;
}

function showResults(answers) {
  const selectedReason = reasons[answers.reason];
  const contextLine = answers.connection === "confirmed"
    ? "You have a confirmed opportunity or connection."
    : answers.connection === "early"
      ? "You have some leads and are still comparing options."
      : "You are at the beginning of your research.";
  const locationLine = answers.location === "inside"
    ? "Where you are when you apply can affect which options are available. Check the location rules on each official visa page."
    : "For some options, you need to be outside Australia when you apply or when a decision is made. Check the location rules on each official visa page.";

  const chosenReason = selectedReason.context.replace(/^You chose /, "").toLowerCase();
  document.querySelector("#results-intro").textContent = `You chose ${chosenReason} ${contextLine} These pages are a research starting point, not a personal visa match. ${locationLine}`;
  const plannerPathway = {
    study: "study",
    "student-family": "student-family",
    work: "work",
    family: "family",
    protection: "humanitarian",
    visit: "visit",
    unsure: "unsure"
  }[answers.reason] || "unsure";
  document.querySelector("#results-list").replaceChildren(...selectedReason.cards.map((card) => makeResultCard(card, plannerPathway)));
  form.hidden = true;
  results.hidden = false;
  results.scrollIntoView({ behavior: "smooth", block: "start" });
  document.querySelector("#results-title").focus?.();
}

form.addEventListener("change", () => { errorMessage.hidden = true; });
form.addEventListener("submit", (event) => {
  event.preventDefault();
  if (!steps[currentStep].querySelector("input:checked")) {
    errorMessage.hidden = false;
    steps[currentStep].querySelector("input")?.focus();
    return;
  }
  if (currentStep < steps.length - 1) {
    showStep(currentStep + 1);
    return;
  }
  showResults(readAnswers());
});

backButton.addEventListener("click", () => showStep(currentStep - 1));
document.querySelector("#save-move-plan").addEventListener("click", () => {
  const answers = readAnswers();
  const status = document.querySelector("#plan-save-status");
  if (!validReasons.has(answers.reason) || !["outside", "inside"].includes(answers.location) || !["confirmed", "early", "beginning"].includes(answers.connection)) {
    status.textContent = "Return to the questions and complete each step before building a plan.";
    return;
  }
  try {
    const existing = JSON.parse(localStorage.getItem(movePlanStorageKey) || "null");
    const sameDirection = existing?.answers?.reason === answers.reason
      && existing?.answers?.location === answers.location
      && existing?.answers?.connection === answers.connection;
    if (existing && !sameDirection && !window.confirm("Replace the move plan saved on this device with these new starting points?")) return;
    const plan = sameDirection ? existing : { answers, completed: [] };
    plan.answers = answers;
    localStorage.setItem(movePlanStorageKey, JSON.stringify(plan));
    window.location.href = "./move-plan.html";
  } catch {
    status.textContent = "This browser could not save the plan. Check browser storage settings and try again.";
  }
});
document.querySelector("#reset-button").addEventListener("click", () => {
  form.reset();
  results.hidden = true;
  form.hidden = false;
  showStep(0, false);
  document.querySelector("#page-title").focus?.();
});

showStep(0, false);
