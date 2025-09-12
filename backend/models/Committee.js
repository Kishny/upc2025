const mongoose = require("mongoose");

const CommitteeSchema = new mongoose.Schema({
  committee: { type: String, required: true, trim: true },
  city: { type: String, trim: true },
  contact: { type: String, trim: true }, // email / tel
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Committee", CommitteeSchema);
