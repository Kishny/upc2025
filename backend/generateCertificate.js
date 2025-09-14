// backend/generateCertificate.js
const { PDFDocument, rgb, StandardFonts } = require("pdf-lib");
const fs = require("fs");
const path = require("path");

async function generateCertificate({
  type,
  name,
  orgName,
  representative,
  city,
  country,
  date,
}) {
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([600, 800]);
  const width = page.getWidth();
  const height = page.getHeight();

  // Couleurs
  const mainColor = rgb(0, 0.3, 0.2); // vert
  const accentColor = rgb(0.56, 0.48, 0.71); // violet pour organisation

  // Fonts
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

  // Background pastel
  page.drawRectangle({
    x: 0,
    y: 0,
    width,
    height,
    color: rgb(0.93, 0.96, 0.94),
  });

  // Logo
  const logoPath = path.join(__dirname, "logo.png");
  if (fs.existsSync(logoPath)) {
    const logoBytes = fs.readFileSync(logoPath);
    const logoImage = await pdfDoc.embedPng(logoBytes);
    const logoDims = logoImage.scale(0.5);
    page.drawImage(logoImage, {
      x: width / 2 - logoDims.width / 2,
      y: height - 120,
      width: logoDims.width,
      height: logoDims.height,
    });
  }

  // Titre
  page.drawText("CERTIFICAT D'ADHÉSION", {
    x: 50,
    y: height - 160,
    size: 22,
    font: fontBold,
    color: type === "organization" ? accentColor : mainColor,
  });

  let y = height - 200;

  if (type === "organization") {
    // Organisation
    const orgLines = [
      `Organisation : ${orgName}`,
      `Représentant légal : ${representative || "[Nom du représentant]"}`,
      `Ville / Pays : ${city || "Yaoundé"} / ${country || "[Pays]"}`,
      `Date d’adhésion : ${date || "[JJ/MM/AAAA]"}`,
      "",
      "Engagement de l’organisation :",
      "• Cohésion et solidarité",
      "• Participation citoyenne",
      "• Démocratie et transparence",
    ];

    page.drawText(`Nom du membre : ${name}`, { x: 50, y, size: 14, font });
    y -= 25;

    orgLines.forEach((line) => {
      page.drawText(line, { x: 50, y, size: 12, font });
      y -= 18;
    });
  } else {
    // Individuel
    const indivLines = [
      `Nom : ${name}`,
      `a officiellement rejoint l’Union pour le Changement et s’engage à soutenir le Programme Commun de Transition et de Refondation du Cameroun.`,
      "",
      `Ville : ${city || "Yaoundé"}`,
      `Date d’adhésion : ${date || "[JJ/MM/AAAA]"}`,
    ];

    indivLines.forEach((line) => {
      page.drawText(line, { x: 50, y, size: 14, font });
      y -= 18;
    });
  }

  // Signatures
  const anicetPath = path.join(__dirname, "anicet.png");
  const djeukamPath = path.join(__dirname, "djeukam.png");

  if (fs.existsSync(anicetPath)) {
    const anicetBytes = fs.readFileSync(anicetPath);
    const anicetImg = await pdfDoc.embedPng(anicetBytes);
    page.drawImage(anicetImg, { x: 50, y: 50, width: 100, height: 50 });
    page.drawText("Anicet EKANE", { x: 50, y: 40, size: 12, font: fontBold });
  }

  if (fs.existsSync(djeukamPath)) {
    const djeukamBytes = fs.readFileSync(djeukamPath);
    const djeukamImg = await pdfDoc.embedPng(djeukamBytes);
    page.drawImage(djeukamImg, { x: 400, y: 50, width: 100, height: 50 });
    page.drawText("Djeukam TCHAMENI", {
      x: 400,
      y: 40,
      size: 12,
      font: fontBold,
    });
  }

  // Sauvegarde dans un buffer
  const pdfBytes = await pdfDoc.save();
  return pdfBytes;
}

module.exports = { generateCertificate };
