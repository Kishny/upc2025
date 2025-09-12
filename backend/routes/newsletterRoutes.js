const express = require("express");
const router = express.Router();
const Subscriber = require("../models/Subscriber");
const { sendMail } = require("../mailer");

// POST /api/newsletter
router.post("/", async (req, res) => {
  try {
    const { email, region, consent } = req.body;

    if (!email || !consent)
      return res
        .status(400)
        .json({ ok: false, error: "EMAIL_AND_CONSENT_REQUIRED" });

    // Vérifie si déjà inscrit
    const exists = await Subscriber.findOne({ email });
    if (exists)
      return res
        .status(400)
        .json({ ok: false, error: "EMAIL_ALREADY_SUBSCRIBED" });

    // Création du document
    const subscriber = await Subscriber.create({ email, region, consent });

    // Envoi mail de confirmation
    await sendMail({
      subject: `Confirmation d'inscription newsletter`,
      html: `<h2>Merci pour votre inscription à la newsletter</h2>
             <ul>
               <li><b>Email</b> : ${email}</li>
               <li><b>Région</b> : ${region || "-"}</li>
             </ul>
             <p>Inscription enregistrée le ${new Date(
               subscriber.createdAt
             ).toLocaleString()}</p>`,
    });

    res.json({ ok: true, id: subscriber._id });
  } catch (e) {
    console.error("Erreur newsletter :", e);
    res.status(500).json({ ok: false, error: "SERVER_ERROR" });
  }
});

module.exports = router;
