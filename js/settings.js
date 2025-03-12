// js/settings.js

console.log("settings.js loaded");

/* Switch between tabs in the settings panel */
function switchTab(event) {
  const target = event.target.getAttribute("data-target");
  console.log("Switching to tab:", target);
  const buttons = document.querySelectorAll(".tab-buttons button");
  const contents = document.querySelectorAll(".tab-content");
  buttons.forEach(btn => btn.classList.remove("active"));
  contents.forEach(content => content.classList.remove("active"));
  event.target.classList.add("active");
  document.getElementById(target).classList.add("active");
}

/* Load settings from localStorage */
function loadSettings() {
  console.log("loadSettings called");
  const settings = JSON.parse(localStorage.getItem("siteSettings")) || {
    defaultCategory: "all",
    enableAnimation: true,
    alwaysShowEdit: false,
    hoverScale: 1.2,
    primaryButtonColor: "#6a90ab",
    cardBgColor: "#ffffff",
    cardHoverBgColor: "#e6e6e6",
    textColor: "#333333",
    linkColor: "#007bff",
    customCSS: ""
  };

  // General tab
  document.querySelector(`input[name="defaultCategory"][value="${settings.defaultCategory}"]`)?.click();
  document.getElementById("enableAnimation").checked = settings.enableAnimation;
  document.getElementById("alwaysShowEdit").checked = settings.alwaysShowEdit;

  // Appearance tab
  document.getElementById("hoverScale").value = settings.hoverScale;
  document.getElementById("hoverScaleDisplay").innerText = settings.hoverScale;
  document.getElementById("primaryButtonColor").value = settings.primaryButtonColor;
  document.getElementById("cardBgColor").value = settings.cardBgColor;
  document.getElementById("cardHoverBgColor").value = settings.cardHoverBgColor;
  document.getElementById("textColor").value = settings.textColor;
  document.getElementById("linkColor").value = settings.linkColor;
  document.getElementById("hoverPreview").style.transform = `scale(${settings.hoverScale})`;

  // Advanced tab
  document.getElementById("customCSS").value = settings.customCSS;
}

/* Save settings to localStorage */
function saveSettings(event) {
  console.log("saveSettings called");
  event.preventDefault();
  const defaultCategory = document.querySelector('input[name="defaultCategory"]:checked')?.value || "all";
  const enableAnimation = document.getElementById("enableAnimation").checked;
  const alwaysShowEdit = document.getElementById("alwaysShowEdit").checked;
  const hoverScale = document.getElementById("hoverScale").value;
  const primaryButtonColor = document.getElementById("primaryButtonColor").value;
  const cardBgColor = document.getElementById("cardBgColor").value;
  const cardHoverBgColor = document.getElementById("cardHoverBgColor").value;
  const textColor = document.getElementById("textColor").value;
  const linkColor = document.getElementById("linkColor").value;
  const customCSS = document.getElementById("customCSS").value;

  const settings = {
    defaultCategory,
    enableAnimation,
    alwaysShowEdit,
    hoverScale,
    primaryButtonColor,
    cardBgColor,
    cardHoverBgColor,
    textColor,
    linkColor,
    customCSS
  };
  localStorage.setItem("siteSettings", JSON.stringify(settings));
  console.log("Settings saved:", settings);

  // Apply theming immediately
  document.documentElement.style.setProperty("--button-color", primaryButtonColor);
  document.documentElement.style.setProperty("--hover-scale", hoverScale);
  document.documentElement.style.setProperty("--card-bg", cardBgColor);
  document.documentElement.style.setProperty("--card-hover-bg", cardHoverBgColor);
  document.documentElement.style.setProperty("--text-color", textColor);
  document.documentElement.style.setProperty("--link-color", linkColor);

  if (!enableAnimation) {
    document.body.classList.add("no-animation");
  } else {
    document.body.classList.remove("no-animation");
  }
  if (alwaysShowEdit) {
    document.body.classList.add("always-show-edit");
  } else {
    document.body.classList.remove("always-show-edit");
  }

  applyCustomCSS(true);
  hideSettings();
}

/* Apply custom CSS from Advanced tab */
function applyCustomCSS(skipAlert) {
  console.log("applyCustomCSS called");
  const customCSSText = document.getElementById("customCSS").value;
  let customStyleEl = document.getElementById("customStyle");
  if (!customStyleEl) {
    customStyleEl = document.createElement("style");
    customStyleEl.id = "customStyle";
    document.head.appendChild(customStyleEl);
  }
  customStyleEl.innerHTML = customCSSText;
  if (!skipAlert) {
    alert("Custom CSS applied.");
  }
}

/* Reset settings to defaults */
function resetSettings() {
  console.log("resetSettings called");
  if (confirm("Reset settings to defaults?")) {
    localStorage.removeItem("siteSettings");
    loadSettings();
  }
}

/* Hide settings panel */
function hideSettings() {
  console.log("hideSettings called");
  document.getElementById("settingsPanel").style.display = "none";
}
