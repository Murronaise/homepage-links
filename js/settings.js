// js/settings.js

// Debug log for settings module load
console.log("Settings module loaded");

// Switch between tabs in the settings panel.
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
