import React, { useEffect, useState } from "react";
import axios from "axios";
import "./AdminDashboard.css";
import { FaSearch } from "react-icons/fa";
import { useNavigate, useParams } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import apiConfig from "../../apiconfig/apiConfig";
import Header from "./Header";
import AdminSidebar from "./AdminSidebar";

function UserPaymenthistory() {
  const { userId} = useParams();    
  const [sortOrder, setSortOrder] = useState("asc");
  const [paymenthistory, setPaymenthistory] = useState([]);
   const [filteredPayments, setFilteredPayments] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [fromDate, setFromDate] = useState("");
    const [toDate, setToDate] = useState("");
    const [rowsPerPage, setRowsPerPage] = useState(20);
    const [currentPage, setCurrentPage] = useState(1);
  
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPayments = async () => {
      if (!userId) {
        navigate("/admin-dashboard");
        return;
      }
      try {
        const response = await axios.get(`${apiConfig.baseURL}/api/stud/payment-history/${userId}`);
        const sortedUsers = response.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        setPaymenthistory(sortedUsers);
      } catch (error) {
        console.error("Error fetching payment history", {
          message: error.message,
          stack: error.stack,
          response: error.response?.data,
        });
      }
    };

    fetchPayments();
  }, [userId, navigate]); 

  const handleSortByDate = () => {
    const sorted = [...filteredPayments].sort((a, b) => {
      const dateA = new Date(a.createdAt);
      const dateB = new Date(b.createdAt);
      return sortOrder === "desc" ? dateA - dateB : dateB - dateA;
    });
  
    setFilteredPayments(sorted);
    setSortOrder(sortOrder === "asc" ? "desc" : "asc");
  };
  
 useEffect(() => {
    filterPayments();
  }, [searchTerm, fromDate, toDate, paymenthistory]);

  const filterPayments = () => {
    let filtered = [...paymenthistory];

    // Apply search
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter((payment) => {
        return (
          payment.userId?.username?.toLowerCase().includes(term) ||
          payment.paymentStatus?.toLowerCase().includes(term) ||
          payment.duration?.toLowerCase().includes(term) ||
          payment.razorpayPaymentId?.toLowerCase().includes(term)
        );
      });
    }

  // Date filter
  if (fromDate || toDate) {
    filtered = filtered.filter((payment) => {
      const paymentDate = new Date(payment.createdAt);
      const start = fromDate ? new Date(fromDate) : null;
      const end = toDate
        ? new Date(new Date(toDate).setHours(23, 59, 59, 999))
        : null;

      const afterFrom = !start || paymentDate >= start;
      const beforeTo = !end || paymentDate <= end;

      return afterFrom && beforeTo;
    });
  }
    setFilteredPayments(filtered);
    setCurrentPage(1); // Reset to first page after filtering
  };

  const indexOfLast = currentPage * rowsPerPage;
  const indexOfFirst = indexOfLast - rowsPerPage;
  const currentUsers = filteredPayments.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filteredPayments.length / rowsPerPage);

  const resetFilter = () => {
    setSearchTerm("");
    setFromDate("");
    setToDate("");
  };


  return (
    <>
    <Header />
    <AdminSidebar />
    <div className="admin-dashboard-page admin-main-content">
          <div className="search-bar-search">
                  <div className="search-container-table">
                    <FaSearch className="search-icon" />
                    <input
                      type="text"
                      placeholder="Search across all columns..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="search-input"
                    />
                  </div>
                </div>
        
                <div className="admin-dashboard-table-header">
                  <div className="rows-dropdown-left">
                    <label htmlFor="rowsPerPage">Rows per page:</label>
                    <select
                      id="rowsPerPage"
                      value={rowsPerPage}
                      onChange={(e) => {
                        const value =
                          e.target.value === "all"
                            ? filteredPayments.length
                            : parseInt(e.target.value);
                        setRowsPerPage(value);
                        setCurrentPage(1);
                      }}
                    >
                      <option value={30}>30</option>
                      <option value={50}>50</option>
                      <option value={100}>100</option>
                      <option value="all">All</option>
                    </select>
                  </div>
        
                  <div className="date-filter">
                    <label>From:</label>
                    <input
                      type="date"
                      value={fromDate}
                      onChange={(e) => setFromDate(e.target.value)}
                    />
        
                    <label>To:</label>
                    <input
                      type="date"
                      value={toDate}
                      onChange={(e) => setToDate(e.target.value)}
                    />
        
                    <button onClick={resetFilter}>Reset</button>
                  </div>
                </div>
        
           <div className="cam-scroll" style={{ overflowX: "auto" }}>
      <table className="admin-dashboard-table">
      <thead>
    <tr>
        <th>S.No</th>
        <th onClick={handleSortByDate} style={{ cursor: "pointer" }}>
        Payment Date {sortOrder === "asc" ? "▲" : "▼"}
      </th>  
      <th>UserName</th>
      <th>Amount</th>
      <th>Plan Details(Days)</th>
      <th>Expiry Date</th>
      <th>Payment Status</th>
      <th>Payment Id</th>
    </tr>
  </thead>
  <tbody>
  {currentUsers && currentUsers.length > 0 ? (
                currentUsers.map((payment) => (
        <tr key={payment._id}>
          <td>{paymenthistory.indexOf(payment) + 1}</td>
          <td>{new Date(payment.createdAt).toLocaleDateString()}</td>
          <td>{payment.userId?.username || "N/A"}</td>
          <td>₹{payment.amount}</td>
          <td>{payment.duration}</td>
          <td>{new Date(payment.expiryDate).toLocaleDateString()}</td>
          <td>{payment.paymentStatus}</td>
          <td>{payment.razorpayPaymentId || 'N/A'}</td>
        </tr>
      ))
    ) : (
      <tr>
        <td colSpan="6" style={{ textAlign: "center", padding: "10px" }}>
          No payment history available
        </td>
      </tr>
    )}
  </tbody>
</table>
      </div>
        {/* Pagination */}
        <div className="pagination-container">
          <div className="pagination-controls">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => p - 1)}
            >
              Prev
            </button>
            <span>
              Page {currentPage} of {totalPages}
            </span>
            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((p) => p + 1)}
            >
              Next
            </button>
          </div>
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
    </>
  );
}

export default UserPaymenthistory;
