import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import animate from "../../Images/featureanimated.svg";
import {
  faEnvelopeOpenText, 
  faAddressBook, 
  faChartLine, 
  faMousePointer, 
  faBullseye, 
  faRedoAlt, 
} from "@fortawesome/free-solid-svg-icons";
import "./Partner.css";
import partnerimg from "../../Images/FeaturedImage.jpeg";

function Partner() {
  const sidebarItems = [
    { id: 1, icon: faEnvelopeOpenText, text: "Intuitive Email Builder" },
    { id: 2, icon: faMousePointer, text: "Drag and Drop" },
    { id: 3, icon: faChartLine, text: "Campaign Report History" },
    { id: 4, icon: faAddressBook, text: "Contact Management For Bulk Mails" },
    { id: 5, icon: faBullseye, text: "Tracking Campaign" },
    { id: 6, icon: faRedoAlt, text: "Retargeting Users" },
  ];
   

  return (
    <div className="partner" id="feature">
      <div className="head-partner">
        <div>
          <h5>FEATURES</h5>
          <h2 className="partner-title">
            Transform Your Business with Email
            <span style={{ color: "#ff8434" }}>Con</span>:
            <br />
            Excellence Beyond Expectations!
          </h2>
        </div>
        <div>
          <img src={animate} alt="animate" className="animate" />
        </div>
      </div>
      <section className="partner-section">
        <div className="sidebar-partner">
          {sidebarItems.map((item) => (
            <div key={item.id} className="sidebar-item">
              <FontAwesomeIcon icon={item.icon} className="icon" />
              <span className="text">{item.text}</span>
            </div>
          ))}
        </div>
        <div className="partner-image">
          <img src={partnerimg} alt="Software Suite Preview" />
          <p className="partner-text">
            Send bulk emails effortlessly with EmailCon.
          </p>
        </div>
      </section>
    </div>
  );
}


export default Partner;
