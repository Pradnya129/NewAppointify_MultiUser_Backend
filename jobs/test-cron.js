require('dotenv').config(); // Load env vars
const runRenewalReminderJob = require('./renewalReminderJob');

// Manually trigger the reminder job
(async () => {
  console.log("🚀 Running test for renewal reminder job...");
  await runRenewalReminderJob();
})();
