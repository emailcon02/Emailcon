import React from "react";
import "./Future.css";
import { GraduationCap } from "lucide-react";
import { Laptop2 } from "lucide-react";
import { ShoppingCart } from "lucide-react";
import { Stethoscope } from "lucide-react";
import { Home } from "lucide-react";
import { Banknote } from "lucide-react";


function Future() {
  return (
    <div className="app-container-front">
      {/* Header Section */}
      <div className="header-front">
        <h3>WE'RE HERE TO HELP</h3>
        <h1 style={{ color: "#2f327d" }}>
          This is The Future of Email
          <span style={{ color: "#ff8434" }}>con</span> Management
        </h1>
      </div>

      {/* Cards Section */}
      <div className="card-container-front">
        <div className="card-front" data-type="edu">
          <div className="icon-circle edu">
      <GraduationCap className="icon-style icon-education" />
    </div>
              <h2>Education</h2>
          <p>
            Empower learning with cutting-edge solutions tailored for
            institutions, ensuring an interactive and efficient educational
            experience.
          </p>
        </div>

        <div className="card-front" data-type="apps">
        <div className="icon-circle apps">
      <Laptop2 className="icon-style icon-apps" />
    </div>
          <h2>Apps And Software</h2>
          <p>
            Develop, manage, and scale your digital applications with robust,
            innovative, and secure software solutions.
          </p>
        </div>

        <div className="card-front" data-type="ecom">
        <div className="icon-circle ecom">
      <ShoppingCart className="icon-style icon-ecommerce" />
    </div>
          <h2>E-Commerce Businesses</h2>
          <p>
            Elevate your online store with seamless integrations, secure
            transactions, and customer-centric digital strategies.
          </p>
        </div>
      </div>

      <div className="card-container-front cards-separation">
        <div className="card-front" data-type="heal">
        <div className="icon-circle heal">
      <Stethoscope className="icon-style icon-healthcare" />
    </div>
          <h2>Healthcare</h2>
          <p>
            Revolutionize patient care with innovative healthcare technologies
            designed for accuracy, efficiency, and security.
          </p>
        </div>

        <div className="card-front" data-type="real">
        <div className="icon-circle real">
      <Home className="icon-style icon-realestate" />
    </div>
          <h2>Real Estate</h2>
          <p>
            Accelerate property sales and management with smart, integrated real
            estate solutions built for modern markets.
          </p>
        </div>

        <div className="card-front" data-type="bank">
        <div className="icon-circle bank">
      <Banknote className="icon-style icon-finance" />
    </div>        
      <h2>Banks And Financial Services</h2>
          <p>
            Ensure security, compliance, and customer trust with our tailored
            banking and financial service technologies.
          </p>
        </div>
      </div>
    </div>
  );
}

export default Future;
