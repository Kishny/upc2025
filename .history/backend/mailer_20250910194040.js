const nodemailer = require("nodemailer");

function createTransport() {
  return nodemailer.createTransport({
    host: process.env.MAIL_HOST,
    port: Number(process.env.MAIL_PORT || 587),
    secure: process.env.MAIL_SECURE === "true",
    auth: { user: process.env.MAIL_USER, pass: process.env.MAIL_PASS },
  });
}

async function sendMail({ subject, html }) {
  const transporter = createTransport();
  await transporter.sendMail({
    from: `"UPC 2025" <${process.env.MAIL_USER}>`,
    to: process.env.MAIL_TO,
    subject,
    html,
  });
}

module.exports = { sendMail };
