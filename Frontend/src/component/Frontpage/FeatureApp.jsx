import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import CreateEmails from "../../Images/CreateEmails.svg";
import EmailTemplate from "../../Images/computer.png";
import SendEmail from "../../Images/SendEmails.svg";
import "./FeatureApp.css";
import { useNavigate } from "react-router-dom";

const FeaturedApps = () => {
  const navigate =useNavigate();  
  const handlenavigate = () => {
    navigate("/user-login");
  }
    
  return (
    <section className="featured-apps">
      <h2 className="section-title">How does it work?</h2>
      <div className="apps-container">
        <div className="app-card green">
          <div className="app-header">
            <img src={CreateEmails} alt="logo" className="title-img" />
          </div>
          <p className="app-description">Connect your email service</p>
          <p className="app-details">
            Choose from a variety of email services. We support bulk
            transactional email services (Smtp) and personal email services like
            ( Gmail,Hostinger).
          </p>
          <button className="app-button green-btn"  onClick={handlenavigate}>
            {" "}
            Get Started{" "}
            <FontAwesomeIcon icon={faArrowRight} className="arrow-icon" />
          </button>
        </div>

        {/* AU SALES Card */}
        <div className="app-card yellow">
          <div className="app-header">
            <img src={EmailTemplate} alt="logo" className="title-img" />
          </div>
          <p className="app-description">Create email template</p>
          <p className="app-details">
            Easily build your own template. Choose the tool most suitable for
            you in our text editor. Templates customization will be more easiler
            in our campaign .
          </p>
          <button className="app-button yellow-btn" onClick={handlenavigate}>
            {" "}
            Get Started{" "}
            <FontAwesomeIcon icon={faArrowRight} className="arrow-icon" />
          </button>
        </div>

        <div className="app-card blue">
          <div className="app-header">
            <img src={SendEmail} alt="logo" className="title-img" style={{width:"10rem"}}  />
          </div>
          <p className="app-description">Send email from uploaded contact</p>
          <p className="app-details">
            Easily send personalized emails to your uploaded contact list with
            just a few clicks. Boost your communication and reach your audience
            effortlessly.
          </p>
          <button className="app-button blue-btn" onClick={handlenavigate}>
            {" "}
            Get Started{" "}
            <FontAwesomeIcon icon={faArrowRight} className="arrow-icon" />
          </button>
        </div>
      </div>
    </section>
  );
};

export default FeaturedApps;
