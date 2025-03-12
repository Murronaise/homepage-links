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
    customCSS: "",
    uiScale: 1,
    bgUrl: "",
    presetTheme: "",
    animationStyle: "none"
  };

  // General tab
  const radio = document.querySelector(`input[name="defaultCategory"][value="${settings.defaultCategory}"]`);
  if (radio) radio.click();
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

  // New fields
  document.getElementById("uiScale").value = settings.uiScale;
  document.getElementById("uiScaleDisplay").innerText = settings.uiScale;
  document.getElementById("bgUrl").value = settings.bgUrl;
  document.getElementById("presetTheme").value = settings.presetTheme;
  document.getElementById("animationStyle").value = settings.animationStyle;

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

  // New fields
  const uiScale = document.getElementById("uiScale").value;
  const bgUrl = document.getElementById("bgUrl").value.trim();
  const presetTheme = document.getElementById("presetTheme").value;
  const animationStyle = document.getElementById("animationStyle").value;

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
    customCSS,
    uiScale,
    bgUrl,
    presetTheme,
    animationStyle
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

  applyPresetTheme(presetTheme);
  updateUI(uiScale, bgUrl, animationStyle);
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

/* Additional logic for new fields */

/* Update UI scaling, background, and animation style */
function updateUI(scale, bgUrl, animationStyle) {
  console.log("updateUI called with scale:", scale, "bgUrl:", bgUrl, "animationStyle:", animationStyle);
  document.body.style.transform = `scale(${scale})`;
  document.body.style.transformOrigin = "top left";

  if (bgUrl) {
    document.body.style.backgroundImage = `url('${bgUrl}')`;
    document.body.style.backgroundSize = "cover";
    document.body.style.backgroundRepeat = "no-repeat";
  } else {
    // Revert to default gradient if no custom URL
    document.body.style.backgroundImage = "none";
  }

  // Example animation style handling
  const allCards = document.querySelectorAll(".card");
  allCards.forEach(card => {
    card.style.animation = "";
  });

  switch (animationStyle) {
    case "bounce":
      allCards.forEach(card => {
        card.style.animation = "bounce 2s infinite alternate";
      });
      break;
    case "fade":
      allCards.forEach(card => {
        card.style.animation = "fadeIn 1s ease-in-out";
      });
      break;
    case "zoom":
      allCards.forEach(card => {
        card.style.animation = "zoomIn 0.6s ease-in-out";
      });
      break;
    case "none":
    default:
      // No extra animation
      break;
  }
}

/* Example preset themes */
function applyPresetTheme(themeName) {
  console.log("applyPresetTheme called with:", themeName);
  switch (themeName) {
    case "light":
      document.documentElement.setAttribute("data-theme", "light");
      break;
    case "dark":
      document.documentElement.setAttribute("data-theme", "dark");
      break;
    case "matrix":
      // Example matrix-like colors
      document.documentElement.style.setProperty("--bg-color", "#000");
      document.documentElement.style.setProperty("--text-color", "#0f0");
      document.documentElement.style.setProperty("--gradient-bg", "linear-gradient(135deg, #000 0%, #003300 100%)");
      break;
    case "retro":
      // Example retro colors
      document.documentElement.style.setProperty("--bg-color", "#f2efe4");
      document.documentElement.style.setProperty("--text-color", "#444");
      document.documentElement.style.setProperty("--gradient-bg", "linear-gradient(135deg, #ffdfba 0%, #ffd7b3 100%)");
      break;
    default:
      // No preset or revert
      break;
  }
}
