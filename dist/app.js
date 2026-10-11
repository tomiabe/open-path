const journeyContent = {
  explore: {
    title: "Start with what matters to you.",
    description: "Before comparing visas, get clear on who is moving, what you hope to do, and what a move would need to make possible.",
    icon: "ph-compass",
    link: "Explore official Australian immigration information",
    items: [
      "Write down your reason for considering Australia",
      "List who would be part of the move",
      "Keep official requirements separate from personal stories"
    ]
  },
  prepare: {
    title: "Make the opportunity into a plan.",
    description: "Study and research can involve a provider, a visa, family plans, health cover, documents, and the practical costs of moving.",
    icon: "ph-notebook",
    link: "Read the study and research guide",
    href: "./study-research.html",
    internal: true,
    items: [
      "Confirm the course or research details",
      "Check current rules for partners and family",
      "Plan for paperwork, health cover, and arrival"
    ]
  },
  settle: {
    title: "Give the first weeks some breathing room.",
    description: "A new country brings everyday questions alongside the big milestones. Pick a few practical tasks at a time and let your routine grow gradually.",
    icon: "ph-house-line",
    link: "Visit the Australian Government information portal",
    items: [
      "Work out your first month of housing and transport",
      "Make a list of the local services you need to set up",
      "Choose one useful task to finish this week"
    ]
  }
};

const tabs = [...document.querySelectorAll(".journey-tab")];
const panel = document.querySelector("#journey-panel");
const panelTitle = document.querySelector("#panel-title");
const panelDescription = document.querySelector("#panel-description");
const panelIcon = document.querySelector(".panel-icon i");
const panelLink = document.querySelector("#panel-link");
const panelList = document.querySelector("#panel-list");

function selectStage(stage, focusTab = false) {
  const content = journeyContent[stage];
  const selectedTab = tabs.find((tab) => tab.dataset.stage === stage);
  if (!content || !selectedTab) return;

  tabs.forEach((tab) => {
    const selected = tab === selectedTab;
    tab.setAttribute("aria-selected", String(selected));
    tab.tabIndex = selected ? 0 : -1;
  });

  panel.setAttribute("aria-labelledby", selectedTab.id);
  panelTitle.textContent = content.title;
  panelDescription.textContent = content.description;
  panelIcon.className = `ph-fill ${content.icon}`;
  const linkLabel = document.createElement("span");
  linkLabel.className = "text-link-label";
  linkLabel.textContent = content.link;
  const arrow = document.createElement("i");
  arrow.className = "ph-fill ph-arrow-up-right";
  arrow.setAttribute("aria-hidden", "true");
  panelLink.replaceChildren(linkLabel, arrow);
  panelLink.href = content.href ?? "https://immi.homeaffairs.gov.au/";
  if (content.internal) {
    panelLink.removeAttribute("target");
    panelLink.removeAttribute("rel");
  } else {
    panelLink.target = "_blank";
    panelLink.rel = "noreferrer";
  }
  panelList.replaceChildren(...content.items.map((item) => {
    const li = document.createElement("li");
    const icon = document.createElement("i");
    const text = document.createElement("span");
    icon.className = "ph-fill ph-check-circle";
    icon.setAttribute("aria-hidden", "true");
    text.textContent = item;
    li.append(icon, text);
    return li;
  }));

  if (focusTab) selectedTab.focus();
}

tabs.forEach((tab, index) => {
  tab.addEventListener("click", () => selectStage(tab.dataset.stage));
  tab.addEventListener("keydown", (event) => {
    if (!["ArrowRight", "ArrowLeft", "Home", "End"].includes(event.key)) return;
    event.preventDefault();
    const nextIndex = event.key === "Home" ? 0
      : event.key === "End" ? tabs.length - 1
      : (index + (event.key === "ArrowRight" ? 1 : -1) + tabs.length) % tabs.length;
    selectStage(tabs[nextIndex].dataset.stage, true);
  });
});

const menuToggle = document.querySelector(".menu-toggle");
const mobileNav = document.querySelector("#mobile-nav");
menuToggle.addEventListener("click", () => {
  const expanded = menuToggle.getAttribute("aria-expanded") === "true";
  menuToggle.setAttribute("aria-expanded", String(!expanded));
  menuToggle.setAttribute("aria-label", expanded ? "Open navigation" : "Close navigation");
  menuToggle.innerHTML = `<i class="ph-fill ${expanded ? "ph-list" : "ph-x"}" aria-hidden="true"></i>`;
  mobileNav.hidden = expanded;
});

mobileNav.addEventListener("click", (event) => {
  if (!event.target.closest("a")) return;
  mobileNav.hidden = true;
  menuToggle.setAttribute("aria-expanded", "false");
  menuToggle.setAttribute("aria-label", "Open navigation");
  menuToggle.innerHTML = '<i class="ph-fill ph-list" aria-hidden="true"></i>';
});
