// backend/routes/payment.js
import express from "express";
import Razorpay from "razorpay";
import dotenv from 'dotenv';
dotenv.config();

const router = express.Router();

const razorpay = new Razorpay({
  key_id:process.env.RAZORPAY_KEY_ID,
  key_secret:process.env.RAZORPAY_KEY_SECRET,
});

router.post("/create-order", async (req, res) => {
  const { amount, currency, receipt } = req.body;

  try {
    const options = {
      amount: amount, // amount in paise
      currency: currency || "INR",
      receipt: receipt || `receipt_order_${Date.now()}`,
    };

    const order = await razorpay.orders.create(options);
    res.json(order);
  } catch (err) {
    console.error("Error creating order:", err);
    res.status(500).send("Order creation failed.");
  }
});

export default router;
