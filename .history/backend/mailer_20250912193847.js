// backend/mailer.js
require("dotenv").config();
const nodemailer = require("nodemailer");

// ⚡ Configuration du transport SMTP
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: process.env.SMTP_SECURE === "true", // false pour Mailtrap
  auth: {
    user: process.env.Jean VOLCY, // ton identifiant Mailtrap
    pass: process.env.SMTP_PASS, // ton mot de passe Mailtrap
  },
});

// ⚡ Fonction pour envoyer un mail
async function sendMail({ subject, html, to = process.env.MAIL_TO }) {
  try {
    const info = await transporter.sendMail({
      from: `"UPC 2025" <${process.env.SMTP_USER}>`,
      to,
      subject,
      html,
    });
    console.log("Email envoyé :", info.messageId);
    return info;
  } catch (err) {
    console.error("Erreur envoi mail :", err);
    throw err;
  }
}

module.exports = { sendMail };
