import React, { useState, useRef } from "react";
import { FaSignOutAlt, FaEdit, FaEye, FaEyeSlash } from "react-icons/fa";
import axios from "axios";
import "./EditProfileModal.css";
import apiConfig from "../../apiconfig/apiConfig";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const EditProfile = ({ users, handleLogout }) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [editField, setEditField] = useState(null);
  const [saveLoading,setSaveLoading] = useState(false);
  const [formData, setFormData] = useState({
    username: users?.username || "",
    userPassword: "",
    newUserPassword: "",
    confirmUserPassword: "",
    gender: users?.gender || "",
    smtpPassword: "",
    newSmtpPassword: "",
    confirmSmtpPassword: "",
    avatar: users?.avatar || "",
  });

  const [showPassword, setShowPassword] = useState({
    userPassword: false,
    newUserPassword: false,
    confirmUserPassword: false,
    smtpPassword: false,
    newSmtpPassword: false,
    confirmSmtpPassword: false,
  });

  // const handleFileChange = (e) => {
  //   const file = e.target.files[0];
  //   if (file) {
  //     const reader = new FileReader();
  //     reader.onloadend = () => {
  //       setFormData(prev => ({
  //         ...prev,
  //         avatar: reader.result
  //       }));
  //     };
  //     reader.readAsDataURL(file);
  //   }
  // };

  const togglePassword = (field) => {
    setShowPassword(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  const localAvatars = [
    "/images/male-profile-1.jpg",
    "/images/male-profile-4.jpg",
    "/images/female-profile-1.jpg",
    "/images/female-profile-3.jpg",
  ];
  
  const dropdownRef = useRef(null);
  

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const form = new FormData();
    form.append("image", file);

    try {
      const res = await axios.post(`${apiConfig.baseURL}/api/stud/upload`, form, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setFormData({ ...formData, avatar: res.data.imageUrl });
    } catch (error) {
      console.error("Upload failed", error);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const openModal = (field) => {
    setEditField(field);
    setModalOpen(true);
  };

  const closeModal = () => {
    setEditField(null);
    setModalOpen(false);
  };

  const handlecloseModal = () => {
    setEditField(null);
  };
const saveUsername = async () => {
    if (!formData.username) { 
      toast.error("Username cannot be empty.");
      return;
    }
    if (formData.username.length < 3) {
      toast.error("Username must be at least 3 characters long.");
      return;
    }
    setEditField(null);
  }
  const savegender = async () => {
    if (!formData.gender) { 
      toast.error("select cannot be empty.");
      return;
    }
  
    setEditField(null);
  }

 const saveChanges = async () => {
    try {
      await axios.put(`${apiConfig.baseURL}/api/auth/update-avatar`, {
        userId: users?._id,
        username: formData.username,
        gender:formData.gender,
        avatar: formData.avatar,
      });
      toast.success("Profile Updated Successfully");
      setModalOpen(false);
      setEditField(null);
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  const saveUserPassword = async () => {
    if (formData.newUserPassword !== formData.confirmUserPassword) {
      toast.error("New password and Confirm password do not match.");
      return;
    }
    if (!formData.userPassword || !formData.newUserPassword || !formData.confirmUserPassword) {
      toast.error("Please fill all fields.");
      return;
    }
    if (formData.userPassword === formData.newUserPassword) {
      toast.error("New password cannot be the same as old password.");
      return;
    }
    if (formData.newUserPassword.length < 8) {
      toast.error("New password must be at least 8 characters long.");
      return;
    }
 
    setSaveLoading(true);
    try {
      await axios.put(`${apiConfig.baseURL}/api/auth/update-password`, {
        userId: users?._id,
        newPassword: formData.newUserPassword,
        oldPassword:formData.userPassword,
      });
      toast.success("User password updated successfully!");
      setFormData({
        ...formData,
        userPassword: "",
        newUserPassword: "",
        confirmUserPassword: "",
      });
      setEditField(null);
      setSaveLoading(false);
    } catch (error) {
      setSaveLoading(false);
      if(error.response){
        const errormessage = error.response.data.message || "Error updating user password";
        toast.error(errormessage);
      console.error(error);
      }
    }
  };

  const saveSmtpPassword = async () => {
    if (formData.newSmtpPassword !== formData.confirmSmtpPassword) {
      toast.error("Passwords do not match.");
      return;
    }
    setSaveLoading(true);

    try {
      await axios.put(`${apiConfig.baseURL}/api/auth/update-smtp-password`, {
        userId: users?._id,
        userEmail: users?.email,
        newSmtpPassword: formData.newSmtpPassword,
      });
      toast.success("SMTP password updated successfully!");
      setEditField(null);
      setSaveLoading(false);
    } catch (error) {
      setSaveLoading(false);
      if (error.response) {
        const errorMessage = error.response.data.message || "Error updating SMTP password";
        if (error.response.status === 400) {
          if (errorMessage.includes("Invalid SMTP credentials")) {
            toast.warning("Invalid SMTP credentials. Please check your email or app password.");
          } else {
            toast.error(errorMessage);
          }
        }
        else {
          toast.error(errorMessage);
        }
      }
      console.error(error);
    }
  };

  return (
    <div className="profile-container" ref={dropdownRef}>
      <button onClick={() => setModalOpen(!modalOpen)} className="profile-button">
        <img
          src={formData.avatar || "https://cdn-icons-png.flaticon.com/512/847/847969.png"}
          alt="User Avatar"
          className="profile-avatar"
        />
      </button>

      {modalOpen && (
        <div className="ep-modal">
          <div className="ep-modal-content">
            <span className="ep-close-icon" onClick={closeModal}>×</span>
            <h2>Edit Profile</h2>

            <div className="ep-avatar-upload">
              <label htmlFor="avatar-upload" className="ep-avatar-label">
                <img
                  src={formData.avatar || "https://cdn-icons-png.flaticon.com/512/847/847969.png"}
                  alt="Avatar"
                  className="ep-avatar-preview"
                />
                <FaEdit className="ep-avatar-edit-icon" />
              </label>
              <input
                id="avatar-upload"
                type="file"
                onChange={handleImageChange}
                style={{ display: "none" }}
              />
            </div>
            <div className="ep-avatar-defaults">
  <div className="ep-avatar-grid">
    {localAvatars.map((src, index) => (
      <img
        key={index}
        src={src}
        alt={`Avatar ${index + 1}`}
        className="ep-avatar-option"
        onClick={async () => {
          try {
            const response = await fetch(src);
            const blob = await response.blob();
            const file = new File([blob], `avatar-${Date.now()}.jpg`, { type: blob.type });
        
            const formDataUpload = new FormData();
            formDataUpload.append("image", file);
        
            const uploadRes = await axios.post(`${apiConfig.baseURL}/api/stud/upload`, formDataUpload, {
              headers: { "Content-Type": "multipart/form-data" },
            });
        
            setFormData(prev => ({
              ...prev,
              avatar: uploadRes.data.imageUrl, 
            }));
          } catch (err) {
            console.error("Error uploading default avatar:", err);
            toast.error("Failed to upload default avatar");
          }
        }}
        
      />
    ))}
  </div>
</div>

            <div className="ep-field">
              <label className="ep-label">Username:</label>
              <div className="ep-edit-container">
                <input
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  className="ep-input"
                  disabled={editField !== "username"}
                />
                {editField !== "username" && (
                  <FaEdit className="ep-edit-icon" onClick={() => openModal("username")} />
                )}
              </div>
            </div>
            <div className="ep-field">
              <label className="ep-label">Gender:</label>
              <div className="ep-edit-container">
                <input
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  className="ep-input"
                  disabled={editField !== "gender"}
                />
                {editField !== "gender" && (
                  <FaEdit className="ep-edit-icon" onClick={() => openModal("gender")} />
                )}
              </div>
            </div>


            {["userPassword", "smtpPassword"].map((field) => (
              <div className="ep-field" key={field}>
                <label className="ep-label">{field === "userPassword" ? "User Password:" : "SMTP Password:"}</label>
                <div className="ep-edit-container">
                  <input
                    name={field}
                    type={showPassword[field] ? "text" : "password"}
                    value={formData[field]}
                    onChange={handleChange}
                    className="ep-input"
                    disabled={editField !== field}
                  />
                  {editField !== field && (
                    <FaEdit className="ep-edit-icon" onClick={() => openModal(field)} />
                  )}
                  {editField === field && (
                    <span className="ep-eye-icon" onClick={() => togglePassword(field)}>
                      {showPassword[field] ? <FaEyeSlash /> : <FaEye />}
                    </span>
                  )}
                </div>
              </div>
            ))}

            <div className="ep-buttons">
              <button onClick={saveChanges} className="ep-save">Save</button>
              <button onClick={handleLogout} className="ep-logout">
                Logout <FaSignOutAlt className="icon-log" />
              </button>
            </div>
          </div>
        </div>
      )}

      {editField && (
        <div className="ep-edit-modal">
          <div className="ep-edit-modal-content">
            <span className="ep-close-icon" onClick={handlecloseModal}>×</span>
            <h3>Edit {editField}</h3>

            {editField === "username" && (
              <div className="ep-field">
                <label className="ep-label">New Username:</label>
                <input
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  className="ep-input"
                />
              </div>
            )}
            {editField === "gender" && (
        <div className="ep-field">
          <label className="ep-label">Select Gender:</label>
          <select
            name="gender"
            value={formData.gender}
            onChange={handleChange}
            className="ep-input"
          >
            <option value="">-- Select --</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
        </div>
      )}
                
            {editField === "userPassword" && (
              <>
                {["userPassword", "newUserPassword", "confirmUserPassword"].map((field, index) => (
                  <div className="ep-field" key={index}>
                    <label className="ep-label">
                      {field === "userPassword"
                        ? "Old Password:"
                        : field === "newUserPassword"
                        ? "New Password:"
                        : "Confirm Password:"}
                    </label>
                    <div className="ep-edit-container">
                      <input
                        name={field}
                        type={showPassword[field] ? "text" : "password"}
                        value={formData[field]}
                        onChange={handleChange}
                        className="ep-input"
                      />
                      <span className="ep-eye-icon" onClick={() => togglePassword(field)}>
                        {showPassword[field] ? <FaEyeSlash /> : <FaEye />}
                      </span>
                    </div>
                  </div>
                ))}
              </>
            )}

            {editField === "smtpPassword" && (
              <>
                {["newSmtpPassword", "confirmSmtpPassword"].map((field, index) => (
                  <div className="ep-field" key={index}>
                    <label className="ep-label">
                      {field === "newSmtpPassword" ? "New SMTP Password:" : "Confirm SMTP Password:"}
                    </label>
                    <div className="ep-edit-container">
                      <input
                        name={field}
                        type={showPassword[field] ? "text" : "password"}
                        value={formData[field]}
                        onChange={handleChange}
                        className="ep-input"
                      />
                      <span className="ep-eye-icon" onClick={() => togglePassword(field)}>
                        {showPassword[field] ? <FaEyeSlash /> : <FaEye />}
                      </span>
                    </div>
                  </div>
                ))}
              </>
            )}

            <div className="ep-buttons">
            {editField === "username" && (
                <button onClick={saveUsername} className="ep-save">Save</button>
              )}
                {editField === "gender" && (
                <button onClick={savegender} className="ep-save">Save</button>
              )}
              {editField === "userPassword" && (
                <button onClick={saveUserPassword} className="ep-save"
                disabled={saveLoading}>
                    {saveLoading ?(
                      <span className="loader-create-remainder"></span>
                    ) : (
                      "Save"
                    )}
                  </button>
              )}

              {editField === "smtpPassword" && (
                <button onClick={saveSmtpPassword} className="ep-save"
                disabled={saveLoading}>
                    {saveLoading ?(
                      <span className="loader-create-remainder"></span>
                    ) : (
                      "Save"
                    )}
                    </button>
              )}
            </div>
          </div>
        </div>
      )}

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

export default EditProfile;