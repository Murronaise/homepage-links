// js/main.js

/* -----------------------------------------------------------
   SHARED PASSWORD CONFIGURATION
----------------------------------------------------------- */
const sharedPassword = "Chip751DE";

/* -----------------------------------------------------------
   LOGIN / LOGOUT FUNCTIONS
----------------------------------------------------------- */
function login() {
  const entered = document.getElementById("loginPassword").value;
  if (entered === sharedPassword) {
    // Correct password
    localStorage.setItem("loggedIn", "true");
    document.getElementById("loginContainer").style.display = "none";
    document.getElementById("mainContent").style.display = "block";
    focusSearchBar();
  } else {
    // Incorrect password
    document.getElementById("loginError").style.display = "block";
  }
}

function logout() {
  localStorage.removeItem("loggedIn");
  location.reload(); // Reload to show login prompt again
}

function checkLogin() {
  if (localStorage.getItem("loggedIn") === "true") {
    // Already logged in
    document.getElementById("loginContainer").style.display = "none";
    document.getElementById("mainContent").style.display = "block";
    focusSearchBar();
  } else {
    // Not logged in - focus the password field
    const passEl = document.getElementById("loginPassword");
    passEl.focus();
    passEl.select();
  }
}

function submitLogin(event) {
  event.preventDefault();
  login();
}

function focusSearchBar() {
  const searchEl = document.getElementById("searchBox");
  searchEl.focus();
  searchEl.select();
}

/* -----------------------------------------------------------
   LINKS & DATA
----------------------------------------------------------- */
let linksData = [];
let currentCategory = "all"; // Default category on load
let editIndex = null;

// Merge default sites (from data/sites.js) with any stored links
function mergeLinksFromStorage() {
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
  localStorage.setItem("linksData", JSON.stringify(linksData));
}

/* -----------------------------------------------------------
   RENDER & FILTER LINKS
----------------------------------------------------------- */
function renderLinks() {
  const linksList = document.getElementById("linksList");
  linksList.innerHTML = "";

  const filteredData = (currentCategory === "all")
    ? linksData
    : linksData.filter(link => link.category === currentCategory);

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

    // Append elements to card
    card.appendChild(anchor);
    card.appendChild(copyBtn);
    card.appendChild(editBtn);
    card.appendChild(removeBtn);

    // Append card to the list
    linksList.appendChild(card);
  });

  // Apply search filter after rendering
  searchLinks();
}

function searchLinks() {
  const input = document.getElementById("searchBox").value.toLowerCase();
  const cards = document.querySelectorAll(".link-item");
  cards.forEach(card => {
    card.style.display = card.textContent.toLowerCase().includes(input) ? "flex" : "none";
  });
}

function clickCategory(cat) {
  document.getElementById("searchBox").value = "";
  currentCategory = cat;
  renderLinks();
}

function clickManage() {
  document.getElementById("searchBox").value = "";
  searchLinks();
  toggleManagePanel();
}

function clearSearch() {
  document.getElementById("searchBox").value = "";
  searchLinks();
}

/* -----------------------------------------------------------
   MANAGE PANEL (Add/Edit/Remove Links)
----------------------------------------------------------- */
function toggleManagePanel() {
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
  const name = document.getElementById("linkName").value.trim();
  const url = document.getElementById("linkURL").value.trim();
  const category = document.getElementById("linkCategory").value;
  if (!name || !url || !category) return;

  if (editIndex !== null) {
    // Editing existing link
    linksData[editIndex].name = name;
    linksData[editIndex].url = url;
    linksData[editIndex].category = category;
    editIndex = null;
    document.getElementById("submitBtn").textContent = "Add Link";
  } else {
    // Adding new link
    linksData.push({ name, url, category });
  }
  saveLinksToStorage();
  event.target.reset();
  renderLinks();
}

function fillFormForEdit(index) {
  editIndex = index;
  document.getElementById("linkName").value = linksData[index].name;
  document.getElementById("linkURL").value = linksData[index].url;
  document.getElementById("linkCategory").value = linksData[index].category;
  document.getElementById("submitBtn").textContent = "Save Changes";
  document.getElementById("managePanel").style.display = "block";
  document.body.classList.add("manage-mode");
}

function removeLink(index) {
  linksData.splice(index, 1);
  saveLinksToStorage();
  renderLinks();
}

/* -----------------------------------------------------------
   COPY URL
----------------------------------------------------------- */
function copyURL(url, btn) {
  navigator.clipboard.writeText(url)
    .then(() => {
      const originalText = btn.innerText;
      btn.innerText = "Copied!";
      setTimeout(() => { btn.innerText = originalText; }, 2000);
    })
    .catch(err => console.error("Copy failed: ", err));
}

/* -----------------------------------------------------------
   BACK TO TOP
----------------------------------------------------------- */
function topFunction() {
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
  // Check login
  checkLogin();
  // Set up theme
  setupTheme();
  // Merge default sites with any stored changes
  mergeLinksFromStorage();
  // Load settings from localStorage
  loadSettings();

  // Focus the search bar
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
          window.location.href = singleLink.href;
        }
      }
    }
  });

  // Render the list of links
  renderLinks();
});
