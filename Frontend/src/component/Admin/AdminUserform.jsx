import React, { useEffect, useState } from "react";
import axios from "axios";
import "./AdminDashboard.css"; // Import the CSS file
import { FaSignOutAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import apiconfig from "../../apiconfig/apiConfig.js";

function AdminUserform() {
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if the adminToken is present in localStorage
    const adminToken = localStorage.getItem("adminToken");
    if (!adminToken) {
      navigate("/admin-login"); // Redirect to login page if no adminToken
    } else {
      const fetchUsers = async () => {
        const response = await axios.get(
          `${apiconfig.baseURL}/api/admin/user-form-data`
        );
        setUsers(response.data);
      };
      fetchUsers();
    }
  }, [navigate]);

  const handleback = () => {
    navigate("/admin-dashboard"); // Redirect to homepage or login page after logout
  };

 
  return (
    <div className="admin-dashboard-page">
      <div className="admin-navnew">
        <h2 className="admin-dashboard-header">Emailcon Admin Dashboard</h2>
        <button onClick={handleback} className="admin-nav-buttonnew">
          <span className="admin-nav-icons">
            <FaSignOutAlt />
          </span>{" "}
          <span className="nav-names">Back</span>
        </button>
      </div>
      <h2 className="admin-dashboard-heading">User Enrollment Details</h2>
      <div className="cam-scroll" style={{ overflowX: "auto" }}>
        <table className="admin-dashboard-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Gender</th>
              <th>Address</th>
              <th>Profession</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user._id}>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>{user.phone}</td>
                <td>{user.gender}</td>
                <td>{user.address}</td>
                <td>{user.profession}</td>             
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <ToastContainer
        className="custom-toast"
        position="bottom-center"
        autoClose={3000}
        hideProgressBar={true} // Disable progress bar
        closeOnClick={false}
        closeButton={false}
        pauseOnHover={true}
        draggable={true}
        theme="light" // Optional: Choose theme ('light', 'dark', 'colored')
      />
    </div>
  );
}

export default AdminUserform;
