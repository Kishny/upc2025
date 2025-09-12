const mongoose = require("mongoose");

const MemberSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, trim: true, lowercase: true },
  phone: { type: String, trim: true },
  region: { type: String, trim: true },
  contribution: {
    type: String,
    enum: [
      "Donateur",
      "Communication",
      "Mobilisation",
      "Contrôle du vote",
      "Influence",
      "Autre",
      "Don",
    ],
    default: "Mobilisation",
  },
  note: { type: String, trim: true },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Member", MemberSchema);
