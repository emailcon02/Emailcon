import React, { useState, useEffect } from "react";
import "./Verifyotp.css";
import pingenerate from "../Images/pingenerators.png";
import { useLocation, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import apiConfig from '../apiconfig/apiConfig.js';


const Verifyotp = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { email, otp } = location.state || {};
  const [verifyOtpLoading, setVerifyOtpLoading] = useState(false);
  const [resendOtpLoading, setResendOtpLoading] = useState(false);

  const [enteredOtp, setEnteredOtp] = useState(["", "", "", "", "", ""]);

  const [resendTimer, setResendTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);

  // Timer countdown
  useEffect(() => {
    if (resendTimer > 0) {
      const timerInterval = setInterval(() => {
        setResendTimer(prev => prev - 1);
      }, 1000);
      return () => clearInterval(timerInterval);
    } else {
      setCanResend(true);
    }
  }, [resendTimer]);

  // OTP input change
  const handleChange = (index, value) => {
    if (/^[0-9]?$/.test(value)) {
      const updatedOtp = [...enteredOtp];
      updatedOtp[index] = value;
      setEnteredOtp(updatedOtp);
      if (value && index < 5) {
        const nextInput = document.getElementById(`otp-${index + 1}`);
        if (nextInput) nextInput.focus();
      }
    }
  };

  // OTP verification
  const handleVerifyOtp = () => {
    const finalOtp = enteredOtp.join("");
    setVerifyOtpLoading(true);
    setTimeout(() => {
      if (finalOtp === otp) {
        toast.success("OTP Verified. Reset your password.");
        setTimeout(() => {
          navigate("/resetpassword", { state: { email } });
        }, 2000);
      } else {
        toast.error("Invalid OTP");
      }
      setVerifyOtpLoading(false);
    }, 1000);
  };
  const handlePaste = (e) => {
    e.preventDefault();
    const pasteData = e.clipboardData.getData("Text").trim();
    if (/^\d{6}$/.test(pasteData)) {
      const digits = pasteData.split("");
      setEnteredOtp(digits);
      // Optionally, focus the last input
      const lastInput = document.getElementById(`otp-5`);
      if (lastInput) lastInput.focus();
    } else {
      toast.error("Please paste a valid 6-digit OTP.");
    }
  };
  

  // Resend OTP click handler
  const handleResendOtp = async () => {
    if (!canResend) return;
    setResendOtpLoading(true);
  
    try {
      const res = await axios.post(`${apiConfig.baseURL}/api/auth/send-otp`, {
        email: email,
      });
  
      toast.success("OTP has been resent.");
      setEnteredOtp(["", "", "", "", "", ""]);
      setResendTimer(60);
      setCanResend(false);
    } catch (error) {
      toast.error("Failed to resend OTP. Please try again.");
      console.error("Resend OTP error:", error);
    }
    finally{
      setResendOtpLoading(false);
    }
  };
  
  return (
    <div className="pin-container">
      <div className="pin-left">
        <img src={pingenerate} alt="Pin visual" />
        <h2 className="verify-head">
          Verification <span style={{ color: "#f48c06" }}>Code</span>
        </h2>
        <p className="verify-para">
          A PIN Generator spits out random digits to lock down your info like a pro.
        </p>
      </div>

      <div className="pin-right">
        <h2>
          OTP <span style={{ color: "#f48c06" }}>Verification</span>
        </h2>
        <p className="Pin-para">Kindly enter the PIN sent to your registered email.</p>
        <div className="pin-inputs">
          {enteredOtp.map((digit, index) => (
           <input
           key={index}
           id={`otp-${index}`}
           type="text"
           maxLength="1"
           value={digit}
           onChange={(e) => handleChange(index, e.target.value)}
           onKeyDown={(e) => {
             if (e.key === "Backspace" && !digit && index > 0) {
               const prevInput = document.getElementById(`otp-${index - 1}`);
               if (prevInput) prevInput.focus();
             }
           }}
           onPaste={index === 0 ? handlePaste : undefined}
         />
         
          ))}
        </div>

        <button className="pin-button" onClick={handleVerifyOtp} disabled={verifyOtpLoading}>
          {verifyOtpLoading ? <span className="loader-login small"></span> : "Verify OTP"}
        </button>

        <div style={{ marginTop: "10px", textAlign: "center" }}>
          {canResend ? (
            <button onClick={handleResendOtp} className="resend-button" disabled={resendOtpLoading}>
          {resendOtpLoading ? <span className="loader-login small"></span> : "Resend OTP"}
          </button>
          ) : (
            <span style={{ color: "#888" }}>
              Resend available in {resendTimer}s
            </span>
          )}
        </div>
      </div>

      <ToastContainer
        className="custom-toast"
        position="bottom-center"
        autoClose={2000}
        hideProgressBar
        closeOnClick={false}
        closeButton={false}
        pauseOnHover
        draggable
        theme="light"
      />
    </div>
  );
};

export default Verifyotp;
