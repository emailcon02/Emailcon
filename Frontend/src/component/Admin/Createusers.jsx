import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Createusers.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import apiconfig from '../../apiconfig/apiConfig';

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
    <div className="admin-dashboard-user-list">
      <h1 className="admin-dashboard-title">Admin Panel</h1>
      <button onClick={() => setShowModal(true)} className="admin-dashboard-create-btn">Create User</button>

      {showModal && (
        <div className="admin-dashboard-modal-overlay">
          <div className="admin-dashboard-modal-box">
            <h2 className="admin-dashboard-modal-title">Create User</h2>
            <form onSubmit={handleCreate}>
  <input
    placeholder="Email"
    type="email"
    value={form.email}
    onChange={(e) => setForm({ ...form, email: e.target.value })}
    required
    className="admin-dashboard-input"
  />
  <input
    placeholder="Username"
    value={form.username}
    onChange={(e) => setForm({ ...form, username: e.target.value })}
    required
    className="admin-dashboard-input"
  />
  <input
    placeholder="Password"
    type="password"
    value={form.password}
    onChange={(e) => setForm({ ...form, password: e.target.value })}
    required
    className="admin-dashboard-input"
  />
<select
  value={form.role}
  onChange={(e) => setForm({ ...form, role: e.target.value })}
  required
  className="admin-dashboard-input"
>
  <option value="">-- Select Role --</option>
  <option value="admin">sub-admin</option>
  <option value="user">business-admin</option>
  <option value="manager">Manager</option>
</select>

  <button type="submit" className="admin-dashboard-submit-btn">Create</button>
  <button type="button" onClick={() => setShowModal(false)} className="admin-dashboard-cancel-btn">Cancel</button>
</form>

          </div>
        </div>
      )}

      <table className="admin-dashboard-user-list-table">
        <thead>
          <tr>
            <th>Email</th>
            <th>Username</th>
            <th>Role</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user._id}>
              <td>{user.email}</td>
              <td>{user.username}</td>
              <td>{user.role}</td>
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
  );
};

export default Createusers;
