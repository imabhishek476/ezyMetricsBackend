const express = require("express");
const Lead = require("../models/Lead");
const { createObjectCsvWriter } = require("csv-writer");
const PDFDocument = require("pdfkit");
const fs = require("fs");
const router = express.Router();
const { Apideck } = require("@apideck/node");
const sendAlertEmail = require("../utils/sendEmail");
const apideck = new Apideck({
  apiKey: "",
  appId: "",
  consumerId: "test-consumer",
});

router.get("/report/csv", async (req, res) => {
  const leads = await Lead.find();
  const RefineLeads = leads.map((i) => {
    const { _id, name, email, status, addresses, phone } = i;
    return {
      _id,
      name,
      email,
      city: addresses[0].city,
      state: addresses[0].state,
      country: addresses[0].country,
      postal: addresses[0].postal_code,
      phone: phone[0],
      status,
    };
  });

  const csvWriter = createObjectCsvWriter({
    path: "leads_report.csv",
    header: [
      { id: "_id", title: "Lead ID" },
      { id: "name", title: "Name" },
      { id: "email", title: "Email" },
      { id: "city", title: "City" },
      { id: "state", title: "State" },
      { id: "country", title: "Country" },
      { id: "postal_code", title: "Postal" },
      { id: "phone", title: "Phone" },
      { id: "status", title: "Status" },
    ],
  });

  await csvWriter.writeRecords(RefineLeads);
  res.download("leads_report.csv");
});

router.get("/report/pdf", async (req, res) => {
  try {
    const leads = await Lead.find();
    const doc = new PDFDocument();

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      'attachment; filename="leads_report.pdf"'
    );

    doc.pipe(res);

    doc.fontSize(14).text("EzyMetrics Lead Report", { align: "center" });

    leads.forEach((lead, index) => {
      doc.text(`Lead ID: ${lead._id}`);
      doc.text(`Name: ${lead.name}`);
      doc.text(`Email: ${lead.email}`);
      doc.text(`City: ${lead.addresses[0].city}`);
      doc.text(`State: ${lead.addresses[0].state}`);
      doc.text(`Country: ${lead.addresses[0].country}`);
      doc.text(`Postal: ${lead.addresses[0].postal_code}`);
      doc.text(`Phone: ${lead.phone[0]}`);
      doc.text(`Status: ${lead.status}`);
      if (index < leads.length - 1) {
        doc
          .moveTo(50, doc.y + 10)
          .lineTo(550, doc.y + 10)
          .stroke("#888888");
      }
      doc.moveDown();
    });

    doc.end();
  } catch (error) {
    res.status(500).json({ message: "Something went wrong!" });
  }
});
router.get("/hello", async (req, res) => {
  try {
    const response = await apideck.crm.leadsAll({
      serviceId: "activecampaign",
      limit: 10,
    });
    res.json({ message: "Hello", data: response.data });
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
});

module.exports = router;

// const response = await apideck.crm.contactsAll({
//   serviceId: 'activecampaign', // optional
//   limit: 10
// })
