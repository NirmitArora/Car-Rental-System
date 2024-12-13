// razorpayService.js
const Razorpay = require('razorpay');

// Initialize Razorpay instance
const razorpay = new Razorpay({
    key_id: 'rzp_test_iiWd5oMIjo6kcY', // Key ID
    key_secret: 'yVPcIT6AYUx9hEHjUCXNlNjW', // Key Secret
});

module.exports = razorpay;