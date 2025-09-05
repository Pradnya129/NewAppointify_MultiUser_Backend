const cron = require('node-cron');
const moment = require('moment-timezone');
const sendEmail = require('../utils/email.js');
const Appointment = require('../models/admin/CustomerAppointmentsModel.js');
require('dotenv').config();

// Run every 5 minutes
cron.schedule('* * * * *', async () => {
    // console.log('🕒 Cron triggered at', new Date().toLocaleString());
  const nowIST = moment().tz('Asia/Kolkata');
//   console.log(nowIST);
  const todayDate = nowIST.format('YYYY-MM-DD');
// console.log(todayDate);
  try {
    // Get today's appointments
    const appointments = await Appointment.findAll({
      where: { appointmentDate: todayDate },
    });

    for (const appointment of appointments) {
      // Parse appointment time from stored string
      const [startTime] = appointment.appointmentTime.split(' - ');
      const apptDateTimeIST = moment.tz(`${appointment.appointmentDate} ${startTime}`, 'YYYY-MM-DD hh:mm A', 'Asia/Kolkata');

      const diffInMinutes = apptDateTimeIST.diff(nowIST, 'minutes');

      // Send reminders if appointment is within next 30 mins, every 5 mins
      if (diffInMinutes >= 0 && diffInMinutes <= 10) {
        const htmlContent = `
          <h3>Hi ${appointment.firstName} ${appointment.lastName},</h3>
          <p>This is a reminder that you have an appointment scheduled at <strong>${apptDateTimeIST.format('hh:mm A')}</strong> today.</p>
          <p>Thank you for using Appointify.</p>
        `;

        await sendEmail("pradnyamandekar129@gmail.com", '⏰ Appointment Reminder - Appointify', htmlContent);
        console.log(`✅ Email sent to ${appointment.email} for appointment at ${apptDateTimeIST.format('hh:mm A')}`);
      }
    }
  } catch (error) {
    console.error('❌ Error sending reminders:', error);
  }
});
