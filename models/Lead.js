const mongoose = require("mongoose");

const leadSchema = new mongoose.Schema(
  {
    // owner_name: { type: String },
    // company_name: { type: String },
    // prefix: { type: String },
    name: { type: String },
    email: { type: String, required: true, unique: true },
    addresses: { type: [Object] },
    phone: { type: [String] },
    lead_source: { type: String , default: "Manual"},
    status: { type: String },
  },
  { strict: "false", timestamps: true, collection: "leads" }
);


module.exports = mongoose.model("Lead", leadSchema);
