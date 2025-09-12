/* =========================
   NAV / HEADER
   ========================= */
// Burger / Nav
const burger = document.getElementById("burger");
const nav = document.getElementById("nav");
if (burger) {
  burger.addEventListener("click", () => nav.classList.toggle("open"));

  // Fermer le menu quand on clique sur un lien (mobile)
  nav
    ?.querySelectorAll("a")
    .forEach((a) =>
      a.addEventListener("click", () => nav.classList.remove("open"))
    );

  // Fermer avec ESC
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") nav?.classList.remove("open");
  });
}

// Lien actif (surbrillance) selon la page
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
   SLIDER — PILLIERS
   ========================= */
const track = document.querySelector(".pillars__track");
const prev = document.querySelector(".pillars .prev");
const next = document.querySelector(".pillars .next");
const scrollBy = 300;
prev?.addEventListener("click", () =>
  track.scrollBy({ left: -scrollBy, behavior: "smooth" })
);
next?.addEventListener("click", () =>
  track.scrollBy({ left: scrollBy, behavior: "smooth" })
);

/* =========================
   SLIDER — AXES DU PROGRAMME
   ========================= */
(function axisSlider() {
  const wrap = document.getElementById("axisSlider");
  if (!wrap) return;
  const slides = Array.from(wrap.children);
  const dots = document.getElementById("axisDots");

  // Dots
  slides.forEach((_, i) => {
    const b = document.createElement("button");
    if (i === 0) b.classList.add("active");
    b.addEventListener("click", () => {
      wrap.scrollTo({ left: slides[i].offsetLeft - 16, behavior: "smooth" });
    });
    dots.appendChild(b);
  });

  // Active dot on scroll
  wrap.addEventListener("scroll", () => {
    const w = slides[0].offsetWidth + 16;
    const idx = Math.round(wrap.scrollLeft / w);
    [...dots.children].forEach((d, i) =>
      d.classList.toggle("active", i === idx)
    );
  });

  // Auto-play doux
  let i = 0;
  setInterval(() => {
    i = (i + 1) % slides.length;
    wrap.scrollTo({ left: slides[i].offsetLeft - 16, behavior: "smooth" });
  }, 5000);
})();

/* =========================
   I18N (appel via i18n.js)
   ========================= */
// Bouton toggle
document
console.log("I18N:", I18N);
  .getElementById("langToggle")
  ?.addEventListener("click", () => I18N.toggle());

/* =========================
   FORMS — DEMO (validation + messages)
   ========================= */
function fakeSubmit(form, alertBox, okMessage) {
  alertBox.hidden = false;
  alertBox.style.borderColor = "#007A5E";
  alertBox.textContent = okMessage || "✔️ Envoi validé (démo)";
  form.reset();
}

function wireFormDemo(id, okMessage) {
  const form = document.getElementById(id);
  if (!form) return;
  const alertBox = form.querySelector(".form__alert");
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    if (!form.checkValidity()) {
      alertBox.hidden = false;
      alertBox.style.borderColor = "#CE1126";
      alertBox.textContent = "⚠️ Merci de remplir les champs requis.";
      return;
    }
    fakeSubmit(form, alertBox, okMessage);
  });
}

wireFormDemo(
  "form-adhesion",
  "Merci ! Votre adhésion a été enregistrée (démo)."
);
wireFormDemo("form-committee", "Comité enregistré (démo).");
wireFormDemo("form-contact", "Message envoyé (démo).");
wireFormDemo("form-newsletter", "Inscription newsletter enregistrée (démo).");

/* =========================
   ANIMATIONS
   ========================= */
document.addEventListener("DOMContentLoaded", () => {
  const img = document.querySelector(".candidat__img");
  if (img) {
    img.style.opacity = 0;
    img.style.transition = "opacity 1s ease";
    setTimeout(() => (img.style.opacity = 1), 200);
  }
});

/* =========================
   VIDEO CONTROL
   ========================= */
const video = document.getElementById("meetingVideo");
const btn = document.getElementById("volumeToggle");
const iconMute = document.getElementById("iconMute");
const iconSound = document.getElementById("iconSound");

btn?.addEventListener("click", () => {
  if (!video) return;
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
