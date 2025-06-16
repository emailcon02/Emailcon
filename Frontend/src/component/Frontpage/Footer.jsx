import React from "react";
import "./Footer.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPhone, faEnvelope } from '@fortawesome/free-solid-svg-icons';
import { Link } from "react-router-dom";

const Footer = ({onOpenModal }) => {


  return (
    <footer className="footer-container" id="contact">
      {/* Top Section */}
      <div className="top-section">
        <div className="nav-links">
          <ul>
            <li>
              <a href="/#">Home</a>
            </li>
            <li>
              <a href="/#feature">Features</a>
            </li>
          </ul>
        </div>
        <div className="cta-container">
          <p>
            Ready To Begin?
          </p>
            <button onClick={onOpenModal } className="cta-button">Get a Demo</button>
        </div>
      </div>

      {/* Footer Content */}
      <div className="footer-content">
        {/* Left Column */}
        <div className="footer-section">
        <p className="logoContentfoot">
              <span style={{ fontSize: "34px" }}>E</span>mail
              <span style={{ color: "#f48c06" }}>con</span>
          </p>
          <p>
          Transform Your Email Campaigns With EmailCon - Your All-In-One Email Sending Solution.
          </p>
        </div>

        {/* Quicklinks */}
        <div className="footer-section">
          <h6>QUICKLINKS</h6>
          <ul>
            <li>
              <a href="#feature">Features</a>
            </li>
            <li>
              <a href="#Price">Prices</a>
            </li>
            <li>
              <a href="#contact">Contact Us</a>
            </li>
            <li>
           <Link to="/terms-of-service" reloadDocument>Terms Of Service</Link>
           </li>
            <li>
           <Link to="/privacy-policy" reloadDocument>Privacy Policy</Link>
           </li>
         
          </ul>
        </div>

        {/* Contact Info */}
       <div className="footer-section">
  <h6>Contact</h6>
  <p>
    <FontAwesomeIcon icon={faPhone} style={{ marginRight: '8px' }} />
    +91-8667238830
  </p>
  <h6>Email</h6>
  <p>
    <FontAwesomeIcon icon={faEnvelope} style={{ marginRight: '8px' }} />
    <a href="mailto:support@atts.in">support@emailcon.in</a>
  </p>
</div>

      </div>

  

      {/* Bottom Section */}
      <div className="bottom-section">
  
<p>
  Emailcon by <span className="highlight">Imagecon India Private Limited</span>. All rights reserved © {new Date().getFullYear()}.
</p>

      </div>
    </footer>
  );
};

export default Footer;
