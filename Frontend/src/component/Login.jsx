import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Login.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import apiConfig from "../apiconfig/apiConfig.js";
import logimg from "../Images/mail.png";
import { FaEye, FaEyeSlash,FaArrowLeft } from "react-icons/fa";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const [showForgotModal, setShowForgotModal] = useState(false);
  const [showResetModal, setShowResetModal] = useState(false);

  const [forgotEmail, setForgotEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [enteredOtp, setEnteredOtp] = useState("");

  const [sendOtpLoading, setSendOtpLoading] = useState(false);
  const [verifyOtpLoading, setVerifyOtpLoading] = useState(false);

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [resendTimer, setResendTimer] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) navigate("/home");
  }, [navigate]);

  useEffect(() => {
    let timer;
    if (resendTimer > 0) {
      timer = setInterval(() => {
        setResendTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [resendTimer]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const res = await axios.post(`${apiConfig.baseURL}/api/auth/login`, { email, password });
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      navigate("/home");
    } catch (error) {
      toast.error(error.response?.data || "Error logging in");
    } finally {
      setIsLoading(false);
    }
  };
  const handleforgetPassword = () => {
    navigate("/forgetpassword");
  }

  const handleSendOtp = async () => {
    if (!forgotEmail) return toast.error("Enter your registered email.");
    setSendOtpLoading(true);
    try {
      const res = await axios.post(`${apiConfig.baseURL}/api/auth/send-otp`, { email: forgotEmail });
      toast.success("OTP sent to your email.");
      setOtp(res.data.otp);
    } catch (error) {
      toast.error(error.response?.data || "Error sending OTP");
    } finally {
      setSendOtpLoading(false);
    }
  };

  const handleVerifyOtp = () => {
    setVerifyOtpLoading(true);
    setTimeout(() => {
      if (enteredOtp === otp) {
        toast.success("OTP Verified. Reset your password.");
        setShowForgotModal(false);
        setShowResetModal(true);
      } else {
        toast.error("Invalid OTP");
      }
      setVerifyOtpLoading(false);
    }, 1000);
  };
  const handleBackHome = () =>{
    navigate("/")
  }

  const handleResetPassword = async () => {
    if (!newPassword || !confirmPassword) {
      toast.error("Fill all fields.");
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }
    try {
      await axios.post(`${apiConfig.baseURL}/api/auth/reset-password`,{
        email: forgotEmail,
        password: newPassword,
      });
      toast.success("Password updated. Please login.");
      setShowResetModal(false);
    } catch (error) {
      toast.error(error.response?.data || "Failed to reset password");
    }
  };

  return (
    <div className="login-page">
      <div className="login-cover">
        <div className="login-aside">
          <img src={logimg} alt="Mail" className="login-image" />
          <h2 style={{ fontWeight: "550", color: "#2f327d" }}>
            Welcome <span style={{ color: "#f48c06" }}>Back...!</span>
          </h2>
          <p style={{ fontSize: "16px", lineHeight: "1.7", textAlign: "center", padding: "0px 50px", color: "black" }}>
            Here You go To Next Step, Your Login Here...!
          </p>
        </div>

        <div className="login-container">
           <button onClick={handleBackHome} className="login-nav-btn">
                              <span className="admin-nav-icons">
                                <FaArrowLeft />
                              </span>
                      <span className="nav-names">Home</span>
            </button>
          <h2 className="login-header" style={{ color: "#2f327d" }}>
          <span> Email<span style={{ color: "#f48c06" }}>con</span></span>
          <span style={{marginLeft:"5px"}}>Log<span style={{ color: "#f48c06" }}>in</span></span>  
              </h2>
          <form onSubmit={handleSubmit}>
            <div className="labels">
              <label>Email</label>
            </div>
            <div className="input-container-login">
              <input
                type="email"
                value={email}
                placeholder="Enter Your Registered Mail ID"
                onChange={(e) => setEmail(e.target.value)}
                required
                className="login-input"
              />
            </div>
            <div className="labels">
              <label>Password</label>
            </div>
            <div className="input-container-login">
              <input
                type="password"
                value={password}
                placeholder="Enter Your User Password"
                onChange={(e) => setPassword(e.target.value)}
                required
                className="login-input"
              />
            </div>

            <div className="forgot-password-container">
              <button type="button" className="forgot-password-button" onClick={handleforgetPassword}>
                Forgot Password?
              </button>
            </div>

            <div className="log-btn">
              <button type="submit" className="login-button login-submit" disabled={isLoading}>
                {isLoading ? <span className="loader-login"></span> : "Login"}
              </button>
            </div>

            <div className="log-sign">
              <button onClick={() => navigate("/signup")} className="logins-button">
                Don't have an account? <span style={{ color: "#2f327d" }}>Signup</span>
              </button>
            </div>

            <div className="log-sign">
              <button onClick={() => navigate("/admin-login")} className="login-button login-submit">
                Way to Admin Login
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Forgot Password Modal */}
      {showForgotModal && (
        <div className="login-modal-overlay">
          <div className="login-modal-container">
            <h3>Forgot Password</h3>
            <input
              type="email"
              placeholder="Enter your registered email"
              value={forgotEmail}
              onChange={(e) => setForgotEmail(e.target.value)}
              className="login-modal-input"
            />
            <button className="login-modal-btn" onClick={handleSendOtp} disabled={sendOtpLoading || resendTimer > 0}>
              {sendOtpLoading ? (
                <span className="loader-login small"></span>
              ) : resendTimer > 0 ? (
                `Resend OTP in ${resendTimer}s`
              ) : (
                "Send OTP"
              )}
            </button>

            <input
              type="text"
              placeholder="Enter OTP"
              value={enteredOtp}
              onChange={(e) => setEnteredOtp(e.target.value)}
              className="login-modal-input"
            />
            <button className="login-modal-btn" onClick={handleVerifyOtp} disabled={verifyOtpLoading}>
              {verifyOtpLoading ? <span className="loader-login small"></span> : "Verify OTP"}
            </button>
            <span className="login-modal-close-icon" onClick={() => setShowForgotModal(false)}>
              &times;
            </span>
          </div>
        </div>
      )}

      {/* Reset Password Modal */}
      {showResetModal && (
        <div className="login-modal-overlay">
          <div className="login-modal-container">
            <h3>Reset Password</h3>

            <div className="password-toggle-container">
              <input
                type={showNewPassword ? "text" : "password"}
                placeholder="New Password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="login-modal-input"
              />
              <span
                className="eye-icon"
                onClick={() => setShowNewPassword((prev) => !prev)}
              >
                {showNewPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>

            <div className="password-toggle-container">
              <input
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirm New Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="login-modal-input"
              />
              <span
                className="eye-icon"
                onClick={() => setShowConfirmPassword((prev) => !prev)}
              >
                {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>

            <button className="login-modal-btn" onClick={handleResetPassword}>
              Save New Password
            </button>
            <span className="login-modal-close-icon" onClick={() => setShowResetModal(false)}>
              &times;
            </span>
          </div>
        </div>
      )}

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

export default Login;
