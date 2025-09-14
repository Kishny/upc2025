require("dotenv").config();
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const mongoose = require("mongoose");
const path = require("path");
const fs = require("fs");
const { PDFDocument, rgb, StandardFonts } = require("pdf-lib");

const Member = require("./models/Member");
const Committee = require("./models/Committee");
const Subscriber = require("./models/Subscriber");
const { sendMail } = require("./mailer");

// Routes
const committeeRoutes = require("./routes/committeeRoutes");
const contactRoutes = require("./routes/contactRoutes");
const memberRoutes = require("./routes/memberRoutes");
const newsletterRoutes = require("./routes/newsletterRoutes");

const app = express();

// =========================
// MIDDLEWARES
// =========================
app.use(helmet());
app.use(express.json());

app.use(
  cors({
    origin: ["http://127.0.0.1:5500", "http://localhost:5500"],
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
// ROUTES API
// =========================
app.use("/api/committee", committeeRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/member", memberRoutes);
app.use("/api/newsletter", newsletterRoutes);

app.get("/api/health", (_req, res) => res.json({ ok: true }));

// --- Adhésion individuelle / organisation ---
app.post("/api/join", async (req, res) => {
  try {
    const {
      member_type, // 'individual' ou 'organization'
      inscription_mode, // 'online' ou 'paper'
      name,
      email,
      phone,
      region,
      role,
      note,
      org_name,
      org_members,
    } = req.body || {};

    if (!name)
      return res.status(400).json({ ok: false, error: "NAME_REQUIRED" });

    // Contribution selon rôle
    const ROLE_MAP = {
      Mobilisation: "Mobilisation",
      Communication: "Communication",
      "Contrôle du vote": "VoteControl",
      Donateur: "Don",
      Influence: "Influence",
    };
    const contribution = ROLE_MAP[role] || "Mobilisation";

    // Création membre
    const doc = await Member.create({
      name,
      email,
      phone,
      region,
      contribution,
      note,
      org_name: org_name || null,
      org_members: org_members || null,
      member_type,
      inscription_mode,
    });

    // Créer certificat PDF si inscription en ligne
    let pdfPath = null;
    if (inscription_mode === "online") {
      const pdfDoc = await PDFDocument.create();
      const page = pdfDoc.addPage([500, 400]);
      const font = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
      page.drawText("CERTIFICAT D'ADHÉSION", {
        x: 50,
        y: 350,
        size: 20,
        color: rgb(0, 0.3, 0.2),
        font,
      });
      page.drawText(`Nom: ${name}`, { x: 50, y: 300, size: 16 });
      if (member_type === "organization")
        page.drawText(`Organisation: ${org_name}`, { x: 50, y: 270, size: 16 });
      page.drawText(`Date: ${new Date().toLocaleDateString()}`, {
        x: 50,
        y: 240,
        size: 16,
      });
      page.drawText(`Signé par: ${process.env.CERTIFICATE_SIGNATURE}`, {
        x: 50,
        y: 210,
        size: 14,
      });

      const pdfBytes = await pdfDoc.save();

      if (!fs.existsSync("./certificates")) fs.mkdirSync("./certificates");
      pdfPath = `./certificates/certificate_${doc._id}.pdf`;
      fs.writeFileSync(pdfPath, pdfBytes);
    }

    // Envoi mail
    try {
      await sendMail({
        subject: `Nouvelle adhésion — ${name}`,
        html: `<h2>Nouvelle adhésion (${member_type})</h2>
          <ul>
            <li><b>Nom</b> : ${name}</li>
            <li><b>Email</b> : ${email || "-"}</li>
            <li><b>Téléphone</b> : ${phone || "-"}</li>
            <li><b>Région</b> : ${region || "-"}</li>
            ${
              member_type === "organization"
                ? `<li><b>Organisation</b> : ${org_name}</li><li><b>Membres</b> : ${org_members}</li>`
                : ""
            }
            <li><b>Contribution</b> : ${role || "-"}</li>
            <li><b>Note</b> : ${note || "-"}</li>
          </ul>
          <p>Enregistré le ${new Date(doc.createdAt).toLocaleString()}</p>`,
        ...(pdfPath
          ? { attachments: [{ filename: "certificate.pdf", path: pdfPath }] }
          : {}),
      });
    } catch (mailErr) {
      console.error("Erreur envoi mail adhésion :", mailErr);
    }

    res.json({ ok: true, id: doc._id });
  } catch (err) {
    console.error("Erreur serveur adhésion :", err);
    res.status(500).json({ ok: false, error: "SERVER_ERROR" });
  }
});

// =========================
// SERVIR LE FRONTEND (Render / Production)
// =========================
app.use(express.static(path.join(__dirname, "..")));
app.get(/.*/, (req, res) => {
  res.sendFile(path.join(__dirname, "../index.html"));
});

// =========================
// START SERVER
// =========================
const port = process.env.PORT || 4000;
app.listen(port, () => console.log(`API listening on :${port}`));
