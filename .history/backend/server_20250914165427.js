require("dotenv").config();
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const mongoose = require("mongoose");
const path = require("path");
const fs = require("fs");
const { PDFDocument, rgb } = require("pdf-lib");

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
app.get("/api/health", (_req, res) => res.json({ ok: true }));

// --- Nouvelle route /api/join ---
app.post("/api/join", async (req, res) => {
  try {
    const {
      name,
      email,
      phone,
      region,
      role,
      note,
      member_type,
      inscription_mode,
      org_name,
      org_members,
    } = req.body || {};

    if (!name || !member_type || !inscription_mode)
      return res.status(400).json({ ok: false, error: "REQUIRED_FIELDS" });

    // Création du membre dans MongoDB
    const memberDoc = await Member.create({
      name,
      email,
      phone,
      region,
      contribution: role || "Mobilisation",
      note,
      member_type,
      org_name: member_type === "organization" ? org_name : undefined,
      org_members: member_type === "organization" ? org_members : undefined,
    });

    // Si inscription en ligne → générer PDF et envoyer mail
    if (inscription_mode === "online") {
      const pdfDoc = await PDFDocument.create();
      const page = pdfDoc.addPage([600, 400]);
      const { width, height } = page.getSize();
      const fontSize = 18;

      page.drawText("Certificat d'adhésion UPC 2025", {
        x: 50,
        y: height - 80,
        size: fontSize,
        color: rgb(0, 0.4, 0.3),
      });
      page.drawText(`Nom : ${name}`, { x: 50, y: height - 140, size: 14 });
      if (member_type === "organization")
        page.drawText(`Organisation : ${org_name}`, {
          x: 50,
          y: height - 170,
          size: 14,
        });
      page.drawText(`Signé par : ${process.env.CERTIFICATE_SIGNATURE}`, {
        x: 50,
        y: height - 200,
        size: 14,
      });

      const pdfBytes = await pdfDoc.save();
      const pdfPath = path.join(
        __dirname,
        "certificates",
        `${memberDoc._id}.pdf`
      );
      fs.writeFileSync(pdfPath, pdfBytes);

      // Envoi e-mail
      try {
        await sendMail({
          to: email,
          subject: "Votre certificat d'adhésion UPC 2025",
          html: `<h2>Merci pour votre adhésion</h2>
                 <p>Veuillez trouver votre certificat en pièce jointe.</p>`,
          attachments: [
            {
              filename: "certificat.pdf",
              path: pdfPath,
            },
          ],
        });
      } catch (err) {
        console.error("Erreur envoi mail certificat :", err);
      }
    }

    res.json({ ok: true, id: memberDoc._id });
  } catch (err) {
    console.error("Erreur /api/join :", err);
    res.status(500).json({ ok: false, error: "SERVER_ERROR" });
  }
});

// --- Routes comité ---
app.use("/api/committee", require("./routes/committeeRoutes"));

// --- Newsletter ---
app.use("/api/newsletter", require("./routes/newsletterRoutes"));

// --- Contact ---
app.use("/api/contact", require("./routes/contactRoutes"));

// =========================
// SERVIR FRONTEND
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
