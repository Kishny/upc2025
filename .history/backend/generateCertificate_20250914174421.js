const fs = require("fs");
const { PDFDocument, rgb, StandardFonts } = require("pdf-lib");
const path = require("path");

async function generateCertificate({ name, type, org_name }) {
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([600, 400]); // taille de page adaptée

  const fontTitle = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  const fontNormal = await pdfDoc.embedFont(StandardFonts.Helvetica);

  // ⚡ Logo
  const logoBytes = fs.readFileSync(path.join(__dirname, "logo.png"));
  const logoImage = await pdfDoc.embedPng(logoBytes);

  const logoDims = logoImage.scale(0.3); // ajuste la taille du logo
  page.drawImage(logoImage, {
    x: (page.getWidth() - logoDims.width) / 2,
    y: page.getHeight() - logoDims.height - 20,
    width: logoDims.width,
    height: logoDims.height,
  });

  // Titre
  page.drawText("CERTIFICAT D'ADHÉSION", {
    x: 50,
    y: page.getHeight() - logoDims.height - 60,
    size: 22,
    font: fontTitle,
    color: rgb(0, 0.3, 0.2),
  });

  // Nom
  page.drawText(`Nom: ${name}`, { x: 50, y: 250, size: 16, font: fontNormal });

  // Organisation si applicable
  if (type === "organization") {
    page.drawText(`Organisation: ${org_name}`, {
      x: 50,
      y: 220,
      size: 16,
      font: fontNormal,
    });
  }

  // Date
  page.drawText(`Date: ${new Date().toLocaleDateString()}`, {
    x: 50,
    y: 190,
    size: 16,
    font: fontNormal,
  });

  // Signature
  page.drawText(`Signé par: Djeukam Tchameni & Anicet Ekane`, {
    x: 50,
    y: 160,
    size: 14,
    font: fontNormal,
  });

  const pdfBytes = await pdfDoc.save();
  return pdfBytes;
}

module.exports = { generateCertificate };
