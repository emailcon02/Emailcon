import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Createusers.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import apiconfig from "../../apiconfig/apiConfig";
import Header from "./Header";
import AdminSidebar from "./AdminSidebar";
import { FaSearch } from "react-icons/fa";
import { FaEdit, FaTrash } from "react-icons/fa";

const Createusers = () => {
  const [users, setUsers] = useState([]);
   const [filteredUsers, setFilteredUsers] = useState([]);
      const [searchTerm, setSearchTerm] = useState("");
      const [fromDate, setFromDate] = useState("");
      const [toDate, setToDate] = useState("");
      const [rowsPerPage, setRowsPerPage] = useState(20);
      const [currentPage, setCurrentPage] = useState(1);
  const [form, setForm] = useState({
    email: "",
    username: "",
    password: "",
    role: "",
  });
  const [showModal, setShowModal] = useState(false);

  const fetchUsers = async () => {
    const res = await axios.get(apiconfig.baseURL + "/api/admin/getadminuser");
    setUsers(res.data);
  };

  useEffect(() => {
    fetchUsers();
  }, []);
   useEffect(() => {
        filterUsers();
      }, [searchTerm, fromDate, toDate, users]);
    
  
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
            user.role?.toLowerCase().includes(term) ||
            user.createdAt?.toLowerCase().includes(term) 
         
          );
        });
      }
  
      // Apply date filter
      if (fromDate || toDate) {
        filtered = filtered.filter((user) => {
          const paymentDate = new Date(user.createdAt);
          const from = fromDate ? new Date(fromDate) : null;
          const to = toDate ? new Date(toDate) : null;
  
          const afterFrom = !from || paymentDate >= from;
          const beforeTo = !to || paymentDate <= to;
  
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
  

  const handleCreate = async (e) => {
    e.preventDefault();
    await axios.post(apiconfig.baseURL + "/api/admin/admin-user-create", form);
    setForm({ email: "", username: "", password: "", role: "user" });
    setShowModal(false);
    fetchUsers();
  };

  return (
    <>
      <Header />
      <AdminSidebar />
      <div className="admin-dashboard-user-list admin-main-content">
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


        <button
          onClick={() => setShowModal(true)}
          className="admin-dashboard-create-btn"
        >
          + Create New Employee
        </button>

        {showModal && (
          <div className="admin-dashboard-modal-overlay">
            <div className="admin-dashboard-modal-box">
              <h2 className="admin-dashboard-modal-title">
                Create <span style={{ color: "#f48c06" }}>Employee</span>
              </h2>
              <form onSubmit={handleCreate}>
                <label>Email</label>
                <input
                  placeholder="Email"
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  required
                  className="admin-dashboard-input"
                />
                <label>Username</label>
                <input
                  placeholder="Username"
                  value={form.username}
                  onChange={(e) =>
                    setForm({ ...form, username: e.target.value })
                  }
                  required
                  className="admin-dashboard-input"
                />
                <label>Password</label>
                <input
                  placeholder="Password"
                  type="password"
                  value={form.password}
                  onChange={(e) =>
                    setForm({ ...form, password: e.target.value })
                  }
                  required
                  className="admin-dashboard-input"
                />
                <label>Role</label>
                <select
                  value={form.role}
                  onChange={(e) => setForm({ ...form, role: e.target.value })}
                  required
                  className="admin-dashboard-select"
                >
                  <option value="">-- Select Role --</option>
                  <option value="sub-admin">admin</option>
                  <option value="business-admin">business-admin</option>
                  <option value="manager">Manager</option>
                </select>

                <button type="submit" className="admin-dashboard-submit-btn">
                  Create
                </button>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="admin-dashboard-cancel-btn"
                >
                  Cancel
                </button>
              </form>
            </div>
          </div>
        )}

        <table className="admin-dashboard-table">
          <thead>
            <tr>
              <th>S.No</th>
              <th>Username</th>
              <th>Email</th>
              <th>Password</th>
              <th>Created At</th>
              <th>Role</th>
              <th>Send Login</th>
              <th>Account Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
          {currentUsers && currentUsers.length > 0 ? (
                currentUsers.map((user) => (
              <tr key={user._id}>
                <td>{users.indexOf(user) + 1}</td>
                <td>{user.username}</td>
                <td>{user.email}</td>
                <td>{user.password}</td>
                <td>{new Date(user.createdAt).toLocaleDateString("en-IN")}</td>
                <td>{user.role}</td>
                <td>
                  <button
                    className="send-btn"
                    style={{ backgroundColor: "#f48c06", color: "white" }}
                    onClick={() => {
                      toast.success("Login details sent successfully!");
                    }}
                  >
                    Send
                  </button>
                </td>
                <td>
                  <label className="toggle-switch">
                    <input
                      type="checkbox"
                      checked={user.isActive}
                      onChange={() => {
                        toast.success(
                          user.isActive
                            ? "Account Deactivated!"
                            : "Account Activated!"
                        );
                      }}
                    />
                    <span className="slider"></span>
                  </label>
                </td>
                <td>
                  <div className="action-button-admin">
                    <button
                      className="editadmin"
                      //  onClick={() => handleEditStudent(student)}
                    >
                      <FaEdit size={18} color="#2f327d" />
                    </button>
                    <button
                      className="deleteadmin"
                      //  onClick={handleDeleteSelectedStudents}
                    >
                      <FaTrash size={18} color="#f48c06" />
                    </button>
                  </div>
                </td>
              </tr>
            ))
            ) : (
              <tr>
                <td colSpan="9" style={{ textAlign: "center" }}>
                  No users found
                </td>
              </tr>
            )}
          </tbody>
        </table>

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
};

export default Createusers;
