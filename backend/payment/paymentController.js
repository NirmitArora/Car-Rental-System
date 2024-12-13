const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const razorpay = require('./razorpayService'); // Import Razorpay instance

// Path to store orders data
const ordersFilePath = path.join(__dirname, '../data/orders.json');

// Helper functions to read and write orders data
const readOrders = () => {
    if (fs.existsSync(ordersFilePath)) {
        const data = fs.readFileSync(ordersFilePath, 'utf-8');
        return JSON.parse(data);
    }
    return [];
};

const writeOrders = (orders) => {
    fs.writeFileSync(ordersFilePath, JSON.stringify(orders, null, 2), 'utf-8');
};

// Create a Razorpay Order
const createOrder = async (req, res) => {
    try {
        const { amount } = req.body; // Amount in INR (e.g., ₹500 = 500)

        const options = {
            amount: amount * 100, // Convert amount to paise
            currency: "INR",
            receipt: `receipt_${Date.now()}`, // Unique receipt ID
        };

        // Generate order using Razorpay API
        const order = await razorpay.orders.create(options);

        // Store the order in the JSON file
        const orders = readOrders();
        orders.push({
            orderId: order.id,
            amount: order.amount,
            currency: order.currency,
            receipt: order.receipt,
            status: "created", // Initial status
        });
        writeOrders(orders);

        // Send order details to the client
        res.status(201).json({
            success: true,
            orderId: order.id,
            amount: order.amount,
            currency: order.currency,
        });
    } catch (error) {
        console.error("Error creating Razorpay order:", error);
        res.status(500).json({ success: false, message: "Failed to create order" });
    }
};

// Verify Payment Signature
const verifyPayment = (req, res) => {
    try {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

        const secret = 'yVPcIT6AYUx9hEHjUCXNlNjW'; 

        // Generate expected signature
        const generatedSignature = crypto
            .createHmac('sha256', secret)
            .update(`${razorpay_order_id}|${razorpay_payment_id}`)
            .digest('hex');

        if (generatedSignature === razorpay_signature) {
            // Update the order status in the JSON file
            const orders = readOrders();
            const order = orders.find(o => o.orderId === razorpay_order_id);
            if (order) {
                order.status = "paid";
                order.paymentId = razorpay_payment_id;
                writeOrders(orders);
            }

            res.status(200).json({ success: true, message: "Payment verified successfully" });
        } else {
            res.status(400).json({ success: false, message: "Payment verification failed" });
        }
    } catch (error) {
        console.error("Error verifying payment:", error);
        res.status(500).json({ success: false, message: "Error verifying payment" });
    }
};

module.exports = { createOrder, verifyPayment };
