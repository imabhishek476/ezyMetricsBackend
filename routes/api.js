const express = require("express");
const dotenv = require("dotenv");
const Lead = require("../models/Lead");
const router = express.Router();
const axios = require("axios");
const { saveLeads } = require("../utils/filterData");
const sendAlertEmail = require("../utils/sendEmail");
const Campaign = require("../models/Campaign");
dotenv.config();
const CRMHeader = {
  Authorization: `Bearer ${process.env.API_DECK_API_KEY}`,
  "x-apideck-app-id": process.env.API_DECK_API_ID,
  "x-apideck-consumer-id": "test-consumer",
  "x-apideck-service-id": "zoho-crm",
};

router.get("/generate/leads", async (req, res) => {
  try {
    const response = await axios.get("https://unify.apideck.com/crm/leads", {
      headers: CRMHeader,
    });
    const data = response.data;
    // ...
    if (data.status === "OK") {
      // await saveLeads(data.data)
      let existingEmails = [];
      for (const apiLead of data.data) {
        const existingLead = await Lead.findOne({
          email: apiLead.emails[0].email,
        });
        if (existingLead) {
          existingLead.status = apiLead.status;
          await existingLead.save();
          existingEmails.push(existingLead.email);
          // console.log(`Lead with email ${apiLead.email} already exists.`);
        } else {
          const newLead = new Lead({
            // owner_name: apiLead.owner_name,
            // company_name: apiLead.company_name,
            // prefix: apiLead.prefix,
            email: apiLead.emails[0].email,
            name: apiLead.name,
            addresses: apiLead.addresses.map((address) => ({
              city: address.city,
              state: address.state,
              country: address.country,
              postal_code: address.postal_code,
            })),
            phone: apiLead.phone_numbers.map((phone) => phone.number),
            lead_source: apiLead.lead_source,
            status: apiLead.status,
            crm_service: data.service,
            // ... other fields ...
          });
          await newLead.save();
          //   console.log(`New lead saved with email ${apiLead.email}.`);
        }
      }
      if (existingEmails.length > 0) {
        const text = `<p>List of Emails already present:<p><ul>${existingEmails
          .map((email) => `<li>${email}</li>`)
          .join("")}</ul>`;
        sendAlertEmail("Same Lead Generated for these Emails", text);
      }
      res
        .status(201)
        .json(
          existingEmails.length > 0
            ? { message: "Dublicate Leads Found Check your email" }
            : { message: `Leads Generated From ${data.service}` }
        );
    } else {
      res.status(404).json({ message: "Leads not generated" });
    }
  } catch (error) {
    res.status(500).json(error || "Something went Wrong");
  }
  // const leads = [
  //     { leadId: 1, name: 'John Doe', email: 'john@example.com', status: 'new' },
  //     { leadId: 2, name: 'Jane Smith', email: 'jane@example.com', status: 'converted' }
  // ];
  // res.json(leads);
});

router.get("/marketing/campaigns", async (req, res) => {
  try {
    const response = await axios.get("https://unify.apideck.com/crm/leads", {
      headers: CRMHeader,
    });
    const data = response.data;
    // ...
    if (data.status === "OK") {
      let countNewCompaign = 0;
      for (const apiLead of data.data) {
        const existingLead = await Lead.findOne({
          email: apiLead.emails[0].email,
        });
        if (existingLead) {
          continue;
          // console.log(`Lead with email ${apiLead.email} already exists.`);
        } else {
          countNewCompaign = countNewCompaign + 1;
        }
      }
      if (countNewCompaign > 0) {
        const newCampaign = new Campaign({
          name: data.service,
          leadsGenerated: countNewCompaign,
        });
        await newCampaign.save();
        res
          .status(201)
          .json({ message: `New Compaign found from ${data.service}` });
      } else {
        res.status(201).json({ message: "No New Compaign generated" });
      }
    } else {
      res.status(404).json({ message: "Something went Wrong with fetching" });
    }
  } catch (error) {
    res.status(500).json(error || "Something went Wrong");
  }
});


// router.post("/lead", async (req, res) => {
//   try {
//     const newLead = new Lead(req.body);
//     await newLead.save();

//     await sendAlertEmail(
//       "New Lead Added",
//       `A new lead (${newLead.name}) was added to the system.`
//     );

//     res.status(201).send(newLead);
//   } catch (error) {
//     res.status(500).send("Error creating lead");
//   }
// });

module.exports = router;
