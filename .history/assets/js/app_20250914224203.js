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
  downloadBtn.style.display = mode === "online" ? "none" : "inline-block";
}

memberTypeRadios.forEach((r) =>
  r.addEventListener("change", updateFormDisplay)
);
modeRadios.forEach((r) => r.addEventListener("change", updateFormDisplay));

/* =========================
   Génération PDF frontend
========================= */
async function generateCertificatePDF(data) {
  const { name, org_name, member_type, role, region } = data;

  const pdfDoc = await PDFLib.PDFDocument.create();
  const page = pdfDoc.addPage([600, 850]);
  const width = page.getWidth();
  const height = page.getHeight();

  const font = await pdfDoc.embedFont(PDFLib.StandardFonts.HelveticaBold);

  // Fond pastel
  page.drawRectangle({
    x: 0,
    y: 0,
    width,
    height,
    color: PDFLib.rgb(0.93, 0.96, 0.94),
  });

  // Titre
  page.drawText("CERTIFICAT D'ADHÉSION", {
    x: 50,
    y: height - 100,
    size: 24,
    font,
    color: PDFLib.rgb(0, 0.3, 0.2),
  });

  page.drawText(`Nom: ${name}`, { x: 50, y: height - 140, size: 16 });
  if (member_type === "organization") {
    page.drawText(`Organisation: ${org_name}`, {
      x: 50,
      y: height - 170,
      size: 16,
    });
  }
  page.drawText(`Région: ${region}`, { x: 50, y: height - 200, size: 16 });
  page.drawText(`Contribution: ${role}`, { x: 50, y: height - 230, size: 16 });

  // Générer le PDF
  const pdfBytes = await pdfDoc.save();

  // Créer un blob pour téléchargement
  const blob = new Blob([pdfBytes], { type: "application/pdf" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = "certificat-adhesion.pdf";
  link.click();
}

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

  const formData = Object.fromEntries(new FormData(form));
  const mode = document.querySelector(
    'input[name="inscription_mode"]:checked'
  ).value;

  // Désactiver le bouton pendant l'envoi
  submitBtn.disabled = true;
  submitBtn.textContent = "Envoi en cours...";

  try {
    // ✅ Génération PDF côté frontend si mode en ligne
    if (mode === "online") {
      await generateCertificatePDF(formData);
    }

    alert("Formulaire envoyé avec succès !");

    // Réinitialiser le formulaire
    form.reset();
    updateFormDisplay();

    // Si mode papier → redirection vers page documents
    if (mode === "paper") window.location.href = "documents.html";
  } catch (err) {
    console.error(err);
    alert("Erreur lors de la génération du certificat.");
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
