const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.SMTP_EMAIL,     // Your email from .env
    pass: process.env.SMTP_PASSWORD   // Your password or app password
  }
});

exports.sendAppointmentEmail = async (to, subject, body) => {
  const mailOptions = {
    from: process.env.SMTP_EMAIL,
    to,
    subject,
    text: body
  };

  return transporter.sendMail(mailOptions);
};
