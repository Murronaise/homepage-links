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

  document.getElementById("uiScale").value = settings.uiScale;
  document.getElementById("uiScaleDisplay").innerText = settings.uiScale;
  document.getElementById("bgUrl").value = settings.bgUrl;
  document.getElementById("presetTheme").value = settings.presetTheme;
  document.getElementById("animationStyle").value = settings.animationStyle;

  // Update the preview box + card to reflect these initial values
  updatePreview();

  // Advanced tab
  document.getElementById("customCSS").value = settings.customCSS;

  // Attach live preview listeners
  attachPreviewListeners();
}

/* Attach event listeners for live preview in #hoverPreview + #cardPreview */
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
      // Changing the theme pickers if user picks a new theme
      if (id === "presetTheme") {
        el.addEventListener("change", (e) => {
          // If user picks a new theme, we auto-update color pickers
          updateThemePickers(e.target.value);
          updatePreview();
        });
      }
      // Otherwise just normal preview updates
      el.addEventListener("input", updatePreview);
      el.addEventListener("change", updatePreview);
    }
  });
}

/* If user picks a new theme from the dropdown, update the color pickers to that theme's defaults. */
function updateThemePickers(theme) {
  console.log("updateThemePickers called with:", theme);
  switch (theme) {
    case "light":
      document.getElementById("primaryButtonColor").value = "#6a90ab";
      document.getElementById("cardBgColor").value = "#ffffff";
      document.getElementById("cardHoverBgColor").value = "#e6e6e6";
      document.getElementById("textColor").value = "#333333";
      document.getElementById("linkColor").value = "#007bff";
      break;
    case "dark":
      document.getElementById("primaryButtonColor").value = "#5b8fa8";
      document.getElementById("cardBgColor").value = "#2c2c2c";
      document.getElementById("cardHoverBgColor").value = "#3a3a3a";
      document.getElementById("textColor").value = "#ddd";
      document.getElementById("linkColor").value = "#90caf9";
      break;
    case "matrix":
      document.getElementById("primaryButtonColor").value = "#009900";
      document.getElementById("cardBgColor").value = "#000000";
      document.getElementById("cardHoverBgColor").value = "#002200";
      document.getElementById("textColor").value = "#00ff00";
      document.getElementById("linkColor").value = "#00ff88";
      break;
    case "retro":
      document.getElementById("primaryButtonColor").value = "#c28f7a";
      document.getElementById("cardBgColor").value = "#f2efe4";
      document.getElementById("cardHoverBgColor").value = "#ffd7b3";
      document.getElementById("textColor").value = "#444444";
      document.getElementById("linkColor").value = "#cc5500";
      break;
    case "neon":
      document.getElementById("primaryButtonColor").value = "#ff00ff";
      document.getElementById("cardBgColor").value = "#000000";
      document.getElementById("cardHoverBgColor").value = "#0f0f0f";
      document.getElementById("textColor").value = "#00ffff";
      document.getElementById("linkColor").value = "#39ff14";
      break;
    case "pastel":
      document.getElementById("primaryButtonColor").value = "#b39eb5";
      document.getElementById("cardBgColor").value = "#ffefd5";
      document.getElementById("cardHoverBgColor").value = "#ffe4e1";
      document.getElementById("textColor").value = "#333333";
      document.getElementById("linkColor").value = "#ffb6c1";
      break;
    case "solarized":
      document.getElementById("primaryButtonColor").value = "#268bd2";
      document.getElementById("cardBgColor").value = "#fdf6e3";
      document.getElementById("cardHoverBgColor").value = "#eee8d5";
      document.getElementById("textColor").value = "#657b83";
      document.getElementById("linkColor").value = "#2aa198";
      break;
    case "monokai":
      document.getElementById("primaryButtonColor").value = "#66d9ef";
      document.getElementById("cardBgColor").value = "#272822";
      document.getElementById("cardHoverBgColor").value = "#3e3d32";
      document.getElementById("textColor").value = "#f8f8f2";
      document.getElementById("linkColor").value = "#a6e22e";
      break;
    case "highcontrast":
      document.getElementById("primaryButtonColor").value = "#ffffff";
      document.getElementById("cardBgColor").value = "#000000";
      document.getElementById("cardHoverBgColor").value = "#222222";
      document.getElementById("textColor").value = "#ffffff";
      document.getElementById("linkColor").value = "#ffff00";
      break;
    default:
      // none
      break;
  }
}

/* Update the #hoverPreview box + #cardPreview to show color/scale changes live */
function updatePreview() {
  console.log("updatePreview called for #hoverPreview & #cardPreview");

  const hoverScale = document.getElementById("hoverScale")?.value || "1.2";
  const primaryButtonColor = document.getElementById("primaryButtonColor")?.value || "#6a90ab";
  const cardBgColor = document.getElementById("cardBgColor")?.value || "#ffffff";
  const cardHoverBgColor = document.getElementById("cardHoverBgColor")?.value || "#e6e6e6";
  const textColor = document.getElementById("textColor")?.value || "#333333";
  const linkColor = document.getElementById("linkColor")?.value || "#007bff";
  const uiScale = document.getElementById("uiScale")?.value || "1";

  // Display scale values
  const hoverScaleDisplay = document.getElementById("hoverScaleDisplay");
  if (hoverScaleDisplay) hoverScaleDisplay.innerText = hoverScale;

  const uiScaleDisplay = document.getElementById("uiScaleDisplay");
  if (uiScaleDisplay) uiScaleDisplay.innerText = uiScale;

  // #hoverPreview (small text-based box)
  const preview = document.getElementById("hoverPreview");
  if (preview) {
    preview.style.transform = `scale(${hoverScale})`;
    preview.style.backgroundColor = cardBgColor;
    preview.style.color = textColor;
    preview.style.borderColor = cardHoverBgColor;
    preview.innerHTML = `<a href="#" style="color:${linkColor}; text-decoration:none;">Preview Link</a> with UI scale: ${uiScale}`;
  }

  // #cardPreview (simulate a real card)
  const cardPreview = document.getElementById("cardPreview");
  if (cardPreview) {
    cardPreview.style.backgroundColor = cardBgColor;
    cardPreview.style.color = textColor;
    cardPreview.innerHTML = `
      <div style="display:flex; justify-content:space-between; align-items:center;">
        <a href="#" style="color:${linkColor}; text-decoration:none; margin-right:10px;">Sample Card Title</a>
        <button style="background-color:${primaryButtonColor}; color:#fff; border:none; border-radius:6px; padding:6px 12px;">Copy</button>
        <button style="background-color:#6d6f6f; color:#fff; border:none; border-radius:6px; padding:6px 12px; margin-left:5px;">Edit</button>
        <button style="background-color:#c85a5a; color:#fff; border:none; border-radius:6px; padding:6px 12px; margin-left:5px;">Remove</button>
      </div>
    `;
  }
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
  if (uiScale < 1) uiScale = 1;    // clamp
  if (uiScale > 2) uiScale = 2;    // clamp

  // Trim background URL; if it's blank or "undefined", set it to empty string
  let bgUrl = document.getElementById("bgUrl").value.trim();
  if (!bgUrl || bgUrl.toLowerCase() === "undefined") bgUrl = "";

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
    case "pulse":
      allCards.forEach(card => {
        card.style.animation = "pulse 1.5s infinite alternate";
      });
      break;
    case "flip":
      allCards.forEach(card => {
        card.style.animation = "flip 1.2s infinite alternate";
      });
      break;
    case "spin":
      allCards.forEach(card => {
        card.style.animation = "spin 2s linear infinite";
      });
      break;
    case "shake":
      allCards.forEach(card => {
        card.style.animation = "shake 0.8s infinite";
      });
      break;
    case "none":
    default:
      break;
  }
}

/* Example preset themes, extended with more options */
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
    case "neon":
      document.documentElement.style.setProperty("--bg-color", "#000");
      document.documentElement.style.setProperty("--text-color", "#0ff");
      document.documentElement.style.setProperty("--gradient-bg", "linear-gradient(135deg, #000 0%, #111 100%)");
      break;
    case "pastel":
      document.documentElement.style.setProperty("--bg-color", "#ffe4e1");
      document.documentElement.style.setProperty("--text-color", "#444");
      document.documentElement.style.setProperty("--gradient-bg", "linear-gradient(135deg, #fffaf0 0%, #ffe4e1 100%)");
      break;
    case "solarized":
      document.documentElement.style.setProperty("--bg-color", "#fdf6e3");
      document.documentElement.style.setProperty("--text-color", "#657b83");
      document.documentElement.style.setProperty("--gradient-bg", "linear-gradient(135deg, #eee8d5 0%, #fdf6e3 100%)");
      break;
    case "monokai":
      document.documentElement.style.setProperty("--bg-color", "#272822");
      document.documentElement.style.setProperty("--text-color", "#f8f8f2");
      document.documentElement.style.setProperty("--gradient-bg", "linear-gradient(135deg, #383830 0%, #272822 100%)");
      break;
    case "highcontrast":
      document.documentElement.style.setProperty("--bg-color", "#000");
      document.documentElement.style.setProperty("--text-color", "#fff");
      document.documentElement.style.setProperty("--gradient-bg", "linear-gradient(135deg, #000 0%, #111 100%)");
      break;
    default:
      // no preset or revert
      break;
  }
}
