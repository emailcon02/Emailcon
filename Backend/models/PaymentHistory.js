import mongoose from "mongoose";

const paymentHistorySchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    paymentStatus: {
        type: String,
        enum: ["pending", "paid", "failed","expired","trial"],
        default: "pending"
    },
    expiryDate: { type: Date },
    duration: { type: String },
    amount: { type: Number },
    invoiceUrl: { type: String, default: null },


    // Razorpay fields
    razorpayPaymentId: { type: String, default: null },
    razorpayOrderId: { type: String, default: null },
    razorpaySignature: { type: String, default: null },
}, {
    timestamps: true
});

const PaymentHistory = mongoose.model("PaymentHistory", paymentHistorySchema);
export default PaymentHistory;
