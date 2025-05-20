import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./PaymentPage.css";
import apiconfig from "../apiconfig/apiConfig";
import payment from "../Images/Payment.svg";


const DURATION_OPTIONS = [
  { label: "10 Minutes", value: 10 / (24 * 60), amount: 1 },
  { label: "1 Hour", value: 1 / 24, amount: 5 },
  { label: "1 Day", value: 1, amount: 10 },
  { label: "5 Days", value: 5, amount: 30 },
  { label: "1 Week", value: 7, amount: 50 },
  { label: "1 Month", value: 30, amount: 100 },
];

function PaymentPage() {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [duration, setDuration] = useState(DURATION_OPTIONS[0].value);
  const [amount, setAmount] = useState(DURATION_OPTIONS[0].amount);
  const [paymentCompleted, setPaymentCompleted] = useState(false);


  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get(`${apiconfig.baseURL}/api/admin/user/${userId}`);
        setUser(response.data);
      } catch (error) {
        toast.error("Failed to fetch user details.");
        navigate("/signup");
      }
    };
    fetchUser();
  }, [userId, navigate]);

  const handleDurationChange = (e) => {
    const selected = DURATION_OPTIONS.find(opt => String(opt.value) === e.target.value);
    if (selected) {
      setDuration(selected.value);
      setAmount(selected.amount);
    }
  };

  const handlePayment = async () => {
    if (!user) return;
  
    const expiryDate = new Date();
    expiryDate.setTime(expiryDate.getTime() + duration * 24 * 60 * 60 * 1000);
  
    try {
      const shortId = user._id.slice(-6);
      const receipt = `rcpt_${shortId}_${Date.now()}`.slice(0, 40);
  
      const orderRes = await axios.post(`${apiconfig.baseURL}/api/create-order`, {
        amount: amount * 100, // Razorpay expects amount in paise
        currency: "INR",
        receipt,
      });
  
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: orderRes.data.amount,
        currency: "INR",
        name: "Emailcon",
        description: "Account Activation",
        image: "/logo192.png",
        order_id: orderRes.data.id,
        handler: async function (response) {
          // ✅ Successful payment: update and activate account
          await axios.post(`${apiconfig.baseURL}/api/admin/update-status`, {
            id: user._id,
            status: true,
            paymentStatus: "paid",
            expiryDate: expiryDate.toISOString(),
            duration,
            amount,
            razorpayPaymentId: response.razorpay_payment_id,
            razorpayOrderId: response.razorpay_order_id,
            razorpaySignature: response.razorpay_signature,
          });
 
          // toast.success("Payment successful!");
          setPaymentCompleted(true);
          setProcessing(true);
          setTimeout(() => navigate("/user-login"), 3000);
        },
        prefill: {
          name: user.username,
          email: user.email || "test@example.com",
          contact: user.phone || "9999999999",
        },
        notes: {
          userId: user._id,
          planDuration: `${duration} days`,
        },
        theme: {
          color: "#f48c06",
        },
      };
  
      const razorpay = new window.Razorpay(options);
      razorpay.open();
  
      razorpay.on("payment.failed", async function (response) {
        await axios.post(`${apiconfig.baseURL}/api/admin/update-status`, {
          id: user._id,
          status: false,
          paymentStatus: "failed",
          expiryDate: expiryDate.toISOString(),
          duration,
          amount,
          razorpayPaymentId: response.error?.metadata?.payment_id || "",
          razorpayOrderId: response.error?.metadata?.order_id || "",
        });
  
        toast.error("Payment failed. Please try again.");
        setProcessing(false);
      });
  
    } catch (error) {
      setProcessing(false);
      toast.error("Something went wrong.");
    } 
  }; 

  const handleCancel = () => navigate(-1);
  
  if (paymentCompleted) {
    return (
      <div className="redirect-screen">
        <div className="redirect-card">
          <div className="success-icon">✔</div>
          <h2>Payment Successful</h2>
          <p>You will be redirected to the login page shortly...</p>
          <div className="loader-payment"></div>
        </div>
      </div>
    );
  }
  
  return (
    
    <div className="advanced-card">
      <div className="card-image">
        <img src={payment} className="pay-img" alt="Payment Illustration" />
      </div>
      <div className="card-content">
        <h2>
          Emailcon <span style={{ color: "#f48c06" }}>Payment</span>
        </h2>
        <p>
          Proceed with payment for <strong>{user?.username}</strong>
        </p>

        <div className="form-group">
          <label>Select Emailcon Plan</label>
          <select value={String(duration)} onChange={handleDurationChange}>
            {DURATION_OPTIONS.map((opt) => (
              <option key={opt.value} value={String(opt.value)}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        <div className="amount-display">
          Amount to Pay: <span>₹{amount}</span>
        </div>
        <div className="payment-summary-box">
  <h3 className="payment-summary-title">Payment Summary</h3>
  <ul className="payment-summary-list">
    <li><strong>User:</strong> {user?.username}</li>
    <li><strong>Duration:</strong> {DURATION_OPTIONS.find(d => d.value === duration)?.label}</li>
    <li><strong>Amount:</strong> ₹{amount}</li>
    <li><strong>Account Expiry:</strong> {new Date(Date.now() + duration * 86400000).toDateString()}</li>
  </ul>
</div>


        <div className="button-group">
          <button
            onClick={handlePayment}
            disabled={processing}
            className="btn confirm"
          >
            {processing ? "Processing..." : "Pay Now"}
          </button>
          <button onClick={handleCancel} className="btn cancel">
            Cancel
          </button>
        </div>
        
      </div>
      <ToastContainer
        position="bottom-center"
        autoClose={2000}
        hideProgressBar
      />
    </div>
  );
}

export default PaymentPage;
