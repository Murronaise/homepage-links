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

  // UI scale, background, etc.
  document.getElementById("uiScale").value = settings.uiScale;
  document.getElementById("uiScaleDisplay").innerText = settings.uiScale;
  document.getElementById("bgUrl").value = settings.bgUrl;
  document.getElementById("presetTheme").value = settings.presetTheme;
  document.getElementById("animationStyle").value = settings.animationStyle;

  // Hover preview
  updatePreview(); // Set #hoverPreview to show these initial values

  // Advanced tab
  document.getElementById("customCSS").value = settings.customCSS;

  // Attach live preview listeners
  attachPreviewListeners();
}

/* Attach event listeners for live preview in #hoverPreview */
function attachPreviewListeners() {
  const watchers = [
    "hoverScale",
    "primaryButtonColor",
    "cardBgColor",
    "cardHoverBgColor",
    "textColor",
    "linkColor",
    "uiScale",
    "bgUrl",
    "presetTheme",
    "animationStyle"
  ];
  watchers.forEach(id => {
    const el = document.getElementById(id);
    if (el) {
      el.addEventListener("input", updatePreview);
      el.addEventListener("change", updatePreview);
    }
  });
}

/* Update the #hoverPreview box to show color/scale changes live */
function updatePreview() {
  console.log("updatePreview called for #hoverPreview");
  const hoverScale = document.getElementById("hoverScale").value;
  document.getElementById("hoverScaleDisplay").innerText = hoverScale;

  const primaryButtonColor = document.getElementById("primaryButtonColor").value;
  const cardBgColor = document.getElementById("cardBgColor").value;
  const cardHoverBgColor = document.getElementById("cardHoverBgColor").value;
  const textColor = document.getElementById("textColor").value;
  const linkColor = document.getElementById("linkColor").value;
  const uiScale = document.getElementById("uiScale").value;
  document.getElementById("uiScaleDisplay").innerText = uiScale;

  // For the "preview" box
  const preview = document.getElementById("hoverPreview");
  preview.style.transform = `scale(${hoverScale})`;
  preview.style.backgroundColor = cardBgColor;
  preview.style.color = textColor;
  preview.style.borderColor = cardHoverBgColor;
  // We'll create a mock link inside the preview
  preview.innerHTML = `<a href="#" style="color:${linkColor}; text-decoration:none;">Preview Link</a> with UI scale: ${uiScale}`;
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

  // Parse float for UI scale
  let uiScale = parseFloat(document.getElementById("uiScale").value);
  if (isNaN(uiScale)) uiScale = 1; // default to 1 if user typed nothing

  // Trim background URL; if it's blank, set it to empty string
  let bgUrl = document.getElementById("bgUrl").value.trim();
  if (!bgUrl) bgUrl = "";

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
  document.body.classList.remove("settings-open");
  document.getElementById("settingsPanel").style.display = "none";
}

/* Additional logic for new fields */

/* Update UI scaling, background, and animation style */
function updateUI(scale, bgUrl, animationStyle) {
  console.log("updateUI called with scale:", scale, "bgUrl:", bgUrl, "animationStyle:", animationStyle);

  // Scale only the #mainContent (not the entire body)
  const mainContent = document.getElementById("mainContent");
  mainContent.style.transform = `scale(${scale})`;
  mainContent.style.transformOrigin = "top center";

  if (bgUrl) {
    mainContent.style.backgroundImage = `url('${bgUrl}')`;
    mainContent.style.backgroundSize = "cover";
    mainContent.style.backgroundRepeat = "no-repeat";
  } else {
    mainContent.style.backgroundImage = "none";
  }

  // Remove any existing inline animations on .card
  const allCards = document.querySelectorAll(".card");
  allCards.forEach(card => {
    card.style.animation = "";
  });

  // Apply new animation style
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
      document.documentElement.style.setProperty("--bg-color", "#000");
      document.documentElement.style.setProperty("--text-color", "#0f0");
      document.documentElement.style.setProperty("--gradient-bg", "linear-gradient(135deg, #000 0%, #003300 100%)");
      break;
    case "retro":
      document.documentElement.style.setProperty("--bg-color", "#f2efe4");
      document.documentElement.style.setProperty("--text-color", "#444");
      document.documentElement.style.setProperty("--gradient-bg", "linear-gradient(135deg, #ffdfba 0%, #ffd7b3 100%)");
      break;
    default:
      // no preset or revert
      break;
  }
}
