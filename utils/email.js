const nodemailer = require('nodemailer');
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.SMTP_EMAIL, // e.g., your Gmail
    pass: process.env.SMTP_PASSWORD  // use app password
  }
});

async function sendEmail(to, subject, html) {
  const mailOptions = {
    from: `"Appointify" <${process.env.SMTP_EMAIL}>`,
    to,
    subject,
    html
  };

  await transporter.sendMail(mailOptions);
}

module.exports = sendEmail;
