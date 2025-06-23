import React, { useState,useEffect } from 'react'
import avatarimg from "../../Images/admin-avatar.png";
import logo from "../../Images/emailcon_logo.png";
import axios from 'axios';
import apiConfig from '../../apiconfig/apiConfig.js';
import { useNavigate } from 'react-router-dom';
function Header() {
    const [user, setUser] = useState({});
    const adminuserId = localStorage.getItem("adminuserId");
    const navigate = useNavigate();
      useEffect(() => {
          const fetchuserdata = async () => {
            if (!adminuserId) {
              navigate("/admin-login"); 
              return;
            }
      
            try {
              const res = await axios.get(
                `${apiConfig.baseURL}/api/stud/adminuserdata/${adminuserId}` // Use adminuserId to fetch user data
              );
              setUser(res.data);
            } catch (err) {
              console.error(err);
              console.log("Failed to fetch admin userdata");
            }
          };
          fetchuserdata();
        }, [adminuserId, navigate]);


  return (
    <div>
         {/* Header Bar */}
      <div className="header-bar">
          <div className="brand-name">
          <img src={logo} alt="imagehomenav" className="logo_img"/>
          </div>


        <div className="header-actions">
          <div className="search-bar-header">
            <span role="img" aria-label="search">
              🔍
            </span>
            <input type="text" placeholder="Search..." />
          </div>

          <div role="img" aria-label="notification">
            🔔
          </div>

          <div className="user-profile">
            <div className="admin-user-avatar">
              <img src={avatarimg} alt="User Avatar" className="admin-avatar-img" />
            </div>

            <div>{user?.username || "Imagecon Academy"}</div>
          </div>

        </div>
      </div>

    </div>
  )
}

export default Header