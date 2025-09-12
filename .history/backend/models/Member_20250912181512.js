const mongoose = require("mongoose");

const memberSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: String,
    phone: String,
    region: String,
    contribution: {
      type: String,
      enum: [
        "Mobilisation",
        "Communication",
        "Vote Monitoring",
        "Don",
        "Influence",
      ], // <- ajout de "Don"
      default: "Mobilisation",
    },
    note: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Member", memberSchema);
