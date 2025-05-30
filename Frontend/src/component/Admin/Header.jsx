import React from 'react'
import avatarimg from "../../Images/admin-avatar.png";
function Header() {
  return (
    <div>
         {/* Header Bar */}
      <div className="header-bar">
        <div className="brand-container">
          <div className="brand-logo">E</div>
          <div className="brand-name">
            Email<span style={{ color: "#f48c06" }}>con</span>
          </div>
        </div>

        <div className="header-actions">
          <div className="search-bar-header">
            <span role="img" aria-label="search">
              🔍
            </span>
            <input type="text" placeholder="Search..." />
          </div>

          <div className='dashboard-notify' role="img" aria-label="notification">
            🔔
          </div>

          <div className="user-profile">
            <div className="admin-user-avatar">
              <img src={avatarimg} alt="User Avatar" className="admin-avatar-img" />
            </div>
            <div>Imagecon Academy</div>
          </div>

        </div>
      </div>

    </div>
  )
}

export default Header