import React from "react";
import "./FeatureSection.css";
import featureVideo from "../../Images/Emailcon-video.mp4"; // Replace with actual video path
const FeatureSection = () => {
  return (
    <section className="feature-section">
      <div className="feature-content">
        <p className="feature-subtitle">CREATE STUNNING EMAILS IN MINUTES</p>
        <h2 className="feature-title">
          Email Builder With Customized Templates
        </h2>
        <p className="feature-description">
          <p className="emailcon-text">
            EmailCon’s easy-to-use platform lets you craft stunning emails with
            our drag-and-drop builder — no coding needed. Choose from a wide
            range of responsive templates or design your own from scratch to
            captivate your audience on any device. Personalize every campaign
            with advanced targeting tools and smart automation. Monitor your
            results with real-time analytics to optimize performance.
            <br />
            Welcome to <span style={{ fontWeight: "550", color: "black" }}>Emailcon</span>.
          </p>
        </p>
      </div>
      <div className="feature-image">
        <video
          src={featureVideo}
          autoPlay
          loop
          muted
          playsInline
          className="feature-video"
        />
      </div>
    </section>
  );
};

export default FeatureSection;
