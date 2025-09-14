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
  video.play().catch(() => console.log("Autoplay bloqué"));

  btn?.addEventListener("click", () => {
    video.muted = !video.muted;
    iconMute?.classList.toggle("hidden");
    iconSound?.classList.toggle("hidden");
  });
}

/* =========================
   BACKEND — URL dynamique
========================= */
const BASE_URL = ["127.0.0.1", "localhost"].includes(location.hostname)
  ? "http://127.0.0.1:4000"
  : "https://upc2025-backend.onrender.com";

/* =========================
   POST FORMULAIRE
========================= */
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

/* =========================
   FORMULAIRE ADHÉSION
========================= */
const form = document.getElementById("form-adhesion");
const orgFields = document.querySelector(".org-only");
const downloadBtn = document.getElementById("download-form");
const memberTypeRadios = document.querySelectorAll('input[name="member_type"]');
const modeRadios = document.querySelectorAll('input[name="inscription_mode"]');

function updateFormDisplay() {
  const memberType = document.querySelector(
    'input[name="member_type"]:checked'
  ).value;
  const mode = document.querySelector(
    'input[name="inscription_mode"]:checked'
  ).value;

  // Organisation → afficher ou masquer champs
  if (memberType === "organization") {
    orgFields.style.display = "flex";
    form.classList.add("form-org");
    form.classList.remove("form-individual");
  } else {
    orgFields.style.display = "none";
    form.classList.add("form-individual");
    form.classList.remove("form-org");
  }

  // Mode inscription → ajuster bouton téléchargement
  downloadBtn.style.display = mode === "online" ? "none" : "inline-block";
}

memberTypeRadios.forEach((r) =>
  r.addEventListener("change", updateFormDisplay)
);
modeRadios.forEach((r) => r.addEventListener("change", updateFormDisplay));

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  // Validation simple
  const inputs = form.querySelectorAll("input, select");
  for (let inp of inputs) {
    if (inp.required && !inp.value) {
      alert("Merci de remplir tous les champs obligatoires.");
      return;
    }
  }

  const data = Object.fromEntries(new FormData(form));
  const mode = document.querySelector(
    'input[name="inscription_mode"]:checked'
  ).value;

  try {
    const result = await postForm("/api/join", data);
    if (!result.ok) return alert("Erreur : " + (result.error || "Serveur"));

    if (mode === "online" && result.id) {
      alert("Formulaire envoyé ! Votre certificat est prêt au téléchargement.");
      window.open(`${BASE_URL}/certificat/${result.id}.pdf`, "_blank");
    } else {
      alert(
        "Formulaire envoyé ! Vous pouvez maintenant télécharger la fiche papier."
      );
      window.location.href = "documents.html";
    }
  } catch (err) {
    console.error(err);
    alert("Erreur serveur, réessayez plus tard.");
  }
});

// Initialisation
updateFormDisplay();

/* =========================
   FONCTION POUR WIRE TOUS LES FORMULAIRES
========================= */
function wireFormBackend(id, url, okMessage) {
  const formEl = document.getElementById(id);
  if (!formEl) return;

  const alertBox = formEl.querySelector(".form__alert");

  formEl.addEventListener("submit", async (e) => {
    e.preventDefault();
    alertBox.hidden = false;
    alertBox.style.borderColor = "#007A5E";
    alertBox.textContent = "Envoi en cours…";

    const formData = Object.fromEntries(new FormData(formEl));
    try {
      const res = await postForm(url, formData);
      if (res.ok) {
        alertBox.style.borderColor = "#007A5E";
        alertBox.textContent = okMessage;
        formEl.reset();
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
wireFormBackend(
  "form-adhesion-cert",
  "/api/join",
  "Merci ! Votre certificat vous sera envoyé par email."
);
wireFormBackend(
  "form-contact",
  "/api/contact",
  "Merci ! Votre message a été envoyé."
);
/* =========================
   FORMULAIRE CONTACT
========================= */
const contactForm = document.getElementById("form-contact");
if (contactForm) {
  const subjectSelect = contactForm.querySelector('select[name="subject"]');
  const otherSubjectInput = contactForm.querySelector(
    'input[name="other_subject"]'
  );

  subjectSelect.addEventListener("change", () => {
    if (subjectSelect.value === "other") {
      otherSubjectInput.style.display = "block";
      otherSubjectInput.required = true;
    } else {
      otherSubjectInput.style.display = "none";
      otherSubjectInput.required = false;
    }
  });
}
// Initialisation
if (otherSubjectInput) otherSubjectInput.style.display = "none";
