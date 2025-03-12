// js/main.js

console.log("main.js loaded");

/* -----------------------------------------------------------
   SHARED PASSWORD CONFIGURATION
----------------------------------------------------------- */
const sharedPassword = "Chip751DE";

/* -----------------------------------------------------------
   LOGIN / LOGOUT FUNCTIONS
----------------------------------------------------------- */
function submitLogin(event) {
  event.preventDefault();
  login();
}

function login() {
  const entered = document.getElementById("loginPassword").value;
  console.log("Login attempt with password:", entered);
  if (entered === sharedPassword) {
    console.log("Password correct, logging in...");
    localStorage.setItem("loggedIn", "true");
    document.getElementById("loginContainer").style.display = "none";
    document.getElementById("mainContent").style.display = "block";
    focusSearchBar();
  } else {
    console.log("Incorrect password");
    document.getElementById("loginError").style.display = "block";
  }
}

function logout() {
  console.log("Logout called");
  localStorage.removeItem("loggedIn");
  location.reload();
}

function checkLogin() {
  console.log("checkLogin called");
  if (localStorage.getItem("loggedIn") === "true") {
    console.log("User is logged in, showing mainContent");
    document.getElementById("loginContainer").style.display = "none";
    document.getElementById("mainContent").style.display = "block";
    focusSearchBar();
  } else {
    console.log("User not logged in, showing loginContainer");
    const passEl = document.getElementById("loginPassword");
    passEl.focus();
    passEl.select();
  }
}

function focusSearchBar() {
  console.log("focusSearchBar called");
  const searchEl = document.getElementById("searchBox");
  searchEl.focus();
  searchEl.select();
}

/* -----------------------------------------------------------
   THEME FUNCTIONS
----------------------------------------------------------- */
function setupTheme() {
  console.log("setupTheme called");
  const storedTheme = localStorage.getItem("theme");
  const themeToggle = document.getElementById("themeToggle");
  if (storedTheme) {
    if (storedTheme === "light") {
      console.log("Stored theme is light");
      document.documentElement.setAttribute("data-theme", "light");
      themeToggle.checked = true;
    } else {
      console.log("Stored theme is dark");
      document.documentElement.setAttribute("data-theme", "dark");
      themeToggle.checked = false;
    }
  } else {
    console.log("No stored theme, defaulting to dark");
    document.documentElement.setAttribute("data-theme", "dark");
    themeToggle.checked = false;
    localStorage.setItem("theme", "dark");
  }
}

function toggleTheme() {
  console.log("toggleTheme called");
  const htmlEl = document.documentElement;
  const toggle = document.getElementById("themeToggle");
  if (toggle.checked) {
    console.log("Switching to light theme");
    htmlEl.setAttribute("data-theme", "light");
    localStorage.setItem("theme", "light");
  } else {
    console.log("Switching to dark theme");
    htmlEl.setAttribute("data-theme", "dark");
    localStorage.setItem("theme", "dark");
  }
}

/* -----------------------------------------------------------
   RESET BUTTON FUNCTIONS
----------------------------------------------------------- */
function defaultResetAll() {
  console.log("defaultResetAll called");
  if (confirm("Are you sure you want to reset list to default? This will remove any custom changes.")) {
    localStorage.removeItem("linksData");
    linksData = [...snippetLinks];
    saveLinksToStorage();
    currentCategory = "all";
    renderLinks();
  }
}

function defaultResetHosted() {
  console.log("defaultResetHosted called");
  if (confirm("Are you sure you want to reset list to default? This will remove any custom changes.")) {
    localStorage.removeItem("linksData");
    linksData = [...snippetLinks];
    saveLinksToStorage();
    currentCategory = "hosted";
    renderLinks();
  }
}

function defaultResetNonHosted() {
  console.log("defaultResetNonHosted called");
  if (confirm("Are you sure you want to reset list to default? This will remove any custom changes.")) {
    localStorage.removeItem("linksData");
    linksData = [...snippetLinks];
    saveLinksToStorage();
    currentCategory = "nonhosted";
    renderLinks();
  }
}

/* -----------------------------------------------------------
   MERGE / SAVE LINKS
----------------------------------------------------------- */
let linksData = [];
let currentCategory = "all"; // Default category on load
let editIndex = null;

function mergeLinksFromStorage() {
  console.log("mergeLinksFromStorage called");
  const storedLinks = localStorage.getItem("linksData");
  if (storedLinks) {
    const storedArr = JSON.parse(storedLinks);
    for (const sLink of snippetLinks) {
      if (!storedArr.some(x => x.name === sLink.name && x.url === sLink.url)) {
        storedArr.push(sLink);
      }
    }
    linksData = storedArr;
    saveLinksToStorage();
  } else {
    linksData = [...snippetLinks];
    saveLinksToStorage();
  }
}

function saveLinksToStorage() {
  console.log("saveLinksToStorage called");
  localStorage.setItem("linksData", JSON.stringify(linksData));
}

/* -----------------------------------------------------------
   RENDER & FILTER LINKS
----------------------------------------------------------- */
function renderLinks() {
  console.log("renderLinks called, currentCategory:", currentCategory);
  const linksList = document.getElementById("linksList");
  linksList.innerHTML = "";

  const filteredData = (currentCategory === "all")
    ? linksData
    : linksData.filter(link => link.category === currentCategory);

  console.log("filteredData length:", filteredData.length);

  filteredData.forEach((link, idx) => {
    const card = document.createElement("div");
    card.classList.add("card", "link-item");

    // Anchor
    const anchor = document.createElement("a");
    anchor.href = link.url;
    anchor.textContent = link.name;

    // Copy Button
    const copyBtn = document.createElement("button");
    copyBtn.className = "copy-btn";
    copyBtn.textContent = "Copy";
    copyBtn.onclick = () => copyURL(anchor.href, copyBtn);

    // Edit Button
    const editBtn = document.createElement("button");
    editBtn.className = "edit-btn";
    editBtn.textContent = "Edit";
    editBtn.onclick = () => fillFormForEdit(idx);

    // Remove Button
    const removeBtn = document.createElement("button");
    removeBtn.className = "remove-btn";
    removeBtn.textContent = "X";
    removeBtn.onclick = () => removeLink(idx);

    // Append to card
    card.appendChild(anchor);
    card.appendChild(copyBtn);
    card.appendChild(editBtn);
    card.appendChild(removeBtn);

    linksList.appendChild(card);
  });
  searchLinks();
}

function searchLinks() {
  console.log("searchLinks called");
  const input = document.getElementById("searchBox").value.toLowerCase();
  const cards = document.querySelectorAll(".link-item");
  let visibleCount = 0;
  cards.forEach(card => {
    if (card.textContent.toLowerCase().includes(input)) {
      card.style.display = "flex";
      visibleCount++;
    } else {
      card.style.display = "none";
    }
  });
  console.log("searchLinks visibleCount:", visibleCount);
}

function clickCategory(cat) {
  console.log("clickCategory called with:", cat);
  document.getElementById("searchBox").value = "";
  currentCategory = cat;
  renderLinks();
}

function clickManage() {
  console.log("clickManage called");
  document.getElementById("searchBox").value = "";
  searchLinks();
  toggleManagePanel();
}

function clearSearch() {
  console.log("clearSearch called");
  document.getElementById("searchBox").value = "";
  searchLinks();
}

/* -----------------------------------------------------------
   MANAGE PANEL (Add/Edit/Remove Links)
----------------------------------------------------------- */
function toggleManagePanel() {
  console.log("toggleManagePanel called");
  const panel = document.getElementById("managePanel");
  if (panel.style.display === "none" || panel.style.display === "") {
    panel.style.display = "block";
    document.body.classList.add("manage-mode");
  } else {
    panel.style.display = "none";
    document.body.classList.remove("manage-mode");
  }
}

function submitForm(event) {
  event.preventDefault();
  console.log("submitForm called");
  const name = document.getElementById("linkName").value.trim();
  const url = document.getElementById("linkURL").value.trim();
  const category = document.getElementById("linkCategory").value;
  console.log("submitForm inputs:", { name, url, category });

  if (!name || !url || !category) {
    console.log("submitForm: missing data, returning");
    return;
  }

  if (editIndex !== null) {
    console.log("submitForm: editing existing link at index:", editIndex);
    linksData[editIndex].name = name;
    linksData[editIndex].url = url;
    linksData[editIndex].category = category;
    editIndex = null;
    document.getElementById("submitBtn").textContent = "Add Link";
  } else {
    console.log("submitForm: adding new link");
    linksData.push({ name, url, category });
  }
  saveLinksToStorage();
  event.target.reset();
  renderLinks();
}

function fillFormForEdit(index) {
  console.log("fillFormForEdit called with index:", index);
  editIndex = index;
  document.getElementById("linkName").value = linksData[index].name;
  document.getElementById("linkURL").value = linksData[index].url;
  document.getElementById("linkCategory").value = linksData[index].category;
  document.getElementById("submitBtn").textContent = "Save Changes";
  document.getElementById("managePanel").style.display = "block";
  document.body.classList.add("manage-mode");
}

function removeLink(index) {
  console.log("removeLink called with index:", index);
  linksData.splice(index, 1);
  saveLinksToStorage();
  renderLinks();
}

/* -----------------------------------------------------------
   COPY URL
----------------------------------------------------------- */
function copyURL(url, btn) {
  console.log("copyURL called with url:", url);
  navigator.clipboard.writeText(url)
    .then(() => {
      console.log("URL copied to clipboard");
      const originalText = btn.innerText;
      btn.innerText = "Copied!";
      setTimeout(() => { btn.innerText = originalText; }, 2000);
    })
    .catch(err => console.error("Copy failed: ", err));
}

/* -----------------------------------------------------------
   SETTINGS PANEL TOGGLE
----------------------------------------------------------- */
function toggleSettings() {
  console.log("toggleSettings called");
  const panel = document.getElementById("settingsPanel");
  if (panel.style.display === "none" || panel.style.display === "") {
    console.log("Showing settings panel");
    loadSettings(); // load current settings from localStorage
    panel.style.display = "block";
  } else {
    console.log("Hiding settings panel");
    panel.style.display = "none";
  }
}

/* -----------------------------------------------------------
   BACK TO TOP
----------------------------------------------------------- */
function topFunction() {
  console.log("topFunction called");
  window.scrollTo({ top: 0, behavior: "smooth" });
}
window.addEventListener("scroll", function() {
  const topBtn = document.getElementById("topBtn");
  if (document.body.scrollTop > 100 || document.documentElement.scrollTop > 100) {
    topBtn.style.display = "flex";
  } else {
    topBtn.style.display = "none";
  }
});

/* -----------------------------------------------------------
   DOM LOADED (INIT)
----------------------------------------------------------- */
window.addEventListener("DOMContentLoaded", () => {
  console.log("DOMContentLoaded event fired");
  checkLogin();
  setupTheme();
  mergeLinksFromStorage();
  loadSettings(); // from settings.js

  const searchEl = document.getElementById("searchBox");
  searchEl.focus();
  searchEl.addEventListener("focus", () => searchEl.select());
  searchEl.addEventListener("input", searchLinks);

  // Pressing Enter in the search box with exactly one result navigates directly
  searchEl.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      const visibleCards = [...document.querySelectorAll(".link-item")].filter(
        card => card.style.display !== "none"
      );
      if (visibleCards.length === 1) {
        const singleLink = visibleCards[0].querySelector("a");
        if (singleLink) {
          console.log("Navigating directly to:", singleLink.href);
          window.location.href = singleLink.href;
        }
      }
    }
  });

  renderLinks();
  console.log("Initialization complete");
});
