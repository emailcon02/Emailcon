import React, { useState, useEffect } from "react";
import "./DashboardPage.css";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Header from "./Header";
import AdminSidebar from "./AdminSidebar";
import axios from "axios";
import apiconfig from "../../apiconfig/apiConfig.js";
import UserChart from "./UserChart.jsx";

function DashboardPage() {
  const [activePeriod, setActivePeriod] = useState("Monthly");
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeUsers: 0,
    inactiveUsers: 0,
    trialRequests: 0,
    newUsers: 0,
    newTrialUsers: 0,
  });
  const [selectedDate, setSelectedDate] = useState(new Date());

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await axios.get(`${apiconfig.baseURL}/api/admin/users`);
        const users = response.data;
  
        const trailresponse = await axios.get(`${apiconfig.baseURL}/api/stud/all-payment-history`);
        const trailUsers = trailresponse.data.filter(user => user.paymentStatus === "trial");
  
        const selectedStr = selectedDate.toISOString().split('T')[0];
  
        const newTrialUsers = trailresponse.data.filter(user => {
          const createdDateStr = new Date(user.createdAt).toISOString().split('T')[0];
          return user.paymentStatus?.toLowerCase() === "trial" && createdDateStr === selectedStr;
        });
  
        const newUsers = users.filter(user => {
          const createdDateStr = user.createdAt
            ? new Date(user.createdAt).toISOString().split('T')[0]
            : null;
          return user.isActive === true && createdDateStr === selectedStr;
        });
        
        setStats({
          totalUsers: users.length,
          activeUsers: users.filter(user => user.isActive).length,
          inactiveUsers: users.filter(user => !user.isActive).length,
          trialRequests: trailUsers.length,
          newTrialUsers: newTrialUsers.length || 0,
          newUsers: newUsers.length || 0,
        });
      } catch (error) {
        console.error("Error fetching user stats:", error);
      }
    };
  
    fetchStats();
  }, [selectedDate]); // <== Rerun when selectedDate changes
  

  const dataMap = {
    Daily: [
      { id: "active", label: "Active Users", value: `${stats.activeUsers} (${((stats.activeUsers/stats.totalUsers)*100).toFixed(0)}%)`, color: "#4169e1" },
      { id: "inactive", label: "Inactive Users", value: `${stats.inactiveUsers} (${((stats.inactiveUsers/stats.totalUsers)*100).toFixed(0)}%)`, color: "#9370db" },
      { id: "total", label: "Total Users", value: `${stats.totalUsers} (100%)`, color: "#f79e19" },
    ],
    Weekly: [
      { id: "active", label: "Active Users", value: `${stats.activeUsers} (${((stats.activeUsers/stats.totalUsers)*100).toFixed(0)}%)`, color: "#4169e1" },
      { id: "inactive", label: "Inactive Users", value: `${stats.inactiveUsers} (${((stats.inactiveUsers/stats.totalUsers)*100).toFixed(0)}%)`, color: "#9370db" },
      { id: "total", label: "Total Users", value: `${stats.totalUsers} (100%)`, color: "#f79e19" },
    ],
    Monthly: [
      { id: "active", label: "Active Users", value: `${stats.activeUsers} (${((stats.activeUsers/stats.totalUsers)*100).toFixed(0)}%)`, color: "#4169e1" },
      { id: "inactive", label: "Inactive Users", value: `${stats.inactiveUsers} (${((stats.inactiveUsers/stats.totalUsers)*100).toFixed(0)}%)`, color: "#9370db" },
      { id: "total", label: "Total Users", value: `${stats.totalUsers} (100%)`, color: "#f79e19" },
    ],
    Yearly: [
      { id: "active", label: "Active Users", value: `${stats.activeUsers} (${((stats.activeUsers/stats.totalUsers)*100).toFixed(0)}%)`, color: "#4169e1" },
      { id: "inactive", label: "Inactive Users", value: `${stats.inactiveUsers} (${((stats.inactiveUsers/stats.totalUsers)*100).toFixed(0)}%)`, color: "#9370db" },
      { id: "total", label: "Total Users", value: `${stats.totalUsers} (100%)`, color: "#f79e19" },
    ],
  };

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  return (
    <>
      <Header/>
      <AdminSidebar/>
        <div className="admin-main-content">
          <div className="dashboard-header">
            <div>
              <h1 className="dashboard-title">Emailcon Analytics</h1>
              <p className="dashboard-subtitle">
                Track Your Emailcon Users Data Smarter.
              </p>
            </div>

            <div className="date-filter-main">
              <div className="date-filter-dashboard">
                <DatePicker
                  selected={selectedDate}
                  onChange={handleDateChange}
                  dateFormat="MMMM d, yyyy"
                  className="date-picker-input"
                />
              </div>

              <div className="filter-button">
                <span>Apply Filters</span>
              </div>
            </div>
          </div>

          <div className="dashboard-grid">
         

 <div className="quick-stats">
            {[
              {
                icon: <i className="fas fa-users"></i>, // Total users
                title: "Total Users",
                value: stats.totalUsers.toString(),
                badge: `+${stats.newUsers} New Users`,
                gradient: "blue-gradient",
                badgeClass: "badge-blue",
              },
              {
                icon: <i className="fas fa-user-check"></i>, // Active users
                title: "Active Users",
                value: stats.activeUsers.toString(),
                badge: `${(
                  (stats.activeUsers / stats.totalUsers) *
                  100
                ).toFixed(0)}% of Total`,
                gradient: "purple-gradient",
                badgeClass: "badge-purple",
              },
              {
                icon: <i className="fas fa-user-clock"></i>, // Idle/inactive
                title: "Inactive Users",
                value: stats.inactiveUsers.toString(),
                badge: `${(
                  (stats.inactiveUsers / stats.totalUsers) *
                  100
                ).toFixed(0)}% of Total`,
                gradient: "green-gradient",
                badgeClass: "badge-green",
              },
              {
                icon: <i className="fas fa-user-plus"></i>, // New trial users
                title: "Trial Users",
                value: stats.trialRequests.toString(),
                badge: `+${stats.newTrialUsers} New Trials`,
                gradient: "orange-gradient",
                badgeClass: "badge-orange",
              },
            ].map(({ icon, title, value, badge, gradient, badgeClass }) => (
              <div className={`stat-card ${gradient}`} key={title}>
                <div className="stat-content">
                  <div className="stat-title">{title}</div>
                  <div className="stat-value">{value}</div>
                  <div className={`stat-badge ${badgeClass}`}>{badge}</div>
                </div>
                <div className="start-icon-container">
                  <div className={`stat-icon ${gradient}`}>{icon}</div>
                </div>
              </div>
            ))}
          </div>

            <div className="revenue-chart-container">
              <div className="chart-header">
                <div className="chart-title">User Distribution</div>
                <div className="period-tabs">
                  {["Daily", "Weekly", "Monthly", "Yearly"].map((period) => (
                    <div
                      className={`period-tab${period === activePeriod ? " active" : ""}`}
                      key={period}
                      onClick={() => setActivePeriod(period)}
                      style={{ cursor: "pointer" }}
                    >
                      {period}
                    </div>
                  ))}
                </div>
              </div>

              <div className="revenue-chart">
                <div className="circular-chart">
                  <div 
                    className="donut-chart"
                    style={{
                      background: `conic-gradient(
                        ${dataMap[activePeriod][0].color} 0% ${(stats.activeUsers/stats.totalUsers)*100}%,
                        ${dataMap[activePeriod][1].color} ${(stats.activeUsers/stats.totalUsers)*100}% ${((stats.activeUsers + stats.inactiveUsers)/stats.totalUsers)*100}%,
                        ${dataMap[activePeriod][2].color} ${((stats.activeUsers + stats.inactiveUsers)/stats.totalUsers)*100}% ${((stats.activeUsers + stats.inactiveUsers + stats.trialRequests)/stats.totalUsers)*100}%
                      )`
                    }}
                  >
                    <div className="donut-hole">
                      <div className="donut-total">{stats.totalUsers}</div>
                      <div className="donut-label">Total Users</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="chart-legend">
                {dataMap[activePeriod].map(({ id, label, value, color }) => (
                  <div className="legend-item" key={id} id={id}>
                    <div
                      className="legend-color"
                      style={{ backgroundColor: color }}
                    ></div>
                    <div>
                      {label}: {value}
                    </div>
                  </div>
                ))}
              </div>

            </div>
            <UserChart/>

          </div>
        </div>
    </>
  );
}

export default DashboardPage;