import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./AdminLogin.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import adminimg from "../../Images/signup-img.png";
import axios from "axios"; // ✅ add axios for API call
import apiConfig from "../../apiconfig/apiConfig.js"; // ✅ import apiConfig

function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${apiConfig.baseURL}/api/auth/admin-login`, {
        email,
        password,
      });

      if (response.data.success) {
        // Save token in localStorage
        localStorage.setItem("adminToken", response.data.token);
        navigate("/admin-dashboard");
      } else {
        toast.error("Invalid admin credentials");
      }
    } catch (error) {
      console.error(error);
      toast.error(
        error.response?.data?.message || "Something went wrong. Try again."
      );
    }
  };

  return (
    <div className="admin-login-page">
      <div className="admin-cover">
        <div className="admin-aside">
          <img
            src={adminimg}
            alt="Sample Excel Format"
            className="signup-image"
          />
          <h2 style={{ fontWeight: "550", color: "#2f327d" }}>
            Admin <span style={{ color: "#f48c06" }}> Access</span>
          </h2>
          <p
            style={{
              fontSize: "16px",
              lineHeight: "1.7",
              textAlign: "center",
              padding: "0px 50px",
              color: "black",
            }}
          >
            View The Overall Access Content Here...
          </p>
        </div>
        <div className="admin-login-container">
          <h2
            className="admin-login-header"
            style={{ fontWeight: "550", color: "#2f327d" }}
          >
            <span> Email<span style={{ color: "#f48c06" }}>con </span> <span>Admin<span style={{ color: "#f48c06" }}> Login</span></span></span>            
          </h2>
          <form onSubmit={handleSubmit}>
            <div className="lab">
              <label>Email</label>
            </div>
            <div className="input-container">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="admin-login-input"
              />
            </div>
            <div className="lab">
              <label>Password</label>
            </div>
            <div className="input-container">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="admin-login-input"
              />
            </div>
            <div className="Admin-submit">
              <button type="submit" className="admin-login-button">
                Login
              </button>
            </div>
          </form>
        </div>
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

export default AdminLogin;
