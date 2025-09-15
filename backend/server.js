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
const { sendMail } = require("./mailer");

const app = express();

// ----------------- Middlewares -----------------
const FRONT_URL = "https://www.unionpourlechangement.org";

app.use(
  cors({
    origin: [FRONT_URL, "http://127.0.0.1:5500", "http://localhost:5500"],
    methods: ["GET", "POST"],
    credentials: true,
  })
);
app.use(rateLimit({ windowMs: 60 * 1000, max: 600 }));

// ----------------- MongoDB -----------------
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("Mongo error", err.message));

// ----------------- Formulaire adhésion -----------------
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
    } = req.body;

    // validations
    if (!name)
      return res.status(400).json({ ok: false, error: "NAME_REQUIRED" });
    if (!email)
      return res.status(400).json({ ok: false, error: "EMAIL_REQUIRED" });
    if (member_type === "organization" && !org_name)
      return res.status(400).json({ ok: false, error: "ORG_NAME_REQUIRED" });

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

    // Génération du PDF si en ligne
    if (inscription_mode === "online") {
      const pdfDoc = await PDFDocument.create();
      const page = pdfDoc.addPage([600, 850]);
      const font = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

      // Fond, texte etc...
      page.drawText("CERTIFICAT D'ADHÉSION", {
        x: 50,
        y: 800,
        size: 24,
        font,
        color: rgb(0, 0.3, 0.2),
      });
      page.drawText(`Nom: ${name}`, { x: 50, y: 760, size: 16 });

      // Sauvegarde PDF
      if (!fs.existsSync("./certificates"))
        fs.mkdirSync("./certificates", { recursive: true });
      pdfPath = `./certificates/certificate_${memberDoc._id}.pdf`;

      const pdfBytes = await pdfDoc.save();
      fs.writeFileSync(pdfPath, pdfBytes); // ⚠ Assure-toi que pdfBytes est utilisé ici

      // Contenu PDF
      page.drawText("CERTIFICAT D'ADHÉSION", {
        x: 50,
        y: height - 100,
        size: 24,
        font,
        color: rgb(0, 0.3, 0.2),
      });
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

      if (!fs.existsSync("./certificates"))
        fs.mkdirSync("./certificates", { recursive: true });
      pdfPath = `./certificates/certificate_${memberDoc._id}.pdf`;
      fs.writeFileSync(pdfPath, await pdfDoc.save());
    }

    // Email avec PDF attaché
    try {
      await sendMail({
        subject: `Nouvelle adhésion — ${name}`,
        html: `<h2>Nouvelle adhésion (${member_type})</h2>
          <ul>
            <li><b>Nom:</b> ${name}</li>
            <li><b>Email:</b> ${email || "-"}</li>
            <li><b>Téléphone:</b> ${phone || "-"}</li>
            <li><b>Région:</b> ${region || "-"}</li>
            ${
              member_type === "organization"
                ? `<li><b>Organisation:</b> ${org_name}</li><li><b>Membres:</b> ${org_members}</li>`
                : ""
            }
            <li><b>Contribution:</b> ${role || "-"}</li>
            <li><b>Note:</b> ${note || "-"}</li>
          </ul>
          <p>Enregistré le ${new Date(
            memberDoc.createdAt
          ).toLocaleString()}</p>`,
        ...(pdfPath
          ? { attachments: [{ filename: "certificate.pdf", path: pdfPath }] }
          : {}),
      });
    } catch (mailErr) {
      console.error("Erreur envoi mail :", mailErr);
    }

    res.json({
      ok: true,
      id: memberDoc._id,
      pdfPath: pdfPath
        ? pdfPath.replace(/^\.\/certificates\//, "certificates/")
        : null,
    });
  } catch (err) {
    console.error("Erreur serveur :", err);
    res.status(500).json({ ok: false, error: "SERVER_ERROR" });
  }
});

// ----------------- Routes supplémentaires -----------------
app.use("/api/committee", require("./routes/committeeRoutes"));
app.use("/api/newsletter", require("./routes/newsletterRoutes"));

// ----------------- Frontend -----------------
// Servir les fichiers statiques à partir de la racine
app.use(express.static(path.join(__dirname, "..")));

// Route catch-all pour SPA
app.get(/^(?!\/api|\/certificates).*/, (_req, res) => {
  res.sendFile(path.join(__dirname, "..", "index.html"));
});

// ----------------- Certificats -----------------
app.use("/certificates", express.static(path.join(__dirname, "certificates")));

// Catch-all SPA
app.get(/^(?!\/api|\/certificates).*/, (_req, res) =>
  res.sendFile(path.join(__dirname, "..", "public", "index.html"))
);

// ----------------- Démarrage serveur -----------------
const port = process.env.PORT || 4000;
app.listen(port, () => console.log(`API listening on :${port}`));
