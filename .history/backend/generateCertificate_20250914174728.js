const fs = require("fs");
const path = require("path");
const { PDFDocument, rgb, StandardFonts } = require("pdf-lib");

async function generateCertificate({
  name,
  org_name,
  sigle,
  city,
  country,
  date,
  type = "organization", // "individual" ou "organization"
}) {
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([600, 850]);

  const fontTitle = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  const fontNormal = await pdfDoc.embedFont(StandardFonts.Helvetica);

  // ⚡ Logo
  const logoBytes = fs.readFileSync(path.join(__dirname, "logo.png"));
  const logoImage = await pdfDoc.embedPng(logoBytes);
  const logoDims = logoImage.scale(0.25); // Ajuste la taille du logo
  page.drawImage(logoImage, {
    x: (page.getWidth() - logoDims.width) / 2,
    y: page.getHeight() - logoDims.height - 20,
    width: logoDims.width,
    height: logoDims.height,
  });

  // Titre du document
  page.drawText("Certificat d’adhésion – Union pour le Changement", {
    x: 50,
    y: page.getHeight() - logoDims.height - 60,
    size: 16,
    font: fontTitle,
    color: rgb(0, 0.3, 0.2),
  });

  // Ligne horizontale
  page.drawLine({
    start: { x: 40, y: page.getHeight() - logoDims.height - 70 },
    end: { x: 560, y: page.getHeight() - logoDims.height - 70 },
    thickness: 1,
    color: rgb(0.5, 0.5, 0.5),
  });

  // Section certificat
  let y = page.getHeight() - logoDims.height - 100;
  page.drawText("CERTIFICAT D'ADHÉSION", {
    x: 50,
    y,
    size: 18,
    font: fontTitle,
  });
  y -= 25;

  page.drawText(`Ce certificat atteste que :`, {
    x: 50,
    y,
    size: 12,
    font: fontNormal,
  });
  y -= 20;

  page.drawText(`[Nom de l’organisation / ${name}]`, {
    x: 50,
    y,
    size: 12,
    font: fontNormal,
  });
  if (sigle) {
    y -= 18;
    page.drawText(`[Sigle / Acronyme: ${sigle}]`, {
      x: 50,
      y,
      size: 12,
      font: fontNormal,
    });
  }

  y -= 25;
  page.drawText(
    `est officiellement membre de l’Union pour le Changement et adhère pleinement au Programme Commun de Transition et de Refondation du Cameroun.`,
    { x: 50, y, size: 12, font: fontNormal, lineHeight: 14, maxWidth: 500 }
  );

  y -= 50;
  page.drawLine({
    start: { x: 40, y },
    end: { x: 560, y },
    thickness: 1,
    color: rgb(0.5, 0.5, 0.5),
  });
  y -= 25;

  page.drawText(`Représentant légal : [Nom] – [Fonction]`, {
    x: 50,
    y,
    size: 12,
    font: fontNormal,
  });
  y -= 20;
  page.drawText(
    `Ville / Pays : ${city || "Yaoundé"} / ${country || "[Pays]"}`,
    { x: 50, y, size: 12, font: fontNormal }
  );
  y -= 20;
  page.drawText(`Date d’adhésion : ${date || "[JJ/MM/AAAA]"}`, {
    x: 50,
    y,
    size: 12,
    font: fontNormal,
  });

  y -= 40;
  page.drawText("Engagement :", { x: 50, y, size: 14, font: fontTitle });
  y -= 20;

  const commitments = [
    "Cohésion et solidarité",
    "Participation citoyenne",
    "Démocratie et transparence",
  ];
  commitments.forEach((c) => {
    page.drawText(`• ${c}`, { x: 60, y, size: 12, font: fontNormal });
    y -= 18;
  });

  y -= 25;
  page.drawLine({
    start: { x: 40, y },
    end: { x: 560, y },
    thickness: 1,
    color: rgb(0.5, 0.5, 0.5),
  });
  y -= 30;

  page.drawText("Anicet EKANE", { x: 50, y, size: 12, font: fontNormal });
  page.drawText("Djeukam TCHAMENI", { x: 400, y, size: 12, font: fontNormal });

  const pdfBytes = await pdfDoc.save();
  return pdfBytes;
}

module.exports = { generateCertificate };
