/* =========================
   URL dynamique backend
========================= */
const BASE_URL = ["127.0.0.1", "localhost"].includes(location.hostname)
  ? "http://127.0.0.1:4000"
  : "https://upc2025-backend.onrender.com";

/* =========================
   Sélecteurs principaux
========================= */
const form = document.getElementById("form-adhesion");
const orgFields = document.querySelector(".org-only");
const downloadBtn = document.getElementById("download-form");
const memberTypeRadios = document.querySelectorAll('input[name="member_type"]');
const modeRadios = document.querySelectorAll('input[name="inscription_mode"]');

/* =========================
   Fonction pour afficher/masquer champs
========================= */
function updateFormDisplay() {
  const memberType = document.querySelector(
    'input[name="member_type"]:checked'
  ).value;
  const mode = document.querySelector(
    'input[name="inscription_mode"]:checked'
  ).value;

  // Organisation → afficher ou masquer champs supplémentaires
  if (memberType === "organization") {
    orgFields.style.display = "flex";
    form.classList.add("form-org");
    form.classList.remove("form-individual");
  } else {
    orgFields.style.display = "none";
    form.classList.add("form-individual");
    form.classList.remove("form-org");
  }

  // Mode inscription → bouton téléchargement
  downloadBtn.style.display = "none"; // cacher par défaut
}

memberTypeRadios.forEach((r) =>
  r.addEventListener("change", updateFormDisplay)
);
modeRadios.forEach((r) => r.addEventListener("change", updateFormDisplay));

/* =========================
   Soumission formulaire
========================= */
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
    const res = await fetch(`${BASE_URL}/api/join`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    const result = await res.json();

    if (!result.ok) return alert("Erreur : " + (result.error || "Serveur"));

    alert("Formulaire envoyé avec succès !");

    // ✅ Si inscription en ligne → afficher bouton PDF
    if (mode === "online" && result.pdfPath) {
      downloadBtn.style.display = "inline-block";
      downloadBtn.removeAttribute("disabled");
      downloadBtn.onclick = () =>
        window.open(`${BASE_URL}/${result.pdfPath}`, "_blank");
    }

    // Réinitialiser le formulaire
    form.reset();
    updateFormDisplay();

    // ✅ Si mode papier → redirection vers documents
    if (mode === "paper") {
      window.location.href = "documents.html";
    }
  } catch (err) {
    console.error(err);
    alert("Erreur serveur, réessayez plus tard.");
  }
});

/* =========================
   Initialisation
========================= */
updateFormDisplay();

/* =========================
   Cookies
========================= */
function createCookieBanner() {
  if (localStorage.getItem("cookiesAccepted") !== null) return;

  const banner = document.createElement("div");
  banner.style.position = "fixed";
  banner.style.bottom = "0";
  banner.style.left = "0";
  banner.style.width = "100%";
  banner.style.backgroundColor = "#fff";
  banner.style.boxShadow = "0 -2px 8px rgba(0,0,0,0.2)";
  banner.style.padding = "1rem";
  banner.style.display = "flex";
  banner.style.justifyContent = "space-between";
  banner.style.alignItems = "center";
  banner.style.zIndex = "9999";

  const text = document.createElement("span");
  text.innerText =
    "Nous utilisons des cookies pour améliorer votre expérience. Acceptez-vous les cookies ?";
  banner.appendChild(text);

  const buttons = document.createElement("div");
  const acceptBtn = document.createElement("button");
  acceptBtn.innerText = "Accepter";
  const refuseBtn = document.createElement("button");
  refuseBtn.innerText = "Refuser";

  acceptBtn.onclick = () => {
    localStorage.setItem("cookiesAccepted", "true");
    banner.remove();
  };
  refuseBtn.onclick = () => {
    localStorage.setItem("cookiesAccepted", "false");
    banner.remove();
  };

  buttons.appendChild(acceptBtn);
  buttons.appendChild(refuseBtn);
  banner.appendChild(buttons);

  document.body.appendChild(banner);
}
document.addEventListener("DOMContentLoaded", createCookieBanner);
/* =========================
   FORMULAIRE CONTACT
========================= 
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
*/
