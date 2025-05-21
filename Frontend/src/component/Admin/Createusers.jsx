import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Createusers.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import apiconfig from '../../apiconfig/apiConfig';
import Header from './Header';
import AdminSidebar from './AdminSidebar';
import { FaEdit, FaTrash } from 'react-icons/fa';

const Createusers = () => {
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState({ email: '', username: '', password: '', role: '' });
  const [showModal, setShowModal] = useState(false);

  const fetchUsers = async () => {
    const res = await axios.get(apiconfig.baseURL + '/api/admin/getadminuser');
    setUsers(res.data);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    await axios.post(apiconfig.baseURL + '/api/admin/admin-user-create', form);
    setForm({ email: '', username: '', password: '', role: 'user' });
    setShowModal(false);
    fetchUsers();
  };

  return (
    <>
    <Header/>
    <AdminSidebar/>    
    <div className="admin-dashboard-user-list admin-main-content">
      <button onClick={() => setShowModal(true)} className="admin-dashboard-create-btn">+ Create New Admin</button>

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
                  <option value="sub-admin">sub-admin</option>
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
          {users.map(user => (
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
                    style={{ backgroundColor: '#f48c06', color: 'white' }}
                    onClick={() => {
                        toast.success('Login details sent successfully!');
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
                            toast.success(user.isActive ? 'Account Deactivated!' : 'Account Activated!');
                        }}
                    />
                    <span className="slider"></span>
                    </label>
                </td>
                    <td >
                        <div className="action-button-admin">

                        <button
                         className="editadmin"
                                //  onClick={() => handleEditStudent(student)}
                                           >
                                             <FaEdit size={18} color="green" />
                                           </button>
                                           <button
                                             className="deleteadmin"
                                            //  onClick={handleDeleteSelectedStudents}
                                           >
                                             <FaTrash size={18} color="red" />
                                           </button>
                        </div>
                       
                                 </td>
            </tr>
          ))}
        </tbody>
      </table>
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
