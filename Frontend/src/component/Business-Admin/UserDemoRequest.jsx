import React, { useEffect, useState } from "react";
import axios from "axios";
import "../Admin/AdminDashboard.css"; // Import the CSS file
import { ToastContainer, toast } from "react-toastify";
import { FaSearch } from "react-icons/fa";
import "react-toastify/dist/ReactToastify.css";
import apiconfig from "../../apiconfig/apiConfig.js";
import Header from "./Header.jsx";
import Sidebar from "./AdminSidebar.jsx";
function UserDemoRequest() {
  const [users, setUsers] = useState([]);
    const [filterRequest, setFilterRequest] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [fromDate, setFromDate] = useState("");
    const [toDate, setToDate] = useState("");
    const [rowsPerPage, setRowsPerPage] = useState(20);
    const [currentPage, setCurrentPage] = useState(1);
    const [sortOrder, setSortOrder] = useState("asc");
    const [isModalOpen, setIsModalOpen] = useState(false);
const [selectedUser, setSelectedUser] = useState(null);
const [editStatus, setEditStatus] = useState("");
const [editRemark, setEditRemark] = useState("");

const openEditModal = (user) => {
  setSelectedUser(user);
  setEditStatus(user.status);
  setEditRemark(user.remarks);
  setIsModalOpen(true);
};

const closeModal = () => {
  setIsModalOpen(false);
  setSelectedUser(null);
};

const saveChanges = async () => {
  try {
    await axios.put(`${apiconfig.baseURL}/api/admin/update-form-data/${selectedUser._id}`, {
      status: editStatus,
      remarks: editRemark,
    });

    // Update frontend
    setUsers((prev) =>
      prev.map((user) =>
        user._id === selectedUser._id ? { ...user, status: editStatus, remarks: editRemark } : user
      )
    );

    toast.success("Updated successfully");
    closeModal();
  } catch (err) {
    toast.error("Update failed");
  }
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
<td>
  {user.remarks.length > 8
    ? `${user.remarks.substring(0, 8)}...`
    : user.remarks}
  <span
    style={{ marginLeft: "10px", color: "blue", cursor: "pointer" }}
    onClick={() => openEditModal(user)}
  >
    ✏️
  </span>
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

{isModalOpen && (
  <>
    <style>
      {`
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0, 0, 0, 0.4);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
        }

        .modal-content {
          background: rgba(255, 255, 255, 0.85);
          backdrop-filter: blur(10px);
          border-radius: 12px;
          padding: 30px;
          width: 90%;
          max-width: 400px;
          box-shadow: 0 8px 30px rgba(0, 0, 0, 0.2);
          animation: slideDown 0.3s ease-out;
        }

        @keyframes slideDown {
          from {
            transform: translateY(-30px);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }

        .modal-content h3 {
          margin-bottom: 20px;
          color: #2f327d;
          font-size: 22px;
          text-align: center;
        }

        .modal-content label {
          display: block;
          margin-top: 15px;
          margin-bottom: 6px;
          font-weight: 600;
          color: #222;
        }

        .modal-content select,
        .modal-content textarea {
          width: 100%;
          padding: 10px;
          border-radius: 8px;
          border: 1px solid #ccc;
          font-size: 15px;
          resize: none;
        }

        .modal-buttons {
          display: flex;
          justify-content: space-between;
          margin-top: 20px;
        }

        .modal-buttons button {
          flex: 1;
          margin: 0 5px;
          padding: 10px 15px;
          font-size: 15px;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          transition: background 0.3s ease;
        }

        .modal-buttons button:first-child {
          background:#2f327d;
          color: white;
        }

        .modal-buttons button:first-child:hover {
          background:;rgb(39, 41, 101);
        }

        .modal-buttons button:last-child {
          background:#f8c604;
          color: white;
        }

        .modal-buttons button:last-child:hover {
          background:rgb(230, 185, 6);
        }
      `}
    </style>

    <div className="modal-overlay">
      <div className="modal-content">
        <h3>Edit Status & Remarks</h3>
        <label>Status:</label>
        <select value={editStatus} onChange={(e) => setEditStatus(e.target.value)}>
          <option value="pending">Pending</option>
          <option value="purchased">Purchased</option>
          <option value="not interested">Not Interested</option>
        </select>

        <label>Remarks:</label>
        <textarea
          rows="5"
          value={editRemark}
          onChange={(e) => setEditRemark(e.target.value)}
        ></textarea>

        <div className="modal-buttons">
          <button onClick={saveChanges}>Save</button>
          <button onClick={closeModal}>Cancel</button>
        </div>
      </div>
    </div>
  </>
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
        theme="light" 
      />
    </div>
    </>    
  );
}

export default UserDemoRequest;
