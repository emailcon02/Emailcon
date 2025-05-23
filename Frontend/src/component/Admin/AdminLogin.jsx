import React, { useState,useEffect } from "react";
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
  const [role, setRole] = useState("super-admin"); 
  const [roles, setRoles] = useState([]);

  const navigate = useNavigate();
   const fetchUsers = async () => {
      const res = await axios.get(apiConfig.baseURL + '/api/admin/getadminuser');
      setRoles(res.data.map(user => user.role));
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
        if (role === "super-admin") {
          navigate("/super-admin-dashboard");
        } else if(role === "admin") {
          navigate("/admin-user-create");
        }else if(role === "business-admin") {
          navigate("/admin-dashboard");
        }else {
          navigate("/user-dashboard");
        }
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
            <span>
              Email<span style={{ color: "#f48c06" }}>con </span> Admin
              <span style={{ color: "#f48c06" }}> Login</span>
            </span>
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

            {/* ✅ Role Select Dropdown */}
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
