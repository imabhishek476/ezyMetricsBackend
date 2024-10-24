const mongoose = require("mongoose");

const campaignSchema = new mongoose.Schema(
  {
    // campaignId: Number,
    name: { type: String },
    status: { type: String, default: "active" },
    leadsGenerated: { type: Number, default: 0 },
  },
  { strict: "false", timestamps: true, collection: "campaign" }
);

module.exports = mongoose.model("Campaign", campaignSchema);
