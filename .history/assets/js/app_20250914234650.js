/* =========================
   URL dynamique backend
========================= */
const BASE_URL = ["127.0.0.1", "localhost"].includes(location.hostname)
  ? "http://127.0.0.1:4000"
  : "https://upc2025-backend.onrender.com";

/* =========================
   Sélecteurs
========================= */
const form = document.getElementById("form-adhesion");
const orgFields = document.querySelector(".org-only");
const downloadBtn = document.getElementById("download-form");
const submitBtn = form.querySelector('button[type="submit"]');
const memberTypeRadios = document.querySelectorAll('input[name="member_type"]');
const modeRadios = document.querySelectorAll('input[name="inscription_mode"]');

/* =========================
   Affichage dynamique du formulaire
========================= */
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
    document.querySelector('input[name="org_name"]').required = true;
    document.querySelector('input[name="org_members"]').required = true;
    form.classList.add("form-org");
    form.classList.remove("form-individual");
  } else {
    orgFields.style.display = "none";
    document.querySelector('input[name="org_name"]').required = false;
    document.querySelector('input[name="org_members"]').required = false;
    form.classList.add("form-individual");
    form.classList.remove("form-org");
  }

  // Mode inscription → cacher ou afficher bouton
  if (mode === "online") {
    downloadBtn.style.display = "none";
  } else {
    downloadBtn.style.display = "inline-block";
  }
}

/* =========================
   Événements radios
========================= */
memberTypeRadios.forEach((r) =>
  r.addEventListener("change", updateFormDisplay)
);
modeRadios.forEach((r) => r.addEventListener("change", updateFormDisplay));

/* =========================
   Soumission du formulaire
========================= */
form.addEventListener("submit", async (e) => {
  e.preventDefault();

  // Validation simple
  const inputs = form.querySelectorAll("input, select");
  let isValid = true;
  inputs.forEach((inp) => {
    if (inp.required && !inp.value.trim()) {
      inp.style.borderColor = "red";
      isValid = false;
    } else {
      inp.style.borderColor = "";
    }
  });

  if (!isValid) {
    alert("Merci de remplir tous les champs obligatoires.");
    return;
  }

  // Préparer les données
  const data = Object.fromEntries(new FormData(form));
  const mode = document.querySelector(
    'input[name="inscription_mode"]:checked'
  ).value;

  // Désactiver le bouton pendant l'envoi
  submitBtn.disabled = true;
  submitBtn.textContent = "Envoi en cours...";

  try {
    // Soumettre le formulaire au backend
    const res = await fetch(`${BASE_URL}/api/join`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    const result = await res.json();
    console.log("Résultat API:", result);

    if (!result.ok) {
      alert("Erreur : " + (result.error || "Serveur"));
      return;
    }

    // Formulaire envoyé avec succès
    alert("Formulaire envoyé avec succès ! Merci pour votre adhésion.");

    // Réinitialiser le formulaire
    form.reset();
    updateFormDisplay();

    // Si mode papier → redirection vers page documents
    if (mode === "paper") window.location.href = "documents.html";
  } catch (err) {
    console.error(err);
    alert("Erreur serveur, réessayez plus tard.");
  } finally {
    submitBtn.disabled = false;
    submitBtn.textContent = "Rejoindre";
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
========================= */
document.addEventListener("DOMContentLoaded", () => {
  const contactForm = document.getElementById("form-contact");
  const alertBox = contactForm.querySelector(".form__alert");
  const submitBtn = contactForm.querySelector('button[type="submit"]');

  contactForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    // Validation simple
    let isValid = true;
    contactForm.querySelectorAll("input, textarea").forEach((input) => {
      if (input.required && !input.value.trim()) {
        input.style.borderColor = "red";
        isValid = false;
      } else {
        input.style.borderColor = "";
      }
    });

    if (!isValid) {
      alertBox.hidden = false;
      alertBox.textContent = "Merci de remplir tous les champs obligatoires.";
      alertBox.style.borderColor = "#CE1126";
      return;
    }

    // Préparer les données
    const data = Object.fromEntries(new FormData(contactForm));

    // Désactiver le bouton pendant l'envoi
    submitBtn.disabled = true;
    submitBtn.textContent = "Envoi en cours…";
    alertBox.hidden = true;

    try {
      // Ici, l'API backend ou service d'email
      const res = await fetch("https://example.com/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await res.json();

      if (result.ok) {
        alertBox.hidden = false;
        alertBox.textContent = "Merci ! Votre message a été envoyé.";
        alertBox.style.borderColor = "#007A5E";

        // Réinitialisation du formulaire
        contactForm.reset();
      } else {
        alertBox.hidden = false;
        alertBox.textContent = `Erreur : ${result.error || "Serveur"}`;
        alertBox.style.borderColor = "#CE1126";
      }
    } catch (err) {
      console.error(err);
      alertBox.hidden = false;
      alertBox.textContent = "Erreur réseau, réessayez plus tard.";
      alertBox.style.borderColor = "#CE1126";
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = "Envoyer";
    }
  });
});
