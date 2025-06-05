import React from "react";
import "./BookDemo.css"; 

const BookDemo = ({ onOpenModal }) => {
  
  return (
    <div className="demo-button-wrapper">
      <button onClick={onOpenModal}>
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
