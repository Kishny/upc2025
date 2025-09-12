/* =========================================================
   i18n.js — charge fr/en depuis assets/i18n/, avec cache
   ========================================================= */

(function () {
  const LS_LANG = "i18n.lang";
  const LS_BUNDLE = (lang) => `i18n.bundle.${lang}`;
  const LS_VER = "i18n.version";
  const BASE = "assets/i18n";
  const DEF_LANG = "fr";
  const FALLBACK = "fr";

  // util
  const fetchJSON = (url) =>
    fetch(url, { cache: "no-store" }).then((r) => {
      if (!r.ok) throw new Error(`HTTP ${r.status} on ${url}`);
      return r.json();
    });

  // état interne
  const state = {
    lang: localStorage.getItem(LS_LANG) || detectLang(),
    dict: {},
    version: localStorage.getItem(LS_VER) || "0.0.0",
  };

  function detectLang() {
    const n = (navigator.language || "fr").toLowerCase();
    return n.startsWith("en") ? "en" : "fr";
  }

  async function ensureVersion() {
    try {
      const v = await fetchJSON(`${BASE}/version.json`);
      if (v?.version && v.version !== state.version) {
        // purge bundles si version change
        localStorage.removeItem(LS_BUNDLE("fr"));
        localStorage.removeItem(LS_BUNDLE("en"));
        localStorage.setItem(LS_VER, v.version);
        state.version = v.version;
      }
    } catch {
      // pas bloquant
    }
  }

  function loadFromCache(lang) {
    try {
      const raw = localStorage.getItem(LS_BUNDLE(lang));
      if (!raw) return null;
      return JSON.parse(raw);
    } catch {
      return null;
    }
  }

  async function loadLang(lang) {
    // 1) cache
    const cached = loadFromCache(lang);
    if (cached) {
      state.dict = cached;
      state.lang = lang;
      return;
    }
    // 2) réseau
    try {
      const json = await fetchJSON(`${BASE}/${lang}.json`);
      state.dict = json || {};
      state.lang = lang;
      localStorage.setItem(LS_LANG, lang);
      localStorage.setItem(LS_BUNDLE(lang), JSON.stringify(state.dict));
    } catch (e) {
      // fallback sur FR puis EN
      if (lang !== FALLBACK) return loadLang(FALLBACK);
      console.warn("[i18n] fallback failed:", e);
      state.dict = {};
    }
  }

  function tr(key) {
    // support des chemins "a.b.c"
    const parts = String(key).split(".");
    let cur = state.dict;
    for (const p of parts) {
      cur = cur?.[p];
      if (cur == null) break;
    }
    return cur ?? key; // si absent, on renvoie la clé
  }

  // Applique les traductions au DOM
  function applyDOM(root = document) {
    // textContent
    root.querySelectorAll("[data-i18n]").forEach((el) => {
      // si l’élément a aussi data-i18n-html, on ne touche pas textContent
      if (el.hasAttribute("data-i18n-html")) return;
      const key = el.getAttribute("data-i18n");
      el.textContent = tr(key);
    });

    // innerHTML
    root.querySelectorAll("[data-i18n-html]").forEach((el) => {
      const key = el.getAttribute("data-i18n-html");
      el.innerHTML = tr(key);
    });

    // attributs
    root.querySelectorAll("[data-i18n-attr]").forEach((el) => {
      const list = (el.getAttribute("data-i18n-attr") || "")
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);

      list.forEach((attr) => {
        const attrKey =
          el.getAttribute(`data-i18n-${attr}`) || el.getAttribute("data-i18n");
        if (attrKey) el.setAttribute(attr, tr(attrKey));
      });
    });

    document.documentElement.setAttribute("lang", state.lang);
  }

  async function init() {
    await ensureVersion();
    await loadLang(state.lang);
    applyDOM();
  }

  // API publique
  const I18N = {
    get lang() {
      return state.lang;
    },
    async set(lang) {
      if (!lang || lang === state.lang) return;
      await loadLang(lang);
      localStorage.setItem(LS_LANG, state.lang);
      applyDOM();
    },
    async toggle() {
      const next = state.lang === "fr" ? "en" : "fr";
      await I18N.set(next);
    },
    t: tr,
    apply: applyDOM,
    // recharge manuelle (utile après injection dynamique de HTML)
    async reload() {
      await loadLang(state.lang);
      applyDOM();
    },
  };

  // expose global
  window.I18N = I18N;

  // auto-init
  document.readyState === "loading"
    ? document.addEventListener("DOMContentLoaded", init)
    : init();
})();
