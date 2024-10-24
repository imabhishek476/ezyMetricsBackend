# Nodejs FES Template

# Environment vars

This project uses the following environment variables:
As for using this application some required Environment variables data, I have provided in About section of this repository you can use from that:

| Name              | Description                                                               | Default Value                |
| ----------------- | ------------------------------------------------------------------------- | ---------------------------- |
| MONGO_URI         | your mongodb Database url                                                 | "use-your-own"               |
| PORT              | Expose port for server                                                    | 5000                         |
| GMAIL_PASS        | using nodemailer, so you have to generate APP password from GMAIL account | Available in About section   |
| GMAIL_ID          | using nodemailer, so from which email is recepient will receive email     | Available in About section   |
| RECEIVER_GMAIL_ID | using nodemailer, so whom you want to send the alerts emails              | your-email@gmail.com         |
| API_DECK_API_KEY  | I am using apideck.com website as CRM platform and zoho-crm (use api-key) | Available in About section   |
| API_DECK_API_ID   | I am using apideck.com website as CRM platform and zoho-crm (use api-id)  | Available in About section   |

# Getting started

- Clone the repository

```
git clone  https://github.com/imabhishek476/ezyMetricsBackend.git
```

- Install dependencies

```
cd ezyMetricsBackend
npm install
```

- Build and run the project

```
npm run dev
```

- API Document endpoints

| API Name                         | Description                                                                   | Endpoint Value                                |
| -------------------------------- | ----------------------------------------------------------------------------- | --------------------------------------------- |
| Home                             | As you start server, so you will get email if any campaigns data              | http://localhost:5000/api                     |
| New Leads                        | In this endpoint you get all the leads with different CRM sources             | http://localhost:5000/api/generate/leads      |
| New Campaigns according to Leads | In this endpoint you get all the campaigns according to leads store in db     | http://localhost:5000/api/marketing/campaigns |
| Generate PDF                     | In this endpoint you can download the pdf file with all the leads data        | http://localhost:5000/api/report/pdf          |
| Generate CSV                     | In this endpoint you can download the CSV(excel) file with all the leads data | http://localhost:5000/api/report/pdf          |

As if any Errors found then You will receive email during generating leads
