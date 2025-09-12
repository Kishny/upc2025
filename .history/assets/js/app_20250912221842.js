/* =========================
   NAV / HEADER
========================= */
const burger = document.getElementById("burger");
const nav = document.getElementById("nav");

if (burger) {
  burger.addEventListener("click", () => nav.classList.toggle("open"));
  nav
    ?.querySelectorAll("a")
    .forEach((a) =>
      a.addEventListener("click", () => nav.classList.remove("open"))
    );
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") nav?.classList.remove("open");
  });
}

// Lien actif selon la page
(function markActiveNav() {
  const path = location.pathname.split("/").pop() || "index.html";
  document
    .querySelectorAll("#nav a")
    .forEach((a) =>
      a.classList.toggle("active", a.getAttribute("href") === path)
    );
})();

/* =========================
   FOOTER
========================= */
const yearEl = document.getElementById("year");
if (yearEl) yearEl.textContent = new Date().getFullYear();

/* =========================
   HERO — Vidéo
========================= */
const video = document.getElementById("meetingVideo");
const btn = document.getElementById("volumeToggle");
const iconMute = document.getElementById("iconMute");
const iconSound = document.getElementById("iconSound");

if (video) {
  video.loop = true;
  video.muted = true;
  video
    .play()
    .catch(() => console.log("Autoplay bloqué, vérifier si muted est activé"));

  btn?.addEventListener("click", () => {
    if (video.muted) {
      video.muted = false;
      iconMute?.classList.add("hidden");
      iconSound?.classList.remove("hidden");
    } else {
      video.muted = true;
      iconMute?.classList.remove("hidden");
      iconSound?.classList.add("hidden");
    }
  });
}

/* =========================
   BACKEND — Formulaires
========================= */
// URL de ton backend
const BASE_URL = "http://127.0.0.1:4000";

// Fonction POST générique
async function postForm(url, data) {
  try {
    const res = await fetch(`${BASE_URL}${url}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    return await res.json();
  } catch (err) {
    console.error("Erreur fetch:", err);
    return { ok: false, error: "NETWORK_ERROR" };
  }
}

// Fonction pour brancher un formulaire
function wireFormBackend(id, url, okMessage) {
  const form = document.getElementById(id);
  if (!form) return;

  const alertBox = form.querySelector(".form__alert");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    alertBox.hidden = false;
    alertBox.style.borderColor = "#007A5E";
    alertBox.textContent = "Envoi en cours…";

    const formData = Object.fromEntries(new FormData(form));

    try {
      const res = await postForm(url, formData);
      if (res.ok) {
        alertBox.style.borderColor = "#007A5E";
        alertBox.textContent = okMessage;
        form.reset();
      } else {
        alertBox.style.borderColor = "#CE1126";
        alertBox.textContent = `Erreur: ${res.error || "Serveur"}`;
      }
    } catch (err) {
      console.error(err);
      alertBox.style.borderColor = "#CE1126";
      alertBox.textContent = "Erreur réseau, réessayez plus tard.";
    }
  });
}

// ⚡ Brancher tous les formulaires
wireFormBackend(
  "form-adhesion",
  "/api/join",
  "Merci ! Votre adhésion a été enregistrée."
);
wireFormBackend("form-committee", "/api/committee", "Comité enregistré !");
wireFormBackend(
  "form-newsletter",
  "/api/newsletter",
  "Merci ! Votre inscription à la newsletter a été enregistrée."
);

/* =========================
   ANIMATIONS — Candidat
========================= */
document.addEventListener("DOMContentLoaded", () => {
  const img = document.querySelector(".candidat__img");
  if (img) {
    img.style.opacity = 0;
    img.style.transition = "opacity 1s ease";
    setTimeout(() => (img.style.opacity = 1), 200);
  }
});
