import React, { useEffect, useState } from "react";
import axios from "axios";
import "./AdminDashboard.css";
import { FaSignOutAlt } from "react-icons/fa";
import { useNavigate} from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import apiConfig from "../../apiconfig/apiConfig";

function AllUserPaymenthistory() {
  const [paymenthistory, setPaymenthistory] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchPayments = async () => {
 
      try {
        const response = await axios.get(`${apiConfig.baseURL}/api/stud/all-payment-history`);
        setPaymenthistory(response.data);
        console.log("Payment History:", response.data);
      } catch (error) {
        console.error("Error fetching payment history", {
          message: error.message,
          stack: error.stack,
          response: error.response?.data,
        });
      }
    };

    fetchPayments();
  }, []); // Only run when user ID or navigate changes

  const handleLogout = () => {
    navigate("/admin-dashboard");
  };


  return (
    <div className="admin-dashboard-page">
      <div className="admin-navnew">
        <div>
          <h2 className="admin-dashboard-header">User Payment History</h2>
        </div>
        <div className="admin-nav-btn">
          <button onClick={handleLogout} className="admin-nav-buttonnew">
            <span className="admin-nav-icons">
              <FaSignOutAlt />
            </span>{" "}
            <span className="nav-names">Back</span>
          </button>
        </div>
      </div>

      <h2 className="admin-dashboard-payment-heading">Payment Details</h2>

      <div className="cam-scroll" style={{ overflowX: "auto" }}>
      <table className="admin-dashboard-table">
        <thead>
          <tr>
            <th>S.No</th>
            <th>Payment Date</th>
            <th>UserName</th>
            <th>Amount</th>
            <th>Plan Details (Days)</th>
            <th>Expiry Date</th>
            <th>Payment Status</th>
            <th>Payment Id</th>
          </tr>
        </thead>
        <tbody>
          {paymenthistory && paymenthistory.length > 0 ? (
            paymenthistory.map((payment, index) => (
              <tr key={payment._id}>
                <td>{index + 1}</td>
                <td>{new Date(payment.createdAt).toLocaleDateString()}</td>
                <td>{payment.userId?.username || 'N/A'}</td>
                <td>₹{payment.amount}</td>
                <td>{payment.duration}</td>
                <td>{new Date(payment.expiryDate).toLocaleDateString()}</td>
                <td>{payment.paymentStatus}</td>
                <td>{payment.razorpayPaymentId || 'N/A'}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="8" style={{ textAlign: "center", padding: "10px" }}>
                No payment history available
              </td>
            </tr>
          )}
        </tbody>
      </table>
      </div>

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

export default AllUserPaymenthistory;
