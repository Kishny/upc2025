const express = require("express");
const router = express.Router();
const Member = require("../models/Member");

// Ajouter un membre (adhésion)
router.post("/", async (req, res) => {
  try {
    const member = new Member(req.body);
    await member.save();
    res.status(201).json({ success: true, member });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

module.exports = router;
