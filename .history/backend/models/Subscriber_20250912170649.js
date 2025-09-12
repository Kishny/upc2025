const mongoose = require("mongoose");

const subscriberSchema = new mongoose.Schema(
  {
    email: { type: String, required: true },
    region: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Subscriber", subscriberSchema);
