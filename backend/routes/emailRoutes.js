import express from "express";
import { sendEmail } from "../mailer.js";

const router = express.Router();

router.post("/send-email", async (req, res) => {
  const { email, subject, message } = req.body;

  try {
    await sendEmail({
      to: email,
      subject,
      html: `<p>${message}</p>`,
    });
    res.status(200).json({ success: true, message: "Email envoyé !" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

export default router;
