import React, { useEffect, useState } from "react";
import axios from "axios";
import "./AdminDashboard.css"; // Import the CSS file
import { ToastContainer, toast } from "react-toastify";
import { FaSearch } from "react-icons/fa";
import "react-toastify/dist/ReactToastify.css";
import apiconfig from "../../apiconfig/apiConfig.js";
import Header from "./Header.jsx";
import Sidebar from "./AdminSidebar.jsx";
function UserRequestForm() {
  const [users, setUsers] = useState([]);
    const [filterRequest, setFilterRequest] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [fromDate, setFromDate] = useState("");
    const [toDate, setToDate] = useState("");
    const [rowsPerPage, setRowsPerPage] = useState(20);
    const [currentPage, setCurrentPage] = useState(1);
    const [sortOrder, setSortOrder] = useState("asc");
const [isRemarkModalOpen, setIsRemarkModalOpen] = useState(false);
const [selectedRemark, setSelectedRemark] = useState('');

const openRemarkModal = (remark) => {
  setSelectedRemark(remark);
  setIsRemarkModalOpen(true);
};

const closeRemarkModal = () => {
  setIsRemarkModalOpen(false);
};



useEffect(() => {
    const fetchRequest = async () => {
      try {
        const response = await axios.get(
          `${apiconfig.baseURL}/api/admin/user-form-data`
        );
        setUsers(response.data);
      } catch (error) {
        console.error("Error fetching demo request", error);
      }
    };
    fetchRequest();
  }, []);

  useEffect(() => {
    filteredRequest();
  }, [searchTerm, fromDate, toDate, users]);

  const handleSortByDate = () => {
    const sorted = [...filterRequest].sort((a, b) => {
      const dateA = new Date(a.createdAt);
      const dateB = new Date(b.createdAt);
      return sortOrder === "desc" ? dateA - dateB : dateB - dateA;
    });
  
    setFilterRequest(sorted);
    setSortOrder(sortOrder === "asc" ? "desc" : "asc");
  };
  

  const filteredRequest = () => {
    let filtered = [...users];

    // Apply search
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter((payment) => {
        return (
          payment.name?.toLowerCase().includes(term) ||
          payment.email?.toLowerCase().includes(term) ||
          payment.phone?.toLowerCase().includes(term) ||
          payment.state?.toLowerCase().includes(term) ||
          payment.district?.toLowerCase().includes(term) ||
          payment.gender?.toLowerCase().includes(term) ||
          payment.type?.toLowerCase().includes(term) ||
          payment.profession?.toLowerCase().includes(term) ||
          payment.status?.toLowerCase().includes(term) ||
          payment.remarks?.toLowerCase().includes(term)
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

    setFilterRequest(filtered);
    setCurrentPage(1); // Reset to first page after filtering
  };

  const indexOfLast = currentPage * rowsPerPage;
  const indexOfFirst = indexOfLast - rowsPerPage;
  const currentUsers = filterRequest.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filterRequest.length / rowsPerPage);

  const resetFilter = () => {
    setSearchTerm("");
    setFromDate("");
    setToDate("");
  };

 
  return (
    <>
    <Header />
    <Sidebar/>
  
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
                          ? filterRequest.length
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
        Date {sortOrder === "asc" ? "▲" : "▼"}
      </th>
                    <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>State</th>
              <th>District</th>
              <th>Gender</th>
              <th>Type</th>
              <th>Profession</th>
              <th>Status</th>
              <th>Remarks</th>
            </tr>
          </thead>
          <tbody>
          {currentUsers && currentUsers.length > 0 ? (
                currentUsers.map((user) => (
              <tr key={user._id}>
                <td>{users.indexOf(user) + 1}</td>
                <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>{user.phone}</td>
                <td>{user.state}</td>
                <td>{user.district}</td>
                <td>{user.gender}</td>
                <td>{user.type}</td>
                <td>{user.profession}</td>
                <td>
                    {user.status === "pending" ? (
                      <span style={{ color: "orange" }}>Pending</span>
                    ) : user.status === "purchased" ? (
                      <span style={{ color: "green" }}>Purchased</span>
                    ) : (
                      <span style={{ color: "red" }}>Not Interested</span>
                    )}
                </td>
<td
  style={{
    maxWidth: '150px',
    cursor: 'pointer',
    color: '#007bff',
    textDecoration: 'underline'
  }}
  onClick={() => openRemarkModal(user.remarks)}
>
  {user.remarks
    ? user.remarks.length > 20
      ? `${user.remarks.slice(0, 20)}...`
      : user.remarks
    : <span style={{ fontSize: "12px", color: "#888" }}>N/A</span>
  }
</td>


              </tr>
            ))
            ) : (
              <tr>
                <td colSpan="12" style={{ textAlign: "center" }}>
                  No data available
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
{isRemarkModalOpen && (
  <div style={{
    position: 'fixed',
    top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000
  }}>
    <div style={{
      backgroundColor: '#fff',
      padding: '20px',
      borderRadius: '10px',
      maxWidth: '400px',
      width: '90%',
      boxShadow: '0 5px 15px rgba(0,0,0,0.3)',
      fontFamily: 'Arial, sans-serif'
    }}>
      <h4 style={{ marginTop: 0 }}>Full Remark</h4>
      <p style={{ whiteSpace: 'pre-wrap', margin: '20px 0' }}>{selectedRemark || "N/A"}</p>
      <button
        onClick={closeRemarkModal}
        style={{
          padding: '8px 16px',
          backgroundColor: '#f8c604',
          color: '#fff',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer'
        }}
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
        hideProgressBar={true} // Disable progress bar
        closeOnClick={false}
        closeButton={false}
        pauseOnHover={true}
        draggable={true}
        theme="light" // Optional: Choose theme ('light', 'dark', 'colored')
      />
    </div>
    </>
  );
}

export default UserRequestForm;
