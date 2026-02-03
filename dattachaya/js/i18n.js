const DEFAULT_LANG = "en";

/**
 * Safely get nested value from object using dot-notation
 */
function getNestedValue(obj, path) {
  return path.split(".").reduce((acc, key) => {
    return acc && acc[key] !== undefined ? acc[key] : null;
  }, obj);
}

/**
 * Apply translations with fallback
 */
function applyTranslations(translations) {
  document.querySelectorAll("[data-i18n]").forEach(el => {
    const key = el.getAttribute("data-i18n");

    // Store original text once (for fallback)
    if (!el.dataset.i18nFallback) {
      el.dataset.i18nFallback = el.textContent.trim();
    }

    const translatedText = getNestedValue(translations, key);

    if (translatedText) {
      el.textContent = translatedText;
    } else {
      // Fallback to original text
      el.textContent = el.dataset.i18nFallback;

      // Optional debug log (safe to keep)
      console.warn(`i18n missing key: ${key}`);
    }
  });
}

/**
 * Load language JSON safely
 */
async function loadLanguage(lang) {
  try {
    const response = await fetch(`i18n/${lang}.json`, { cache: "no-cache" });
    if (!response.ok) throw new Error("Language file not found");

    const translations = await response.json();
    applyTranslations(translations);

    localStorage.setItem("lang", lang);
    updateActiveLangButton(lang);

  } catch (error) {
    console.error("i18n load failed, falling back to default language", error);

    if (lang !== DEFAULT_LANG) {
      loadLanguage(DEFAULT_LANG);
    }
  }
}

/**
 * Update active button state
 */
function updateActiveLangButton(lang) {
  document.querySelectorAll(".lang-switcher button").forEach(btn => {
    btn.classList.toggle("active", btn.dataset.lang === lang);
  });
}

/**
 * Init
 */
document.addEventListener("DOMContentLoaded", () => {
  const savedLang = localStorage.getItem("lang") || DEFAULT_LANG;
  loadLanguage(savedLang);

  document.querySelectorAll(".lang-switcher button").forEach(btn => {
    btn.addEventListener("click", () => {
      loadLanguage(btn.dataset.lang);
    });
  });
});
