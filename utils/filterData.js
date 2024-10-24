const Lead = require("../models/Lead");

async function saveLeads(apiLeads, service) {
  let arr = [];
  for (const apiLead of data.data) {
    const existingLead = await Lead.findOne({ email: apiLead.email });
    if (existingLead) {
      existingLead.status = apiLead.status;
      await existingLead.save();
      arr.push(apiLead.email);
      // console.log(`Lead with email ${apiLead.email} already exists.`);
    } else {
      const newLead = new Lead({
        owner_name: apiLead.owner_name,
        company_name: apiLead.company_name,
        prefix: apiLead.prefix,
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
        crm_service: service
        // ... other fields ...
      });
      await newLead.save();
      console.log(`New lead saved with email ${apiLead.email}.`);
    }
  }
  // if (existingEmails.length > 0) {
  //   const text = `<p>List of Emails already present:<p><ul>${existingEmails
  //     .map((email) => `<li>${email}</li>`)
  //     .join("")}</ul>`;
  //   sendAlertEmail("Same Lead Generated for these Emails", text);
  // }
}

module.exports = saveLeads;
