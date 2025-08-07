import React from "react";
import Lookingimg from "../../Images/hand-drawn-step-illustration.png";
import { useLocation, useNavigate } from "react-router-dom";
import "./Campaign.css";

function Campaign() {
  const navigate = useNavigate(); 
    const location = useLocation();
    const previewContenttem = location.state?.previewContenttem || [];
    const bgColortem = location.state?.bgColortem || "ffffff";
    const selectedTemplatepre = location.state?.selectedTemplatepre || "";

const handleToggle = () => {
  if (previewContenttem && previewContenttem.length > 0) {
    navigate("/TemMainpage", {
      state: { previewContenttem, bgColortem, selectedTemplatepre},
    });
  } else {
    navigate("/editor");
  }
};


  return (
    <div className="campaign-Mobile-page">
        <nav className="campaign-app-navbar">
          <p className="campaign-mobile-head">
            Camp<span style={{ color: "#f48c06" }}>aigns</span>
          </p>
        </nav>

        <div className="campaign-app-content">
          <img src={Lookingimg} alt="looking" style={{ width: "300px" }} />
          <p style={{ textAlign: "center" }}>
            Looking for creating your own campaigns! Experience it.
          </p>
        </div>

        <footer className="campaign-app-footer">
          <div className="campaign-half-circle"></div>
          <button className="campaign-foot-button" onClick={handleToggle}>
            +
          </button>
        </footer>
      </div>
  );
}

export default Campaign;