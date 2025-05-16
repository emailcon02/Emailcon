import React, { useState, useEffect } from "react";
import "./Form.css";
import img1 from "../../Images/imgesform1.png";
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
    state: "",
    district: "",
    gender: "",
    type: "",
    profession: "",
  });

  const [allStates, setAllStates] = useState([]);
  const [allDistricts, setAllDistricts] = useState([]);

  const navigate = useNavigate();

  // Fetch Indian states
  useEffect(() => {
    const fetchStates = async () => {
      try {
        const response = await axios.post(
          "https://countriesnow.space/api/v0.1/countries/states",
          { country: "India" }
        );
        const states = response.data.data.states.map((s) => s.name);
        setAllStates(states);
      } catch (error) {
        console.error("Error fetching states:", error);
      }
    };

    fetchStates();
  }, []);

  // Fetch districts based on selected state
  useEffect(() => {
    const fetchDistricts = async () => {
      if (!formData.state) return;

      try {
        const response = await axios.post(
          "https://countriesnow.space/api/v0.1/countries/state/cities",
          {
            country: "India",
            state: formData.state,
          }
        );
        setAllDistricts(response.data.data);
      } catch (error) {
        console.error("Error fetching districts:", error);
      }
    };

    fetchDistricts();
  }, [formData.state]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
      ...(name === "state" && { district: "" }), // reset district when state changes
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        `${apiConfig.baseURL}/api/admin/user-form`,
        formData
      );

      if (response.status === 201) {
        toast.success("Details submitted successfully!");
        navigate("/");

        setFormData({
          name: "",
          email: "",
          phone: "",
          state: "",
          district: "",
          gender: "",
          type: "",
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
            Enrollment <span style={{ color: "#ff8434" }}>Form</span>
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

          <label className="form-label">State</label>
          <select
            name="state"
            value={formData.state}
            onChange={handleChange}
            className="form-select"
            required
          >
            <option value="">-- Select State --</option>
            {allStates.map((state, index) => (
              <option key={index} value={state}>
                {state}
              </option>
            ))}
          </select>

          <label className="form-label">District</label>
          <select
            name="district"
            value={formData.district}
            onChange={handleChange}
            className="form-select"
            required
            disabled={!formData.state}
          >
            <option value="">-- Select District --</option>
            {allDistricts.map((district, index) => (
              <option key={index} value={district}>
                {district}
              </option>
            ))}
          </select>

          <label className="form-label">Profession</label>
          <select
            name="type"
            value={formData.type}
            onChange={handleChange}
            className="form-select"
            required
          >
            <option value="">-- Select Type --</option>
            <option value="organization">Organization</option>
            <option value="individual">Individual</option>
          </select>

          {formData.type && (
            <div>
              <label className="form-label">
                {formData.type === "organization"
                  ? "Organization Name"
                  : "Individual Profession Name"}
              </label>
              <input
                type="text"
                name="profession"
                value={formData.profession}
                placeholder={
                  formData.type === "organization"
                    ? "e.g., Company Name"
                    : "e.g., Freelancer, Student, etc."
                }
                onChange={handleChange}
                className="form-input"
                required
              />
            </div>
          )}

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
        <div className="wrapper-form">
          <img src={img1} alt="form" />
        </div>
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
