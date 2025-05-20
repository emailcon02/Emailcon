import React, { useEffect, useState } from "react";
import axios from "axios";
import "./AdminDashboard.css";
import { FaSignOutAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import apiconfig from "../../apiconfig/apiConfig.js";

function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [statusLoadingId, setStatusLoadingId] = useState(null);
  const [sendLoadingId, setSendLoadingId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const adminToken = localStorage.getItem("adminToken");
    if (!adminToken) {
      navigate("/admin-login");
    } else {
      const fetchUsers = async () => {
        const response = await axios.get(
          `${apiconfig.baseURL}/api/admin/users`
        );
        setUsers(response.data);
      };
      fetchUsers();
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    navigate("/user-login");
  };
  const handlecreateuser = () => {  
    navigate("/admin-user-create");
  };

  const handleenroll = () => {
    navigate("/user-enroll");
  };
  const handleallpayment = () => {  
    navigate("/all-user-payment-history");
  };

  const handlepaymentview = (userId) => {
    navigate(`/user-payment-history/${userId}`);
  };

  const handleSendCredentials = async (userId) => {
    setSendLoadingId(userId);
    try {
      await axios.post(`${apiconfig.baseURL}/api/admin/send-credentials`, {
        id: userId,
      });
      toast.success(`Login credentials sent successfully!`, {
        autoClose: 3000,
      });
    } catch (error) {
      console.error("Email sending error:", error);
      toast.error(`Failed to send login credentials`, {
        autoClose: 3000,
      });
    } finally {
      setSendLoadingId(null);
    }
  };

  const handleStatusChange = async (id, status) => {
    setStatusLoadingId(id);
    try {
      // Step 1: Update user status
      await axios.post(`${apiconfig.baseURL}/api/admin/update-status-manually`, {
        id,
        status
      });
  
      // Step 2: Update frontend state
      toast.success(`Account ${status ? "Activated" : "Deactivated"}`, {
        autoClose: 3000,
      });
  
      setUsers((prev) =>
        prev.map((user) =>
          user._id === id ? { ...user, isActive: status } : user
        )
      );
    } catch (error) {
      toast.error("Error updating status", { autoClose: 3000 });
    } finally {
      setStatusLoadingId(null);
    }
  };
  

  return (
    <div className="admin-dashboard-page">
      <div className="admin-navnew">
        <div>
          <h2 className="admin-dashboard-header">Emailcon Admin Dashboard</h2>
        </div>
        <div className="admin-nav-btn">
        <button onClick={handlecreateuser} className="admin-nav-buttonnew">
            <span className="nav-names">New employee</span>
          </button>
          <button onClick={handleallpayment} className="admin-nav-buttonnew">
            <span className="nav-names">Payment History</span>
          </button>
          <button onClick={handleenroll} className="admin-nav-buttonnew">
            <span className="nav-names">Demo Request</span>
          </button>
          <button onClick={handleLogout} className="admin-nav-buttonnew">
            <span className="admin-nav-icons">
              <FaSignOutAlt />
            </span>{" "}
            <span className="nav-names">Logout</span>
          </button>
        </div>
      </div>

      <h2 className="admin-dashboard-heading">User Signup Details</h2>

      <div className="cam-scroll" style={{ overflowX: "auto" }}>
        <table className="admin-dashboard-table">
          <thead>
            <tr>
              <th>Email</th>
              <th>Username</th>
              <th>Password</th>
              <th>SMTP Passcode</th>
              <th>Status</th>
              <th>Activate / Deactivate</th>
              <th>Send Login Details</th>
              <th>Payment History</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user._id}>
                <td>{user.email}</td>
                <td>{user.username}</td>
                <td>{user.password ? user.password.substring(0, 8) : ""}</td>
                <td>{user.smtppassword ? user.smtppassword.substring(0, 8) : ""}</td>
                <td>{user.isActive ? "Active" : "Inactive"}</td>
                <td>
                  {statusLoadingId === user._id ? (
                    <div className="loader"></div>
                  ) : (
                    <label className="toggle-switch">
                      <input
                        type="checkbox"
                        checked={user.isActive}
                        onChange={() =>
                          handleStatusChange(user._id, !user.isActive)
                        }
                      />
                      <span className="slider"></span>
                    </label>
                  )}
                </td>
              
                <td>
                  <button
                    className="send-btn"
                    onClick={() => handleSendCredentials(user._id)}
                  >
                    {sendLoadingId === user._id ? (
                      <span className="loader-create-remainder"></span>
                    ) : (
                      "Send"
                    )}
                  </button>
                </td>
                <td>
                <button
                      className="payment-view"
                      onClick={() => handlepaymentview(user._id)}
                    >
                      View
                    </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <ToastContainer
        className="custom-toast"
        position="bottom-center"
        autoClose={3000}
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

export default AdminDashboard;
