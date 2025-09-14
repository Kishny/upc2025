const { PDFDocument, rgb, StandardFonts } = require("pdf-lib");

async function generateCertificate(member) {
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([600, 400]);
  const font = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

  page.drawText(`CERTIFICAT D’ADHÉSION`, {
    x: 50,
    y: 350,
    size: 24,
    font,
    color: rgb(0, 0.5, 0),
  });
  page.drawText(`Nom : ${member.name}`, { x: 50, y: 300, size: 18, font });
  if (member.type === "organization") {
    page.drawText(`Organisation : ${member.org_name}`, {
      x: 50,
      y: 270,
      size: 18,
      font,
    });
    page.drawText(`Nombre de membres : ${member.org_members}`, {
      x: 50,
      y: 240,
      size: 18,
      font,
    });
  }
  page.drawText(`Type : ${member.type}`, { x: 50, y: 210, size: 18, font });
  page.drawText(`Signatures : ${process.env.CERTIFICATE_SIGNATURE}`, {
    x: 50,
    y: 150,
    size: 16,
    font,
  });

  const pdfBytes = await pdfDoc.save();
  return pdfBytes;
}

module.exports = { generateCertificate };
