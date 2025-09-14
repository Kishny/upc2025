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

const app = express();

// =========================
// MIDDLEWARES
// =========================
app.use(helmet());
app.use(express.json());

app.use(
  cors({
    origin: [
      "http://127.0.0.1:5500",
      "http://localhost:5500",
      process.env.ORIGIN || "*",
    ],
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
app.get("/api/health", (_req, res) => res.json({ ok: true }));

// --- Adhésion individuelle / organisation ---
app.post("/api/join", async (req, res) => {
  try {
    const {
      member_type,
      inscription_mode,
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

    const ROLE_MAP = {
      Mobilisation: "Mobilisation",
      Communication: "Communication",
      "Contrôle du vote": "VoteControl",
      Donateur: "Don",
      Influence: "Influence",
    };
    const contribution = ROLE_MAP[role] || "Mobilisation";

    const memberDoc = await Member.create({
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

    let pdfPath = null;

    // Génération du certificat PDF si inscription en ligne
    if (inscription_mode === "online") {
      const pdfDoc = await PDFDocument.create();
      const page = pdfDoc.addPage([600, 850]);
      const width = page.getWidth();
      const height = page.getHeight();
      const font = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

      // Fond pastel
      page.drawRectangle({
        x: 0,
        y: 0,
        width,
        height,
        color: rgb(0.93, 0.96, 0.94),
      });

      // Titre
      page.drawText("CERTIFICAT D'ADHÉSION", {
        x: 50,
        y: height - 100,
        size: 24,
        font,
        color: rgb(0, 0.3, 0.2),
      });

      // Nom et type
      page.drawText(`Nom: ${name}`, { x: 50, y: height - 140, size: 16 });
      if (member_type === "organization")
        page.drawText(`Organisation: ${org_name}`, {
          x: 50,
          y: height - 170,
          size: 16,
        });

      page.drawText(`Date: ${new Date().toLocaleDateString()}`, {
        x: 50,
        y: height - 200,
        size: 16,
      });
      page.drawText(`Signé par: ${process.env.CERTIFICATE_SIGNATURE}`, {
        x: 50,
        y: height - 230,
        size: 14,
      });

      // Sauvegarde PDF
      const pdfBytes = await pdfDoc.save();
      if (!fs.existsSync("./certificates")) fs.mkdirSync("./certificates");
      pdfPath = `./certificates/certificate_${memberDoc._id}.pdf`;
      fs.writeFileSync(pdfPath, pdfBytes);
    }

    // Envoi mail avec ou sans PDF
    try {
      await sendMail({
        subject: `Nouvelle adhésion — ${name}`,
        html: `<h2>Nouvelle adhésion (${member_type})</h2>
          <ul>
            <li><b>Nom</b>: ${name}</li>
            <li><b>Email</b>: ${email || "-"}</li>
            <li><b>Téléphone</b>: ${phone || "-"}</li>
            <li><b>Région</b>: ${region || "-"}</li>
            ${
              member_type === "organization"
                ? `<li><b>Organisation</b>: ${org_name}</li><li><b>Membres</b>: ${org_members}</li>`
                : ""
            }
            <li><b>Contribution</b>: ${role || "-"}</li>
            <li><b>Note</b>: ${note || "-"}</li>
          </ul>
          <p>Enregistré le ${new Date(
            memberDoc.createdAt
          ).toLocaleString()}</p>`,
        ...(pdfPath
          ? { attachments: [{ filename: "certificate.pdf", path: pdfPath }] }
          : {}),
      });
    } catch (mailErr) {
      console.error("Erreur envoi mail adhésion :", mailErr);
    }

    res.json({
      ok: true,
      id: memberDoc._id,
      pdfPath: pdfPath ? pdfPath.replace("./", "") : null,
    });
  } catch (err) {
    console.error("Erreur serveur adhésion :", err);
    res.status(500).json({ ok: false, error: "SERVER_ERROR" });
  }
});

// --- Création comité et newsletter ---
app.use("/api/committee", require("./routes/committeeRoutes"));
app.use("/api/newsletter", require("./routes/newsletterRoutes"));

// =========================
// SERVIR LE FRONTEND
// =========================
app.use(express.static(path.join(__dirname, "../frontend")));
app.get(/.*/, (_req, res) =>
  res.sendFile(path.join(__dirname, "../frontend/index.html"))
);

// =========================
// SERVIR CERTIFICATS
// =========================
app.use("/certificates", express.static(path.join(__dirname, "certificates")));

// =========================
// START SERVER
// =========================
const port = process.env.PORT || 4000;
app.listen(port, () => console.log(`API listening on :${port}`));
