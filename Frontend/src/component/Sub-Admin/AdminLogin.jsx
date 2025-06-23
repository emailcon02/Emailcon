import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./AdminLogin.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import adminimg from "../../Images/signup-img.png";
import axios from "axios";
import apiConfig from "../../apiconfig/apiConfig.js";


function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState("super-admin");
  const [roles, setRoles] = useState([]);
  const navigate = useNavigate();

  const fetchUsers = async () => {
    const res = await axios.get(apiConfig.baseURL + "/api/admin/getadminuser");
    setRoles(res.data.map((user) => user.role));
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${apiConfig.baseURL}/api/auth/admin-login`, {
        email,
        password,
        role,
      });

      if (response.data.success) {
        localStorage.setItem("adminToken", response.data.token);
        localStorage.setItem("adminuserId", response.data.userId);
        if (role === "super-admin") {
          setTimeout(() => {
            navigate("/super-admin-dashboard");
          }, 3000);
        } else if (role === "admin") {
          setTimeout(() => {
            navigate("/sub-admin-dashboard");
          }, 3000);
        } else if (role === "business-admin") {
          setTimeout(() => {
            navigate("/business-admin-dashboard");
          }, 3000);
        } else {
          navigate("/sub-admin-dashboard");
        }
        toast.success("Login successful!");
      } else {
        toast.error("Invalid admin credentials");
      }
    } catch (error) {
      console.error("Login error:", error);
      if (error.response) {
        const errorMessage = error.response.data.message || "Invalid credentials";
        if (error.response.status === 403 && errorMessage === "Account not activated") {
          toast.error("Your account is not activated.");
        } else {
          toast.error(errorMessage);
        }
      } else if (error.request) {
        toast.error("Network error. Please check your connection.");
      } else {
        toast.error("An error occurred. Please try again.");
      }
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
            <div style={{ display: "flex", justifyContent: "center" }}>
              <span>
                <img src={logo} alt="imagesignnav" className="logo_img_sign" />{" "}
              </span>
              <span
                style={{
                  marginTop: "5px",
                  fontWeight: "600",
                  fontSize: "26px",
                }}
              >
                Adm<span style={{ color: "#f48c06" }}>in</span>
                Log<span style={{ color: "#f48c06" }}>in</span>
              </span>
            </div>
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
            <div className="input-container password-container">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="admin-login-input"
              />
              <span
                className="toggle-password"
                onClick={() => setShowPassword(!showPassword)}
              >
                <i
                  className={`fas ${showPassword ? "fa-eye-slash" : "fa-eye"}`}
                ></i>
              </span>
            </div>

            <div className="lab">
              <label>Role</label>
            </div>
            <div className="input-container">
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="admin-login-input"
                required
              >
                <option value="super-admin">Super-Admin</option>
                {[...new Set(roles)].map((r) => (
                  <option key={r} value={r}>
                    {r}
                  </option>
                ))}
              </select>
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
