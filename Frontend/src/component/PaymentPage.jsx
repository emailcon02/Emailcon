import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import apiconfig from "../apiconfig/apiConfig";

const DURATION_OPTIONS = [
  { label: "10 Minutes", value: 10 / (24 * 60), amount: 1 },
  { label: "1 Hour", value: 1 / 24, amount: 5 },
  { label: "1 Day", value: 1, amount: 10 },
  { label: "10 Days", value: 10, amount: 50 },
  { label: "1 Week", value: 7, amount: 30 },
  { label: "1 Month", value: 30, amount: 100 },
];

function PaymentPage() {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [duration, setDuration] = useState(DURATION_OPTIONS[0].value);
  const [amount, setAmount] = useState(DURATION_OPTIONS[0].amount);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get(
          `${apiconfig.baseURL}/api/admin/user/${userId}`
        );
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
    setProcessing(true);
  
    const expiryDate = new Date();
    const durationInMs = duration * 24 * 60 * 60 * 1000;
    expiryDate.setTime(expiryDate.getTime() + durationInMs);
  
    try {
      await axios.post(`${apiconfig.baseURL}/api/admin/update-status`, {
        id: user._id,
        status: true,
        paymentStatus: "paid",
        expiryDate: expiryDate.toISOString(),
        duration,
        amount,
      });
  
      toast.success("Payment successful! Activation email sent.");
      setTimeout(() => navigate("/user-login"), 3000);
    } catch (error) {
      toast.error("Payment failed. Try again.");
    } finally {
      setProcessing(false);
    }
  };  
  const handleCancel = () => navigate("/signup");

  return (
    <div className="payment-page" style={{ padding: "40px", textAlign: "center" }}>
      <h2>Confirm Payment for <span style={{ color: "#007bff" }}>{user?.username}</span></h2>
      <p>Select duration and confirm payment to activate access.</p>

      <div style={{ marginTop: "20px" }}>
        <label>Duration: </label>
        <select value={String(duration)} onChange={handleDurationChange} style={{ padding: "5px", marginLeft: "10px" ,width: "150px", borderRadius: "5px"}}>
          {DURATION_OPTIONS.map((opt) => (
            <option key={opt.value} value={String(opt.value)}>{opt.label}</option>
          ))}
        </select>
        <p style={{ marginTop: "10px" }}>Amount: ₹{amount}</p>
      </div>

      <div style={{ marginTop: "30px" }}>
        <button
          onClick={handlePayment}
          disabled={processing}
          style={{
            padding: "10px 20px",
            backgroundColor: "#28a745",
            color: "#fff",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
            fontWeight: "bold"
          }}
        >
          {processing ? "Processing..." : "Mark as Paid"}
        </button>

        <button
          onClick={handleCancel}
          style={{
            marginLeft: "15px",
            padding: "10px 20px",
            backgroundColor: "#dc3545",
            color: "#fff",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
            fontWeight: "bold"
          }}
        >
          Cancel
        </button>
      </div>

   <ToastContainer
        className="custom-toast"
        position="bottom-center"
        autoClose={2000}
        hideProgressBar={true}
        closeOnClick={false}
        closeButton={false}
        pauseOnHover={true}
        draggable={true}
        theme="light"
      />
  </div>
  );
}

export default PaymentPage;
