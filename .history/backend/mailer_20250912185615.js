const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: process.env.MAIL_HOST, // correspond à MAIL_HOST
  port: process.env.MAIL_PORT, // correspond à MAIL_PORT
  secure: false, // true si port 465, false sinon
  auth: {
    user: process.env.MAIL_USER, // correspond à MAIL_USER
    pass: process.env.MAIL_PASS, // correspond à MAIL_PASS
  },
});

async function sendMail({ subject, html, to = process.env.MAIL_USER }) {
  return transporter.sendMail({
    from: `"UPC 2025" <${process.env.MAIL_USER}>`,
    to,
    subject,
    html,
  });
}

module.exports = { sendMail };
