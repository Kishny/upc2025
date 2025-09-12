const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: process.env.SMTP_SECURE === "true",
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

async function sendMail({ subject, html, to = process.env.MAIL_TO }) {
  return transporter.sendMail({
    from: `"UPC 2025" <${process.env.SMTP_USER}>`,
    to,
    subject,
    html,
  });
}

module.exports = { sendMail };
  const resp = await fetch(BASE_URL + url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
//
// function wireFormBackend(id, url, okMessage) {
//   const form = document.getElementById(id);
//   if (!form) return;