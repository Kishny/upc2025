const express = require("express");
const router = express.Router();
const Committee = require("../models/Committee");

// Ajouter un comité
router.post("/", async (req, res) => {
  try {
    const committee = new Committee(req.body);
    await committee.save();
    res.status(201).json({ success: true, committee });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

// Lister tous les comités
router.get("/", async (req, res) => {
  try {
    const committees = await Committee.find();
    res.json(committees);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
