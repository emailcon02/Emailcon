import React from "react";
import { useNavigate } from "react-router-dom";
import "./BookDemo.css"; 

const BookDemo = () => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate("/register-form"); 
  };

  return (
    <div className="demo-button-wrapper">
      <button onClick={handleClick}>
        <span>
          <span className="container">
            <span className="primary"></span>
            <span className="complimentary"></span>
          </span>
        </span>
        <span>Book a demo</span>
      </button>
    </div>
  );
};

export default BookDemo;
