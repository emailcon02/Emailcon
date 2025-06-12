import React, { useEffect, useState } from "react";
import axios from "axios";
import "./AdminDashboard.css";
import { useNavigate } from "react-router-dom";
import { FaSearch,FaTrash } from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import apiconfig from "../../apiconfig/apiConfig.js";
import Header from "./Header.jsx";
import AdminSidebar from "./AdminSidebar.jsx";

function EmployeeDetails() {
  const [users, setUsers] = useState([]);
  const [statusLoadingId, setStatusLoadingId] = useState(null);
  const [sendLoadingId, setSendLoadingId] = useState(null);
   const [filteredUsers, setFilteredUsers] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [fromDate, setFromDate] = useState("");
    const [toDate, setToDate] = useState("");
    const [rowsPerPage, setRowsPerPage] = useState(20);
    const [currentPage, setCurrentPage] = useState(1);
    const [sortOrder, setSortOrder] = useState("asc");
         const [showDeleteModal, setShowDeleteModal] = useState(false);
          const [deleteUserId, setDeleteUserId] = useState(null);
    
  const navigate = useNavigate();

    const fetchUsers = async () => {
        const response = await axios.get(
          `${apiconfig.baseURL}/api/admin/users`
        );
    const sortedUsers = response.data.sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    );
      const filteredemployees = sortedUsers.filter(user => {
        const roles = user.role?.toLowerCase() || "";
        const exclude = roles.includes("employee");
        return exclude;
      });
    setUsers(filteredemployees);     
 };

  useEffect(() => {
    const adminToken = localStorage.getItem("adminToken");
    if (!adminToken) {
      navigate("/admin-login");
    } else {
    
      fetchUsers();
    }
  }, [navigate]);


  useEffect(() => {
      filterUsers();
    }, [searchTerm, fromDate, toDate, users]);
  
  const handleSortByDate = () => {
    const sorted = [...filteredUsers].sort((a, b) => {
      const dateA = new Date(a.createdAt);
      const dateB = new Date(b.createdAt);
      return sortOrder === "desc" ? dateA - dateB : dateB - dateA;
    });

    setFilteredUsers(sorted);
    setSortOrder(sortOrder === "asc" ? "desc" : "asc");
  };
  
  const filterUsers = () => {
    let filtered = [...users];

    // Apply search
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter((user) => {
        return (
          user.username?.toLowerCase().includes(term) ||
          user.email?.toLowerCase().includes(term) ||
          user.password?.toLowerCase().includes(term) ||
          user.smtppassword?.toLowerCase().includes(term) ||
          user.createdAt?.toLowerCase().includes(term) ||
          user.isActive?.toString().toLowerCase().includes(term)
        );
      });
    }

        // Date filter
  if (fromDate || toDate) {
    filtered = filtered.filter((user) => {
      const userDate = new Date(user.createdAt);
      const start = fromDate ? new Date(fromDate) : null;
      const end = toDate
        ? new Date(new Date(toDate).setHours(23, 59, 59, 999))
        : null;

      const afterFrom = !start || userDate >= start;
      const beforeTo = !end || userDate <= end;

      return afterFrom && beforeTo;
    });
  }

    setFilteredUsers(filtered);
    setCurrentPage(1); 
  };

  const indexOfLast = currentPage * rowsPerPage;
  const indexOfFirst = indexOfLast - rowsPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filteredUsers.length / rowsPerPage);

  const resetFilter = () => {
    setSearchTerm("");
    setFromDate("");
    setToDate("");
  };

  
const handleDeleteClick = (id) => {
  setDeleteUserId(id);
  setShowDeleteModal(true);
};



const ConfirmDeleteUser = async () => {
  try {
    const response = await axios.delete(`${apiconfig.baseURL}/api/stud/user/${deleteUserId}`);
        setShowDeleteModal(false);
        fetchUsers();
        toast.success(response.data.message);   
  } catch (error) {
    console.error("Error deleting user:", error);
    toast.error("Failed to delete user.");
  }
};

  const handlepaymentview = (userId) => {
    navigate(`/user-payment-history/${userId}`);
  };

  const handleSendCredentials = async (userId) => {
    setSendLoadingId(userId);
    try {
      await axios.post(`${apiconfig.baseURL}/api/admin/send-credentials`, {
        id: userId,
      });
      toast.success(`Login credentials sent successfully!`, {
        autoClose: 3000,
      });
    } catch (error) {
      console.error("Email sending error:", error);
      toast.error(`Failed to send login credentials`, {
        autoClose: 3000,
      });
    } finally {
      setSendLoadingId(null);
    }
  };

  const handleStatusChange = async (id, status) => {
    setStatusLoadingId(id);
    try {
      // Step 1: Update user status
      await axios.post(`${apiconfig.baseURL}/api/admin/update-status-employee`, {
        id,
        status
      });
  
      // Step 2: Update frontend state
      toast.success(`Account ${status ? "Activated" : "Deactivated"}`, {
        autoClose: 3000,
      });
  
      setUsers((prev) =>
        prev.map((user) =>
          user._id === id ? { ...user, isActive: status } : user
        )
      );
    } catch (error) {
      toast.error("Error updating status", { autoClose: 3000 });
    } finally {
      setStatusLoadingId(null);
    }
  };
  

  return (
    <>
    <Header/>
    <AdminSidebar/>
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
                    ? filteredUsers.length
                    : parseInt(e.target.value);
                setRowsPerPage(value);
                setCurrentPage(1);
              }}
            >
              <option value={20}>20</option>
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

      <div className="admin-scroll" style={{ overflowX: "auto" }}>
        <table className="admin-dashboard-table">
          <thead>
            <tr>
              <th>S.No</th>
              <th>Username</th>
              <th>Email</th>
              <th>Password</th>
              <th>SMTP Passcode</th>
                <th onClick={handleSortByDate} style={{ cursor: "pointer" }}>
        Signup Date {sortOrder === "asc" ? "▲" : "▼"}
      </th>  
              <th>Contact No</th>
              <th>Account Status</th>
              <th>Action</th>
              <th>Send Login</th>
              <th>Payment History</th>
                            <th>Permanent Deactivate</th>

            </tr>
          </thead>
          <tbody>
          {currentUsers && currentUsers.length > 0 ? (
                currentUsers.map((user, index) => (
              <tr key={user._id}>
                  <td>{indexOfFirst + index + 1}</td>
                <td>{user.username}</td>
                <td>{user.email}</td>
                <td>{user.password ? user.password.substring(0, 8) : ""}</td>
                <td>{user.smtppassword ? user.smtppassword.substring(0, 8) : ""}</td>
                <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                <td>{user.phone || "N/A"}</td>
                <td>{user.isActive ? "Active" : "Inactive"}</td>
                <td>
                  {statusLoadingId === user._id ? (
                    <div className="loader"></div>
                  ) : (
                    <label className="toggle-switch">
                      <input
                        type="checkbox"
                        checked={user.isActive}
                        onChange={() =>
                          handleStatusChange(user._id, !user.isActive)
                        }
                      />
                      <span className="slider"></span>
                    </label>
                  )}
                </td>
              
                <td>
                  <button
                    className="send-btn"
                    onClick={() => handleSendCredentials(user._id)}
                  >
                    {sendLoadingId === user._id ? (
                      <span className="loader-create-remainder"></span>
                    ) : (
                      "Send"
                    )}
                  </button>
                </td>
                <td>
                <button
                      className="payment-view"
                      onClick={() => handlepaymentview(user._id)}
                    >
                      View
                    </button>
                </td>
                   <td>
                                     <button
                                          className="deleteadmin"
                                                          onClick={() => handleDeleteClick(user._id)}
                                            >
                                            <FaTrash size={18} color="#f48c06" />
                                      </button>
                                </td>
              </tr>
            ))
            ) : (
              <tr>
                <td colSpan="10" style={{ textAlign: "center" }}>
                  No users found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

             {showDeleteModal && (
          <div className="admin-dashboard-modal-overlay">
            <div className="admin-dashboard-modal-box">
              <h2 className="admin-dashboard-modal-title">
                Confirm <span style={{ color: "#f48c06" }}>Delete</span>
              </h2>
              <p>Are you sure you want to delete this user?</p>
              <div className="modal-buttons">
                <button
                  onClick={ConfirmDeleteUser}
                  className="admin-dashboard-submit-btn"
                >
                  Yes, Delete
                </button>    
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="admin-dashboard-cancel-btn"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

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

export default EmployeeDetails;
