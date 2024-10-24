const nodemailer = require('nodemailer');
const dotenv = require('dotenv')
dotenv.config()

async function sendAlertEmail(subject, text, file) {
    let transporter = nodemailer.createTransport({
        secure: true,
        host: 'smtp.gmail.com',
        port: 465,
        auth: {
            user: process.env.GMAIL_ID,
            pass: process.env.GMAIL_PASS
        }
    });

    let mailOptions = {
        from: `Hey Ezy 👻 <${process.env.GMAIL_ID}>`,
        to: process.env.RECEIVER_GMAIL_ID,
        subject: subject,
        html: text,
        attachmets: file && [
            {
                filename: 'report.pdf',
                content: file,
                contentType: 'application/pdf'
                
            }
        ]
    };

    await transporter.sendMail(mailOptions);
    console.log('Alert email sent');
}

module.exports = sendAlertEmail;
