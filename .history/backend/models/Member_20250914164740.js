const mongoose = require("mongoose");

const memberSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: String,
    region: String,
    contribution: {
      type: String,
      enum: [
        "Mobilisation",
        "Communication",
        "VoteControl",
        "Don",
        "Influence",
      ],
      default: "Mobilisation",
    },
    note: String,
    type: {
      type: String,
      enum: ["individual", "organization"],
      default: "individual",
    },
    org_name: String,
    org_members: Number,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Member", memberSchema);
