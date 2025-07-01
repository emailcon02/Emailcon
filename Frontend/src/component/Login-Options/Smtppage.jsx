import React from "react";
import { FaInfoCircle } from "react-icons/fa";
import "./SmtpPage.css";
import smtp from "../../Images/googleconnect.png";
import apiConfig from "../../apiconfig/apiConfig";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import logo from "../../Images/emailcon_svg_logo.svg";


const Smtppage = () => {
  const navigate = useNavigate();

  const handleconnectgoogle = () => {
    // Get userId from localStorage (adjust based on your auth system)
    const userData = JSON.parse(localStorage.getItem("user"));
    
    if (!userData?.id) {
      toast.error("Please login first");
      navigate("/signup");
      return;
    }

    // Pass userId to backend
    window.location.href = `${apiConfig.baseURL}/auth/google?userId=${userData.id}`;
  };

  const handleCancel = () => {
    navigate("/signup");
  };

  return (
    <div className="smtp-page-container">
      <div className="smtp-left-side">
      <h2 className="signup-header">
              <span>
                  <img src={logo} alt="imagesignnav" className="logo_img_sign" />{" "}
                </span>
                <div>
                <span style={{marginTop:"5px",fontWeight:"600",fontSize:"26px"}}>
                  Gmail Setup
                </span>
                </div>
              </h2>

        <div className="smtp-note-box">
          <FaInfoCircle className="smtp-note-icon" />
          <p className="smtp-note-text">
            Use your <strong>registered Gmail</strong> for Google Connect. <br />
            For sending mail, ensure you use the same Gmail account.
          </p>
        </div>

        <div className="smtp-button-group">
          <button className="smtp-save-button" onClick={handleconnectgoogle}>
            Connect Google      
          </button>
          <button className="smtp-cancel-button" onClick={handleCancel}>
            Cancel
          </button>
        </div>
      </div>

      <div className="smtp-right-side">
        <img src={smtp} alt="Right Side" className="smtp-right-image" />
      </div>

      <ToastContainer
        position="bottom-center"
        autoClose={3000}
        hideProgressBar
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </div>
  );
};

export default Smtppage;