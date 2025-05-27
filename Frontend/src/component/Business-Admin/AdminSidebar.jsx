import React, { useState} from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import apiConfig from '../../apiconfig/apiConfig.js';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function AdminSidebar() {
  const location = useLocation();
  const [showModal, setShowModal] = useState(false);
  const [profileClicked, setProfileClicked] = useState(false);
  const navigate = useNavigate();
    const [oldPassword, setOldPassword] = useState('');
const [newPassword, setNewPassword] = useState('');
const [confirmPassword, setConfirmPassword] = useState('');
const [showOldPassword, setShowOldPassword] = useState(false);
const [showNewPassword, setShowNewPassword] = useState(false);
const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const adminuserId = localStorage.getItem("adminuserId");
  const [saveLoading, setSaveLoading] = useState(false);



  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminuserId");
    navigate("/admin-login");
  };

  const handleProfileClick = () => {
    setShowModal(true);
    setProfileClicked(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setProfileClicked(false);
  };
  const handleSavePassword = async () => {
  if (!newPassword || !confirmPassword) {
    toast.warning("Please fill in all fields.");
    return;
  }

  if (newPassword !== confirmPassword) {
    toast.warning("New passwords do not match.");
    return;
  }
  setSaveLoading(true);

  try {
    const res = await axios.put(`${apiConfig.baseURL}/api/auth/update-admin-password`, {
      userId: adminuserId,
      newPassword: newPassword
    });
    toast.success(res.data.message);
    setTimeout(() => {
          setShowModal(false);
    }, 2000); // Close modal after 2 seconds
    setOldPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setSaveLoading(false);
  } catch (err) {
    setSaveLoading(false);
    console.error(err);
    const errorMsg = err.response?.data?.message || "Something went wrong";
    toast.error(errorMsg);
  }
};


  return (
    <>
      <div className="admin-sidebar">
        <Link
          to="/business-admin-dashboard"
          className={`nav-item${location.pathname === "/business-admin-dashboard" ? " active" : ""}`}
        >
          <div className="nav-icon">
            <i className="fas fa-clipboard-list icon-hover"></i>
          </div>
          <div className="nav-label">Demo Request</div>
        </Link>

        <div
          className={`nav-item${showModal ? " active" : ""}`}
          onClick={handleProfileClick}
          style={{ cursor: "pointer" }}
        >
          <div className="nav-icon">
            <i className={`fas ${profileClicked ? "fa-user-edit" : "fa-user"} icon-hover`}></i>
          </div>
          <div className="nav-label">Profile</div>
        </div>

        <div
          className="nav-item"
          onClick={handleLogout}
          style={{ cursor: "pointer" }}
        >
          <div className="nav-icon">
            <i className="fas fa-sign-out-alt icon-hover"></i>
          </div>
          <div className="nav-label">Logout</div>
        </div>
      </div>

      {showModal && (
        <div
          className="unique-profile-modal"
          style={{
            position: 'fixed',
            top: 0, left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(0, 0, 0, 0.6)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000
          }}
        >
          <div
            style={{
              backgroundColor: '#fff',
              padding: '20px 30px',
              borderRadius: '10px',
              width: '90%',
              maxWidth: '400px',
              boxSizing: 'border-box'
            }}
          >
            <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>Update Password</h2>

          <div style={{ marginBottom: '15px' }}>
  <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px' }}>Old Password</label>
  <div style={{ position: 'relative' }}>
    <input
      type={showOldPassword ? "text" : "password"}
      placeholder="Enter old password"
      value={oldPassword}
      onChange={(e) => setOldPassword(e.target.value)}
      style={{ width: '95%', padding: '8px' }}
    />
    <i
      className={`fas ${showOldPassword ? 'fa-eye-slash' : 'fa-eye'}`}
      onClick={() => setShowOldPassword(!showOldPassword)}
      style={{
        position: 'absolute',
        right: '10px',
        top: '50%',
        transform: 'translateY(-50%)',
        cursor: 'pointer',
        color: '#888'
      }}
    />
  </div>
</div>

           <div style={{ marginBottom: '15px' }}>
  <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px' }}>New Password</label>
  <div style={{ position: 'relative' }}>
    <input
      type={showNewPassword ? "text" : "password"}
      placeholder="Enter new password"
      value={newPassword}
      onChange={(e) => setNewPassword(e.target.value)}
      style={{ width: '95%', padding: '8px' }}
    />
    <i
      className={`fas ${showNewPassword ? 'fa-eye-slash' : 'fa-eye'}`}
      onClick={() => setShowNewPassword(!showNewPassword)}
      style={{
        position: 'absolute',
        right: '10px',
        top: '50%',
        transform: 'translateY(-50%)',
        cursor: 'pointer',
        color: '#888'
      }}
    />
  </div>
</div>

<div style={{ marginBottom: '15px' }}>
  <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px' }}>Confirm Password</label>
  <div style={{ position: 'relative' }}>
    <input
      type={showConfirmPassword ? "text" : "password"}
      placeholder="Confirm new password"
      value={confirmPassword}
      onChange={(e) => setConfirmPassword(e.target.value)}
      style={{ width: '95%', padding: '8px' }}
    />
    <i
      className={`fas ${showConfirmPassword ? 'fa-eye-slash' : 'fa-eye'}`}
      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
      style={{
        position: 'absolute',
        right: '10px',
        top: '50%',
        transform: 'translateY(-50%)',
        cursor: 'pointer',
        color: '#888'
      }}
    />
  </div>
</div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '20px' }}>
           
              <button
                onClick={handleSavePassword}
                style={{
                  padding: '8px 16px',
                  backgroundColor: '#2f327d',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '5px',
                  cursor: 'pointer'
                }}
               disabled={saveLoading}>
                    {saveLoading ?(
                      <span className="loader-create-remainder"></span>
                    ) : (
                      "Save"
                    )}
                
              </button>
                 <button
                onClick={closeModal}
                style={{
                  padding: '8px 16px',
                  backgroundColor: '#f8c604',
                  color:"#fff",
                  border: 'none',
                  borderRadius: '5px',
                  marginLeft:"10px",
                  cursor: 'pointer'
                }}
              >
                Cancel
              </button>
            </div>
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
      )}
    </>
  );
}

export default AdminSidebar;
