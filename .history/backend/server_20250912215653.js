require("dotenv").config();
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const mongoose = require("mongoose");
const Member = require("./models/Member");
const Committee = require("./models/Committee");
const { sendMail } = require("./mailer");

const app = express();

// =========================
// MIDDLEWARES
// =========================
app.use(helmet());
app.use(express.json());

app.use(
  cors({
    origin: ["http://127.0.0.1:5500", "http://localhost:5500"], // ton frontend
    methods: ["GET", "POST"],
    credentials: true,
  })
);

app.use(rateLimit({ windowMs: 60 * 1000, max: 30 }));

// =========================
// CONNECT MONGODB
// =========================
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("Mongo error", err.message));

// =========================
// ROUTES
// =========================
app.get("/api/health", (_req, res) => res.json({ ok: true }));

// --- Adhésion individuelle ---
app.post("/api/join", async (req, res) => {
  console.log("Requête reçue:", req.body);
  try {
    const { name, email, phone, region, role, note } = req.body || {};
    if (!name)
      return res.status(400).json({ ok: false, error: "NAME_REQUIRED" });

    // Map formulaire → enum backend
    const ROLE_MAP = {
      Mobilisation: "Mobilisation",
      Communication: "Communication",
      "Contrôle du vote": "VoteControl",
      Donateur: "Don",
      Influence: "Influence",
    };

    const doc = await Member.create({
      name,
      email,
      phone,
      region,
      contribution: ROLE_MAP[role] || "Mobilisation",
      note,
    });

    // Envoi mail avec Mailtrap
    await sendMail({
      subject: `Nouvelle adhésion — ${name}`,
      html: `<h2>Nouvelle adhésion (individuelle)</h2>
        <ul>
          <li><b>Nom</b> : ${name}</li>
          <li><b>Email</b> : ${email || "-"}</li>
          <li><b>Téléphone</b> : ${phone || "-"}</li>
          <li><b>Région</b> : ${region || "-"}</li>
          <li><b>Contribution</b> : ${role || "-"}</li>
          <li><b>Note</b> : ${note || "-"}</li>
        </ul>
        <p>Enregistré le ${new Date(doc.createdAt).toLocaleString()}</p>`,
    });

    res.json({ ok: true, id: doc._id });
  } catch (e) {
    console.error(e);
    res.status(500).json({ ok: false, error: "SERVER_ERROR" });
  }
});

// --- Création de comité ---
app.post("/api/committee", async (req, res) => {
  try {
    const { committee, city, contact } = req.body || {};
    if (!committee)
      return res.status(400).json({ ok: false, error: "COMMITTEE_REQUIRED" });

    const doc = await Committee.create({ committee, city, contact });

    // Envoi mail avec Mailtrap
    await sendMail({
      subject: `Nouveau comité — ${committee}`,
      html: `<h2>Nouveau comité local</h2>
        <ul>
          <li><b>Nom du comité</b> : ${committee}</li>
          <li><b>Ville</b> : ${city || "-"}</li>
          <li><b>Contact</b> : ${contact || "-"}</li>
        </ul>
        <p>Enregistré le ${new Date(doc.createdAt).toLocaleString()}</p>`,
    });

    res.json({ ok: true, id: doc._id });
  } catch (e) {
    console.error(e);
    res.status(500).json({ ok: false, error: "SERVER_ERROR" });
  }
});

// =========================
// START SERVER
// =========================
const port = process.env.PORT || 4000;
app.listen(port, () => console.log(`API listening on :${port}`));
