const express = require("express");
const router = express.Router();
const nodemailer = require("nodemailer");
require("dotenv").config();

// Transporter SMTP
const transporter = nodemailer.createTransport({
  service: "gmail", // ou autre service
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

router.post("/", async (req, res) => {
  const { name, email, subject, message } = req.body;
  if (!name || !email || !message)
    return res
      .status(400)
      .json({ ok: false, error: "Champs requis manquants" });

  try {
    await transporter.sendMail({
      from: email,
      to: process.env.EMAIL_USER,
      subject: subject || "Formulaire contact UPC 2025",
      text: `Nom: ${name}\nEmail: ${email}\nMessage: ${message}`,
    });
    res.json({ ok: true });
  } catch (err) {
    console.error("Erreur mail contact:", err);
    res.status(500).json({ ok: false, error: err.message });
  }
});

module.exports = router;
