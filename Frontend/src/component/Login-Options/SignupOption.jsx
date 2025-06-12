import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./signupOption.css";
import signupop from "../../Images/Signupops.png"

function SignupOption() {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);

  // const handlePayment = () => {
  //   navigate(`/userpayment/${userId}`);
  // };

  const handleDemoClick = () => {
    setShowModal(true);
  };

  const handleCancel = () => {
    setShowModal(false);
  };

  const handleOk = () => {
    setShowModal(false);
    toast.success("Wait for admin response!");
    setTimeout(() => {
      navigate("/user-login");
    }, 2000);
  };

  return (
    <div className="signupopt-container">
      <div className="signupopt-left">
        <div className="signupopt-buttons">
          <h1 className="signupopt-title">
            Welcome To Email<span style={{ color: "#f48c06" }}>con</span>
          </h1>
          <h2 className="signupopt-heading">
            Start Your Journey with a 1-Day Free Demo
          </h2>
          <p className="signupopt-fancy">
            "One Day. Infinite Possibilities. Experience the future—today."
          </p>
          <p className="signupopt-description">
            Get instant access to explore the platform's features, discover the
            experience firsthand, and unlock new possibilities— all with a
            single-day preview. No commitments, just value. Upgrade anytime with
            Pay Now to unlock full access and extended benefits.
          </p>
          <div className="btns-trial">
            <div onClick={handleDemoClick} className="signupopt-demo-btn">
              Free Trail
            </div>
            {/* <div onClick={handlePayment} className="signupopt-pay-btn">
              Pay Now
            </div> */}
          </div>
        </div>
      </div>

      <div className="signupopt-right">
        <img
          src={signupop}
          alt="Signup Illustration"
          className="signupopt-image"
        />
      </div>

      {showModal && (
        <div className="signupopt-modal-overlay">
          {" "}
          <div className="signupopt-modal-content">
            {" "}
            <h2 className="signupopt-modal-title">🎁 1-Day Free Demo Access</h2>
            <p className="signupopt-modal-subtext">
              Get started instantly with a one-day preview. Experience our
              features, explore the tools, and discover your potential.
            </p>
            <div className="signupopt-points-container">
            
              <div className="signupopt-point">
                <span className="signupopt-point-icon">📧</span>
                <div>
                  <h4>Email Confirmation</h4>
                  <p>
                    Your login credentials will be emailed once your demo is
                    activated by the admin.
                  </p>
                </div>
              </div>

              <div className="signupopt-point">
                <span className="signupopt-point-icon">🔒</span>
                <div>
                  <h4>Secure Access</h4>
                  <p>
                    Your demo is private and time-limited for your security and
                    learning comfort.
                  </p>
                </div>
              </div>

              <div className="signupopt-point">
                <span className="signupopt-point-icon">⏳</span>
                <div>
                  <h4>24-Hour Preview</h4>
                  <p>
                    The demo is active for 1 day—enough time to explore and get
                    familiar.
                  </p>
                </div>
              </div>

              <div className="signupopt-point">
                <span className="signupopt-point-icon">🚀</span>
                <div>
                  <h4>Upgrade Anytime</h4>
                  <p>
                    Choose <strong>Pay Now</strong> anytime to unlock full
                    access, premium tools, and priority support.
                  </p>
                </div>
              </div>

              <div className="signupopt-point">
                <span className="signupopt-point-icon">💡</span>
                <div>
                  <h4>Bonus Features</h4>
                  <p>
                    Paid accounts enjoy unlimited access, feature updates, and
                    personalized support from our team.
                  </p>
                </div>
              </div>
            </div>
            <div className="signupopt-modal-buttons">
              <button onClick={handleCancel} className="signupopt-cancel-btn">
                Cancel
              </button>
              <button onClick={handleOk} className="signupopt-ok-btn">
                OK
              </button>
            </div>
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

export default SignupOption;
