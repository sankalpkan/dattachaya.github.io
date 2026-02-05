document.addEventListener("DOMContentLoaded", () => {
  loadTempleInfo();
});

function loadTempleInfo() {
  fetch("data/temple-info.json")
    .then(res => res.json())
    .then(data => {
      document.getElementById("templeName").textContent = data.name;
      document.getElementById("templeMantra").textContent = data.mantra;

      document.getElementById("templeTimings").textContent =
        `Morning: ${data.timings.morning} | Evening: ${data.timings.evening}`;

      document.getElementById("templeAddress").innerHTML =
        `${data.address.line1}<br>
         ${data.address.line2}<br>
         ${data.address.city}, ${data.address.state}, ${data.address.country}`;

      document.getElementById("timingsMorning").textContent =
        `Morning: ${data.timings.morning}`;

      document.getElementById("timingsEvening").textContent =
        `Evening: ${data.timings.evening}`;

      document.getElementById("templePhone").textContent =
        `Phone: ${data.contact.phone}`;

      document.getElementById("templeEmail").textContent =
        `Email: ${data.contact.email}`;

      const festivalList = document.getElementById("festivalList");

      if (festivalList) {
        festivals.forEach(festival => {
          const li = document.createElement("li");
          li.textContent = festival;
          festivalList.appendChild(li);
        });
      }
    });
}

// ================= NAVBAR LOGIC =================

const hamburger = document.getElementById("hamburger");
const navLinks = document.getElementById("navLinks");

hamburger.addEventListener("click", () => {
  navLinks.classList.toggle("active");
});

// Close menu when link clicked (mobile)
document.querySelectorAll(".nav-links a").forEach(link => {
  link.addEventListener("click", () => {
    navLinks.classList.remove("active");
  });
});

const defaultLang = "en";

async function loadLang(lang) {
  try {
    const res = await fetch(`i18n/${lang}.json`);
    const data = await res.json();
    applyTranslations(data);
    localStorage.setItem("lang", lang);
  } catch (e) {
    console.warn("Language load failed", e);
  }
}

function applyTranslations(data) {
  document.querySelectorAll("[data-i18n]").forEach(el => {
    const key = el.dataset.i18n;
    const value = key.split(".").reduce((o, i) => o?.[i], data);
    if (value) el.textContent = value;
  });
}

document.querySelectorAll(".lang-switcher button").forEach(btn => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".lang-switcher button").forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    loadLang(btn.dataset.lang);
  });
});

loadLang(localStorage.getItem("lang") || defaultLang);
