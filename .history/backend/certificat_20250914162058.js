const { PDFDocument, StandardFonts, rgb } = require("pdf-lib");

async function generateCertificate(member) {
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([400, 200]);
  const font = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

  page.drawText(`Certificat d'adhésion UPC 2025`, {
    x: 20,
    y: 150,
    size: 16,
    font,
    color: rgb(0, 0.5, 0),
  });
  page.drawText(`Nom: ${member.name}`, { x: 20, y: 120, size: 12, font });
  page.drawText(`Type: ${member.type}`, { x: 20, y: 100, size: 12, font });
  page.drawText(`Signé par: ${process.env.CERTIFICATE_SIGNATURE}`, {
    x: 20,
    y: 60,
    size: 12,
    font,
  });

  const pdfBytes = await pdfDoc.save();
  return pdfBytes;
}

module.exports = { generateCertificate };
