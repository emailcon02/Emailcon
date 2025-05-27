import React, { useState } from "react";
import { FaInfoCircle } from "react-icons/fa";
import "./SmtpPage.css"; // Link to external CSS
import smtp from "../../Images/smtp passwords.png"
import smtpmodal from "../../Images/bgsmtp.png"
import axios from "axios";
import apiConfig from "../../apiconfig/apiConfig";
import { useLocation, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Smtppage = () => {
  const [authMethod, setAuthMethod] = useState("Gmail");
  const [smtppassword, setSmtppassword] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading,setIsLoading] = useState(false);
  const location = useLocation();
  const userData = location.state;
  const navigate= useNavigate();
 
  

  const handlesave = async () => {
    setIsLoading(true);
    try {
        const response = await axios.post(
            `${apiConfig.baseURL}/api/auth/signup`,{
                email:userData.email,
                username:userData.username,
                password:userData.password,
                gender:userData.gender,
                phone:userData.phone,
                smtppassword}
          );      
        toast.success(response.data.message || "Account created successfully!");
        const userId = response.data.user.id; 
        setTimeout(() => {
          navigate(`/signup-option/${userId}`);
        }, 3000);
    } catch (error) {
          if (error.response) {
            const errorMessage = error.response.data.message || "Error signing up";
            if (error.response.status === 400) {
              if (errorMessage.includes("User already exists")) {
                toast.warning(
                  "User already exists. Please use a different email or username."
                );
              } else {
                toast.error(errorMessage);
              }
            } else {
              toast.error(errorMessage);
            }
          } else {
            toast.error("Network error. Please try again.");
          }
        } finally {
          setIsLoading(false);
        }
      };

  const handleCancel = () => {
    setSmtppassword("");
    navigate("/signup")
  };

  return (
    <div className="smtp-page-container">
      {/* Left Side Input Form */}
      <div className="smtp-left-side">
        <h1 className="smpt-header">
          Email<span style={{ color: "#f48c06" }}>con</span> Smtp Setup
        </h1>
        <div className="smtp-content-container">
          <div className="smtp-label-container">
            <label>
              {authMethod === "Gmail"
                ? "SMTP App Passcode"
                : "Hostinger Password"}
            </label>
            {authMethod === "Gmail" && (
              <FaInfoCircle
                className="smtp-info-icon"
                onClick={() => setIsModalOpen(true)}
              />
            )}
          </div>
          <div className="smtp-input-container">
            <input
              type="text"
              value={smtppassword}
              onChange={(e) => setSmtppassword(e.target.value)}
              required
              className="smtp-signup-input"
              placeholder="Eg: deyq kjki kvii olua"
            />
          </div>
        </div>
        <div className="smtp-button-group">
          <button className="smtp-save-button" onClick={handlesave}
       disabled={isLoading}
       >
         {isLoading ? (
           <span className="loader-signup smtp-loader"></span> // Spinner
         ) : (
           "Save"
         )}
          </button>
          <button className="smtp-cancel-button" onClick={handleCancel}>
            Cancel
          </button>
        </div>
      </div>

      {/* Right Side Image */}
      <div className="smtp-right-side">
        <img src={smtp} alt="Right Side" className="smtp-right-image" />
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="smtp-custom-modal-overlay">
          <div className="smtp-custom-modal-container">
            <div className="smtp-custom-modal-left">
              <h3>Steps to Get Gmail SMTP App Passcode</h3>
              <ol>
                <li>Go to your Google Account Security Settings.</li>
                <li>Enable 2-Step Verification.</li>
                <li>
                  Use the top-left search box to find and simply type “App
                  Password” in the search input and press Enter to automatically
                  scroll to that section.
                </li>
                <li>
                  Generate a new app password for "Mail" and select your device.
                </li>
                <li>
                  Copy and use the generated passcode in the SMTP App Passcode
                  field.
                </li>
                <li>
                  Sample 16 digit App Passcode is{" "}
                  <strong>deyq kjki kvii olua.</strong>
                </li>
              </ol>
              <div className="smtp-close-btn">
              <button
                className="smtp-modal-close-button"
                onClick={() => setIsModalOpen(false)}
              >
                Close
              </button>
              </div>
            
            </div>
            <div className="smtp-custom-modal-right">
              <img
                src={smtpmodal}
                alt="Instructions"
                className="smtp-modal-image"
              />
            </div>
          </div>
        </div>
      )}
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
};

export default Smtppage;