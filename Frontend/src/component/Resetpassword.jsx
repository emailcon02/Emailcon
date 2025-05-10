import React,{useState} from 'react'
import './Resetpassword.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import imgs1 from '../Images/Resetpassword-pana.png'
import { useLocation } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import apiConfig from '../apiconfig/apiConfig.js';
import { useNavigate } from 'react-router-dom';

function Resetpasswords() {
     const [showPassword, setShowPassword] = useState(false);
     const location = useLocation();
     const { email: forgotEmail } = location.state || {};
     const [showConfirmPassword, setShowConfirmPassword] = useState(false);
     const [newPassword, setNewPassword] = useState("");
     const [confirmPassword, setConfirmPassword] = useState("");
     const navigate = useNavigate();
     const [resetPasswordLoading, setResetPasswordLoading] = useState(false);
     

     const togglePassword = () => {
         setShowPassword(prev => !prev);
     };

     const toggleConfirmPassword = () => {
         setShowConfirmPassword(prev => !prev);
     };
     const handleResetPassword = async () => {
        if (!newPassword || !confirmPassword) {
          toast.error("Fill all fields.");
          return;
        }
        if (newPassword !== confirmPassword) {
          toast.error("Passwords do not match.");
          return;
        }
        setResetPasswordLoading(true);
        try {
          await axios.post(`${apiConfig.baseURL}/api/auth/reset-password`,{
            email: forgotEmail,
            password: newPassword,
          });
          toast.success("Password updated. Please login.");
          setTimeout(() => {
            navigate("/user-login");
            }, 2000); // Redirect after 2 seconds
          setResetPasswordLoading(false);
        } catch (error) {
          toast.error(error.response?.data || "Failed to reset password");
            setResetPasswordLoading(false);
        }
      };
    
  return (
    <div class="unique-container">
            
        <div class="unique-left-block">
          <div class="unique-form-box">
            <h2>Reset <span style={{color: "#f48c06"}}>Password</span></h2>
           <div className='unique-content' style={{ position: 'relative' }}>
      <div className='unique-label'>
        <label>New Password</label>
      </div>
      <input
        type={showPassword ? 'text' : 'password'}
        id='unique-email'
        placeholder='Enter Your New User Password'
        required
        value={newPassword}
        onChange={(e) => setNewPassword(e.target.value)}        
        style={{ paddingRight: '0px', width: '100%' }}
      />
      <FontAwesomeIcon
        icon={showPassword ? faEyeSlash : faEye}
        onClick={togglePassword}
        style={{
          position: 'absolute',
          right: '10px',
          top: '58%',
          transform: 'translateY(-50%)',
          cursor: 'pointer',
          fontSize: '14px'
        }}
        title={showPassword ? 'Hide Password' : 'Show Password'}
      />
    </div>
            <div className='unique-content' style={{ position: 'relative' }}>
      <div className='unique-label'>
        <label>Confirm Password</label>
      </div>
      <input
        type={showConfirmPassword ? 'text' : 'password'}
        id='unique-password'
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        placeholder='Enter Your Confirm User Password'
        required
        style={{ paddingRight: '0px', width: '100%' }}
      />
      <FontAwesomeIcon
        icon={showConfirmPassword ? faEyeSlash : faEye}
        onClick={toggleConfirmPassword}
        style={{
          position: 'absolute',
          right: '10px',
          top: '58%',
          transform: 'translateY(-50%)',
          cursor: 'pointer',
          fontSize: '14px'
        }}
        title={showConfirmPassword ? 'Hide Password' : 'Show Password'}
      />
    </div>
            <button  id="unique-get-otp" onClick={handleResetPassword} disabled={resetPasswordLoading}>
          {resetPasswordLoading ? <span className="loader-login small"></span> : "Save New Password"}
        </button>
          </div>
        </div>
    
        <div class="unique-right-image">
            <img src={imgs1} alt="Reset password"/>
            <h2 className='unique-heads-con'>Reset <span style={{color: "#f48c06"}}>Password</span></h2>
            <p className='unique-para-con'>Forgot your password? Reset it now to regain access to your account.</p>
        </div>
         <ToastContainer
                className="custom-toast"
                position="bottom-center"
                autoClose={2000}
                hideProgressBar
                closeOnClick={false}
                closeButton={false}
                pauseOnHover
                draggable
                theme="light"
              />
      </div>
  )
}

export default Resetpasswords