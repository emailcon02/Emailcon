import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import './DashboardPage.css'; // Make sure to import styles

function AdminSidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminuserId");
    navigate("/admin-login");
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const items = [
    { icon: <i className="fas fa-tachometer-alt icon-hover"></i>, label: "Dashboard", path: "/super-admin-dashboard" },
    { icon: <i className="fas fa-users icon-hover"></i>, label: "User Details", path: "/user-detail" },
    { icon: <i className="fas fa-credit-card icon-hover"></i>, label: "Payment Details", path: "/all-user-payment-history" },
    { icon: <i className="fas fa-user-slash icon-hover"></i>, label: "Expired Users", path: "/expired-users" },
    { icon: <i className="fas fa-clipboard-list icon-hover"></i>, label: "Demo Request", path: "/user-enroll" },
    { icon: <i className="fas fa-users icon-hover"></i>, label: "Employee Details", path: "/employee-detail" },
    { icon: <i className="fas fa-user-plus icon-hover"></i>, label: "Add Admin", path: "/admin-user-create" },
    { icon: <i className="fas fa-sign-out-alt icon-hover"></i>, label: "Logout", path: "/admin-login", isLogout: true },
  ];

  return (
    <>
      <div className="mobile-toggle" onClick={toggleSidebar}>
        <i className="fas fa-bars"></i>
      </div>

      <div className={`admin-sidebar ${isSidebarOpen ? 'open' : ''}`}>
        {items.map(({ icon, label, path, isLogout }) =>
          isLogout ? (
            <div key={label} className="nav-item" onClick={handleLogout} style={{ cursor: "pointer" }}>
              <div className="nav-icon">{icon}</div>
              <div className="nav-label">{label}</div>
            </div>
          ) : (
            <Link key={label} to={path} className={`nav-item${location.pathname === path ? " active" : ""}`}>
              <div className="nav-icon">{icon}</div>
              <div className="nav-label">{label}</div>
            </Link>
          )
        )}
      </div>
    </>
  );
}

export default AdminSidebar;
