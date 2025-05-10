import React, { useState } from "react";
import "./Form.css"; // Import the external CSS
import img1 from "../../Images/imgesform1.png"
import apiConfig from "../../apiconfig/apiConfig";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios"; 
import { useNavigate } from "react-router-dom";


const Form = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    gender: "",
    profession: "",
  });
  const navigate=useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
      const response = await axios.post(`${apiConfig.baseURL}/api/admin/user-form`, formData);
  
      if (response.status === 201) {
        toast.success("Details submitted successfully!");
        navigate("/")
        setFormData({
          name: "",
          email: "",
          phone: "",
          address: "",
          gender: "",
          profession: "",
        });
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error("Form submission failed. Please try again.");
    }
  };
  

  return (
    <div className="forms_content" id="register-form">
      <div className="form-container">
        <form onSubmit={handleSubmit} className="form">
          <h2 className="form-heading">
            Enrollment <span style={{ color: "#ff8434" }}>Form</span>{" "}
          </h2>

          <label className="form-label">Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="form-input"
          />

          <label className="form-label">Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            className="form-input"
          />

          <label className="form-label">Phone Number</label>
          <input
            type="text"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            required
            className="form-input"
          />

<label className="form-label">Gender</label>
<div className="form-radio-group">
  <label>
    <input
      type="radio"
      name="gender"
      value="Male"
      checked={formData.gender === "Male"}
      onChange={handleChange}
    />
    Male
  </label>
  <label>
    <input
      type="radio"
      name="gender"
      value="Female"
      checked={formData.gender === "Female"}
      onChange={handleChange}
    />
    Female
  </label>
  <label>
    <input
      type="radio"
      name="gender"
      value="Other"
      checked={formData.gender === "Other"}
      onChange={handleChange}
    />
    Other
  </label>
</div>


          <label className="form-label">Address</label>
          <input
            type="text"
            name="address"
            value={formData.address}
            onChange={handleChange}
            className="form-input"
          />

          <label className="form-label">Profession</label>
          <input
            type="text"
            name="profession"
            value={formData.profession}
            onChange={handleChange}
            required
            className="form-input"
          />

          <button type="submit" className="submit-button">
            Submit
          </button>
        </form>
      </div>
      <div className="img-form">
        <h3>
          Welcome To Email<span style={{ color: "#ff8434" }}>con</span>
        </h3>
        <p className="sub-form-heading">
          EmailCon – Where Design Meets Deliverability.
        </p>
        <p className="form-description">
          From concept to inbox, EmailCon empowers teams to create impactful
          campaigns effortlessly.
        </p>
        <div className="wrapper-form">{<img src={img1} alt="form" />}</div>
      </div>
        <ToastContainer
              className="custom-toast"
              position="bottom-center"
              autoClose={2000}
              hideProgressBar={true}
              closeOnClick={false}
              closeButton={false}
              pauseOnHover={true}
              draggable={true}
              theme="light"
            />
    </div>
  );
};

export default Form;
