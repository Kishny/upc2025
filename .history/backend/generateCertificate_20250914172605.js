// backend/generateCertificate.js
const fs = require("fs");
const path = require("path");
const { PDFDocument, rgb, StandardFonts } = require("pdf-lib");

// Fonction pour générer le certificat
async function generateCertificate({ name, type = "Individuel" }) {
  // Crée un nouveau PDF
  const pdfDoc = await PDFDocument.create();

  // Ajoute une page
  const page = pdfDoc.addPage([600, 400]);
  const { width, height } = page.getSize();

  // Couleurs
  const primaryColor = rgb(0.552, 0.478, 0.71); // violet
  const secondaryColor = rgb(0.0, 0.478, 0.369); // vert

  // Logo
  const logoPath = path.join(__dirname, "logo.png"); // ton logo
  const logoBytes = fs.readFileSync(logoPath);
  const logoImage = await pdfDoc.embedPng(logoBytes);
  const logoDims = logoImage.scale(0.25);

  page.drawImage(logoImage, {
    x: 20,
    y: height - logoDims.height - 20,
    width: logoDims.width,
    height: logoDims.height,
  });

  // Fonts
  const font = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  const fontSizeTitle = 24;
  const fontSizeSub = 16;
  const fontSizeText = 14;

  // Titre
  page.drawText("CERTIFICAT D'ADHÉSION", {
    x: 60,
    y: height - 80,
    size: fontSizeTitle,
    font,
    color: primaryColor,
  });

  // Sous-titre
  page.drawText(`Nom: ${name}`, {
    x: 60,
    y: height - 120,
    size: fontSizeSub,
    font,
    color: rgb(0, 0, 0),
  });

  page.drawText(`Type d'adhésion: ${type}`, {
    x: 60,
    y: height - 150,
    size: fontSizeSub,
    font,
    color: rgb(0, 0, 0),
  });

  // Texte descriptif
  const text = `L’Union pour le Changement en 2025 certifie que ${name} a adhéré à titre ${type.toLowerCase()} et s’engage à soutenir le programme et la campagne du Candidat CONSENSUEL du Peuple.`;
  page.drawText(text, {
    x: 60,
    y: height - 190,
    size: fontSizeText,
    font,
    color: rgb(0, 0, 0),
    maxWidth: 480,
    lineHeight: 18,
  });

  // Signatures
  page.drawText("Djeukam Tchameni", {
    x: 60,
    y: 50,
    size: fontSizeText,
    font,
    color: secondaryColor,
  });
  page.drawText("Anicet Ekane", {
    x: width - 180,
    y: 50,
    size: fontSizeText,
    font,
    color: secondaryColor,
  });

  // Retourne le PDF en buffer
  const pdfBytes = await pdfDoc.save();
  return pdfBytes;
}

module.exports = { generateCertificate };
