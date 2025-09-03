require('dotenv').config(); // Load env vars
const sendEmail = require('./utils/email'); // Update path if needed

async function sendTestMail() {
  try {
    const to = process.env.SMTP_EMAIL; // Send to yourself for testing
    const subject = '📬 Test Email from Appointify';
    const html = `
      <h2>Hello!</h2>
      <p>This is a test email sent at <b>${new Date().toLocaleString()}</b>.</p>
      <p>If you're seeing this, your NodeMailer config works! ✅</p>
    `;

    await sendEmail(to, subject, html);
    console.log(`✅ Test email sent to ${to}`);
  } catch (error) {
    console.error('❌ Failed to send test email:', error);
  }
}

sendTestMail();
