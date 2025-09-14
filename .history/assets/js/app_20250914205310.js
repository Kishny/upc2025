/* =========================
   BACKEND URL
========================= */
const BASE_URL = ["127.0.0.1", "localhost"].includes(location.hostname)
  ? "http://127.0.0.1:4000"
  : "https://upc2025-backend.onrender.com";

/* =========================
   POST FORM GENERIC
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
const memberTypeRadios = document.querySelectorAll('input[name="member_type"]');
const modeRadios = document.querySelectorAll('input[name="inscription_mode"]');

// Gestion affichage formulaire
function updateFormDisplay() {
  const memberType = document.querySelector(
    'input[name="member_type"]:checked'
  ).value;
  const mode = document.querySelector(
    'input[name="inscription_mode"]:checked'
  ).value;

  orgFields.style.display = memberType === "organization" ? "flex" : "none";
}
memberTypeRadios.forEach((r) =>
  r.addEventListener("change", updateFormDisplay)
);
modeRadios.forEach((r) => r.addEventListener("change", updateFormDisplay));
updateFormDisplay();

// Fonction pour générer et télécharger le PDF
async function generateCertificatePDF(data) {
  const { PDFDocument, rgb, StandardFonts } = PDFLib;
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([600, 850]);
  const width = page.getWidth();
  const height = page.getHeight();

  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

  // Fond pastel
  page.drawRectangle({
    x: 0,
    y: 0,
    width,
    height,
    color: rgb(0.93, 0.96, 0.94),
  });

  // Logo
  const logoBytes = await fetch("./logo.png").then((res) => res.arrayBuffer());
  const logoImage = await pdfDoc.embedPng(logoBytes);
  const logoDims = logoImage.scale(0.5);
  page.drawImage(logoImage, {
    x: width / 2 - logoDims.width / 2,
    y: height - 150,
    width: logoDims.width,
    height: logoDims.height,
  });

  let y = height - 180;

  // Titre
  page.drawText("CERTIFICAT D'ADHÉSION", {
    x: 50,
    y,
    size: 22,
    font: fontBold,
    color: rgb(0, 0.3, 0.2),
  });
  y -= 40;

  // Contenu
  const lines = [
    `Nom: ${data.name}`,
    `Organisation: ${data.org_name || "-"}`,
    `Est officiellement membre de l’Union pour le Changement et adhère pleinement au Programme Commun de Transition et de Refondation du Cameroun.`,
    `Représentant légal: [Nom du représentant] – [Fonction]`,
    `Ville / Pays: Yaoundé / [Pays]`,
    `Date d’adhésion: ${new Date().toLocaleDateString()}`,
    `Engagement de l’organisation:`,
    `• Cohésion et solidarité`,
    `• Participation citoyenne`,
    `• Démocratie et transparence`,
  ];

  lines.forEach((line) => {
    page.drawText(line, { x: 50, y, size: 12, font });
    y -= 18;
  });

  // Signatures
  const anicetBytes = await fetch("./anicet.png").then((res) =>
    res.arrayBuffer()
  );
  const djeukamBytes = await fetch("./djeukam.png").then((res) =>
    res.arrayBuffer()
  );
  const anicetImg = await pdfDoc.embedPng(anicetBytes);
  const djeukamImg = await pdfDoc.embedPng(djeukamBytes);

  page.drawImage(anicetImg, { x: 50, y: 50, width: 100, height: 50 });
  page.drawText("Anicet EKANE", { x: 50, y: 40, size: 12, font: fontBold });
  page.drawImage(djeukamImg, { x: 400, y: 50, width: 100, height: 50 });
  page.drawText("Djeukam TCHAMENI", {
    x: 400,
    y: 40,
    size: 12,
    font: fontBold,
  });

  // Téléchargement
  const pdfBytes = await pdfDoc.save();
  const blob = new Blob([pdfBytes], { type: "application/pdf" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = "certificat-adhesion.pdf";
  link.click();
}

// Soumission formulaire adhésion
form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const inputs = form.querySelectorAll("input, select");
  for (let inp of inputs)
    if (inp.required && !inp.value)
      return alert("Merci de remplir tous les champs obligatoires.");

  const data = Object.fromEntries(new FormData(form));
  const mode = document.querySelector(
    'input[name="inscription_mode"]:checked'
  ).value;

  const result = await postForm("/api/join", data);
  if (!result.ok) return alert("Erreur : " + (result.error || "Serveur"));

  if (mode === "online") {
    alert("Formulaire envoyé ! Votre certificat est prêt au téléchargement.");
    await generateCertificatePDF(data);
  } else {
    alert(
      "Formulaire envoyé ! Vous pouvez maintenant télécharger la fiche papier."
    );
    window.location.href = `${BASE_URL}/documents.html`;
  }
});
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
