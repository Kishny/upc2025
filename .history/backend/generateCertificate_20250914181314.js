const fs = require("fs");
const path = require("path");
const { PDFDocument, rgb, StandardFonts } = require("pdf-lib");

async function generateCertificate({
  name,
  member_type = "individual",
  org_name = "",
}) {
  // Créer un nouveau PDF
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([600, 800]);
  const { width, height } = page.getSize();

  // Fonts
  const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);

  // Logo
  const logoPath = path.join(__dirname, "logo.png"); // ton logo
  const logoImage = await pdfDoc.embedPng(fs.readFileSync(logoPath));
  const logoDims = logoImage.scale(0.5);
  page.drawImage(logoImage, {
    x: width / 2 - logoDims.width / 2,
    y: height - 150,
    width: logoDims.width,
    height: logoDims.height,
  });

  // Titre
  page.drawText("CERTIFICAT D'ADHÉSION", {
    x: 50,
    y: height - 200,
    size: 22,
    font: fontBold,
    color: rgb(0, 0.3, 0.2),
  });

  // Contenu principal
  const startY = height - 240;
  let cursorY = startY;
  const lineGap = 25;

  page.drawText(`Nom: ${name}`, { x: 50, y: cursorY, size: 14, font });
  cursorY -= lineGap;

  if (member_type === "organization") {
    page.drawText(`Organisation: ${org_name}`, {
      x: 50,
      y: cursorY,
      size: 14,
      font,
    });
    cursorY -= lineGap;
  }

  page.drawText(
    `est officiellement membre de l'Union pour le Changement et adhère pleinement au Programme Commun de Transition et de Refondation du Cameroun.`,
    { x: 50, y: cursorY, size: 12, font, maxWidth: 500 }
  );
  cursorY -= lineGap * 2;

  page.drawText("Représentant légal de l'organisation : [Nom] – [Fonction]", {
    x: 50,
    y: cursorY,
    size: 12,
    font,
  });
  cursorY -= lineGap;

  page.drawText("Ville / Pays : Yaoundé / [Pays]", {
    x: 50,
    y: cursorY,
    size: 12,
    font,
  });
  cursorY -= lineGap;

  page.drawText(`Date d'adhésion : ${new Date().toLocaleDateString()}`, {
    x: 50,
    y: cursorY,
    size: 12,
    font,
  });
  cursorY -= lineGap * 2;

  page.drawText("Engagement de l'organisation :", {
    x: 50,
    y: cursorY,
    size: 12,
    font,
  });
  cursorY -= lineGap;

  const bulletGap = 15;
  page.drawText("• Cohésion et solidarité", {
    x: 60,
    y: cursorY,
    size: 12,
    font,
  });
  cursorY -= bulletGap;
  page.drawText("• Participation citoyenne", {
    x: 60,
    y: cursorY,
    size: 12,
    font,
  });
  cursorY -= bulletGap;
  page.drawText("• Démocratie et transparence", {
    x: 60,
    y: cursorY,
    size: 12,
    font,
  });
  cursorY -= lineGap * 2;

  // Signatures alignées sur la même ligne
  const sigY = 80;
  const sigFontSize = 12;

  const djeukamPath = path.join(__dirname, "djeukam.png");
  const anicetPath = path.join(__dirname, "anicet.png");

  const djeukamImg = await pdfDoc.embedPng(fs.readFileSync(djeukamPath));
  const anicetImg = await pdfDoc.embedPng(fs.readFileSync(anicetPath));

  const sigWidth = 120;
  const sigHeight = 40;

  // Signature Djeukam (droite)
  page.drawImage(djeukamImg, {
    x: width - 150,
    y: sigY,
    width: sigWidth,
    height: sigHeight,
  });
  page.drawText("Djeukam TCHAMENI", {
    x: width - 150,
    y: sigY - 15,
    size: sigFontSize,
    font,
  });

  // Signature Anicet (gauche)
  page.drawImage(anicetImg, {
    x: 50,
    y: sigY,
    width: sigWidth,
    height: sigHeight,
  });
  page.drawText("Anicet EKANE", {
    x: 50,
    y: sigY - 15,
    size: sigFontSize,
    font,
  });

  const pdfBytes = await pdfDoc.save();
  return pdfBytes;
}

module.exports = { generateCertificate };
