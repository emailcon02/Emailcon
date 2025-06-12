import React,{useState,useEffect} from 'react'
import './Forgetpassword.css';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import { FaArrowLeft } from 'react-icons/fa';
import 'react-toastify/dist/ReactToastify.css';
import img1 from '../../Images/forgetpassword.png';
import apiConfig from '../../apiconfig/apiConfig.js';
import { useNavigate } from 'react-router-dom';
function Forgetpassword() {
 
  const [forgotEmail, setForgotEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [sendOtpLoading, setSendOtpLoading] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);
  const navigate = useNavigate();

 useEffect(() => {
    let timer;
    if (resendTimer > 0) {
      timer = setInterval(() => {
        setResendTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [resendTimer]);
const handleBackCampaign = () => {  
    navigate("/user-login");
    };

    const handleSendOtp = async () => {
      if (!forgotEmail) {
        toast.error("Enter your registered email.");
        return;
      }
    
      setSendOtpLoading(true);
      try {
        const res = await axios.post(`${apiConfig.baseURL}/api/auth/send-otp`, {
          email: forgotEmail,
        });
    
        // OTP sent successfully, now increment attempt count
        const today = new Date().toLocaleDateString();
        const storedData =
          JSON.parse(localStorage.getItem("forgotPasswordAttempts")) || {};
    
        if (storedData.date === today) {
          if (storedData.count >= 2) {
            toast.warn("You've reached the reset limit for today.");
            setSendOtpLoading(false);
            return;
          } else {
            storedData.count += 1;
          }
        } else {
          storedData.date = today;
          storedData.count = 1;
        }
    
        localStorage.setItem("forgotPasswordAttempts", JSON.stringify(storedData));
    
        toast.success("OTP sent to your registered email.");
        setOtp(res.data.otp);
    
        setTimeout(() => {
          navigate("/verifyotp", {
            state: { email: forgotEmail, otp: res.data.otp },
          });
        }, 2000);
      } catch (error) {
        toast.error(error.response?.data || "Error sending OTP");
      } finally {
        setSendOtpLoading(false);
      }
    };
    
  return (
    
    <div class="unique-container">      
    <div class="unique-left-block">         
      <div class="unique-form-box">
           <button onClick={handleBackCampaign} className="report-nav-btn">
                    <span className="admin-nav-icons">
                      <FaArrowLeft />
                    </span>
                    <span className="nav-names">Back</span>
        </button>
   
        <h2>Forget <br/><span style={{color: "#f48c06"}}>Password</span> ?</h2>
        <p className='unique-logo-para'>Please enter your email address.It should belong to an already registered account.</p>
        <div>  
        <div className ='unique-label'>
        </div>
        <input type="email"
            id="unique-email"
            value={forgotEmail}
            onChange={(e) => setForgotEmail(e.target.value)}
            placeholder= "Enter Your Mail ID"
            required/>
        </div>
        <button id='unique-get-otp' onClick={handleSendOtp} disabled={sendOtpLoading}>
              {sendOtpLoading ? (
                <span className="loader-login small"></span>
              ) : (
                "Get OTP"
              )}
            </button>
      </div>
    </div>

    <div class="unique-right-image">
     <img src={img1} alt="forget password" />
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
  )
}

export default Forgetpassword;