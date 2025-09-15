/* =========================
   I18N.JS — Translation Module
   ========================= */
const I18N = (function () {
  let currentLang = localStorage.getItem("lang") || "fr";
  let translations = {};

  // Charger le fichier JSON de traduction
  async function load(lang) {
    try {
      const res = await fetch(`assets/i18n/${lang}.json`);
      translations = await res.json();
      currentLang = lang;
      localStorage.setItem("lang", lang);
      applyTranslations();
    } catch (err) {
      console.error("Erreur chargement traductions :", err);
    }
  }

  // Appliquer les traductions sur les éléments data-i18n
  function applyTranslations() {
    document.querySelectorAll("[data-i18n]").forEach((el) => {
      const key = el.getAttribute("data-i18n");
      if (!key) return;
      const text = get(key);
      if (text !== undefined) {
        if (el.placeholder !== undefined && el.hasAttribute("placeholder")) {
          el.placeholder = text;
        } else {
          el.textContent = text;
        }
      }
    });
  }

  // Récupérer une traduction
  function get(key) {
    return translations[key] ?? key;
  }

  // Basculer la langue
  function toggle() {
    const newLang = currentLang === "fr" ? "en" : "fr";
    load(newLang);
  }

  // Exposer les méthodes et currentLang
  return { load, get, toggle, currentLang };
})();

/* =========================
   READY CALLBACK SECURISEE
   ========================= */
window.I18NReady = function (callback) {
  const check = () => {
    if (window.I18N && typeof window.I18N.currentLang !== "undefined") {
      callback();
    } else {
      setTimeout(check, 50);
    }
  };
  check();
};

/* =========================
   INITIALISATION
   ========================= */
document.addEventListener("DOMContentLoaded", () => {
  console.log("I18N initialisation avant click FR/EN :", I18N);
  I18N.load(I18N.currentLang);

  const langToggleBtn = document.getElementById("langToggle");
  if (langToggleBtn) {
    langToggleBtn.addEventListener("click", () => {
      console.log(
        "FR/EN clicked. Current lang before toggle:",
        I18N.currentLang
      );
      I18N.toggle();
    });
  }
});
