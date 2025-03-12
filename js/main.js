// js/main.js

// Shared password configuration
const sharedPassword = "Chip751DE";

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

// Render the links list
function renderLinks() {
  const linksList = document.getElementById("linksList");
  linksList.innerHTML = "";
  const filteredData = (currentCategory === "all")
    ? linksData
    : linksData.filter(link => link.category === currentCategory);
  filteredData.forEach((link, idx) => {
    const card = document.createElement("div");
    card.classList.add("card", "link-item");

    // Create the anchor element for the link
    const anchor = document.createElement("a");
    anchor.href = link.url;
    anchor.textContent = link.name;

    // Create the Copy button
    const copyBtn = document.createElement("button");
    copyBtn.className = "copy-btn";
    copyBtn.textContent = "Copy";
    copyBtn.onclick = () => copyURL(anchor.href, copyBtn);

    // Create the Edit button
    const editBtn = document.createElement("button");
    editBtn.className = "edit-btn";
    editBtn.textContent = "Edit";
    editBtn.onclick = () => fillFormForEdit(idx);

    // Create the Remove button
    const removeBtn = document.createElement("button");
    removeBtn.className = "remove-btn";
    removeBtn.textContent = "X";
    removeBtn.onclick = () => removeLink(idx);

    // Append all elements to the card
    card.appendChild(anchor);
    card.appendChild(copyBtn);
    card.appendChild(editBtn);
    card.appendChild(removeBtn);

    // Append the card to the list
    linksList.appendChild(card);
  });
  searchLinks();
}

// Search filter function for site cards
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

/* Manage Panel functions */
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

/* Add/Edit Links */
function submitForm(event) {
  event.preventDefault();
  const name = document.getElementById("linkName").value.trim();
  const url = document.getElementById("linkURL").value.trim();
  const category = document.getElementById("linkCategory").value;
  if (!name || !url || !category) return;
  if (editIndex !== null) {
    linksData[editIndex].name = name;
    linksData[editIndex].url = url;
    linksData[editIndex].category = category;
    editIndex = null;
    document.getElementById("submitBtn").textContent = "Add Link";
  } else {
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

/* Remove Link */
function removeLink(index) {
  linksData.splice(index, 1);
  saveLinksToStorage();
  renderLinks();
}

/* Copy URL */
function copyURL(url, btn) {
  navigator.clipboard.writeText(url)
    .then(() => {
      const originalText = btn.innerText;
      btn.innerText = "Copied!";
      setTimeout(() => { btn.innerText = originalText; }, 2000);
    })
    .catch(err => console.error("Copy failed: ", err));
}

/* Back to Top */
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

/* Initialization */
window.addEventListener("DOMContentLoaded", () => {
  checkLogin();
  setupTheme();
  mergeLinksFromStorage();
  loadSettings();

  const searchEl = document.getElementById("searchBox");
  searchEl.focus();
  searchEl.addEventListener("focus", () => searchEl.select());
  searchEl.addEventListener("input", searchLinks);
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
  renderLinks();
});
