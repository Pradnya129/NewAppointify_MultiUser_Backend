const { Admin, SubscriptionRenewal, NotificationPreference } = require('../models');
const sendAppointmentEmail = require('../utils/email.js');
const cron = require('node-cron');

async function runRenewalReminderJob() {
  try {
    const today = new Date();
// console.log(today);
    const subscriptions = await SubscriptionRenewal.findAll({
      include: [
        {
          model: Admin,
          attributes: ['firstName', 'lastName', 'email'],
          as: 'admin'
        },
        {
          model: NotificationPreference,
          attributes: ['daysBefore30', 'daysBefore15', 'daysBefore7', 'overdue'],
          as: 'notificationPref'
        },
      ],
    });

    for (const subscription of subscriptions) {
      const renewalDate = new Date(subscription.endDate);
      const diffInDays = Math.ceil((renewalDate - today) / (1000 * 60 * 60 * 24));

      const admin = subscription.admin;
      const preference = subscription.notificationPref;

      if (!admin || !preference) continue;

      let shouldSend = false; // Temporarily true for testing

      // These conditions still apply — it won't send unless date matches
      if (preference.daysBefore30 && diffInDays === 30) shouldSend = true;
      else if (preference.daysBefore15 && diffInDays === 15) shouldSend = true;
      else if (preference.daysBefore7 && diffInDays === 7) shouldSend = true;
      else if (preference.overdue && diffInDays < 0) shouldSend = true;

      if (shouldSend) {
        const subject = '⏰ Renewal Reminder';
        const body = `
Hello ${admin.firstName} ${admin.lastName},

This is a reminder that your subscription will end on: ${renewalDate.toDateString()}.

Please take the necessary action to renew your plan and avoid service interruption.

Regards,  
Renewal Management System
        `;
        await sendAppointmentEmail(admin.email, subject, body);
        console.log(`✅ Email sent to ${admin.email}`);
      }
    }
  } catch (error) {
    console.error('❌ Error running renewal reminder cron:', error);
  }
}

// ✅ Schedule to run every minute for testing
cron.schedule('0 8 * * *', runRenewalReminderJob);

// ✅ Manually run once now for immediate test
runRenewalReminderJob();

module.exports = runRenewalReminderJob;


// const cron = require('node-cron');
// const nodemailer = require('nodemailer');

// // Setup the transporter
// const transporter = nodemailer.createTransport({
//   service: 'gmail', // or any other SMTP
//   auth: {
//     user: 'pradnyamandekar129@gmail.com',
//     pass: 'qfbx hmtf vwmh igju'
//   }
// });

// // Email options
// const mailOptions = {
//   from: 'pradnyamandekar129@gmail.com',
//   to: 'pradnyamandekar129@gmail.com',
//   subject: 'Test Email from Node.js',
//   text: 'Hello! This is a test email sent using NodeMailer + Cron job.'
// };

// CRON job: runs every minute (for testing)
// (async () => {
//   try {
//     const info = await transporter.sendMail(mailOptions);
//     console.log('✅ Email sent:', info.response);
//   } catch (error) {
//     console.error('❌ Error sending email:', error);
//   }
// })();

