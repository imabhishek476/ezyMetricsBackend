const Lead = require("../models/Lead");
const Campaign = require("../models/Campaign");
const sendAlertEmail = require("../utils/sendEmail");

async function processData() {
  const campaigns = await Campaign.find();
  campaigns.forEach((campaign) => {
    if (campaign.leadsGenerated < 100) {
      sendAlertEmail(
        "Low Leads Generated",
        `<p>Campaign <strong>${campaign.name}</strong> generated only <strong>${campaign.leadsGenerated}</strong> leads.</p>`
      );
    }
  });
  console.log("Data processed");
}

module.exports = processData;
