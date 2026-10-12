const journeyContent = {
  explore: {
    title: "Start with what matters to you.",
    description: "Before comparing visas, get clear on who is moving, what you hope to do, and what a move would need to make possible.",
    icon: "ph-compass",
    link: "Find your starting point",
    href: "./pathways.html",
    internal: true,
    items: [
      "Think about what you want from a move",
      "List who might move with you",
      "Keep official requirements separate from personal stories"
    ]
  },
  prepare: {
    title: "Turn your next step into a practical plan.",
    description: "Once you have a pathway to investigate, organize the documents, questions, and official checks that apply to your situation.",
    icon: "ph-files",
    link: "Open the document planner",
    href: "./document-planner.html",
    internal: true,
    items: [
      "Separate documents you have from those to request",
      "Record the official requirements you need to confirm",
      "Keep a list of questions and next actions"
    ]
  },
  settle: {
    title: "Let the new place become familiar, one task at a time.",
    description: "The first weeks bring everyday questions alongside the big milestones. Work through a practical checklist at your own pace and keep your progress on this device.",
    icon: "ph-house-line",
    link: "Open the first month checklist",
    href: "./settling-in.html",
    internal: true,
    items: [
      "Learn how to get around your area",
      "Check health cover and local services",
      "Build a routine one small step at a time"
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

const cityScenes = [
  {
    name: "Melbourne",
    alt: "A green city tram travels along a busy Melbourne street",
    image: "https://images.unsplash.com/photo-1584615919487-110ee3c56a4c?auto=format&fit=crop&w=2400&q=85"
  },
  {
    name: "Sydney",
    alt: "The Sydney Opera House and city skyline across the harbour",
    image: "https://images.unsplash.com/photo-1549177676-c2fd7773ea9c?auto=format&fit=crop&w=2400&q=85"
  },
  {
    name: "Brisbane",
    alt: "The Brisbane River winding between city buildings",
    image: "https://images.unsplash.com/photo-1789758385737-1125f82baa59?auto=format&fit=crop&w=2400&q=85"
  },
  {
    name: "Perth",
    alt: "Perth city skyline rising behind green parkland",
    image: "https://images.unsplash.com/photo-1782128958147-105181c3c332?auto=format&fit=crop&w=2400&q=85"
  }
];

function setSessionCity() {
  const heroImage = document.querySelector(".hero-image");
  const cityCaption = document.querySelector("#hero-city");
  if (!heroImage || !cityCaption) return;

  let city;
  try {
    const currentName = sessionStorage.getItem("open-path-city-session");
    city = cityScenes.find((scene) => scene.name === currentName);
    if (!city) {
      const previousName = localStorage.getItem("open-path-city-previous");
      const options = cityScenes.filter((scene) => scene.name !== previousName);
      city = options[Math.floor(Math.random() * options.length)];
      sessionStorage.setItem("open-path-city-session", city.name);
      localStorage.setItem("open-path-city-previous", city.name);
    }
  } catch {
    city = cityScenes[Math.floor(Math.random() * cityScenes.length)];
  }

  heroImage.addEventListener("load", () => {
    heroImage.alt = city.alt;
    cityCaption.textContent = `${city.name}, Australia`;
  }, { once: true });
  heroImage.addEventListener("error", () => {
    const fallback = cityScenes[0];
    heroImage.alt = fallback.alt;
    cityCaption.textContent = `${fallback.name}, Australia`;
    heroImage.src = fallback.image;
  }, { once: true });
  heroImage.src = city.image;
}

setSessionCity();

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
