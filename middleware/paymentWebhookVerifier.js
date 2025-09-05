// middlewares/paymentWebhookVerifier.js
const crypto = require('crypto');

const verifyRazorpayWebhook = (req, res, next) => {
  const expectedSignature = crypto
    .createHmac('sha256', process.env.RAZORPAY_WEBHOOK_SECRET)
    .update(JSON.stringify(req.body))
    .digest('hex');

  const receivedSignature = req.headers['x-razorpay-signature'];

  if (expectedSignature !== receivedSignature) {
    return res.status(400).json({ message: 'Invalid webhook signature' });
  }

  next();
};

module.exports = verifyRazorpayWebhook;
