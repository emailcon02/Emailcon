import React, { useEffect, useState } from "react";
import axios from "axios";
import "./CampaignTable.css";
import { FaArrowLeft, FaSearch,FaSync,FaTrash } from "react-icons/fa";
import { useLocation, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import apiConfig from "../../apiconfig/apiConfig";

function CampaignTable() {
  const [campaigns, setCampaigns] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [failedEmails, setFailedEmails] = useState([]);
  const [processingCampaigns, setProcessingCampaigns] = useState({});
  const [showBirthdayDeleteModal, setShowBirthdayDeleteModal] = useState(false);
  const [selectedBirthdayCampaignId, setSelectedBirthdayCampaignId] = useState(null);
  const user = JSON.parse(localStorage.getItem("user"));
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newTime, setNewTime] = useState({});
  const [activeCampaignId, setActiveCampaignId] = useState(null); 
  const [selectedCampaigns, setSelectedCampaigns] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  //  const [sortOrder, setSortOrder] = useState("desc");
     const [filteredCampaign, setFilteredCampaign] = useState([]);
      const [searchTerm, setSearchTerm] = useState("");
      const [fromDate, setFromDate] = useState("");
      const [toDate, setToDate] = useState("");
      const [rowsPerPage, setRowsPerPage] = useState(20);
      const [currentPage, setCurrentPage] = useState(1);
    
    const navigate = useNavigate();
    const location = useLocation();

  

 // Remove this function
// const handleSortByDate = () => {
//   const sorted = [...filteredCampaign].sort((a, b) => {
//     const dateA = new Date(a.senddate);
//     const dateB = new Date(b.senddate);
//     return sortOrder === "asc" ? dateA - dateB : dateB - dateA;
//   });

//   setFilteredCampaign(sorted);
//   setSortOrder(sortOrder === "asc" ? "desc" : "asc");
// };

    
  
   useEffect(() => {
      filterCampaigns();
    }, [searchTerm, fromDate, toDate, campaigns]);
  
   const filterCampaigns = () => {
  let filtered = [...campaigns];

  // Apply search
  if (searchTerm) {
    const term = searchTerm.toLowerCase();
    filtered = filtered.filter((campaign) => {
      return (
        campaign.campaignname?.toLowerCase().includes(term) ||
        campaign.groupname?.toLowerCase().includes(term)
      );
    });
  }

  // Apply senddate filter
  if (fromDate || toDate) {
    filtered = filtered.filter((campaign) => {
      const campaignDate = new Date(campaign.senddate);
      const start = fromDate ? new Date(fromDate) : null;
      const end = toDate
        ? new Date(new Date(toDate).setHours(23, 59, 59, 999))
        : null;

      const afterFrom = !start || campaignDate >= start;
      const beforeTo = !end || campaignDate <= end;

      return afterFrom && beforeTo;
    });
  }

  // Always sort by senddate in descending order (newest first)
  filtered.sort((a, b) => new Date(b.senddate) - new Date(a.senddate));

  setFilteredCampaign(filtered);
  setCurrentPage(1); // Reset page after filtering
};

const indexOfLast = currentPage * rowsPerPage;
const indexOfFirst = indexOfLast - rowsPerPage;
const currentUsers = filteredCampaign.slice(indexOfFirst, indexOfLast); // change from campaigns
const totalPages = Math.ceil(filteredCampaign.length / rowsPerPage);

  
    const resetFilter = () => {
      setSearchTerm("");
      setFromDate("");
      setToDate("");
    };
  

  // Function to handle "Select All" checkbox toggle
  const handleSelectAll = () => {
    setSelectAll((prev) => !prev);
    if (!selectAll) {
      // Select all campaigns
      setSelectedCampaigns(campaigns.map((campaign) => campaign._id));
    } else {
      // Deselect all campaigns
      setSelectedCampaigns([]);
    }
  };

  // Update the "Delete All" button function
  const handleDeleteAllSelected = async () => {
    if (selectedCampaigns.length === 0) {
      toast.warning("No campaigns selected for deletion.");
      return;
    }

    try {
      // Delete each selected campaign
      await Promise.all(
        selectedCampaigns.map((campaignId) =>
          axios.delete(`${apiConfig.baseURL}/api/stud/camhistory/${campaignId}`)
        )
      );

      // Update the UI after deletion
      setCampaigns((prevCampaigns) =>
        prevCampaigns.filter(
          (campaign) => !selectedCampaigns.includes(campaign._id)
        )
      );
      setSelectedCampaigns([]); // Clear selected campaigns
      setSelectAll(false); // Reset "Select All" checkbox
      toast.success("Selected campaigns deleted successfully!");
    } catch (error) {
      console.error("Error deleting selected campaigns:", error);
      toast.error("Failed to delete selected campaigns.");
    }
  };
const refreshCampaigns = async () => {
  try {
    const response = await axios.get(`${apiConfig.baseURL}/api/stud/campaigns/${user.id}`);
    const sortedCampaigns = response.data.sort(
      (a, b) => new Date(b.senddate) - new Date(a.senddate)
    );
    const filteredCampaigns = sortedCampaigns.filter(campaign => {
      const campaignName = campaign.campaignname?.toLowerCase() || "";
      const exclude = campaignName.includes("birthday campaign");
      return !exclude;
    });
    setCampaigns(filteredCampaigns);
    setFilteredCampaign(filteredCampaigns);
  } catch (error) {
    console.error("Error refreshing campaigns", error);
    toast.error("Failed to refresh campaigns");
  }
};

// In your fetchCampaigns function:
useEffect(() => {
  const fetchCampaigns = async () => {
    if (!user?.id) {
      navigate("/user-login");
      return;
    }
    try {
      const response = await axios.get(`${apiConfig.baseURL}/api/stud/campaigns/${user.id}`);
      // Sort by senddate in descending order (newest first)
      const sortedCampaigns = response.data.sort(
        (a, b) => new Date(b.senddate) - new Date(a.senddate) // Changed from createdAt to senddate
      );

      const filteredCampaigns = sortedCampaigns.filter(campaign => {
        const campaignName = campaign.campaignname?.toLowerCase() || "";
        const exclude = campaignName.includes("birthday campaign");
        return !exclude;
      });

      setCampaigns(filteredCampaigns);
      setFilteredCampaign(filteredCampaigns); // Initialize filteredCampaign with sorted data
    } catch (error) {
      console.error("Error fetching campaigns", {
        message: error.message,
        stack: error.stack,
        response: error.response?.data,
      });
    }
  };

  fetchCampaigns();
  
}, [user?.id, navigate, location.pathname]);


  const handleBackCampaign = () => {
    navigate("/home");
  };

  const handleViewFailedEmails = (emails) => {
    setFailedEmails(emails);
    setShowModal(true);
  };
  const handleview = (userId, campaignId) => {
    navigate(`/readreport/${userId}/${campaignId}`);
  };

  const handleCheckboxChange = (id) => {
    setSelectedCampaigns((prevSelected) =>
      prevSelected.includes(id)
        ? prevSelected.filter((item) => item !== id)
        : [...prevSelected, id]
    );
  };

  const handleDeleteCampaignHistory = async (campaignHistoryId) => {
    try {
      // Send a DELETE request to the backend with the campaign history ID
      const response = await axios.delete(
        `${apiConfig.baseURL}/api/stud/camhistory/${campaignHistoryId}`
      );
  
      // Handle success response
      if (response.status === 200) {
        toast.success("Campaign history deleted successfully!");
        setTimeout(() => {
          window.location.reload();
        }, 1000); // Optional delay to let toast display
       
      }
    } catch (error) {
      // Handle error response
      console.error("Error deleting campaign history:", error);
      toast.error("Failed to delete campaign history.");
    }
  };
  
  
  const handleOpenModal = (campaignId, scheduledTime) => {
    console.log(
      "Opening modal for campaign:",
      campaignId,
      "Scheduled Time:",
      scheduledTime
    );
    setNewTime((prev) => ({ ...prev, [campaignId]: scheduledTime || "" })); 
    setActiveCampaignId(campaignId); 
    setIsModalOpen(true); 
  };

  const handleTimeChange = (e, campaignId) => {
    const selectedTime = e.target.value;
    console.log("Selected Time:", selectedTime, campaignId);
    setNewTime((prev) => ({ ...prev, [campaignId]: selectedTime })); // Store per campaign
  };
  const handleSaveTime = async () => {
    if (!newTime[activeCampaignId]) {
      toast.error("Please select a valid time");
      return;
    }

    try {
      const updatedTimeISO = new Date(newTime[activeCampaignId]).toISOString(); // Convert to ISO format
      console.log("Updating campaign:",activeCampaignId,"with new time:",updatedTimeISO
      );

      await axios.put(`${apiConfig.baseURL}/api/stud/camhistory/${activeCampaignId}`,
        {
          scheduledTime: updatedTimeISO,
        }
      );

      setCampaigns((prevCampaigns) =>
        prevCampaigns.map((c) =>
          c._id === activeCampaignId
            ? { ...c, scheduledTime: updatedTimeISO }
            : c
        )
      );
      toast.success("Scheduled time updated successfully!");
      setIsModalOpen(false); // Close modal after save
      setActiveCampaignId(null); // Clear active campaign
    } catch (error) {
      console.error("Error updating scheduled time:", error);
      toast.error("Failed to update scheduled time");
    }
  };

  const handleToggle = async (e, campaignId) => {
    const isChecked = e.target.checked; // Get toggle state

    try {
      const newStatus = isChecked ? "Scheduled On" : "Scheduled Off";

      // Update status and scheduled time in DB
      await axios.put(`${apiConfig.baseURL}/api/stud/camhistory/${campaignId}`,
        {
          status: newStatus,
        }
      );
    } catch (error) {
      console.error("Error updating campaign status:", error);
    }
  };

  const handleResend = async (campaignId) => {
    try {
     
      setProcessingCampaigns((prev) => ({ ...prev, [campaignId]: true })); // Set only this campaign as processing
  
      // Fetch campaign details
      const response = await axios.get(`${apiConfig.baseURL}/api/stud/getcamhistory/${campaignId}`);
      const campaign = response.data;
      console.log("Fetched campaign data:", campaign);
  
      if (!campaign || !campaign.failedEmails || campaign.failedEmails.length === 0) {
        toast.warning("No failed emails to resend.");
        setProcessingCampaigns((prev) => ({ ...prev, [campaignId]: false })); // Reset
        return;
      }
  
      let sentEmails = [];
      let failedEmails = [];
      
      // If groupId is a string (e.g., "no group"), send only to failedEmails and return early
      if (!campaign.groupId || campaign.groupId === "no group") {
        console.log("No group found, sending emails directly.");
      
        // Update status to 'Pending' before resending
        await axios.put(`${apiConfig.baseURL}/api/stud/camhistory/${campaignId}`, {
          status: "Pending",
        });
      
        for (const email of campaign.failedEmails) {
          const personalizedContent = campaign.previewContent.map((item) => {
            const personalizedItem = { ...item };
      
            if (item.content) {
              const placeholderRegex = new RegExp(`\\{?Email\\}?`, "g");
              personalizedItem.content = personalizedItem.content.replace(placeholderRegex, email);
            }
            return personalizedItem;
          });
      
          const emailData = {
            recipientEmail: email,
            subject: campaign.subject,
            aliasName:campaign.aliasName,
            replyTo:campaign.replyTo,
            body: JSON.stringify(personalizedContent),
            bgColor: campaign.bgColor,
            previewtext: campaign.previewtext,
            attachments: campaign.attachments,
            userId: campaign.user,
            groupId: campaign.groupname,
            campaignId: campaignId,
          };
      
          try {
            await axios.post(`${apiConfig.baseURL}/api/stud/sendbulkEmail`, emailData);
            sentEmails.push(email);
          } catch (error) {
            console.error(`Failed to send email to ${email}:`, error);
            failedEmails.push(email);
          }
        }
      
        // ✅ Final status & progress calculation
        const totalEmails = campaign.totalcount;
        const successCount = sentEmails.length;
        const failureCount = failedEmails.length;
        let finalStatus, finalProgress;
  
        if (failureCount > 0) {
          finalStatus = "Failed";
          finalProgress = Math.round((failureCount / totalEmails) * 100); 
        } else {
          finalStatus = "Success";
          finalProgress = 100;
        }
        
             await axios.put(`${apiConfig.baseURL}/api/stud/camhistory/${campaignId}`, {
              sendcount: Number(campaign.sendcount) + successCount,
              sentEmails: [...campaign.sentEmails, ...sentEmails],
              failedEmails: failedEmails.length > 0 ? [...failedEmails] : 0,
              failedcount: failedEmails.length > 0 ? failedEmails.length : 0,
              status: finalStatus,
              progress: finalProgress,
            });  
      
        console.log("Emails resent successfully!");
        return;
      }
          
      // If groupId is a string (e.g., "No id"), send only to failedEmails and return early
      if (!campaign.groupId || campaign.groupId === "No id") {
        console.log("No group found, sending emails directly.");
  
      // Update status to 'Pending' before resending
      await axios.put(`${apiConfig.baseURL}/api/stud/camhistory/${campaignId}`, {
        status: "Pending",
      });
  
      for (const email of campaign.failedEmails) {
        // Find the corresponding student
        const student = campaign.exceldata.find((s) => s.Email === email);
        if (!student) {
          console.warn(`No matching student found for email: ${email}`);
          failedEmails.push(email);
          return;
        }
       
        // Personalize email content with student details
        const personalizedContent = campaign.previewContent.map((item) => {
          const personalizedItem = { ...item };
  
          if (item.content) {
            Object.entries(student).forEach(([key, value]) => {
              const placeholderRegex = new RegExp(`\\{?${key}\\}?`, "g");
              const cellValue = value != null ? String(value).trim() : "";
              personalizedItem.content = personalizedItem.content.replace(placeholderRegex, cellValue);
            });
          }
          return personalizedItem;
        });
  
        const emailData = {
          recipientEmail: email,
          subject: campaign.subject,
          body: JSON.stringify(personalizedContent),
          bgColor: campaign.bgColor,
          previewtext: campaign.previewtext,
          aliasName: campaign.aliasName,
          replyTo:campaign.replyTo,
          attachments: campaign.attachments,
          userId: campaign.user,
          groupId: campaign.groupname,
          campaignId: campaignId,
        };
  
          try {
            await axios.post(`${apiConfig.baseURL}/api/stud/sendbulkEmail`, emailData);
            sentEmails.push(email);
          } catch (error) {
            console.error(`Failed to send email to ${email}:`, error);
            failedEmails.push(email);
          }
        }
  
          // ✅ Final status & progress calculation
          const totalEmails = campaign.totalcount;
          const successCount = sentEmails.length;
          const failureCount = failedEmails.length;
          let finalStatus, finalProgress;
    
          if (failureCount > 0) {
            finalStatus = "Failed";
            finalProgress = Math.round((failureCount / totalEmails) * 100); 
          } else {
            finalStatus = "Success";
            finalProgress = 100;
          }
          
               await axios.put(`${apiConfig.baseURL}/api/stud/camhistory/${campaignId}`, {
                sendcount: Number(campaign.sendcount) + successCount,
                sentEmails: [...campaign.sentEmails, ...sentEmails],
                failedEmails: failedEmails.length > 0 ? [...failedEmails] : 0,
                failedcount: failedEmails.length > 0 ? failedEmails.length : 0,
                status: finalStatus,
                progress: finalProgress,
              });  
        
        console.log("Emails resent successfully!");
  
        return;
      }
  
      // If groupId exists, fetch students and follow existing logic
      const studentsResponse = await axios.get(`${apiConfig.baseURL}/api/stud/groups/${campaign.groupId}/students`);
      const students = studentsResponse.data;
  
      // Update status to 'Pending' before resending
      await axios.put(`${apiConfig.baseURL}/api/stud/camhistory/${campaignId}`, {
        status: "Pending",
      });
  
      for (const email of campaign.failedEmails) {
        // Find the corresponding student
        const student = students.find((s) => s.Email === email);
        if (!student) {
          console.warn(`No matching student found for email: ${email}`);
          failedEmails.push(email);
          return;
        }
          // Replace placeholders in subject
    let personalizedSubject = campaign.subject;
    Object.entries(student).forEach(([key, value]) => {
      const placeholderRegex = new RegExp(`\\{?${key}\\}?`, "g");
      const cellValue = value != null ? String(value).trim() : "";
      personalizedSubject = personalizedSubject.replace(placeholderRegex, cellValue);
    });
        // Personalize email content with student details
        const personalizedContent = campaign.previewContent.map((item) => {
          const personalizedItem = { ...item };
  
          if (item.content) {
            Object.entries(student).forEach(([key, value]) => {
              const placeholderRegex = new RegExp(`\\{?${key}\\}?`, "g");
              const cellValue = value != null ? String(value).trim() : "";
              personalizedItem.content = personalizedItem.content.replace(placeholderRegex, cellValue);
            });
          }
          return personalizedItem;
        });
  
        const emailData = {
          recipientEmail: email,
          subject:personalizedSubject,
          body: JSON.stringify(personalizedContent),
          bgColor: campaign.bgColor,
          previewtext: campaign.previewtext,
          attachments: campaign.attachments,
          aliasName: campaign.aliasName,
          replyTo:campaign.replyTo,
          userId: campaign.user,
          groupId: campaign.groupname,
          campaignId: campaignId,
        };
  
        try {
          await axios.post(`${apiConfig.baseURL}/api/stud/sendbulkEmail`, emailData);
          sentEmails.push(email);
        } catch (error) {
          console.error(`Failed to send email to ${email}:`, error);
          failedEmails.push(email);
        }
  }
        // ✅ Final status & progress calculation
        const totalEmails = campaign.totalcount;
        const successCount = sentEmails.length;
        const failureCount = failedEmails.length;
        let finalStatus, finalProgress;
  
        if (failureCount > 0) {
          finalStatus = "Failed";
          finalProgress = Math.round((failureCount / totalEmails) * 100); 
        } else {
          finalStatus = "Success";
          finalProgress = 100;
        }
        
             await axios.put(`${apiConfig.baseURL}/api/stud/camhistory/${campaignId}`, {
              sendcount: Number(campaign.sendcount) + successCount,
              sentEmails: [...campaign.sentEmails, ...sentEmails],
              failedEmails: failedEmails.length > 0 ? [...failedEmails] : 0,
              failedcount: failedEmails.length > 0 ? failedEmails.length : 0,
              status: finalStatus,
              progress: finalProgress,
            });  
      console.log("Emails resent successfully!");
    } catch (error) {
      console.error("Error resending emails:", error);
    } finally {
      setProcessingCampaigns((prev) => ({ ...prev, [campaignId]: false })); // Reset processing state
    }
  };
  
  

  return (
    <div className="admin-dashboard-page">
      <div className="admin-nav">
        <div className="nav-mobile-btn">
          <h2 className="admin-dashboard-header">Campaign History</h2>
          <button
            onClick={handleBackCampaign}
            className="admin-nav-button2 mobile-btn"
          >
            <span className="admin-nav-icons">
              <FaArrowLeft />
            </span>
            <span className="nav-names">Home</span>
          </button>
        </div>
        <div>
          <button
            onClick={handleBackCampaign}
            className="admin-nav-button desktop"
          >
            <span className="admin-nav-icons">
              <FaArrowLeft />
            </span>
            <span className="nav-names">Home</span>
          </button>
        </div>
      </div>

  <div className="search-bar-search" style={{marginTop:"20px"}}>
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
                            ? filteredCampaign.length
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

     <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
  <button onClick={handleDeleteAllSelected} className="delete-all-btn">
    Delete All
  </button>
  <button 
    onClick={refreshCampaigns} 
    className="refresh-btn"
    style={{
      padding: '8px 15px',
      backgroundColor: '#2f327d',
      color: 'white',
      border: 'none',
      borderRadius: '4px',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      gap: '5px'
    }}
  >
    <FaSync /> 
  </button>
</div>
      <div className="cam-scroll" style={{ overflowX: "auto" }}>
        <table className="cam-dashboard-table">
          <thead>
            <tr>
            <th>
                Select{" "}
                <input
                  type="checkbox"
                  checked={selectAll}
                  onChange={handleSelectAll}
                />
              </th>
              <th>S.No</th>
      <th>
        Send Date 
      </th>               
       <th>Campaign Name</th>
              <th>Group Name</th>
              <th>Total Count</th>
              <th>Send Count</th>
              <th>Failed Count</th>
              <th>Scheduled Time</th>
              <th>Status</th>
              <th>Report</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
         {currentUsers && currentUsers.length > 0 ? (
                currentUsers.map((campaign) => (
        <tr key={campaign._id}>
                   <td>
                    <input
                      type="checkbox"
                      checked={selectedCampaigns.includes(campaign._id)}
                      onChange={() => handleCheckboxChange(campaign._id)}
                    />
                  </td>
                  <td>{campaigns.indexOf(campaign) + 1}</td>
                  <td>{campaign.senddate}</td>
                  <td>{campaign.campaignname}</td>
                  <td>{campaign.groupname}</td>
                  <td>{campaign.totalcount}</td>
                  <td>{campaign.sendcount}</td>
                  <td>
                    {campaign.failedcount > 0 ? (
                      <button
                        className="view-btn"
                        onClick={() =>
                          handleViewFailedEmails(campaign.failedEmails)
                        }
                      >
                        View-{campaign.failedcount}
                      </button>
                    ) : (
                      campaign.failedcount
                    )}
                  </td>
                  {campaign.status === "Scheduled On" ||
                  campaign.status === "Scheduled Off" ? (
                    <td
                      title="Edit"
                      style={{ cursor: "pointer", textDecoration: "underline" }}
                      onClick={(e) => {
                        e.stopPropagation(); // Prevents immediate closing
                        handleOpenModal(campaign._id, campaign.scheduledTime); // Pass scheduledTime
                      }}
                    >
                      {/* Modal */}
                      {isModalOpen && activeCampaignId === campaign._id && (
                        <div
                          className="modal-schedule"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <div
                            className="modal-content-schedule"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <h3>Edit Scheduled Time</h3>
                            <input
                              type="datetime-local"
                              value={newTime[activeCampaignId] || ""}
                              onChange={(e) =>
                                handleTimeChange(e, activeCampaignId)
                              }
                            />

                            <div className="modal-actions-schedule">
                              <button onClick={handleSaveTime}>Save</button>
                              <button onClick={() => setIsModalOpen(false)}>
                                Cancel
                              </button>
                            </div>
                          </div>
                        </div>
                      )}

                      {new Date(campaign.scheduledTime).toLocaleString(
                        "en-IN",
                        { timeZone: "Asia/Kolkata" }
                      )}
                    </td>
                  ) : (
                    <td>
                      {new Date(campaign.scheduledTime).toLocaleString(
                        "en-IN",
                        { timeZone: "Asia/Kolkata" }
                      )}
                    </td>
                  )}

<td
  style={{
    display: "flex",
    alignItems: "center",
    justifyContent:
      campaign.status === "Success" || campaign.status === "Failed"
        ? "center"
        : "flex-start",
    fontWeight: "bold",
    color:
      campaign.status === "Success"
        ? "green"
        : campaign.status === "Failed"
        ? "red"
        : "#2f327d",
  }}
>
  {campaign.status === "Scheduled On" || campaign.status === "Scheduled Off" ? (
    <>
      <span>{campaign.status}</span>
      <label className="toggle-switch" style={{ marginLeft: "15px" }}>
        <input
          type="checkbox"
          checked={campaign.status === "Scheduled On"}
          onChange={(e) => handleToggle(e, campaign._id)}
        />
        <span className="slider"></span>
      </label>
    </>
  ) : (
    <>
      <span>
        {campaign.status} - {campaign.progress}%
      </span>

      {campaign.status === "Failed" && (
        <button
          className="resend-btn"
          onClick={() => handleResend(campaign._id)}
          disabled={processingCampaigns[campaign._id]}
          style={{ marginLeft: "10px" }}
        >
          {processingCampaigns[campaign._id] ? "Resending..." : "Resend"}
        </button>
      )}
    </>
  )}
</td>

                  <td>
                    <button
                      className="resend-btn"
                      onClick={() => handleview(user.id, campaign._id)}
                    >
                      View
                    </button>
                  </td>
                  <td>  <button
                                        className="resend-btn edit-btn-campaign"
                                        onClick={() => {
                                          setSelectedBirthdayCampaignId(campaign._id);
                                          setShowBirthdayDeleteModal(true);
                                        }}
                                        >
                  <FaTrash/>
                  </button></td>

                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" style={{ textAlign: "center" }}>
                  No Campaign History
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
        autoClose={2000}
        hideProgressBar={true}
        closeOnClick={false}
        closeButton={false}
        pauseOnHover={true}
        draggable={true}
        theme="light"
      />

      {/* delete modal */}
      {showBirthdayDeleteModal && (
  <div
    style={{
      position: "fixed",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      backgroundColor: "rgba(0, 0, 0, 0.4)", // <-- Less opaque for more transparency
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      zIndex: 9999,
    }}
  >
    <div
      style={{
        backgroundColor: "#fff",
        padding: "20px",
        borderRadius: "8px",
        textAlign: "center",
        minWidth: "300px",
        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
      }}
    >
      <h3>Delete Campaign History</h3>
      <p>Are you sure you want to delete this campaign history?</p>
      <div style={{ marginTop: "20px" }}>
        <button
          onClick={() => {
            handleDeleteCampaignHistory(selectedBirthdayCampaignId);
            setShowBirthdayDeleteModal(false);
            setSelectedBirthdayCampaignId(null);
          }}
          style={{
            marginRight: "10px",
            backgroundColor: "#f48c06",
            color: "#fff",
            border: "none",
            padding: "8px 16px",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          OK
        </button>
        <button
          onClick={() => {
            setShowBirthdayDeleteModal(false);
            setSelectedBirthdayCampaignId(null);
          }}
          style={{
            backgroundColor: "#ccc",
            border: "none",
            padding: "8px 16px",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          Cancel
        </button>
      </div>
    </div>
  </div>
)}


      {/* Modal for Failed Emails */}
      {showModal && (
        <div className="modal-overlay-fail">
          <div className="modal-content-fail">
            <h3>Failed Emails</h3>

            <div className="failedview">
              {failedEmails.map((email, index) => (
                <p key={index}>{email}</p>
              ))}
            </div>
            <button
              className="close-btn-fail"
              onClick={() => setShowModal(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default CampaignTable;
