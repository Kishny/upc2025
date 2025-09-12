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

// CORS pour ton frontend
app.use(
  cors({
    origin: ["http://127.0.0.1:5500", "http://localhost:5500"],
    methods: ["GET", "POST"],
    credentials: true,
  })
);

// Limitation requêtes
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

// Adhésion individuelle
app.post("/api/join", async (req, res) => {
  try {
    const { name, email, phone, region, role, note } = req.body || {};
    if (!name)
      return res.status(400).json({ ok: false, error: "NAME_REQUIRED" });

    const doc = await Member.create({
      name,
      email,
      phone,
      region,
      contribution: role || "Mobilisation",
      note,
    });

    // ⚠ Commenter sendMail si SMTP non configuré
    // await sendMail({ subject: `Nouvelle adhésion — ${name}`, html: `...` });

    res.json({ ok: true, id: doc._id });
  } catch (e) {
    console.error(e);
    res.status(500).json({ ok: false, error: "SERVER_ERROR" });
  }
});

// Création de comité
app.post("/api/committee", async (req, res) => {
  try {
    const { committee, city, contact } = req.body || {};
    if (!committee)
      return res.status(400).json({ ok: false, error: "COMMITTEE_REQUIRED" });

    const doc = await Committee.create({ committee, city, contact });

    // ⚠ Commenter sendMail si SMTP non configuré
    // await sendMail({ subject: `Nouveau comité — ${committee}`, html: `...` });

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
