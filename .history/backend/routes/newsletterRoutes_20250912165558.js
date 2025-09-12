const express = require("express");
const router = express.Router();

const subscribers = []; // temporaire, on peut stocker dans MongoDB aussi

router.post("/", (req, res) => {
  const { email, region } = req.body;
  if (!email) return res.status(400).json({ error: "Email requis" });
  subscribers.push({ email, region, date: new Date() });
  res.json({ success: true });
});

module.exports = router;
