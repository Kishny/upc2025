require("dotenv").config();
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const mongoose = require("mongoose");
const Member = require("./models/Member");
const Committee = require("./models/Committee");
const Subscriber = require("./models/Subscriber");
const { sendMail } = require("./mailer");

const app = express();
app.use(helmet());
app.use(express.json());
app.use(cors({ origin: process.env.ORIGIN?.split(",") || "*" }));
app.use(rateLimit({ windowMs: 60 * 1000, max: 30 }));

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("Mongo error", err.message));

app.get("/api/health", (_req, res) => res.json({ ok: true }));

/* =========================
   Adhésion individuelle
   ========================= */
app.post("/api/join", async (req, res) => {
  try {
    const { name, email, phone, region, role, note } = req.body;
    if (!name)
      return res.status(400).json({ ok: false, error: "NAME_REQUIRED" });

    const doc = await Member.create({
      name,
      email,
      phone,
      region,
      contribution: role,
      note,
    });

    await sendMail({
      subject: `Nouvelle adhésion — ${name}`,
      html: `<h2>Nouvelle adhésion</h2>
             <ul>
             <li><b>Nom:</b> ${name}</li>
             <li><b>Email:</b> ${email || "-"}</li>
             <li><b>Téléphone:</b> ${phone || "-"}</li>
             <li><b>Région:</b> ${region || "-"}</li>
             <li><b>Contribution:</b> ${role || "-"}</li>
             <li><b>Note:</b> ${note || "-"}</li>
             </ul>
             <p>Enregistré le ${new Date(doc.createdAt).toLocaleString()}</p>`,
    });

    res.json({ ok: true, id: doc._id });
  } catch (e) {
    console.error(e);
    res.status(500).json({ ok: false, error: "SERVER_ERROR" });
  }
});

/* =========================
   Création comité
   ========================= */
app.post("/api/committee", async (req, res) => {
  try {
    const { committee, city, contact } = req.body;
    if (!committee)
      return res.status(400).json({ ok: false, error: "COMMITTEE_REQUIRED" });

    const doc = await Committee.create({ committee, city, contact });

    await sendMail({
      subject: `Nouveau comité — ${committee}`,
      html: `<h2>Nouveau comité local</h2>
             <ul>
             <li><b>Nom:</b> ${committee}</li>
             <li><b>Ville:</b> ${city || "-"}</li>
             <li><b>Contact:</b> ${contact || "-"}</li>
             </ul>
             <p>Enregistré le ${new Date(doc.createdAt).toLocaleString()}</p>`,
    });

    res.json({ ok: true, id: doc._id });
  } catch (e) {
    console.error(e);
    res.status(500).json({ ok: false, error: "SERVER_ERROR" });
  }
});

/* =========================
   Newsletter
   ========================= */
app.post("/api/newsletter", async (req, res) => {
  try {
    const { email, region } = req.body;
    if (!email)
      return res.status(400).json({ ok: false, error: "EMAIL_REQUIRED" });

    const sub = await Subscriber.create({ email, region });
    res.json({ ok: true, id: sub._id });
  } catch (e) {
    console.error(e);
    res.status(500).json({ ok: false, error: "SERVER_ERROR" });
  }
});

/* =========================
   Contact
   ========================= */
app.post("/api/contact", async (req, res) => {
  try {
    const { name, email, message } = req.body;
    if (!name || !message)
      return res.status(400).json({ ok: false, error: "FIELDS_REQUIRED" });

    await sendMail({
      subject: `Message de contact — ${name}`,
      html: `<h2>Nouveau message de contact</h2>
             <ul>
             <li><b>Nom:</b> ${name}</li>
             <li><b>Email:</b> ${email || "-"}</li>
             <li><b>Message:</b> ${message}</li>
             </ul>
             <p>Enregistré le ${new Date().toLocaleString()}</p>`,
    });

    res.json({ ok: true });
  } catch (e) {
    console.error(e);
    res.status(500).json({ ok: false, error: "SERVER_ERROR" });
  }
});

/* =========================
   Démarrage serveur
   ========================= */
const port = process.env.PORT || 4000;
app.listen(port, () => console.log(`API listening on :${port}`));
