import React, { useState,useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Signup.css";
import { ToastContainer, toast } from "react-toastify";
import { FaInfoCircle } from "react-icons/fa";
import "react-toastify/dist/ReactToastify.css";
import sign from "../../Images/ex1.png";
import axios from "axios";
import apiConfig from "../../apiconfig/apiConfig";
import logo from "../../Images/emailcon_svg_logo.svg";

function Signup() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false); // Loading state
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [phone, setPhone] = useState("");
  const [gender, setGender] = useState("");
  const [users, setUsers] = useState([]);
  const [isModalOpenpassword, setIsModalOpenpassword] =useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get(`${apiConfig.baseURL}/api/admin/users`);
       setUsers(response.data);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };
  
    fetchUsers();
  }, []);

    const handleSubmit = async (e) => {
      e.preventDefault();
      setIsLoading(true); 
       // Check for existing email or username
       const existingUser = users.find(
        (user) => user.email === email || user.username === username
      );
    
      // If user exists and is active, show warning
      if (existingUser && existingUser.isActive) {
        toast.warning("User already exists and is active. Please use different credentials.");
        setIsLoading(false);
        return;
      }
       try {
        const response = await axios.post(
            `${apiConfig.baseURL}/api/auth/signup`,{
                email,
                username,
                password,
                gender,
                phone,
                }
          );      
        toast.success(response.data.message || "Account created successfully!");

        localStorage.setItem("user", JSON.stringify(response.data.user));
        setTimeout(() => {
          navigate('/smtppage');
        }, 3000);
    } catch (error) {
          if (error.response) {
            const errorMessage = error.response.data.message || "Error signing up";
            if (error.response.status === 400) {
              if (errorMessage.includes("User already exists")) {
                toast.warning(
                  "User already exists. Please use a different email or username."
                );
              } else {
                toast.error(errorMessage);
              }
            } else {
              toast.error(errorMessage);
            }
          } else {
            toast.error("Network error. Please try again.");
          }
        } finally {
          setIsLoading(false);
        }
      };
  return (
    <div className="signup-page">
      <div className="signup-cover">
        <div className="signup-aside">
          <img src={sign} alt="Sample signup img" className="signup-image" />
          <h2 style={{ fontWeight: "550", color: "#2f327d" }}>
            Welcome To <span style={{ color: "#f48c06" }}>Emailcon...!</span>
          </h2>
          <p
            style={{
              fontSize: "16px",
              lineHeight: "1.7",
              textAlign: "center",
              padding: "0px 50px",
              color: "black",
            }}
          >
            Create your personalized template to strengthen our connection and
            enhance communication and engagement like never before.
          </p>
        </div>
        <div className="signup-container">
          <h2 className="signup-header">
          <span>
              <img src={logo} alt="imagesignnav" className="logo_img_sign" />{" "}
            </span>
            <div>
            <span style={{marginTop:"5px",fontWeight:"600",fontSize:"26px"}}>
              Signup in to Emailcon
            </span>
            </div>
          </h2>
          {/* <div>
            <div className="label">
              <label>Select Mail Service</label>
            </div>
            <select
              value={authMethod}
              onChange={(e) => setAuthMethod(e.target.value)}
              className="signup-dropdown"
            >
              <option value="Hostinger" className="options">
                Hostinger
              </option>
              <option value="Gmail" className="options">
                Gmail
              </option>
            </select>
          </div> */}
          <form onSubmit={handleSubmit} className="form-content">
            <div className="label">
              <label>Email</label>
            </div>
            <div className="input-container-sign">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="signup-input"
                placeholder="Enter the valid Mail ID"
              />
            </div>
            <div className="label">
              <label>Username</label>
            </div>
            <div className="input-container-sign">
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="signup-input"
                placeholder="Enter the Name of the User"
              />
            </div>
            <div className="label">
              <label>Contact Number</label>
            </div>
            <div className="input-container-sign">
              <input
                type="text"
                value={phone}
                onChange={(e) => {
                  const numericValue = e.target.value.replace(/\D/g, ""); // Remove all non-digits
                  setPhone(numericValue);
                }}
                required
                className="signup-input"
                placeholder="Enter the contact number"
              />
            </div>
            <div className="label">
              <label>Gender</label>
            </div>
            <div className="input-container-sign gender-options">
              <label>
                <input
                  type="radio"
                  name="gender"
                  value="Male"
                  checked={gender === "Male"}
                  onChange={(e) => setGender(e.target.value)}
                />
                Male
              </label>
              <label>
                <input
                  type="radio"
                  name="gender"
                  value="Female"
                  checked={gender === "Female"}
                  onChange={(e) => setGender(e.target.value)}
                />
                Female
              </label>
              <label>
                <input
                  type="radio"
                  name="gender"
                  value="Other"
                  checked={gender === "Other"}
                  onChange={(e) => setGender(e.target.value)}
                />
                Other
              </label>
            </div>

            <div className="label">
              <label label>
                {" "}
                User Password{" "}
                <FaInfoCircle
                  className="info-icon"
                  onClick={() => {
                    console.log("Info icon clicked!");
                    setIsModalOpenpassword(true);
                  }}
                  style={{
                    cursor: "pointer",
                    marginLeft: "5px",
                  }}
                />
              </label>
            </div>

            <div className="input-container-sign password-container">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                placeholder="Enter the user password"
                onChange={(e) => setPassword(e.target.value)}
                required
                className="signup-input"
              />
              <span
                className="toggle-password"
                onClick={() => setShowPassword(!showPassword)}
              >
                <i
                  className={`fas ${showPassword ? "fa-eye-slash" : "fa-eye"}`}
                ></i>
              </span>
            </div>

            <div className="sub-btn">
              <button
                type="submit"
                className="signup-button signup-submit"
                disabled={isLoading}
              >
                {isLoading ? (
                  <span className="loader-signup"></span> // Spinner
                ) : (
                  "Sign in"
                )}
              </button>
            </div>
            <div className="sign-log">
              <button
                onClick={() => navigate("/user-login")}
                className="signups-button signup-alt-button"
              >
                Already have an account?{" "}
                <span style={{ color: "#2f327d" }}>Login</span>
              </button>
            </div>
          </form>
        </div>
      </div>

      {isModalOpenpassword && (
        <div className="custom-modal-overlay">
          <div className="custom-modal-container">
            <h3>Password Setup</h3>
            <ol>
              <li>
                Passwords are <strong>case-sensitive</strong>.
              </li>
              <li>
                Password must have One <strong>uppercase</strong> letter (A–Z)
              </li>
              <li>
                Password must have One <strong>lowercase</strong> letter (a–z)
              </li>
              <li>
                Password must have One <strong>number</strong>(0–9)
              </li>
              <li>
                Password must have One <strong> special character</strong>{" "}
                (e.g., !, @, #, $, %, ^, &, *)
              </li>
              <li>
                Minimum length: <strong>8 characters</strong>.
              </li>
              <li>Eg : Template_001 or Template@008</li>
            </ol>
            <button
              onClick={() => setIsModalOpenpassword(false)}
              className="modal-close-button"
            >
              Close
            </button>
          </div>
        </div>
      )}

      <ToastContainer
        className="custom-toast"
        position="bottom-center"
        autoClose={3000}
        hideProgressBar={true}
        closeOnClick={false}
        closeButton={false}
        pauseOnHover={true}
        draggable={true}
        theme="light"
      />
    </div>
  );
}

export default Signup;