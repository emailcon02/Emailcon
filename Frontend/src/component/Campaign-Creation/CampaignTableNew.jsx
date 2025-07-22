import { useState, useRef, useEffect } from "react";
import axios from "axios";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./CampaignTableNew.css";
import { useNavigate } from "react-router-dom";
import apiConfig from "../../apiconfig/apiConfig";
import opened from "../../Images/mail-card.png";
import click from "../../Images/click.png";
import Bounce from "../../Images/alert.png";
import scheduled from "../../Images/event.png";
import delivered from "../../Images/direction.png";
import totaluser from "../../Images/group.png";
// import check from "../../Images/check.png";
import mails from "../../Images/mail-card.png";
// import mail from "../../Images/mail-card-1.png";
import { unparse } from "papaparse";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import {
  FaExclamationTriangle,
  FaEnvelopeOpen,
  FaMousePointer,
  FaPaperPlane,
  FaCheckCircle,
} from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  FaArrowLeft,
  FaRegChartBar,
  FaRegClock,
  FaRegFile,
  FaRegFileExcel,
  FaRegFilePdf,
  FaSyncAlt,
  FaTrash,
} from "react-icons/fa";
import { Download } from "lucide-react";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

import { FaChartBar } from "react-icons/fa";
import { MdOutlineUnsubscribe } from "react-icons/md";

const CampaignTableNew = ({ onSelect = () => {}, className = "" }) => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [isOpenexport, setIsOpenexport] = useState(false);
  const [selectedCampaigns, setSelectedCampaigns] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showDeleteAllConfirm, setShowDeleteAllConfirm] = useState(false);
  const [campaignMetrics, setCampaignMetrics] = useState({});
  const [fromDate, setFromDate] = useState(null);
  const [toDate, setToDate] = useState(null);
  const [filteredCampaigns, setFilteredCampaigns] = useState([]);
  const [campaigns, setCampaigns] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [user] = useState(JSON.parse(localStorage.getItem("user") || "null"));
  const dropdownRef = useRef(null);
  const toggleDropdownexport = () => setIsOpenexport(!isOpenexport);
  const dropdownRefexport = useRef(null);
  const [activeCampaignId, setActiveCampaignId] = useState(
    () => localStorage.getItem("activeCampaignId") || null
  );
  const [openCount, setOpenCount] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [showdelModal, setShowdelModal] = useState(false);
  const [showunsubModal, setShowunsubModal] = useState(false);

  const [showfailModal, setShowfailModal] = useState(false);
  const [emailData, setEmailData] = useState([]);
  const [unsubscribe,setUnsubscribe] = useState([]);
  const [urlCount, setUrlCount] = useState(0);
  const [clickedUrls, setClickedUrls] = useState([]);
  const [emailClickData, setEmailClickData] = useState([]);
  const [urlEmails, setUrlEmails] = useState([]);
  const [showClickModal, setShowClickModal] = useState(false);
  const [showallClickModal, setShowallClickModal] = useState(false);
  const [showOverallClickModal, setShowOverallClickModal] = useState(false);
  // Scheduling State
  const [newTime, setNewTime] = useState({});
  const [activityFeed, setActivityFeed] = useState([]);
  const [recentClickCount, setRecentClickCount] = useState(0);
  const [recentOpenCount, setRecentOpenCount] = useState(0);
  const [timelineData, setTimelineData] = useState([]);
  const [visible, setVisible] = useState({
    opens: true,
    clicks: true,
    bounces: false,
    unsubscribes: false,
  });

  // Fix: Add state for single campaign details
  const [campaignDetails, setCampaignDetails] = useState({
    totalcount: 0,
    sendcount: 0,
    failedcount: 0,
    sentEmails: [],
    failedEmails: [],
  });
  const reportTitle = `Campaign Report - ${new Date().toLocaleDateString(
    "en-IN"
  )}`;

  const downloadPDF = () => {
    const doc = new jsPDF();
    const reportTitle = `Campaign Report - ${new Date().toLocaleDateString(
      "en-IN"
    )}`;
    doc.text(reportTitle, 14, 20);

    const headers = [
      "S.no",
      "Campaign Name",
      "Send Date",
      "Total Count",
      "Send Count",
      "Read Count",
      "Open Count",
      "Failed Count",
    ];

    const rows = [
      [
        1,
        campaignDetails.campaignname || "",
        new Date(campaignDetails.senddate).toLocaleString("en-IN"),
        campaignDetails.totalcount || 0,
        campaignDetails.sendcount || 0,
        openCount || 0,
        openCount || 0,
        campaignDetails.failedcount || 0,
      ],
    ];

    autoTable(doc, {
      head: [headers],
      body: rows,
      startY: 30,
    });

    doc.save(`${campaignDetails.campaignname}_campaign_report.pdf`);
  };

  const downloadCSV = () => {
    const reportTitle = `Campaign Report - ${new Date().toLocaleDateString(
      "en-IN"
    )}`;

    const csvData = [
      {
        "S.no": 1,
        "Campaign Name": campaignDetails.campaignname || "",
        "Send Date": new Date(campaignDetails.senddate).toLocaleString("en-IN"),
        "Total Count": campaignDetails.totalcount || 0,
        "Send Count": campaignDetails.sendcount || 0,
        "Read Count": openCount || 0,
        "Open Count": openCount || 0,
        "Failed Count": campaignDetails.failedcount || 0,
      },
    ];

    const csv = `${reportTitle}\n\n` + unparse(csvData);

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.setAttribute(
      "download",
      `${campaignDetails.campaignname}_campaign_report.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const downloadExcel = () => {
    const reportTitle = `Campaign Report - ${new Date().toLocaleDateString(
      "en-IN"
    )}`;

    const excelData = [
      {
        "S.no": 1,
        "Campaign Name": campaignDetails.campaignname || "",
        "Send Date": new Date(campaignDetails.senddate).toLocaleString("en-IN"),
        "Total Count": campaignDetails.totalcount || 0,
        "Send Count": campaignDetails.sendcount || 0,
        "Read Count": openCount || 0,
        "Open Count": openCount || 0,
        "Failed Count": campaignDetails.failedcount || 0,
      },
    ];

    const worksheet = XLSX.utils.json_to_sheet([]);
    XLSX.utils.sheet_add_aoa(worksheet, [[reportTitle]], { origin: "A1" }); // heading row
    XLSX.utils.sheet_add_json(worksheet, excelData, {
      origin: "A3",
      skipHeader: false,
    });

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Campaigns");

    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });
    const blob = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(blob, `${campaignDetails.campaignname}_campaign_report.xlsx`);
  };
const generateEngagementTimeline = () => {
  const timeline = {};

  // 📬 Opens
  emailData.forEach((item) => {
    let dateKey = "Unknown";
    if (item.timestamp && !isNaN(new Date(item.timestamp))) {
      dateKey = new Date(item.timestamp).toLocaleDateString();
    } else {
      dateKey = new Date().toLocaleDateString(); // fallback
    }

    if (!timeline[dateKey])
      timeline[dateKey] = { date: dateKey, opens: 0, clicks: 0, bounces: 0, unsubscribes: 0 };
    timeline[dateKey].opens += 1;
  });

  // 🔗 Clicks
  clickedUrls.forEach((url) => {
    url.clicks.forEach((click) => {
      let dateKey = "Unknown";
      if (click.timestamp && !isNaN(new Date(click.timestamp))) {
        dateKey = new Date(click.timestamp).toLocaleDateString();
      } else {
        dateKey = new Date().toLocaleDateString(); // fallback
      }

      if (!timeline[dateKey])
        timeline[dateKey] = { date: dateKey, opens: 0, clicks: 0, bounces: 0, unsubscribes: 0 };
      timeline[dateKey].clicks += 1;
    });
  });

  // 📤 Unsubscribes
  if (Array.isArray(unsubscribe)) {
    unsubscribe.forEach((item) => {
      let dateKey = "Unknown";
      if (item.timestamp && !isNaN(new Date(item.timestamp))) {
        dateKey = new Date(item.timestamp).toLocaleDateString();
      } else {
        dateKey = new Date().toLocaleDateString(); // fallback
      }

      if (!timeline[dateKey])
        timeline[dateKey] = { date: dateKey, opens: 0, clicks: 0, bounces: 0, unsubscribes: 0 };
      timeline[dateKey].unsubscribes += 1;
    });
  }

  // ✅ Add bounce only on first activity date
  const bounceRate = campaignDetails.failedcount || 0;
  const sortedDates = Object.keys(timeline).sort((a, b) => new Date(a) - new Date(b));

  if (sortedDates.length > 0 && bounceRate > 0) {
    const firstDate = sortedDates[0];
    timeline[firstDate].bounces = bounceRate;
  }

  return Object.values(timeline).sort((a, b) => new Date(a.date) - new Date(b.date));
};

  useEffect(() => {
  const timeline = generateEngagementTimeline();
  // console.log("Engagement timeline data", timeline);
  setTimelineData(timeline)
}, [emailData, clickedUrls, unsubscribe, campaignDetails]);


  const toggleLine = (key) => {
    setVisible((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  useEffect(() => {
    if (campaigns.length > 0) {
      const storedId = localStorage.getItem("activeCampaignId");
      const initialId =
        storedId && campaigns.some((c) => c._id === storedId)
          ? storedId
          : campaigns[0]._id;
      setActiveCampaignId(initialId);
    }
  }, [campaigns]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRefexport.current &&
        !dropdownRefexport.current.contains(event.target)
      ) {
        setIsOpenexport(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Fetch campaigns function
  const fetchCampaigns = async () => {
    if (!user?.id) {
      navigate("/user-login");
      return;
    }

    try {
      const response = await axios.get(
        `${apiConfig.baseURL}/api/stud/campaigns/${user.id}?t=${Date.now()}`,
        { headers: { "Cache-Control": "no-cache" } }
      );

      const sortedCampaigns = response.data.sort(
        (a, b) => parseDate(b.senddate) - parseDate(a.senddate)
      );

      const filteredCampaigns = sortedCampaigns.filter((campaign) => {
        const campaignName = campaign.campaignname?.toLowerCase() || "";
        return !campaignName.includes("birthday campaign");
      });

      setCampaigns(filteredCampaigns);
      filterCampaigns(filteredCampaigns);

      const metrics = {};
      await Promise.all(
        filteredCampaigns.map(async (campaign) => {
          try {
            const [openRes, clickRes] = await Promise.all([
              axios.get(
                `${apiConfig.baseURL}/api/stud/get-email-open-count?userId=${user.id}&campaignId=${campaign._id}`
              ),
              axios.get(
                `${apiConfig.baseURL}/api/stud/get-click?userId=${user.id}&campaignId=${campaign._id}`
              ),
            ]);

            metrics[campaign._id] = {
              openCount: openRes.data.count || 0,
              clickCount: clickRes.data.count || 0,
            };
          } catch (e) {
            console.error(`Failed to fetch metrics for ${campaign._id}`, e);
            metrics[campaign._id] = {
              openCount: 0,
              clickCount: 0,
            };
          }
        })
      );

      setCampaignMetrics(metrics);
    } catch (error) {
      console.error("Failed to fetch campaigns:", error);
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

      await axios.put(
        `${apiConfig.baseURL}/api/stud/camhistory/${activeCampaignId}`,
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
    } catch (error) {
      console.error("Error updating scheduled time:", error);
      toast.error("Failed to update scheduled time");
    }
  };
  const handleToggle = async (e, campaignId) => {
    const isChecked = e.target.checked;
    const newStatus = isChecked ? "Scheduled On" : "Scheduled Off";
    const campaign = getCampaignById(campaignId);

    try {
      // Optimistically update the UI
      setCampaigns((prevCampaigns) =>
        prevCampaigns.map((campaign) =>
          campaign._id === campaignId
            ? { ...campaign, status: newStatus }
            : campaign
        )
      );

      setCampaignDetails((prev) => ({
        ...prev,
        status: newStatus,
      }));

      // Make the API call
      await axios.put(
        `${apiConfig.baseURL}/api/stud/camhistory/${campaignId}`,
        {
          status: newStatus,
        }
      );

      // Update toast to success
      toast.success(
        `${campaign?.campaignname || "Campaign"} is now ${newStatus}`
      );

      fetchCampaigns();
    } catch (error) {
      console.error("Error updating campaign status:", error);

      // Revert UI if API call fails
      setCampaigns((prevCampaigns) =>
        prevCampaigns.map((campaign) =>
          campaign._id === campaignId
            ? {
                ...campaign,
                status: isChecked ? "Scheduled Off" : "Scheduled On",
              }
            : campaign
        )
      );

      setCampaignDetails((prev) => ({
        ...prev,
        status: isChecked ? "Scheduled Off" : "Scheduled On",
      }));

      // Show error toast
      toast.error(
        `Failed to update ${campaign?.campaignname || "campaign"} status`,
        {
          autoClose: 3000,
        }
      );
    }
  };
  // Parse date function
  const parseDate = (dateStr) => {
    if (!dateStr) return new Date(0);

    if (dateStr.includes("T")) {
      return new Date(dateStr);
    }

    try {
      if (/^\d{1,2}\/\d{1,2}\/\d{4}, \d{1,2}:\d{2}:\d{2}$/.test(dateStr)) {
        const [datePart, timePart] = dateStr.split(", ");
        const [day, month, year] = datePart.split("/").map(Number);
        const [hours, minutes, seconds] = timePart.split(":").map(Number);
        return new Date(year, month - 1, day, hours, minutes, seconds);
      }

      if (
        /^\d{1,2}\/\d{1,2}\/\d{4}, \d{1,2}:\d{2}:\d{2} [AP]M$/.test(dateStr)
      ) {
        const [datePart, timePart] = dateStr.split(", ");
        const [month, day, year] = datePart.split("/").map(Number);
        const [time, period] = timePart.split(" ");
        let [hours, minutes, seconds] = time.split(":").map(Number);

        if (period === "PM" && hours < 12) hours += 12;
        if (period === "AM" && hours === 12) hours = 0;

        return new Date(year, month - 1, day, hours, minutes, seconds);
      }
    } catch (e) {
      console.error("Error parsing date:", dateStr, e);
    }

    const parsed = new Date(dateStr);
    return isNaN(parsed) ? new Date(0) : parsed;
  };

  // Filter campaigns
  const filterCampaigns = (campaignsToFilter = campaigns) => {
    let filtered = [...campaignsToFilter];

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter((campaign) => {
        return (
          campaign.campaignname?.toLowerCase().includes(term) ||
          campaign.groupname?.toLowerCase().includes(term)
        );
      });
    }

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

    filtered.sort((a, b) => {
      const dateA = parseDate(a.senddate);
      const dateB = parseDate(b.senddate);
      return dateB - dateA;
    });

    setFilteredCampaigns(filtered);
  };

  useEffect(() => {
    filterCampaigns();
  }, [searchTerm, fromDate, toDate, campaigns]);

  useEffect(() => {
    fetchCampaigns();
  }, [user?.id]);



  // Handle click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Handle campaign selection
  const handleCampaignSelect = (campaign, event) => {
    event.stopPropagation();
    const isSelected = selectedCampaigns.includes(campaign._id);
    const newSelected = isSelected
      ? selectedCampaigns.filter((id) => id !== campaign._id)
      : [campaign._id];

    setSelectedCampaigns(newSelected);
    setActiveCampaignId(campaign._id);
    localStorage.setItem("activeCampaignId", campaign._id); // Store in localStorage
    setSelectAll(false);
    onSelect(newSelected);

    if (event.target.tagName !== "INPUT") {
      setIsOpen(false);
    }
  };

  // Handle select all toggle
  const handleSelectAll = () => {
    const newSelectAll = !selectAll;
    setSelectAll(newSelectAll);

    if (newSelectAll) {
      const allIds = filteredCampaigns.map((campaign) => campaign._id);
      setSelectedCampaigns(allIds);
      onSelect(allIds);
    } else {
      setSelectedCampaigns([]);
      onSelect([]);
    }
  };

  const handleDeleteAllSelected = async () => {
    if (selectedCampaigns.length === 0) {
      toast.warning("No campaigns selected for deletion.");
      return;
    }

    try {
      await Promise.all(
        selectedCampaigns.map((campaignId) =>
          axios.delete(`${apiConfig.baseURL}/api/stud/camhistory/${campaignId}`)
        )
      );

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

  // Handle reset filters
  const handleReset = () => {
    setSearchTerm("");
    setFromDate(null);
    setToDate(null);
  };

  const userId = user?.id;
  const campaignId = activeCampaignId;

  useEffect(() => {
    if (!userId || !campaignId) return;
    fetchClickData();
    fetchEmailDetails();
  }, [userId, campaignId]);

  const fetchClickData = () => {
    axios
      .get(
        `${apiConfig.baseURL}/api/stud/get-click?userId=${userId}&campaignId=${campaignId}`
      )
      .then((response) => {
        setUrlCount(response.data.count);
        setClickedUrls(response.data.urls);
        setUrlEmails(response.data.emails);
        //   setRecentClicks(processRecentClicks(response.data.urls || []));
      })
      .catch((error) => console.error("Error fetching click data", error));
  };

  // Handle View button click
  const handleViewClick = (clickData) => {
    setShowallClickModal(false);
    setEmailClickData(clickData);
    setShowClickModal(true);
  };

  const handleRefreshAndCloseModals = (e) => {
    e.stopPropagation();
    setShowModal(false);
    setShowdelModal(false);
    setShowunsubModal(false);
    setShowfailModal(false);
    setShowClickModal(false);
    setShowallClickModal(false);
    setShowOverallClickModal(false);
    setTimeout(() => {
      window.location.reload();
    }, 1000);
  };

  const handleCloseClickModal = () => {
    setShowClickModal(false);
    setShowallClickModal(true);
    setEmailClickData([]);
  };

  // Fix: Updated useEffect to handle campaign details properly
  useEffect(() => {
    const fetchCampaignDetails = async () => {
      if (!campaignId) return;

      try {
        const res = await axios.get(
          `${apiConfig.baseURL}/api/stud/getcamhistory/${campaignId}`
        );

        // Fix: Set campaign details properly
        if (res.data) {
          setCampaignDetails(res.data);
        }
      } catch (err) {
        console.error("Error fetching campaign details:", err);
        // Set default values on error
        setCampaignDetails({
          totalcount: 0,
          sendcount: 0,
          failedcount: 0,
          sentEmails: [],
          failedEmails: [],
        });
      }
    };

    fetchCampaignDetails();
  }, [campaignId]);

  useEffect(() => {
    if (!userId || !campaignId) return;

    const fetchEmailCount = () => {
      axios
        .get(
          `${apiConfig.baseURL}/api/stud/get-email-open-count?userId=${userId}&campaignId=${campaignId}`
        )
        .then((response) => {
          setOpenCount(response.data.count);
        })
        .catch((error) => console.error("Error fetching open count", error));
    };

    fetchEmailCount();
  }, [userId, campaignId]);

  const fetchEmailClickDetails = () => {
    setShowallClickModal(true);
  };

  const handleCloseallClickModal = () => {
    setShowallClickModal(false);
  };

  const fetchEmailDetails = async () => {
    try {
      const res = await axios.get(
        `${apiConfig.baseURL}/api/stud/get-email-open-count?userId=${userId}&campaignId=${campaignId}`
      );

      const newEmails = res.data.emails || [];

      // Filter within last hour
      // const filteredEmails = newEmails.filter(e => isWithinLastHour(e.timestamp));

      setEmailData(newEmails); // full list if needed
      // setRecentOpens(filteredEmails); // filtered list
    } catch (err) {
      console.error("Error fetching email details", err);
      setEmailData([]);
    }
  };

useEffect(() => {
  if (campaignDetails?.groupId) {
    fetchUnsubscribeCount();
  }
}, [campaignDetails?.groupId]);

  const fetchUnsubscribeCount= async () => {
    // console.log("Fetching unsubscribe details for groupId:", campaignDetails.groupId);
    if (!campaignDetails.groupId) { 
      console.warn("No groupId found in campaignDetails");
      setUnsubscribe([]);
      return;
    }
    try {
      const res = await axios.get(
        `${apiConfig.baseURL}/api/stud/groups/${campaignDetails.groupId}/unsubscribe-student`
      );
      const newEmails = res.data || [];
      setUnsubscribe(newEmails); 
      // console.log("unsub mail",newEmails)
    } catch (err) {
      console.error("Error fetching unsubscribe details", err);
      setUnsubscribe([]);
    }
  };

  const handlereadDetails = () => {
    fetchEmailDetails();
    setShowModal(true);
  };

  const handleOverallClickDetails = () => {
    setShowallClickModal(false);
    setShowOverallClickModal(true);
  };

  const handleCloseoverallModal = () => {
    setShowOverallClickModal(false);
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

  const handleBackCampaign = () => {
    localStorage.removeItem("activeCampaignId");
    navigate("/home");
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleopendelmodal = () => {
    setShowdelModal(true);
  };

  const handleClosedelModal = () => {
    setShowdelModal(false);
  };
   const handleopenunsubmodal = () => {
    setShowunsubModal(true);
  };

  const handleCloseunsubModal = () => {
    setShowunsubModal(false);
  };

  const handleopenfailmodal = () => {
    setShowfailModal(true);
  };

  const handleClosefailModal = () => {
    setShowfailModal(false);
  };

  // Fix: Update rate calculations to use campaignDetails
  const readRate =
    campaignDetails.totalcount > 0
      ? ((openCount / campaignDetails.totalcount) * 100).toFixed(2)
      : "0.00";

  const clickRate =
    campaignDetails.totalcount > 0
      ? ((urlCount / campaignDetails.totalcount) * 100).toFixed(2)
      : "0.00";
 const unsubRate =
    campaignDetails.totalcount > 0
      ? ((unsubscribe.length / campaignDetails.totalcount) * 100).toFixed(2)
      : "0.00";

  const deliveredRate =
    campaignDetails.totalcount > 0
      ? (
          (campaignDetails.sendcount / campaignDetails.totalcount) *
          100
        ).toFixed(2)
      : "0.00";

  const failedRate =
    campaignDetails.totalcount > 0
      ? (
          (campaignDetails.failedcount / campaignDetails.totalcount) *
          100
        ).toFixed(2)
      : "0.00";

  const data = [
    { name: "Sent", value: `${campaignDetails.totalcount}`, fill: "#2563eb" },
    {
      name: "Delivered",
      value: `${campaignDetails.sendcount}`,
      fill: "#10b981",
    },
    { name: "Opened", value: openCount, fill: "#3b82f6" },
    { name: "Clicked", value: urlCount, fill: "#f59e0b" },
    {
      name: "Bounced",
      value: `${campaignDetails.failedcount}`,
      fill: "#ff5d78",
    },
      {
      name: "Unsubscribe",
      value: `${unsubscribe.length}`,
      fill: "#8B5CF6",
    },
  ];

  // Fix: Get campaign by ID with proper error handling
  const getCampaignById = (id) => {
    if (!Array.isArray(campaigns)) {
      return null;
    }
    return campaigns.find((campaign) => campaign._id === id);
  };

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const isWithinLastHour = (timestamp) => {
    const now = new Date();
    const time = new Date(timestamp);
    return (now - time) / (1000 * 60) <= 60; // last 60 mins
  };
  const getLastHourOpenCount = () =>
    emailData.filter((item) => isWithinLastHour(item.timestamp)).length;

  const getLastHourClickCount = () => {
    let count = 0;
    clickedUrls.forEach((url) =>
      url.clicks.forEach((click) => {
        if (isWithinLastHour(click.timestamp)) count++;
      })
    );
    return count;
  };
  const getLatestActivityFeed = () => {
    const openEvents = emailData.map((item) => ({
      type: "open",
      emailId: item.emailId,
      timestamp: item.timestamp,
      isLive: isWithinLastHour(item.timestamp),
    }));

    let clickEvents = [];
    clickedUrls.forEach((url) =>
      url.clicks.forEach((click) => {
        clickEvents.push({
          type: "click",
          emailId: click.emailId,
          timestamp: click.timestamp,
          clickedUrl: url.clickedUrl,
          isLive: isWithinLastHour(click.timestamp),
        });
      })
    );

    return [...openEvents, ...clickEvents]
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
      .slice(0, 10); // last 10 regardless of time
  };
  useEffect(() => {
    const updateActivity = () => {
      setRecentOpenCount(getLastHourOpenCount());
      setRecentClickCount(getLastHourClickCount());
      setActivityFeed(getLatestActivityFeed()); // new list logic
    };

    updateActivity();
    const interval = setInterval(updateActivity, 30000);
    return () => clearInterval(interval);
  }, [emailData, clickedUrls]);

  // Email validation function
  const isValidEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
  };

  const handleResend = async () => {
    try {
      // Fetch campaign details
      const response = await axios.get(
        `${apiConfig.baseURL}/api/stud/getcamhistory/${campaignId}`
      );
      const campaign = response.data;
      if (
        !campaign ||
        !campaign.failedEmails ||
        campaign.failedEmails.length === 0
      ) {
        toast.warning("No failed emails to resend.");
        return;
      }
      // Validate and filter emails before processing
      const validFailedEmails = campaign.failedEmails.filter(
        (email) => email && isValidEmail(email) && email !== "missing"
      );
      const invalidEmails = campaign.failedEmails.filter(
        (email) => !email || !isValidEmail(email) || email === "missing"
      );

      if (validFailedEmails.length === 0) {
        toast.warning("No valid failed emails to resend.");
        return;
      }

      let sentEmails = [];
      let failedEmails = [...invalidEmails]; // Start with invalid emails

      // If groupId is a string (e.g., "no group"), send only to failedEmails and return early
      if (!campaign.groupId || campaign.groupId === "no group") {
        console.log("No group found, sending emails directly.");

        // Update status to 'Pending' before resending
        await axios.put(
          `${apiConfig.baseURL}/api/stud/camhistory/${campaignId}`,
          {
            status: "Pending",
          }
        );

        for (const email of campaign.failedEmails) {
          const personalizedContent = campaign.previewContent.map((item) => {
            const personalizedItem = { ...item };

            if (item.content) {
              const placeholderRegex = new RegExp(`\\{?Email\\}?`, "g");
              personalizedItem.content = personalizedItem.content.replace(
                placeholderRegex,
                email
              );
            }
            return personalizedItem;
          });

          const emailData = {
            recipientEmail: email,
            subject: campaign.subject,
            aliasName: campaign.aliasName,
            replyTo: campaign.replyTo,
            body: JSON.stringify(personalizedContent),
            bgColor: campaign.bgColor,
            previewtext: campaign.previewtext,
            attachments: campaign.attachments,
            userId: campaign.user,
            groupId: campaign.groupname,
            campaignId: campaignId,
          };

          try {
            await axios.post(
              `${apiConfig.baseURL}/api/stud/sendbulkEmail`,
              emailData
            );
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

        await axios.put(
          `${apiConfig.baseURL}/api/stud/camhistory/${campaignId}`,
          {
            sendcount: Number(campaign.sendcount) + successCount,
            sentEmails: [...campaign.sentEmails, ...sentEmails],
            failedEmails: failedEmails.length > 0 ? [...failedEmails] : 0,
            failedcount: failedEmails.length > 0 ? failedEmails.length : 0,
            status: finalStatus,
            progress: finalProgress,
          }
        );

        console.log("Emails resent successfully!");
        return;
      }

      // If groupId is a string (e.g., "No id"), send only to failedEmails and return early
      if (!campaign.groupId || campaign.groupId === "No id") {
        console.log("No group found, sending emails directly.");

        // Update status to 'Pending' before resending
        await axios.put(
          `${apiConfig.baseURL}/api/stud/camhistory/${campaignId}`,
          {
            status: "Pending",
          }
        );

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
                personalizedItem.content = personalizedItem.content.replace(
                  placeholderRegex,
                  cellValue
                );
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
            replyTo: campaign.replyTo,
            attachments: campaign.attachments,
            userId: campaign.user,
            groupId: campaign.groupname,
            campaignId: campaignId,
          };

          try {
            await axios.post(
              `${apiConfig.baseURL}/api/stud/sendbulkEmail`,
              emailData
            );
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

        await axios.put(
          `${apiConfig.baseURL}/api/stud/camhistory/${campaignId}`,
          {
            sendcount: Number(campaign.sendcount) + successCount,
            sentEmails: [...campaign.sentEmails, ...sentEmails],
            failedEmails: failedEmails.length > 0 ? [...failedEmails] : 0,
            failedcount: failedEmails.length > 0 ? failedEmails.length : 0,
            status: finalStatus,
            progress: finalProgress,
          }
        );

        console.log("Emails resent successfully!");

        return;
      }

      // If groupId exists, fetch students and follow existing logic
      const studentsResponse = await axios.get(
        `${apiConfig.baseURL}/api/stud/groups/${campaign.groupId}/students`
      );
      const students = studentsResponse.data;

      // Update status to 'Pending' before resending
      await axios.put(
        `${apiConfig.baseURL}/api/stud/camhistory/${campaignId}`,
        {
          status: "Pending",
        }
      );

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
          personalizedSubject = personalizedSubject.replace(
            placeholderRegex,
            cellValue
          );
        });
        // Personalize email content with student details
        const personalizedContent = campaign.previewContent.map((item) => {
          const personalizedItem = { ...item };

          if (item.content) {
            Object.entries(student).forEach(([key, value]) => {
              const placeholderRegex = new RegExp(`\\{?${key}\\}?`, "g");
              const cellValue = value != null ? String(value).trim() : "";
              personalizedItem.content = personalizedItem.content.replace(
                placeholderRegex,
                cellValue
              );
            });
          }
          return personalizedItem;
        });

        const emailData = {
          recipientEmail: email,
          subject: personalizedSubject,
          body: JSON.stringify(personalizedContent),
          bgColor: campaign.bgColor,
          previewtext: campaign.previewtext,
          attachments: campaign.attachments,
          aliasName: campaign.aliasName,
          replyTo: campaign.replyTo,
          userId: campaign.user,
          groupId: campaign.groupname,
          campaignId: campaignId,
        };

        try {
          await axios.post(
            `${apiConfig.baseURL}/api/stud/sendbulkEmail`,
            emailData
          );
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

      await axios.put(
        `${apiConfig.baseURL}/api/stud/camhistory/${campaignId}`,
        {
          sendcount: Number(campaign.sendcount) + successCount,
          sentEmails: [...campaign.sentEmails, ...sentEmails],
          failedEmails: failedEmails.length > 0 ? [...failedEmails] : 0,
          failedcount: failedEmails.length > 0 ? failedEmails.length : 0,
          status: finalStatus,
          progress: finalProgress,
        }
      );
      console.log("Emails resent successfully!");
    } catch (error) {
      console.error("Error resending emails:", error);
    }
  };

  return (
    <>
      {/* navbar */}
      <div className="admin-nav">
        <div className="nav-mobile-btn">
          <h2 className="admin-dashboard-header">Campaign Analytics</h2>
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
      {/* select campaign */}
      <div style={{ backgroundColor: "#fffaf3" }}>
        <div className="custom-drop-main">
          <div className={`custom-dropdown-wrapper ${className}`}>
            <div className="custom-dropdown" ref={dropdownRef}>
              <div
                className={`dropdown-trigger ${isOpen ? "active" : ""}`}
                onClick={toggleDropdown}
              >
                <div className="selected-content">
                  {selectedCampaigns.length > 0 ? (
                    <div className="selected-options">
                      {selectedCampaigns.slice(0, 1).map((campaignId) => {
                        const campaign = getCampaignById(campaignId);
                        return (
                          <span key={campaignId} className="selected-tag">
                            <FaRegChartBar className="campaign-icon-rep" />
                            {campaign?.campaignname || "Unknown Campaign"}{" "}
                            {campaign?.temname && (
                              <span style={{ color: "#888", fontSize: "0.85em" }}>
                                (Template: {campaign?.temname})
                              </span>
                            ) }
                          </span>
                        );
                      })}
                    </div>
                  ) : (
                   <span className="placeholder">
  <FaRegChartBar className="campaign-icon-rep" />
  {Array.isArray(campaigns) && campaigns.length > 0 ? (
    <>
      {campaigns[0].campaignname}{" "}
      <span style={{ color: "#888", fontSize: "0.85em" }}>
        (Template: {campaigns[0].temname})
      </span>
    </>
  ) : (
    "No campaigns available"
  )}
</span>


                  )}
                </div>

                <div className={`dropdown-arrow ${isOpen ? "rotate" : ""}`}>
                  <svg width="12" height="8" viewBox="0 0 12 8" fill="none">
                    <path
                      d="M1 1.5L6 6.5L11 1.5"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
              </div>

              {isOpen && (
                <div className="dropdown-content">
                  <div className="dropdown-header">
                    <div className="search-row">
                      <div className="search-container">
                        <svg
                          className="search-icon"
                          width="16"
                          height="16"
                          viewBox="0 0 16 16"
                          fill="none"
                        >
                          <path
                            d="M7.333 12.667A5.333 5.333 0 1 0 7.333 2a5.333 5.333 0 0 0 0 10.667ZM14 14l-2.9-2.9"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                        <input
                          type="text"
                          className="search-input-drop"
                          placeholder="Search campaigns..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                        />
                      </div>

                      <div className="date-filter-group">
                        <div className="date-input-group">
                          <label>From</label>
                          <DatePicker
                            selected={fromDate}
                            onChange={setFromDate}
                            placeholderText="Select date"
                            className="date-input"
                            dateFormat="dd/MM/yyyy"
                          />
                        </div>

                        <div className="date-input-group">
                          <label>To</label>
                          <DatePicker
                            selected={toDate}
                            onChange={setToDate}
                            placeholderText="Select date"
                            className="date-input"
                            dateFormat="dd/MM/yyyy"
                          />
                        </div>

                        <button
                          className="action-button reset-button"
                          onClick={handleReset}
                        >
                          Reset
                        </button>

                        <button
                          className="action-button delete-button"
                          onClick={() => {
                            if (selectedCampaigns.length === 0) {
                              toast.warning(
                                "No campaigns selected for deletion."
                              );
                            } else {
                              setShowDeleteAllConfirm(true);
                            }
                          }}
                        >
                          <FaTrash /> Delete
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="options-container">
                    <div className="select-all-item">
                      <div className="option-checkbox">
                        <input
                          type="checkbox"
                          checked={selectAll}
                          onChange={handleSelectAll}
                        />
                      </div>
                      <div className="option-content">
                        <div className="option-main">
                          <div className="option-label">
                            Select All ({filteredCampaigns.length})
                          </div>
                        </div>
                      </div>
                    </div>

                    {filteredCampaigns.map((campaign) => {
                      const isSelected = selectedCampaigns.includes(
                        campaign._id
                      );
                      return (
                        <div
                          key={campaign._id}
                          className={`option-item ${
                            isSelected ? "selected" : ""
                          }`}
                          onClick={(e) => handleCampaignSelect(campaign, e)}
                        >
                          <div style={{ display: "flex", gap: "10px" }}>
                            <div className="option-checkbox">
                              <input
                                type="checkbox"
                                checked={isSelected}
                                onChange={(e) =>
                                  handleCampaignSelect(campaign, e)
                                }
                                onClick={(e) => e.stopPropagation()}
                              />
                            </div>

                            <div className="option-content">
                              <div className="option-main">
                                <div className="option-label">
                                  {campaign.campaignname || "Unnamed Campaign"}
                                </div>
                                <div className="option-details">
                                  <span className="group-name">
                                    {campaign.groupname || "No Group"}
                                  </span>
                                  <span className="send-date">
                                    {campaign.senddate
                                      ? new Date(
                                          parseDate(campaign.senddate)
                                        ).toLocaleString()
                                      : "No Date"}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>

                          <div>
                            <span
                              style={{
                                fontWeight: "500",
                                cursor: "pointer",
                                fontSize: "12px",
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
                          </div>
                        </div>
                      );
                    })}

                    {filteredCampaigns.length === 0 && (
                      <div className="no-results">No campaigns found</div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Delete all modal */}
          {showDeleteAllConfirm && (
            <div
              style={{
                position: "fixed",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                backgroundColor: "rgba(0, 0, 0, 0.4)",
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
                <p>
                  Are you sure you want to delete {selectedCampaigns.length}{" "}
                  selected campaigns? This action cannot be undone.
                </p>
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

          <div className="export-dropdown-custom" ref={dropdownRefexport}>
            <button className="export-button" onClick={toggleDropdownexport}>
              <Download className="icon grey" />
              Export
            </button>
            <div className={`dropdown-menu-exp ${isOpenexport ? "open" : ""}`}>
              <div className="dropdown-header-exp">Export Options</div>
              <div className="dropdown-item-exp" onClick={downloadPDF}>
                <FaRegFilePdf className="icon blue" />
                <div className="text">
                  <div className="title">PDF Report</div>
                  <div className="desc">Complete performance summary</div>
                </div>
              </div>
              <div className="dropdown-item-exp" onClick={downloadExcel}>
                <FaRegFileExcel className="icon blue" />
                <div className="text">
                  <div className="title">Excel Data</div>
                  <div className="desc">Raw metrics</div>
                </div>
              </div>
              <div className="dropdown-item-exp" onClick={downloadCSV}>
                <FaRegFile className="icon blue" />
                <div className="text">
                  <div className="title">CSV Export</div>
                  <div className="desc">Campaign data for analysis</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* cards */}
        <div className="campaign-his">
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <div className="campaign-cards">
              <h2>Performance Overview</h2>
              <p>Key metrics for selected campaign</p>
            </div>
            <div>
              <button className="Send-details">
                <p
                  style={{
                    marginRight: "6px",
                    backgroundColor: "#22c55e",
                    padding: "5px",
                    borderRadius: "50%",
                  }}
                ></p>
                <span style={{ fontSize: "15px" }}>
                  {" "}
                  Send date: {campaignDetails.senddate}
                </span>
              </button>
            </div>
          </div>
          <div className="campaign-history-cards">
            <div className="history-cards">
              <div className="sub-card-content">
                <img
                  src={totaluser}
                  alt="Templates"
                  className="cards-his-img"
                />
                <p className="values-his">100%</p>
              </div>
              <p className="counts-cards-his">{campaignDetails.totalcount}</p>
              <div className="sub-card">
                <p className="topics-cards">Contact</p>
                <FaSyncAlt
                  onClick={handleRefreshAndCloseModals}
                  className="ref-icon"
                />
              </div>
            </div>
            <div className="history-cards">
              <div className="sub-card-content">
                <img
                  src={scheduled}
                  alt="Templates"
                  className="cards-his-img"
                />
                <p style={{ marginTop: "5px" }}>
                  {["Scheduled On", "Scheduled Off"].includes(
                    campaignDetails.status
                  ) && (
                    <label
                      className="toggle-switch"
                      style={{ marginLeft: "10px" }}
                    >
                      <input
                        type="checkbox"
                        checked={campaignDetails.status === "Scheduled On"}
                        onChange={(e) => handleToggle(e, campaignDetails._id)}
                      />
                      <span className="slider"></span>
                    </label>
                  )}
                </p>
              </div>
              <div
                className="counts-cards-sched"
                style={{ display: "flex", flexDirection: "column" }}
              >
                <span>
                  {new Date(campaignDetails.scheduledTime).toLocaleDateString(
                    "en-IN",
                    {
                      timeZone: "Asia/Kolkata",
                    }
                  )}
                  ,
                </span>
                <span>
                  {new Date(campaignDetails.scheduledTime).toLocaleTimeString(
                    "en-IN",
                    {
                      timeZone: "Asia/Kolkata",
                    }
                  )}
                </span>
              </div>

              <div className="sub-card">
                <p className="topics-cards"> Scheduled</p>

                {["Scheduled On", "Scheduled Off"].includes(
                  campaignDetails.status
                ) && (
                  <span
                    title="Edit"
                    style={{
                      cursor: "pointer",
                      textDecoration: "underline",
                      color: "#2f327d",
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleOpenModal(
                        campaignId,
                        campaignDetails.scheduledTime
                      );
                    }}
                  >
                    Edit
                  </span>
                )}
              </div>            
            </div>

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
            <div className="history-cards" onClick={handlereadDetails}>
              <div className="sub-card-content">
                <img src={opened} alt="Templates" className="cards-his-img" />
                <p className="values-his">{openCount}</p>
              </div>
              <p className="counts-cards-his">{readRate}%</p>
              <div className="sub-card">
                <p className="topics-cards">Opened</p>
                <FaSyncAlt
                  onClick={handleRefreshAndCloseModals}
                  className="ref-icon"
                />
              </div>
            </div>
            <div className="history-cards" onClick={fetchEmailClickDetails}>
              <div className="sub-card-content">
                <img src={click} alt="Templates" className="cards-his-img-1" />
                <p className="values-his">{urlCount}</p>
              </div>
              <p className="counts-cards-his">{clickRate}%</p>
              <div className="sub-card">
                <p className="topics-cards">clicked</p>
                <FaSyncAlt
                  onClick={handleRefreshAndCloseModals}
                  className="ref-icon"
                />
              </div>
            </div>
            
            <div className="history-cards" onClick={handleopendelmodal}>
              <div className="sub-card-content">
                <img
                  src={delivered}
                  alt="Templates"
                  className="cards-his-img-2"
                />
                <p className="values-his"> {campaignDetails.sendcount}</p>
              </div>
              <p className="counts-cards-his">{deliveredRate}%</p>
              <div className="sub-card">
                <p className="topics-cards">Delivered</p>
                <FaSyncAlt
                  onClick={handleRefreshAndCloseModals}
                  className="ref-icon"
                />
              </div>
            </div>
            <div className="history-cards" onClick={handleopenfailmodal}>
              <div className="sub-card-content">
                <img src={Bounce} alt="Templates" className="cards-his-img-1" />
                <p className="values-his">{campaignDetails.failedcount}</p>
              </div>
              <p className="counts-cards-his">{failedRate}%</p>
              <div className="sub-card">
                <p className="topics-cards">Bounced</p>
                <FaSyncAlt
                  onClick={handleRefreshAndCloseModals}
                  className="ref-icon"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Modal for Delevered Details */}
        {showdelModal && (
          <div className="modal-overlay-read" onClick={handleClosedelModal}>
            <div
              className="modal-content-read"
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="modal-heading-read">Delivered Rate</h2>
              <div className="modal-content-read-table">
                <table className="email-table-read">
                  <thead>
                    <tr>
                      <th>Mail ID-{campaignDetails.sendcount}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {campaignDetails.sentEmails &&
                    campaignDetails.sentEmails.length > 0 ? (
                      campaignDetails.sentEmails.map((email, index) => (
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
              <button
                className="target-modal-read"
                onClick={handleClosedelModal}
              >
                Close
              </button>
              <button
                className="close-modal-read"
                onClick={handleClosedelModal}
              >
                x
              </button>
            </div>
          </div>
        )}

           {/* Modal for Unsubscribe Details */}
        {showunsubModal && (
          <div className="modal-overlay-read" onClick={handleCloseunsubModal}>
            <div
              className="modal-content-read"
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="modal-heading-read">Unsubscribed Rate</h2>
              <div className="modal-content-read-table">
                <table className="email-table-read">
                  <thead>
                    <tr>
                      <th>Mail ID-{unsubscribe.length}</th>
                    </tr>
                  </thead>
                  <tbody>
                    
                    {unsubscribe.length > 0 ? (
                      unsubscribe.map((item, index) => (
                        <tr key={index}>
                          <td>{item.Email}</td>
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
                onClick={handleCloseunsubModal}
              >
                Close
              </button>
              <button
                className="close-modal-read"
                onClick={handleCloseunsubModal}
              >
                x
              </button>
            </div>
          </div>
        )}
        {/* Modal for Clicked Details */}
        {showallClickModal && (
          <div
            className="modal-overlay-read"
            onClick={handleCloseallClickModal}
          >
            <div
              className="modal-content-read"
              onClick={(e) => e.stopPropagation()}
            >
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
                    {clickedUrls.length > 0 ? (
                      clickedUrls.map((urlData, index) => (
                        <tr key={index}>
                          <td>{urlData.clickedUrl}</td>
                          <td>
                            <button
                              className="resend-btn"
                              onClick={() => handleViewClick(urlData.clicks)}
                            >
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
                <button
                  className="overall-modal-read"
                  onClick={handleOverallClickDetails}
                >
                  Overall Click Mails
                </button>
                <button
                  className="overall-cancel"
                  onClick={handleCloseallClickModal}
                >
                  Close
                </button>
              </div>
              <button
                className="close-modal-read"
                onClick={handleCloseallClickModal}
              >
                x
              </button>
            </div>
          </div>
        )}

        {/* Modal for link view Details */}
        {showClickModal && (
          <div className="modal-overlay-read" onClick={handleCloseClickModal}>
            <div
              className="modal-content-read"
              onClick={(e) => e.stopPropagation()}
            >
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
                          <td>
                            {new Date(singleemail.timestamp).toLocaleString()}
                          </td>
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
                    campaignId,
                    emailClickData.map((singleemail) => singleemail.emailId)
                  )
                }
              >
                Retarget
              </button>

              <button
                className="close-modal-read"
                onClick={handleCloseClickModal}
              >
                x
              </button>
            </div>
          </div>
        )}

        {/* Modal for Failed Details */}
        {showfailModal && (
          <div className="modal-overlay-read" onClick={handleClosefailModal}>
            <div
              className="modal-content-read"
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="modal-heading-read">Failed Rate</h2>
              <div className="modal-content-read-table">
                <table className="email-table-read">
                  <thead>
                    <tr>
                      <th>Mail ID-{campaignDetails.failedcount}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {campaignDetails.failedEmails &&
                    campaignDetails.failedEmails.length > 0 ? (
                      campaignDetails.failedEmails.map((email, index) => (
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
              <div
                style={{
                  display: "flex",
                  gap: "10px",
                  justifyContent: "center",
                  marginTop: "20px",
                }}
              >
                <button
                  className="target-modal-read"
                  onClick={handleClosefailModal}
                >
                  Close
                </button>
                <button
                  onClick={() => handleResend(campaignId)}
                  className="target-modal-read"
                >
                  Resend
                </button>
              </div>
              <button
                className="close-modal-read"
                onClick={handleClosefailModal}
              >
                x
              </button>
            </div>
          </div>
        )}
        {/* Modal for Email Details */}
        {showModal && (
          <div className="modal-overlay-read" onClick={handleCloseModal}>
            <div
              className="modal-content-read"
              onClick={(e) => e.stopPropagation()}
            >
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
                    {Array.isArray(emailData) && emailData.length > 0 ? (
                      emailData.map((email, index) => (
                        <tr key={index}>
                          <td>{email.emailId}</td>
                          <td>{new Date(email.timestamp).toLocaleString()}</td>
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
              <div className="overall-btn">
                <button
                  className="overall-cancel"
                  onClick={() => handleEditor(userId, campaignId)}
                >
                  Retarget
                </button>
              </div>
              <button className="close-modal-read" onClick={handleCloseModal}>
                x
              </button>
            </div>
          </div>
        )}

        {/* Modal for overall click email Details */}
        {showOverallClickModal && (
          <div className="modal-overlay-read" onClick={handleCloseoverallModal}>
            <div
              className="modal-content-read"
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="modal-heading-read">Overall Click Details</h2>
              <div className="modal-content-read-table">
                <table className="email-table-read">
                  <thead>
                    <tr>
                      <th>Mail ID</th>
                    </tr>
                  </thead>

                  <tbody>
                    {Array.isArray(urlEmails) && urlEmails.length > 0 ? (
                      urlEmails.map((email, index) => (
                        <tr key={index}>
                          <td>{email._id}</td> {/* Extract _id property */}
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
                onClick={() => handleoverallEditor(userId, campaignId)}
              >
                Retarget
              </button>
              <button
                className="close-modal-read"
                onClick={handleCloseoverallModal}
              >
                x
              </button>
            </div>
          </div>
        )}

        {/* bar graph */}

        <div className="containers-data">
          <div className="content-container-graph">
            <div style={{ width: "95%", padding: "10px" }}>
              <div className="content-sub-divide">
                <div>
                  <h2
                    style={{
                      fontWeight: "bold",
                      fontSize: "18px",
                      color: "#1e293b",
                      textAlign: "left",
                      marginTop: "10px",
                    }}
                  >
                    Campaign Data Analysis
                  </h2>
                  <p
                    style={{
                      color: "#64748b",
                      marginBottom: "20px",
                      textAlign: "left",
                      marginTop: "10px",
                    }}
                  >
                    Insights and performance metrics of selcted campaigns
                  </p>
                </div>
                <div
                  style={{ marginTop: "30px" }}
                  onClick={handleRefreshAndCloseModals}
                >
                  <FaSyncAlt className="icon-right" />
                </div>
              </div>

              <ResponsiveContainer
                width="100%"
                height={400}
                style={{ marginTop: "30px" }}
              >
                <BarChart
                  data={data}
                  margin={{ top: 10, right: 30, left: 0, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" stroke="#64748b" fontSize={14} />
                  <YAxis stroke="#64748b" fontSize={12} />
                  <Tooltip />
                  <Bar radius={[4, 4, 0, 0]} barSize={100} dataKey="value" />
                </BarChart>
              </ResponsiveContainer>

              <h2
                style={{
                  fontWeight: "450",
                  fontSize: "16px",
                  color: "#1e293b",
                  textAlign: "left",
                  marginTop: "30px",
                }}
              >
                Detailed Breakdown
              </h2>
              <div className="container-boards" >
                {/* -------------------------table one -----------------------------*/}
                <div className="boards-table" >
                  <div className="div-boards-table">
                    <div className="div-boards-card">
                      {/* <img
                          src={delivered}
                          alt="Templates"
                          className="board-img"
                        /> */}
                      <FaPaperPlane className="sent-details" />

                      <div className="data-progress">
                        <p>Sent</p>
                        <div style={{ display: "flex", gap: "10px" }}>
                          <span>
                            <progress
                              id="file"
                              value="100"
                              max="100"
                              className="sent-progress"
                            >
                              100%
                            </progress>
                          </span>
                          <h6 className="values-progress">100%</h6>
                        </div>
                      </div>
                    </div>
                    <div>
                      <p className="aside-data-value">
                        {campaignDetails.totalcount}
                      </p>
                    </div>
                  </div>
                </div>
                {/* ----------------------------table 2-------------------------------- */}
                <div className="boards-table"  onClick={handleopendelmodal}>
                  <div className="div-boards-table">
                    <div className="div-boards-card">
                     
                      <FaCheckCircle className="delivered-details" />

                      <div className="data-progress">
                        <p>Delivered</p>
                        <div style={{ display: "flex", gap: "10px" }}>
                          <span>
                            <progress
                              id="file"
                              value={deliveredRate}
                              max="100"
                              className="delivered-progress"
                            >
                              {deliveredRate}%
                            </progress>
                          </span>
                          <h6 className="values-progress">{deliveredRate}%</h6>
                        </div>
                      </div>
                    </div>
                    <div>
                      <p className="aside-data-value">
                        {campaignDetails.sendcount}
                      </p>
                    </div>
                  </div>
                </div>
                {/* ----------------------------table 3-------------------------------- */}
                <div className="boards-table"  onClick={handlereadDetails}>
                  <div className="div-boards-table">
                    <div className="div-boards-card">
                      {/* <img
                          src={mails}
                          alt="Templates"
                          className="board-img"
                        /> */}
                      <FaEnvelopeOpen className="opened-details" />

                      <div className="data-progress">
                        <p>Opened</p>
                        <div style={{ display: "flex", gap: "10px" }}>
                          <span>
                            <progress
                              id="file"
                              value={readRate}
                              max="100"
                              className="opened-progress"
                            >
                              {readRate}%
                            </progress>
                          </span>
                          <h6 className="values-progress">{readRate}%</h6>
                        </div>
                      </div>
                    </div>
                    <div>
                      <p className="aside-data-value">{openCount}</p>
                    </div>
                  </div>
                </div>
                {/* ----------------------------table 4-------------------------------- */}
                <div className="boards-table" onClick={fetchEmailClickDetails}>
                  <div className="div-boards-table">
                    <div className="div-boards-card">
                      {/* <img
                          src={click}
                          alt="Templates"
                          className="board-img"
                        /> */}
                      <FaMousePointer className="clicked-details" />

                      <div className="data-progress">
                        <p>Clicked</p>
                        <div style={{ display: "flex", gap: "10px" }}>
                          <span>
                            <progress
                              id="file"
                              value={clickRate}
                              max="100"
                              className="clicked-progress"
                            >
                              {clickRate}%
                            </progress>
                          </span>
                          <h6 className="values-progress">{clickRate}%</h6>
                        </div>
                      </div>
                    </div>
                    <div>
                      <p className="aside-data-value">{urlCount}</p>
                    </div>
                  </div>
                </div>
                {/* ----------------------------table 5-------------------------------- */}
                <div className="boards-table" onClick={handleopenfailmodal}>
                  <div className="div-boards-table">
                    <div className="div-boards-card">
                      <FaExclamationTriangle className="bounced-details" />
                      <div className="data-progress">
                        <p>Bounced</p>
                        <div style={{ display: "flex", gap: "10px" }}>
                          <span>
                            <progress
                              id="file"
                              value={failedRate}
                              max="100"
                              className="failed-progress"
                            >
                              {failedRate}%
                            </progress>
                          </span>
                          <h6 className="values-progress">{failedRate}%</h6>
                        </div>
                      </div>
                    </div>
                    <div>
                      <p className="aside-data-value">
                        {campaignDetails.failedcount}
                      </p>
                    </div>
                  </div>
                </div>

<div className="boards-table"  onClick={handleopenunsubmodal}>
                  <div className="div-boards-table">
                    <div className="div-boards-card">

                      <MdOutlineUnsubscribe className="unsub-details" />

                      <div className="data-progress">
                        <p>Unsubscribe</p>
                        <div style={{ display: "flex", gap: "10px" }}>
                          <span>
                            <progress
                              id="file"
                              value={unsubRate}
                              max="100"
                              className="unsub-progress"
                            >
                              {unsubRate}%
                            </progress>
                          </span>
                          <h6 className="values-progress">{unsubRate}%</h6>
                        </div>
                      </div>
                    </div>
                    <div>
                      <p className="aside-data-value">{unsubscribe.length}</p>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </div>
          <div className="content-container-Activity">
            <div className="live-activity-box">
              <div className="live-activity-header">
                <div className="live-title">
                  <span className="status-dot"></span>
                  <h4 className="live-title">Live Activity</h4>
                </div>
                <i
                  onClick={handlereadDetails}
                  className="fas fa-up-right-from-square icon-right"
                ></i>
              </div>
              <div className="live-activity-box-scroll">
                <div className="activity-list">
                  {activityFeed.map((item, idx) => (
                    <div className="activity-item" key={idx}>
                      <div className="activity-icon">
                        {item.type === "click" ? (
                          <i
                            className="fas fa-mouse-pointer"
                            style={{ color: "blue", marginLeft: 5 }}
                          ></i>
                        ) : (
                          <i className="fas fa-envelope-open-text green"></i>
                        )}
                      </div>
                      <div className="activity-content">
                        <p className="activity-title">
                          {item.type === "click"
                            ? "Link Clicked"
                            : "Email Opened"}
                          {/* {item.isLive && <span className="live-dot"> • live</span>} */}
                        </p>
                        <p className="activity-email">{item.emailId}</p>
                        <p className="activity-info">
                          {campaignDetails?.campaignname || "Campaign"}
                        </p>
                      </div>
                      <span className="activity-time">
                        {new Date(item.timestamp).toLocaleTimeString()}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="activity-footer">
                <div>
                  <p className="activity-count">{recentOpenCount}</p>
                  <p>Opens (last hour)</p>
                </div>
                <div>
                  <p className="activity-count">{recentClickCount}</p>
                  <p>Clicks (last hour)</p>
                </div>
              </div>
            </div>
            <div className="container-activity-content-2">
              <div className="top-performers-container">
                <div className="top-header">
                  <div>
                    <h2 className="top-performers-title">Top Performers</h2>
                    <p className="top-performers-subtitle">
                      Best campaigns by engagement
                    </p>
                  </div>
                  <FaChartBar className="icon-right" />
                </div>
                <div className="top-performers-container-scroll">
                  {[...campaigns]
                    .sort((a, b) => {
                      const aOpen = campaignMetrics[a._id]?.openCount || 0;
                      const bOpen = campaignMetrics[b._id]?.openCount || 0;

                      const aClick = campaignMetrics[a._id]?.clickCount || 0;
                      const bClick = campaignMetrics[b._id]?.clickCount || 0;

                      const aTotal = a.totalcount || 1;
                      const bTotal = b.totalcount || 1;

                      const aAvg = ((aOpen + aClick) / (2 * aTotal)) * 100;
                      const bAvg = ((bOpen + bClick) / (2 * bTotal)) * 100;
                      return bAvg - aAvg;
                    })
                    .map((item, idx) => {
                      const metrics = campaignMetrics[item._id] || {};
                      const open = metrics.openCount || 0;
                      const click = metrics.clickCount || 0;

                      const openRate = (
                        (open / (item.totalcount || 1)) *
                        100
                      ).toFixed(0);
                      const clickRate = (
                        (click / (item.totalcount || 1)) *
                        100
                      ).toFixed(0);

                      return (
                        <div
                          key={item._id || idx}
                          className="campaign-row"
                          onClick={(e) => handleCampaignSelect(item, e)}
                        >
                         <div
  className={`rank-badge ${
    item.status === "Failed" ? "badge-orange-light" : "badge-orange-his"
  }`}
>
  {idx + 1}
</div>

                          <div className="campaign-details">
                            <div className="campaign-header">
                              <p className="campaign-title">
                                {item.campaignname || "Unnamed Campaign"}
                              </p>
                              <span
                                className={`status-tag ${
                                  item.status === "Success"
                                    ? "status-active"
                                    : item.status === "Failed"
                                    ? "status-paused"
                                    : "status-completed"
                                }`}
                              >
                                {item.status}
                              </span>
                            </div>
                            <div className="inline-campaign-data">
                              <div className="campaign-stats">
                                <p>
                                  Open Rate:{" "}
                                  <span className="highlight">{openRate}%</span>
                                </p>
                                <p>
                                  Click Rate:{" "}
                                  <span className="highlight">
                                    {clickRate}%
                                  </span>
                                </p>
                              </div>
                              <div className="campaign-stats">
                                <p>
                                  Delivered:{" "}
                                  <span className="revenue">
                                    {item.sendcount || 0}/{item.totalcount || 0}
                                  </span>
                                </p>
                                <p className="trend-camp">
                                  Failed:{" "}
                                  <span className="trend">
                                    {item.failedcount || 0}
                                  </span>
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* line graph */}
        <div className="engagement-container">
          <div className="engage-boxes">
            <div>
              <h2>Engagement Timeline</h2>
              <p className="engage-para" style={{marginBottom:"16px"}}>Email engagement trends over time</p>
            </div>

            <div>
              <div className="button-group">
                <button
                  className={`toggle-button ${visible.opens ? "active" : ""}`}
                  onClick={() => toggleLine("opens")}
                >
                  📩 Opens
                </button>
                <button
                  className={`toggle-button ${visible.clicks ? "active" : ""}`}
                  onClick={() => toggleLine("clicks")}
                >
                  🖱️ Clicks
                </button>
                <button
                  className={`toggle-button ${visible.bounces ? "active" : ""}`}
                  onClick={() => toggleLine("bounces")}
                >
                  ⚠️ Bounces
                </button>
                <button
                        className={`toggle-button ${visible.unsubscribes ? "active" : ""}`}
                        onClick={() => toggleLine("unsubscribes")}
                    >
                        👤 Unsubscribes
                    </button>
              </div>
            </div>
          </div>

          <ResponsiveContainer
            width="95%"
            height={350}
            className="responsive-graph-linebar"
          >
            <LineChart data={timelineData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="date"
                stroke="#64748b"
                fontSize={11}
                // interval={0} // <- force show all
                textAnchor="end"
              />
              <YAxis stroke="#64748b" fontSize={12} />
              <Tooltip />
              <Legend />
              {visible.opens && (
                <Line
                  type="monotone"
                  dataKey="opens"
                  stroke="#3b82f6"
                  strokeWidth={2}
                  dot={{ r: 3 }}
                />
              )}
              {visible.clicks && (
                <Line
                  type="monotone"
                  dataKey="clicks"
                  stroke="#f59e0b"
                  strokeWidth={2}
                  dot={{ r: 3 }}
                />
              )}
            {visible.bounces && (
  <Line
    type="monotone"
    dataKey="bounces"
    stroke="#DC2626"
    strokeWidth={2}
    dot={false}
    name="Bounced"
  />
)}

{visible.unsubscribes && (
  <Line
    type="monotone"
    dataKey="unsubscribes"
    stroke="#8B5CF6"
    strokeWidth={2}
    dot={false}
    name="Unsubscribed"
  />
)}

            </LineChart>
          </ResponsiveContainer>

          <div className="content-line-bar-below">
           
            <div className="linebar-div">
              <div className="linebar-content">
                {/* <img src={mails} alt="icons-linebar" className="icon-linebar" /> */}
                <FaEnvelopeOpen className="icon-linebar-2" />
                <p className="line-bar-title">Opens</p>
              </div>
              <p className="value-linebar">{openCount}</p>
              <p className="value-linebar-content">Per:{readRate}%</p>
            </div>
            <div className="linebar-div">
              <div className="linebar-content">
                {/* <img src={click} alt="icons-linebar" className="icon-linebar" /> */}
                <FaMousePointer className="icon-linebar-3" />
                <p className="line-bar-title">Clicks</p>
              </div>
              <p className="value-linebar">{urlCount}</p>
              <p className="value-linebar-content">Per:{clickRate}%</p>
            </div>
            <div className="linebar-div">
              <div className="linebar-content">
                {/* <img
                  src={Bounce}
                  alt="icons-linebar"
                  className="icon-linebar"
                /> */}
                <FaExclamationTriangle className="icon-linebar-4" />
                <p className="line-bar-title">Bounces</p>
              </div>
              <p className="value-linebar">{campaignDetails.failedcount}</p>
              <p className="value-linebar-content">Per:{failedRate}%</p>
            </div>
             <div className="linebar-div">
              <div className="linebar-content">
                {/* <img
                  src={delivered}
                  alt="icons-linebar"
                  className="icon-linebar-2"
                /> */}
                <MdOutlineUnsubscribe className="icon-linebar-1" />
                <p className="line-bar-title">Unsubscribe</p>
              </div>
              <p className="value-linebar">{unsubscribe.length}</p>
              <p className="value-linebar-content">Per:{unsubRate}%</p>
            </div>
          </div>
          <div className="show-data-line">
            <p>For latest update</p>
            <FaSyncAlt
              className="icon-right"
              onClick={handleRefreshAndCloseModals}
            />
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
      </div>
    </>
  );
};

export default CampaignTableNew;
