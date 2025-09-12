// i18n.js — tiny loader + cache
const I18N = (() => {
  const LS_LANG_KEY = "i18n:lang";
  const LS_DICT_KEY = "i18n:dict";
  const LS_VER_KEY = "i18n:version";

  const fallbackLang = "fr";
  let lang = localStorage.getItem(LS_LANG_KEY) || fallbackLang;
  let dict = {};

  async function fetchJSON(url) {
    const res = await fetch(url, { cache: "no-store" });
    if (!res.ok) throw new Error(`Fetch failed: ${url}`);
    return res.json();
  }

  async function ensureVersion() {
    // si version.json change, on invalide le cache
    try {
      const { version } = await fetchJSON("assets/i18n/version.json");
      const cached = localStorage.getItem(LS_VER_KEY);
      if (cached !== version) {
        localStorage.removeItem(LS_DICT_KEY);
        localStorage.setItem(LS_VER_KEY, version);
      }
    } catch {
      /* silencieux: on ne casse rien si offline */
    }
  }

  async function load(langCode = lang) {
    await ensureVersion();

    const cached = localStorage.getItem(LS_DICT_KEY);
    if (cached) {
      try {
        dict = JSON.parse(cached);
      } catch {
        /* ignore */
      }
    }

    // si pas de cache ou mauvaise langue en cache, on recharge
    if (!dict.__lang || dict.__lang !== langCode) {
      const data = await fetchJSON(`assets/i18n/${langCode}.json`);
      dict = { ...data, __lang: langCode };
      localStorage.setItem(LS_DICT_KEY, JSON.stringify(dict));
    }

    lang = langCode;
    localStorage.setItem(LS_LANG_KEY, lang);
    apply();
  }

  function t(key, fallback = key) {
    // support des chemins "section.key" -> { section: { key: "..." } }
    return (
      key
        .split(".")
        .reduce((o, k) => (o && o[k] != null ? o[k] : null), dict) ?? fallback
    );
  }

  function apply(root = document) {
    // data-i18n="key" -> textContent
    root.querySelectorAll("[data-i18n]").forEach((el) => {
      const k = el.getAttribute("data-i18n");
      el.textContent = t(k);
    });

    // data-i18n-html="key" -> innerHTML (si tu as besoin de <strong>)
    root.querySelectorAll("[data-i18n-html]").forEach((el) => {
      const k = el.getAttribute("data-i18n-html");
      el.innerHTML = t(k);
    });

    document.documentElement.lang = lang;
  }

  async function toggle() {
    await load(lang === "fr" ? "en" : "fr");
  }

  return {
    load,
    toggle,
    t,
    apply,
    get lang() {
      return lang;
    },
  };
})();

// Auto-load sur DOMContentLoaded
document.addEventListener("DOMContentLoaded", () => {
  I18N.load().catch(() => I18N.apply()); // offline: applique ce qu'on a
});
