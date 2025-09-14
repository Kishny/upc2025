/* =========================
   URL dynamique backend
========================= */
const BASE_URL = ["127.0.0.1", "localhost"].includes(location.hostname)
  ? "http://127.0.0.1:4000"
  : "https://upc2025-backend.onrender.com";

/* =========================
   POST FORMULAIRE ADHÉSION
========================= */
const form = document.getElementById("form-adhesion");
const orgFields = document.querySelector(".org-only");
const downloadBtn = document.getElementById("download-form");
const memberTypeRadios = document.querySelectorAll('input[name="member_type"]');
const modeRadios = document.querySelectorAll('input[name="inscription_mode"]');
const submitBtn = form.querySelector('button[type="submit"]');

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

    // Rendre les champs organisation obligatoires
    document.querySelector('input[name="org_name"]').required = true;
    document.querySelector('input[name="org_members"]').required = true;
  } else {
    orgFields.style.display = "none";
    form.classList.add("form-individual");
    form.classList.remove("form-org");

    // Rendre les champs organisation non obligatoires
    document.querySelector('input[name="org_name"]').required = false;
    document.querySelector('input[name="org_members"]').required = false;
  }

  // Mode inscription → bouton téléchargement
  downloadBtn.style.display = mode === "online" ? "none" : "inline-block";
}

memberTypeRadios.forEach((r) =>
  r.addEventListener("change", updateFormDisplay)
);
modeRadios.forEach((r) => r.addEventListener("change", updateFormDisplay));

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  // Désactiver le bouton pour éviter les doubles soumissions
  submitBtn.disabled = true;
  submitBtn.textContent = "Envoi en cours...";

  // Validation améliorée
  const inputs = form.querySelectorAll("input, select");
  let isValid = true;

  for (let inp of inputs) {
    if (inp.required && !inp.value.trim()) {
      inp.style.borderColor = "red";
      isValid = false;
    } else {
      inp.style.borderColor = "";
    }
  }

  if (!isValid) {
    alert("Merci de remplir tous les champs obligatoires.");
    submitBtn.disabled = false;
    submitBtn.textContent = "Rejoindre";
    return;
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

    if (!result.ok) {
      let errorMessage = "Erreur lors de l'envoi du formulaire";
      if (result.error === "NAME_REQUIRED")
        errorMessage = "Le nom est obligatoire";
      if (result.error === "EMAIL_REQUIRED")
        errorMessage = "L'email est obligatoire";
      if (result.error === "ORG_NAME_REQUIRED")
        errorMessage = "Le nom de l'organisation est obligatoire";

      alert(errorMessage);
      submitBtn.disabled = false;
      submitBtn.textContent = "Rejoindre";
      return;
    }

    // ✅ Formulaire envoyé avec succès
    alert("Formulaire envoyé avec succès ! Merci pour votre adhésion.");

    // Si inscription en ligne → afficher bouton PDF
    if (mode === "online" && result.pdfPath) {
      downloadBtn.style.display = "inline-block";
      downloadBtn.removeAttribute("disabled");
      downloadBtn.textContent = "Télécharger mon certificat";
      downloadBtn.onclick = () => {
        window.open(`${BASE_URL}/${result.pdfPath}`, "_blank");
      };
    } else if (mode === "paper") {
      // Si papier → redirection vers page documents
      window.location.href = "documents.html";
    }

    // Réinitialiser le formulaire
    form.reset();
    updateFormDisplay();
  } catch (err) {
    console.error(err);
    alert("Erreur serveur, réessayez plus tard.");
  } finally {
    submitBtn.disabled = false;
    submitBtn.textContent = "Rejoindre";
  }
});

// Initialisation
updateFormDisplay();

/* =========================
   Cookies
========================= */
function createCookieBanner() {
  if (localStorage.getItem("cookiesAccepted") !== null) return;

  const banner = document.createElement("div");
  banner.id = "cookie-banner";
  banner.style.position = "fixed";
  banner.style.bottom = "0";
  banner.style.left = "0";
  banner.style.width = "100%";
  banner.style.backgroundColor = "#f8f9fa";
  banner.style.borderTop = "1px solid #dee2e6";
  banner.style.padding = "1rem";
  banner.style.display = "flex";
  banner.style.flexWrap = "wrap";
  banner.style.justifyContent = "space-between";
  banner.style.alignItems = "center";
  banner.style.zIndex = "9999";
  banner.style.boxShadow = "0 -2px 10px rgba(0,0,0,0.1)";

  const text = document.createElement("span");
  text.innerHTML =
    "Nous utilisons des cookies pour améliorer votre expérience. En continuant, vous acceptez notre <a href='#' style='color: #007bff;'>politique de cookies</a>.";
  text.style.marginRight = "1rem";
  text.style.flex = "1";
  banner.appendChild(text);

  const buttons = document.createElement("div");
  buttons.style.display = "flex";
  buttons.style.gap = "0.5rem";

  const acceptBtn = document.createElement("button");
  acceptBtn.textContent = "Accepter";
  acceptBtn.className = "btn btn-primary";
  acceptBtn.style.padding = "0.5rem 1rem";

  const refuseBtn = document.createElement("button");
  refuseBtn.textContent = "Refuser";
  refuseBtn.className = "btn btn-secondary";
  refuseBtn.style.padding = "0.5rem 1rem";

  acceptBtn.onclick = () => {
    localStorage.setItem("cookiesAccepted", "true");
    banner.style.display = "none";
  };

  refuseBtn.onclick = () => {
    localStorage.setItem("cookiesAccepted", "false");
    banner.style.display = "none";
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
