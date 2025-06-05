import React from "react";
import "./Pricing.css";
import { useNavigate } from "react-router-dom";


const Pricing= () => {
  const navigate = useNavigate();
  const handlenavigate = () => {
    navigate("/user-login");
  }
 
  return (
    <div className="Pricing" id="Price">
      <h3>TOP-TIER SERVICE WITHOUT TOP-TIER PRICE.</h3>
      <h1>
        Our Email<span style={{ color: "#ff8434" }}>con</span> Services
      </h1>
        {/* <h1>
        Our Email<span style={{ color: "#ff8434" }}>con</span> 
        Service With Pricing{" "}
      </h1> */}

      <div className="pricing-container">
        <div className="pricing-card basic">
          <h2>Free Plan</h2>
          <p className="price">24-Hour Preview</p>
          <ul>
            <li>300 Mails Per Day</li>
            <li>Tracking Email Records</li>
            <li>Retarget Audience</li>
            <li>Secure Access</li>
            <li>Upgrade Anytime</li>
          </ul>
          <button onClick={handlenavigate}>Select Plan</button>
        </div>

        {/* <div className="pricing-card startup">
          <h2>Advanced</h2>
          <p className="price">$79.90/Per Month</p>
          <ul>
            <li>500GB Storage</li>
            <li>Bandwidth 45GB</li>
            <li>Up to 15 Databases</li>
            <li>Email accounts YES</li>
            <li>Up to 150 free SMS</li>
          </ul>
          <button onClick={handlenavigate}>Select Plan</button>
        </div> */}
      </div>
    </div>
  );
};

export default Pricing;
