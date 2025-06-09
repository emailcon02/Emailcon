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
  const [sortOrder, setSortOrder] = useState("asc");
      const [searchTerm, setSearchTerm] = useState("");
      const [fromDate, setFromDate] = useState("");
      const [toDate, setToDate] = useState("");
      const [rowsPerPage, setRowsPerPage] = useState(20);
      const [currentPage, setCurrentPage] = useState(1);
      const [showDeleteModal, setShowDeleteModal] = useState(false);
      const [deleteUserId, setDeleteUserId] = useState(null);
        const [sendLoadingId, setSendLoadingId] = useState(null);
          const [statusLoadingId, setStatusLoadingId] = useState(null);
      const [editForm, setEditForm] = useState({
        email: "",
        username: "",
        password: "",
        role: "",
      });
      const [showEditModal, setShowEditModal] = useState(false);
      const [editUserId, setEditUserId] = useState(null);

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
            user.role?.toLowerCase().includes(term) ||
            user.createdAt?.toLowerCase().includes(term) 
         
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
  

  const handleCreate = async (e) => {
    e.preventDefault();
    await axios.post(apiconfig.baseURL + "/api/admin/admin-user-create", form);
    setForm({ email: "", username: "", password: "", role: "user" });
    setShowModal(false);
    fetchUsers();
  };

  const handleEditClick = (user) => {
    setEditForm({
      email: user.email,
      username: user.username,
      password: user.password,
      role: user.role,
    });
    setEditUserId(user._id);
    setShowEditModal(true);
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(
        apiconfig.baseURL + `/api/admin/edit-user/${editUserId}`,
        editForm
      );
      setShowEditModal(false);
      fetchUsers(); // Refresh the user list
      toast.success("User updated successfully!");
    } catch (error) {
      console.error("Error updating user:", error);
      toast.error("Failed to update user.");
    }
  };

const handleDeleteClick = (id) => {
  setDeleteUserId(id);
  setShowDeleteModal(true);
};

const confirmDeleteUser = async () => {
  try {
    await axios.delete(
      apiconfig.baseURL + `/api/admin/delete-user/${deleteUserId}`
    );
    setShowDeleteModal(false);
    fetchUsers(); // Refresh the user list
    toast.success("User deleted successfully!");
  } catch (error) {
    console.error("Error deleting user:", error);
    toast.error("Failed to delete user.");
  }
};
const handleSendCredentials = async (userId) => {
    setSendLoadingId(userId);
    try {
      await axios.post(`${apiconfig.baseURL}/api/admin/admin-send-credentials`, {
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
        await axios.post(`${apiconfig.baseURL}/api/admin/update-admin-status-manually`, {
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

        <button
          onClick={() => setShowModal(true)}
          className="admin-dashboard-create-btn"
        >
          + Create New Admin
        </button>

        {showModal && (
          <div className="admin-dashboard-modal-overlay">
            <div className="admin-dashboard-modal-box">
              <h2 className="admin-dashboard-modal-title">
                Create <span style={{ color: "#f48c06" }}>Admin</span>
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
                  type="text"
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
                  <option value="admin">admin</option>
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

        {showEditModal && (
          <div className="admin-dashboard-modal-overlay">
            <div className="admin-dashboard-modal-box">
              <h2 className="admin-dashboard-modal-title">
                Edit <span style={{ color: "#f48c06" }}>Admin</span>
              </h2>
              <form onSubmit={handleEditSubmit}>
                <label>Email</label>
                <input
                  placeholder="Email"
                  type="email"
                  value={editForm.email}
                  onChange={(e) =>
                    setEditForm({ ...editForm, email: e.target.value })
                  }
                  required
                  className="admin-dashboard-input"
                />
                <label>Username</label>
                <input
                  placeholder="Username"
                  value={editForm.username}
                  onChange={(e) =>
                    setEditForm({ ...editForm, username: e.target.value })
                  }
                  required
                  className="admin-dashboard-input"
                />
                <label>Password</label>
                <input
                  placeholder="Password"
                  type="text"
                  value={editForm.password}
                  onChange={(e) =>
                    setEditForm({ ...editForm, password: e.target.value })
                  }
                  required
                  className="admin-dashboard-input"
                />
                <label>Role</label>
                <select
                  value={editForm.role}
                  onChange={(e) =>
                    setEditForm({ ...editForm, role: e.target.value })
                  }
                  required
                  className="admin-dashboard-select"
                >
                  <option value="">-- Select Role --</option>
                  <option value="admin">admin</option>
                  <option value="business-admin">business-admin</option>
                  <option value="manager">Manager</option>
                </select>

                <button type="submit" className="admin-dashboard-submit-btn">
                  Update
                </button>
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="admin-dashboard-cancel-btn"
                >
                  Cancel
                </button>
              </form>
            </div>
          </div>
        )}

        {showDeleteModal && (
          <div className="admin-dashboard-modal-overlay">
            <div className="admin-dashboard-modal-box">
              <h2 className="admin-dashboard-modal-title">
                Confirm <span style={{ color: "#f48c06" }}>Delete</span>
              </h2>
              <p>Are you sure you want to delete this user?</p>
              <div className="modal-buttons">
                <button
                  onClick={confirmDeleteUser}
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
          <div className="cam-scroll" style={{ overflowX: "auto" }}>
        <table className="admin-dashboard-table">
          <thead>
            <tr>
              <th>S.No</th>
              <th>Username</th>
              <th>Email</th>
              <th>Password</th>
                <th onClick={handleSortByDate} style={{ cursor: "pointer" }}>
        Created At {sortOrder === "asc" ? "▲" : "▼"}
      </th>             
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
                  <td>
                    {new Date(user.createdAt).toLocaleDateString("en-IN")}
                  </td>
                  <td>{user.role}</td>
                  <td>
                  <button
                    className="send-btn"
                    style={{ backgroundColor: "#f48c06" }}
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
                    <div className="action-button-admin">
                      <button
                        className="editadmin"
                        onClick={() => handleEditClick(user)}
                      >
                        <FaEdit size={18} color="#2f327d" />
                      </button>
                      <button
                        className="deleteadmin"
                        onClick={() => handleDeleteClick(user._id)}
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
