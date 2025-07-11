import React, { useEffect, useState } from "react";
import axios from "axios";
import "./CampaignTable.css";
import { FaArrowLeft, FaSearch,FaSync,FaTrash, FaRegFileAlt,FaUsers,FaHourglassHalf,FaCheck, FaSyncAlt, FaBook, FaThumbsUp, FaEnvelopeOpenText, FaTimes, FaPaperPlane} from "react-icons/fa";
import { useLocation, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import apiConfig from "../../apiconfig/apiConfig";
// import { useParams } from "react-router-dom";
import "./ReadReport.css";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

function CampaignTable() {
// Campaign Data State
const [campaigns, setCampaigns] = useState([]);
const [filteredCampaign, setFilteredCampaign] = useState([]);
const [campaigndata, setCampaigndata] = useState({});
const [campaignDetails, setCampaignDetails] = useState({});      // Added here
const [campaignStats, setCampaignStats] = useState({});          // Added here

// UI State
const [showModal, setShowModal] = useState(false);
const [isModalOpen, setIsModalOpen] = useState(false);
const [showBirthdayDeleteModal, setShowBirthdayDeleteModal] = useState(false);
const [showDeleteAllConfirm, setShowDeleteAllConfirm] = useState(false);
const [showdelModal, setShowdelModal] = useState(false);
const [showfailModal, setShowfailModal] = useState(false);
const [showClickModal, setShowClickModal] = useState(false);
const [showallClickModal, setShowallClickModal] = useState(false);
const [showOverallClickModal, setShowOverallClickModal] = useState(false);
const [showAnalysisModal, setShowAnalysisModal] = useState(false);

// Selection State
const [activeCampaignId, setActiveCampaignId] = useState(null);
const [selectedCampaigns, setSelectedCampaigns] = useState([]);
const [selectAll, setSelectAll] = useState(false);
const [selectedBirthdayCampaignId, setSelectedBirthdayCampaignId] = useState(null);

// Filter/Search State
const [searchTerm, setSearchTerm] = useState("");
const [fromDate, setFromDate] = useState("");
const [toDate, setToDate] = useState("");
const [rowsPerPage, setRowsPerPage] = useState(20);
const [currentPage, setCurrentPage] = useState(1);

// Performance Tracking State
const [processingCampaigns, setProcessingCampaigns] = useState({});

// Campaign Metrics State
const [emailClickData, setEmailClickData] = useState([]);

// Scheduling State
const [newTime, setNewTime] = useState({});

// User/Routing
const user = JSON.parse(localStorage.getItem("user") || null);
const userId = user?.id;
const navigate = useNavigate();
const location = useLocation();
    
   const processDataForGraph = () => {
  const timeCounts = Array(24).fill(0);
  
  // Get email data for the active campaign
  const activeEmailData = campaignDetails[activeCampaignId]?.emailData || [];
  
  activeEmailData.forEach((email) => {
    const hour = new Date(email.timestamp).getHours();
    timeCounts[hour] += 1;
  });

  return timeCounts.map((count, hour) => {
    const period = hour < 12 ? "AM" : "PM";
    const formattedHour = hour % 12 === 0 ? 12 : hour % 12;
    return { hour: `${formattedHour} ${period}`, users: count };
  });
};

  useEffect(() => {
    if (!userId) return;
    fetchClickData();
  }, [userId]);
  
  // Handle View button click
  const handleViewClick = (clickData) => {
    setShowallClickModal(false); // Close Modal
    setEmailClickData(clickData); // Set emails + timestamps for modal
    setShowClickModal(true);
  };
const handleRefreshAndCloseModals = (e) => {
  e.stopPropagation(); // Prevent event bubbling to parent elements
  setShowModal(false);
  setShowdelModal(false);
  setShowfailModal(false);
  setShowClickModal(false);
  setShowallClickModal(false);
  setShowOverallClickModal(false);
  setShowAnalysisModal(false);
  setTimeout(() => {
    window.location.reload();
  }, 1000);
}

  // Close Modal
  const handleCloseClickModal = () => {
    setShowClickModal(false);
    setShowallClickModal(true);
    setEmailClickData([]);
  };

  useEffect(() => {
        if (!userId) return;
    fetchEmailCount();

  }, [userId]);


  const fetchEmailCount = async (campaignId) => {
  if (!campaignId) return;
  
  try {
    const response = await axios.get(
      `${apiConfig.baseURL}/api/stud/get-email-open-count?userId=${userId}&campaignId=${campaignId}`
    );
    setCampaignStats(prev => ({
      ...prev,
      [campaignId]: {
        ...prev[campaignId],
        openCount: response.data.count
      }
    }));
    setCampaignDetails(prev => ({
      ...prev,
      [campaignId]: {
        ...prev[campaignId],
        emailData: response.data.emails || []
      }
    }));
  } catch (error) {
    console.error("Error fetching open count", error);
  }
};

const fetchClickData = async (campaignId) => {
  if (!campaignId) return;
  
  try {
    const response = await axios.get(
      `${apiConfig.baseURL}/api/stud/get-click?userId=${userId}&campaignId=${campaignId}`
    );
    setCampaignStats(prev => ({
      ...prev,
      [campaignId]: {
        ...prev[campaignId],
        urlCount: response.data.count
      }
    }));
    setCampaignDetails(prev => ({
      ...prev,
      [campaignId]: {
        ...prev[campaignId],
        clickedUrls: response.data.urls || [],
        urlEmails: response.data.emails || []
      }
    }));
  } catch (error) {
    console.error("Error fetching click data", error);
  }
};

  const handleCloseallClickModal = () => {
    setShowallClickModal(false); // Close Modal
  };

 const fetchEmailDetails = async (campaignId) => {
  if (!campaignId) return;
  
  setActiveCampaignId(campaignId);
  try {
    await fetchEmailCount(campaignId);
    setShowModal(true);
  } catch (err) {
    console.error("Error fetching email details", err);
  }
};

const fetchEmailClickDetails = (campaignId) => {
  if (!campaignId) return;  
  setActiveCampaignId(campaignId);
  setShowallClickModal(true);
};

  const handleOverallClickDetails = () => {
    setShowallClickModal(false); // Close Modal
    setShowOverallClickModal(true); // Open Overall Click Modal
  };
  const handleCloseoverallModal = () => {
    setShowOverallClickModal(false); // Close Modal
  };

  const handleEditor = (userId, campaignId) => {
    navigate(`/read-editor/${userId}/${campaignId}`);
  };
  const handleoverallEditor = (userId, campaignId) => {
    navigate(`/click-editor/${userId}/${campaignId}`);
  };

  const handleoverallsingleEditor = (userId, campaignId, emails) => {
    navigate(`/clicksingle-editor/${userId}/${campaignId}`, {
      state: { emails },
    });
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };
  const handleClosefailModal = () => {
    setShowfailModal(false);
  };

  const handleClosedelModal = () => {
    setShowdelModal(false);
  };
const handleopendelmodal = (campaignId) => {
  setActiveCampaignId(campaignId);
  fetchCampaignHistory(campaignId); // Fetch fresh data when opening modal
  setShowdelModal(true);
};

const handleopenfailmodal = (campaignId) => {
  setActiveCampaignId(campaignId);
  fetchCampaignHistory(campaignId); // Fetch fresh data when opening modal
  setShowfailModal(true);
};
useEffect(() => {
  filterCampaigns();
}, [searchTerm, fromDate, toDate, campaigns]);

const parseDate = (dateStr) => {
  if (!dateStr) return new Date(0); // fallback for invalid dates
  
  // Try ISO format first
  if (dateStr.includes('T')) {
    return new Date(dateStr);
  }

  // Handle multiple date formats
  try {
    // Format 1: "21/06/2025, 19:38:56" (DD/MM/YYYY, 24-hour)
    if (/^\d{1,2}\/\d{1,2}\/\d{4}, \d{1,2}:\d{2}:\d{2}$/.test(dateStr)) {
      const [datePart, timePart] = dateStr.split(', ');
      const [day, month, year] = datePart.split('/').map(Number);
      const [hours, minutes, seconds] = timePart.split(':').map(Number);
      return new Date(year, month - 1, day, hours, minutes, seconds);
    }
    
    // Format 2: "6/30/2025, 11:00:49 AM" (MM/DD/YYYY, AM/PM)
    if (/^\d{1,2}\/\d{1,2}\/\d{4}, \d{1,2}:\d{2}:\d{2} [AP]M$/.test(dateStr)) {
      const [datePart, timePart] = dateStr.split(', ');
      const [month, day, year] = datePart.split('/').map(Number);
      const [time, period] = timePart.split(' ');
      let [hours, minutes, seconds] = time.split(':').map(Number);
      
      // Convert to 24-hour format
      if (period === 'PM' && hours < 12) hours += 12;
      if (period === 'AM' && hours === 12) hours = 0;
      
      return new Date(year, month - 1, day, hours, minutes, seconds);
    }
  } catch (e) {
    console.error('Error parsing date:', dateStr, e);
  }
  
  // Fallback to native Date parsing
  const parsed = new Date(dateStr);
  return isNaN(parsed) ? new Date(0) : parsed;
};

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
      const campaignDate = parseDate(campaign.senddate);
      const start = fromDate ? new Date(fromDate) : null;
      const end = toDate
        ? new Date(new Date(toDate).setHours(23, 59, 59, 999))
        : null;

      const afterFrom = !start || campaignDate >= start;
      const beforeTo = !end || campaignDate <= end;

      return afterFrom && beforeTo;
    });
  }

  // Sort by parsed date in descending order (newest first)
  filtered.sort((a, b) => {
    const dateA = parseDate(a.senddate);
    const dateB = parseDate(b.senddate);
    return dateB - dateA;
  });

  setFilteredCampaign(filtered);
  setCurrentPage(1); // Reset page after filtering
};



// Optimized fetch function
const fetchCampaigns = async (silent = true) => {
  if (!user?.id) {
    navigate("/user-login");
    return;
  }

  try {
    const response = await axios.get(
      `${apiConfig.baseURL}/api/stud/campaigns/${user.id}?t=${Date.now()}`,
      { headers: { 'Cache-Control': 'no-cache' } }
    );

    const sortedCampaigns = response.data.sort(
      (a, b) => parseDate(b.senddate) - parseDate(a.senddate)
    );

    const filteredCampaigns = sortedCampaigns.filter(campaign => {
      const campaignName = campaign.campaignname?.toLowerCase() || "";
      return !campaignName.includes("birthday campaign");
    });

    // Smart update - only if data changed
    setCampaigns(prev => {
      if (JSON.stringify(prev) !== JSON.stringify(filteredCampaigns)) {
        return filteredCampaigns;
      }
      return prev;
    });

    setFilteredCampaign(filteredCampaigns);

    // Initialize missing campaign data
    setCampaignDetails(prev => {
      const updated = {...prev};
      filteredCampaigns.forEach(camp => {
        if (!updated[camp._id]) {
          updated[camp._id] = { emailData: [], clickedUrls: [], urlEmails: [] };
        }
      });
      return updated;
    });

    // Fetch metrics in batches to avoid overload
    const BATCH_SIZE = 3;
    for (let i = 0; i < filteredCampaigns.length; i += BATCH_SIZE) {
      const batch = filteredCampaigns.slice(i, i + BATCH_SIZE);
      await Promise.all([
        ...batch.map(camp => fetchEmailCount(camp._id)),
        ...batch.map(camp => fetchClickData(camp._id)),
        ...batch.map(camp => fetchCampaignHistory(camp._id))
      ]);
    }


  } catch (error) {
    console.error("Background refresh failed:", error);
  } 
};

// Initial load and auto-refresh setup
useEffect(() => {
  let timeoutId;
  let intervalId;
  
  const setupRefresh = () => {
    fetchCampaigns(); // Initial load
    
    // Adaptive refresh interval (30-60s)
    intervalId = setInterval(() => {
      fetchCampaigns(); // Silent background refresh
    }, 30000 + Math.random() * 30000); // Randomize to avoid thundering herd
  };

  // Retry mechanism if initial load fails
  const retryLoad = (attempt = 0) => {
    if (attempt >= 3) return;
    
    timeoutId = setTimeout(() => {
      fetchCampaigns()
        .catch(() => retryLoad(attempt + 1));
    }, 5000 * (attempt + 1));
  };

  setupRefresh();
  
  return () => {
    clearInterval(intervalId);
    clearTimeout(timeoutId);
  };
}, [user?.id, navigate]);



const indexOfLast = currentPage * rowsPerPage;
const indexOfFirst = indexOfLast - rowsPerPage;
const currentUsers = filteredCampaign.slice(indexOfFirst, indexOfLast);
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
 const fetchCampaignHistory = async (campaignId) => {
  if (!campaignId) return;
  
  try {
    const res = await axios.get(
      `${apiConfig.baseURL}/api/stud/getcamhistory/${campaignId}`
    );
    
    // Update both campaigndata and campaignDetails
    setCampaigndata(res.data);
    setCampaignDetails(prev => ({
      ...prev,
      [campaignId]: {
        ...prev[campaignId],
        sentEmails: res.data.sentEmails || [],
        failedEmails: res.data.failedEmails || [],
        // Add any other data you need to store per campaign
      }
    }));
  } catch (err) {
    console.error("Error fetching campaign history:", err);
  }
};

// Then use it in your useEffect
useEffect(() => {
  fetchCampaignHistory(activeCampaignId);
}, [activeCampaignId]);
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
      setSelectedCampaigns([]); 
      setSelectAll(false); 
      toast.success("Selected campaigns deleted successfully!");
    } catch (error) {
      console.error("Error deleting selected campaigns:", error);
      toast.error("Failed to delete selected campaigns.");
    }
  };
  
  const handleBackCampaign = () => {
    navigate("/home");
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

    if (selectedCampaigns.length === 0) {
      toast.warning("No campaigns selected for deletion.");
      return;
    }

    try {
      // Send a DELETE request to the backend with the campaign history ID
      const response = await axios.delete(
        `${apiConfig.baseURL}/api/stud/camhistory/${campaignHistoryId}`
      );
  
      // Handle success response
      if (response.status === 200) {
      toast.success("Selected campaigns deleted successfully!");
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
  // Email validation function
const isValidEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(String(email).toLowerCase());
};

  const handleResend = async () => {
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
   // Validate and filter emails before processing
      const validFailedEmails = campaign.failedEmails.filter(email => 
        email && isValidEmail(email) && email !== 'missing'
      );
      const invalidEmails = campaign.failedEmails.filter(email => 
        !email || !isValidEmail(email) || email === 'missing'
      );

      if (validFailedEmails.length === 0) {
        toast.warning("No valid failed emails to resend.");
        setProcessingCampaigns((prev) => ({ ...prev, [campaignId]: false }));
        return;
      }

      let sentEmails = [];
      let failedEmails = [...invalidEmails]; // Start with invalid emails
      
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

      <div className="search-bar-search" style={{ marginTop: "20px" }}>
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

      <div style={{ display: "flex", gap: "10px", justifyContent: "flex-start", alignItems: "center",}}>
<button 
  onClick={() => {
    if (selectedCampaigns.length === 0) {
      toast.warning("No campaigns selected for deletion.");
    } else {
      setShowDeleteAllConfirm(true);
    }
  }} 
  className="delete-all-btn"
>
 <FaTrash />
 </button>
        <p className="select-all">
           <input
            type="checkbox"
            checked={selectAll}
            onChange={handleSelectAll}
          />
          {" "}Select All
        </p>
      </div>
      <div className="cam-History-container">        
     <div className="camp_header">
  {currentUsers && currentUsers.length > 0 && (
    <div>
{currentUsers.map((campaign) => {
  const campaignId = campaign._id;
  const stats = campaignStats[campaignId] || { 
    openCount: 0, 
    urlCount: 0,
    sendcount: 0,
    failedcount: 0
  };
  const details = campaignDetails[campaignId] || { 
    emailData: [], 
    clickedUrls: [], 
    urlEmails: [],
    sentEmails: [],
    failedEmails: []
  };

  const readRate = campaign.totalcount > 0
    ? ((stats.openCount / campaign.totalcount) * 100).toFixed(2)
    : "0.00";

  const clickRate = campaign.totalcount > 0
    ? ((stats.urlCount / campaign.totalcount) * 100).toFixed(2)
    : "0.00";

  return (
    <div key={campaignId}
            style={{
              marginBottom: "18px",
              borderBottom: "1px solid #eee",
              paddingBottom: "10px",
            }}
          >
            <div style={{ display: "flex", gap: "30px", marginTop: "20px" }}>
              <p className="header-campaign-name">
                <input
                  type="checkbox"
                  checked={selectedCampaigns.includes(campaignId)}
                  onChange={() => handleCheckboxChange(campaignId)}
                />
                Campaign : {campaign.campaignname}
              </p>
              <div className="failed-split-btn">
                <span
                  style={{
                    fontWeight: "500",
                    cursor: "pointer",
                    fontSize: "18px",
                    marginTop: "3px",
                    alignItems: "center",
                    color:
                      campaign.status === "Success"
                        ? "green"
                        : campaign.status === "Failed"
                        ? "red"
                        : "#2f327d",
                  }}
                >
                  {campaign.status}
                </span>
                {["Scheduled On", "Scheduled Off"].includes(campaign.status) && (
                  <label className="toggle-switch" style={{ marginLeft: "10px" }}>
                    <input
                      type="checkbox"
                      checked={campaign.status === "Scheduled On"}
                      onChange={(e) => handleToggle(e, campaignId)}
                    />
                    <span className="slider"></span>
                  </label>
                )}
                {campaign.status === "Failed" && (
                  <button
                    className="resend-btn failed-resend-btn"
                    onClick={() => handleResend(campaignId)}
                    disabled={processingCampaigns[campaignId]}
                    style={{ marginLeft: "10px" }}
                  >
                    {processingCampaigns[campaignId]
                      ? "Resending..."
                      : "Resend"}
                  </button>
                )}
              </div>
            </div>
            <div className="template-details-container">
              {/* Template Details */}
              <div
                className="template-details"
                style={{ cursor: "auto" }}
                // onClick={() => handleview(user.id, campaignId)}
              >
                <div className="template-icons">
                  <FaRegFileAlt className="icon-his" />
                  <p className="icon-his-text">Template</p>
                </div>
                <p className="sub-icon-his-text">{campaign.senddate}</p>
              </div>

              {/* Total Count */}
              <div
                className="template-details"
style={{ cursor: "auto" }}>
                <div className="template-icons">
                  <FaUsers className="icon-his" size={20} />
                  <p className="icon-his-text">Total Count</p>
                </div>
                <p className="icon-his-text-number">{campaign.totalcount}</p>
                <p className="sub-icon-his-text">
                  Group Name: {campaign.groupname}
                </p>
              </div>

              {/* Scheduled Time */}
              <div className="template-details" style={{ cursor: "auto" }}>
                <div className="template-icons">
                  <FaHourglassHalf className="icon-his" size={18} />
                  <p className="icon-his-text">Scheduled Time</p>
                </div>
                <div className="sub-icon-his-text">
                  {new Date(campaign.scheduledTime).toLocaleString("en-IN", {
                    timeZone: "Asia/Kolkata",
                  })}
                </div>
                {["Scheduled On", "Scheduled Off"].includes(campaign.status) && (
                  <span
                    title="Edit"
                    style={{
                      cursor: "pointer",
                      textDecoration: "underline",
                      color: "#2f327d",
                      marginTop: "5px",
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleOpenModal(campaignId, campaign.scheduledTime);
                    }}
                  >
                    Edit
                  </span>
                )}
                {/* Modal */}
                {isModalOpen && activeCampaignId === campaignId && (
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
                        onChange={(e) => handleTimeChange(e, activeCampaignId)}
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
              </div>

              {/* Read Rate */}
              <div
                className="template-details"
                onClick={() => fetchEmailDetails(campaignId)}
              >
                <div className="template-icons">
                  <FaEnvelopeOpenText className="icon-his" size={18} />
                  <p className="icon-his-text">Read Rate</p>
                </div>
                <p className="report-value">{readRate}%</p>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <div>
                    <span className="report-badge read">
                      {stats.openCount} Opened
                    </span>
                  </div>
                  <button
                    onClick={handleRefreshAndCloseModals}
                    className="refresh-btn-card"
                    title="Refresh Page"
                  >
                    <FaSyncAlt />
                  </button>
                </div>
                <p style={{ fontSize: "10px", color: "#888", marginTop: "5px" }}>
                  For real-time update, click refresh
                </p>
              </div>

              {/* Click Rate */}
              <div
                className="template-details"
                onClick={() => fetchEmailClickDetails(campaignId)}
              >
                <div className="template-icons">
                  <FaThumbsUp className="icon-his" size={18} />
                  <p className="icon-his-text">Click Rate</p>
                </div>
                <p className="report-value">{clickRate}%</p>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <span className="report-badge click">
                    {stats.urlCount} Clicked
                  </span>
                  <button
                    onClick={handleRefreshAndCloseModals}
                    className="refresh-btn-card"
                    title="Refresh Page"
                  >
                    <FaSyncAlt />
                  </button>
                </div>
                <p style={{ fontSize: "10px", color: "#888", marginTop: "5px" }}>
                  For real-time update, click refresh
                </p>
              </div>

              {/* Delivered Rate */}
              <div
                className="template-details"
                onClick={() => handleopendelmodal(campaignId)}
              >
                <div className="template-icons">
                  <FaPaperPlane className="icon-his" size={18} />
                  <p className="icon-his-text">Delivered Rate</p>
                </div>
                <p className="report-value">
                  {campaign.totalcount > 0
                    ? ((campaign.sendcount / campaign.totalcount) * 100).toFixed(2)
                    : "0.00"}%
                </p>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <span className="report-badge deliver">
                    {campaign.sendcount} Delivered
                  </span>
                  <button
                    onClick={handleRefreshAndCloseModals}
                    className="refresh-btn-card"
                    title="Refresh Page"
                  >
                    <FaSyncAlt />
                  </button>
                </div>
                <p style={{ fontSize: "10px", color: "#888", marginTop: "5px" }}>
                  For real-time update, click refresh
                </p>
              </div>

              {/* Failed Rate */}
              <div
                className="template-details"
                onClick={() => handleopenfailmodal(campaignId)}
              >
                <div className="template-icons">
                  <FaTimes className="icon-his" size={18} />
                  <p className="icon-his-text">Failed Rate</p>
                </div>
                <p className="report-value">
                  {campaign.totalcount > 0
                    ? ((campaign.failedcount / campaign.totalcount) * 100).toFixed(2)
                    : "0.00"}%
                </p>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <span className="report-badge failed">
                    {campaign.failedcount} Failed
                  </span>
                  <button
                    onClick={handleRefreshAndCloseModals}
                    className="refresh-btn-card"
                    title="Refresh Page"
                  >
                    <FaSyncAlt />
                  </button>
                </div>
                <p style={{ fontSize: "10px", color: "#888", marginTop: "5px" }}>
                  For real-time update, click refresh
                </p>
              </div>

                     {showModal && activeCampaignId === campaignId && (
        <div className="modal-overlay-read" onClick={handleCloseModal}>
          <div className="modal-content-read" onClick={(e) => e.stopPropagation()}>
            <h2 className="modal-heading-read">Read Rate</h2>
            <div className="modal-content-read-table">
              <table className="email-table-read">
                <thead>
                  <tr>
                    <th>Mail ID</th>
                    <th>Opened Time</th>
                  </tr>
                </thead>
                <tbody>
                  {details.emailData.length > 0 ? (
                    details.emailData.map((email, index) => (
                      <tr key={index}>
                        <td>{email.emailId}</td>
                        <td>{new Date(email.timestamp).toLocaleString()}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="2">No Data Available</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            <div className="overall-btn">
              <button className="overall-modal-read" onClick={() => setShowAnalysisModal(true)}>
                Retarget Analysis
              </button>
              <button className="overall-cancel" onClick={() => handleEditor(userId, campaignId)}>
                Retarget
              </button>
            </div>
            <button className="close-modal-read" onClick={handleCloseModal}>
              x
            </button>
          </div>
        </div>
      )}

      {/* Modal for Failed Details */}
      {showfailModal && activeCampaignId === campaignId && (
        <div className="modal-overlay-read" onClick={handleClosefailModal}>
          <div className="modal-content-read" onClick={(e) => e.stopPropagation()}>
            <h2 className="modal-heading-read">Failed Rate</h2>
            <div className="modal-content-read-table">
              <table className="email-table-read">
                <thead>
                  <tr>
                    <th>Mail ID-{stats.failedcount}</th>
                  </tr>
                </thead>
                <tbody>
                  {details.failedEmails?.length > 0 ? (
                    details.failedEmails.map((email, index) => (
                      <tr key={index}>
                        <td>{email}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="2">No Data Available</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            <div style={{ display: "flex", gap: "10px", justifyContent: "center", marginTop: "20px" }}>
              <button className="target-modal-read" onClick={handleClosefailModal}>
                Close
              </button>
              <button onClick={() => handleResend(campaignId)} className="target-modal-read">
                Resend
              </button>
            </div>
            <button className="close-modal-read" onClick={handleClosefailModal}>
              x
            </button>
          </div>
        </div>
      )}

      {/* Modal for Delivered Details */}
      {showdelModal && activeCampaignId === campaignId && (
        <div className="modal-overlay-read" onClick={handleClosedelModal}>
          <div className="modal-content-read" onClick={(e) => e.stopPropagation()}>
            <h2 className="modal-heading-read">Delivered Rate</h2>
            <div className="modal-content-read-table">
              <table className="email-table-read">
                <thead>
                  <tr>
                    <th>Mail ID-{stats.sendcount}</th>
                  </tr>
                </thead>
                <tbody>
                  {details.sentEmails?.length > 0 ? (
                    details.sentEmails.map((email, index) => (
                      <tr key={index}>
                        <td>{email}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="2">No Data Available</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            <button className="target-modal-read" onClick={handleClosedelModal}>
              Close
            </button>
            <button className="close-modal-read" onClick={handleClosedelModal}>
              x
            </button>
          </div>
        </div>
      )}
            </div>
          </div>
        );
      })}
    </div>
  )}
</div>
      </div>



           {/* Modal for Clicked Details */}
{showallClickModal && (
  <div className="modal-overlay-read" onClick={handleCloseallClickModal}>
    <div className="modal-content-read" onClick={(e) => e.stopPropagation()}>
      <h2 className="modal-heading-read">Clicked Rate</h2>
      <div className="modal-content-read-table">
        <table className="email-table-read">
          <thead>
            <tr>
              <th>Links</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {campaignDetails[activeCampaignId]?.clickedUrls?.length > 0 ? (
              campaignDetails[activeCampaignId].clickedUrls.map((urlData, index) => (
                <tr key={index}>
                  <td>{urlData.clickedUrl}</td>
                  <td>
                    <button className="resend-btn" onClick={() => handleViewClick(urlData.clicks)}>
                      View
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="2">No Clicks Recorded</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <div className="overall-btn">
        <button className="overall-modal-read" onClick={handleOverallClickDetails}>
          Overall Click Mails
        </button>
        <button className="overall-cancel" onClick={handleCloseallClickModal}>
          Close
        </button>
      </div>
      <button className="close-modal-read" onClick={handleCloseallClickModal}>
        x
      </button>
    </div>
  </div>
)}

{/* Modal for link view Details */}
{showClickModal && (
  <div className="modal-overlay-read" onClick={handleCloseClickModal}>
    <div className="modal-content-read" onClick={(e) => e.stopPropagation()}>
      <h2 className="modal-heading-read">Click Details</h2>
      <div className="modal-content-read-table">
        <table className="email-table-read">
          <thead>
            <tr>
              <th>Mail ID</th>
              <th>Clicked Time</th>
            </tr>
          </thead>
          <tbody>
            {emailClickData.length > 0 ? (
              emailClickData.map((singleemail, index) => (
                <tr key={index}>
                  <td>{singleemail.emailId}</td>
                  <td>{new Date(singleemail.timestamp).toLocaleString()}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="2">No Data Available</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <button
        className="target-modal-read"
        onClick={() =>
          handleoverallsingleEditor(
            userId,
            activeCampaignId,
            emailClickData.map((singleemail) => singleemail.emailId)
          )
        }
      >
        Retarget
      </button>
      <button className="close-modal-read" onClick={handleCloseClickModal}>
        x
      </button>
    </div>
  </div>
)}



{/* Modal for overall click email Details */}
{showOverallClickModal && (
  <div className="modal-overlay-read" onClick={handleCloseoverallModal}>
    <div className="modal-content-read" onClick={(e) => e.stopPropagation()}>
      <h2 className="modal-heading-read">Overall Click Details</h2>
      <div className="modal-content-read-table">
        <table className="email-table-read">
          <thead>
            <tr>
              <th>Mail ID</th>
            </tr>
          </thead>
          <tbody>
            {campaignDetails[activeCampaignId]?.urlEmails?.length > 0 ? (
              campaignDetails[activeCampaignId].urlEmails.map((email, index) => (
                <tr key={index}>
                  <td>{email._id}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="3">No Data Available</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <button
        className="target-modal-read"
        onClick={() => handleoverallEditor(userId, activeCampaignId)}
      >
        Retarget
      </button>
      <button className="close-modal-read" onClick={handleCloseoverallModal}>
        x
      </button>
    </div>
  </div>
)}
      
            {/* Modal for Retarget Analysis */}
          {showAnalysisModal && (
  <div className="modal-overlay-read" onClick={() => setShowAnalysisModal(false)}>
    <div className="modal-content-read-graph" onClick={(e) => e.stopPropagation()}>
      <h2 className="modal-heading-read">Read Retarget Analysis</h2>
      <ResponsiveContainer width="100%" height={400}>
        <BarChart data={processDataForGraph()}>
          <XAxis dataKey="hour" />
          <YAxis domain={[0, 100]} tickFormatter={(tick) => `${tick}%`} />
          <Tooltip />
          <Legend verticalAlign="top" align="right" iconType="circle" />
          <Bar dataKey="users" fill="#f48c06" name="User Viewed Time" />
        </BarChart>
      </ResponsiveContainer>
      <button className="close-modal-read" onClick={() => setShowAnalysisModal(false)}>
        x
      </button>
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
  {/* delete all modal */}
      {showDeleteAllConfirm && (
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
              width: "500px",
              boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
            }}
          >
      <h3>Delete All Selected Campaigns</h3>
      <p>Are you sure you want to delete {selectedCampaigns.length} selected campaigns? This action cannot be undone.</p>
            <div style={{ marginTop: "20px" }}>
              <button
                 onClick={async () => {
            await handleDeleteAllSelected();
            setShowDeleteAllConfirm(false);
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
                  onClick={() => setShowDeleteAllConfirm(false)}

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
      
    </div>
  );
}

export default CampaignTable;