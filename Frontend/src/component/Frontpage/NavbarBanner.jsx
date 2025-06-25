import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import "./NavbarBanner.css";
import { useNavigate } from "react-router-dom";
import BannerImg from "../../Images/banner.png";
import logo from "../../Images/emailcon_svg_logo.svg"

const NavbarBanner = ({ onOpenModal }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSticky, setIsSticky] = useState(false);
  const navigate = useNavigate();

  // Handle scroll event for sticky navbar
  const handleScroll = () => {
    if (window.scrollY > 50) {
      setIsSticky(true);
    } else {
      setIsSticky(false);
    }
  };

  const scrollToSection = (sectionId, event) => {
    event.preventDefault();
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
      setIsMenuOpen(false); // Close mobile menu after clicking
    }
  };

  const hadlenavigate = () => {
    navigate("/user-login");
  };

  // Attach scroll listener
  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div>
      {/* Navbar */}
      <div className="navmain">
        <div className={`navbarfront${isSticky ? "sticky" : ""}`}>
          <div className="navbar-container">
            <img src={logo} alt="imagehomenav" className="logo_img_nav"/>
            {/* Hamburger Toggle */}
            <div
              className="menu-toggle"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              ☰
            </div>

            {/* Menu Items */}
            <ul className={`menu ${isMenuOpen ? "active" : ""}`}>
              <li>
                <a href="#home" onClick={(e) => scrollToSection("home", e)}>
                  Home
                </a>
              </li>
              <li>
                <a
                  href="#feature"
                  onClick={(e) => scrollToSection("feature", e)}
                >
                  Features
                </a>
              </li>
              <li>
                <a href="#Price" onClick={(e) => scrollToSection("Price", e)}>
                  Prices
                </a>
              </li>
              <li>
                <a
                  href="#contact"
                  onClick={(e) => scrollToSection("contact", e)}
                >
                  Contact
                </a>
              </li>
              <li>
                <button className="demo-btn" onClick={hadlenavigate}>
                  Login{" "}
                  <FontAwesomeIcon icon={faArrowRight} className="arrow-icon" />
                </button>
              </li>
            </ul>
          </div>
        </div>
      </div>
      {/* Banner Section */}
      <header className="banner">
        <div className="banner-content">
          <h1 className="slide-down">
            Send Email's Directly From <br /> Your{" "}
            <span className="highlight">Emailcon</span> Campaign
          </h1>
          <p className="slide-left">
            Transform Your Email Campaigns With EmailCon - Your All-In-One Email
            Sending Solution.
          </p>
          <button className="schedule-btn slide-up" onClick={onOpenModal}>
            Schedule A Demo
          </button>
        </div>
        <div className="Banner-Image">
          <img className="ban-img" src={BannerImg} alt="ban-img" />
          <div class="shadow"></div>
        </div>
      </header>
    </div>
  );
};

export default NavbarBanner;
