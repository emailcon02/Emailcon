import React, { useState, useEffect, useRef } from "react";
import {
  FaFileAlt,
  FaUserPlus,
  FaEye,
  FaBell,
  FaHistory,
  FaListAlt,
  FaRegFileAlt,
  FaUser,
  FaUsers,
  FaBirthdayCake,
  FaFolderOpen,
  FaCheckCircle,
  FaTrash,
  FaFolder,
  FaRegArrowAltCircleUp,
  FaThLarge,
  FaTachometerAlt,
  FaChartBar,
  FaPuzzlePiece,
  FaCog,
  FaUserFriends,
} from "react-icons/fa";
import "./Home.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import apiConfig from "../../apiconfig/apiConfig.js";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import SendbulkModal from "./SendbulkModal.jsx";
import GroupfileModal from "./GroupfileModal";
import GroupModalnew from "./GroupModalnew.jsx";
import ListPage from "./ListPage.jsx";
import { FaRegClipboard, FaTimes } from "react-icons/fa";
import { FaAddressBook } from "react-icons/fa";
import { MdWavingHand } from "react-icons/md";
import imghome from "../../Images/home-sidebar.jpg";
import welcomeimg from "../../Images/welcome.png";
import GroupfilesingleModal from "./GroupfilesingleModal.jsx";
import * as XLSX from "xlsx";
import { FaInfoCircle } from "react-icons/fa";
import sampleexcel from "../../Images/excelsheet.png";
import CustomHourSelect from "./CustomHourSelect.jsx";
import EditProfile from "./EditProfile.jsx";
import ParaEditor from "./ParaEditor.jsx";
import Logo from "../../Images/emailcon_svg_logo.svg";
import FileManagerModal from "../../pages/FilemanagerModal.jsx";
import { FaBullhorn, FaCogs, FaSave } from "react-icons/fa";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  LineChart,
  Legend,
  Line,
} from "recharts";
import LivePopup from "./LivePopup.jsx";
import { foodTemplate } from "./SavedTemplates/FoodTemplate.jsx";
import { educationalTemplate } from "./SavedTemplates/EducationTemplate.jsx";
import { agricultureTemplate } from "./SavedTemplates/AgricultureTemplate.jsx";
import { travelTemplate } from "./SavedTemplates/TravelTemplate.jsx";
import { pharmacyTemplate } from "./SavedTemplates/PharmacyTemplate.jsx";
import { gymTemplate } from "./SavedTemplates/GymTemplate.jsx";

const Home = () => {
  const [view, setView] = useState("dashboard");
  const [campaignMetrics, setCampaignMetrics] = useState({});
  const [showCampaignModal, setShowCampaignModal] = useState(false);
  const [showTemplateModal, setShowTemplateModal] = useState(false);
  const [showCampaignModalTem, setShowCampaignModalTem] = useState(false);
  const [showCampaignModalauto, setShowCampaignModalauto] = useState(false);
  const [campaignName, setCampaignName] = useState("");
  const [templateName, setTemplateName] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isFromSavedTemplate, setIsFromSavedTemplate] = useState(false);

  const [showfileGroupModal, setShowfileGroupModal] = useState(false);
  const [showfilesingleGroupModal, setShowfilesingleGroupModal] =
    useState(false);
  const [showNewGroupModal, setShowNewGroupModal] = useState(false);
  const [showListPageModal, setShowListPageModal] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [templates, setTemplates] = useState([]);
  const [birthtemplates, setBirthTemplates] = useState([]);
  const [showtemModal, setShowtemModal] = useState(false);
  const [showbirthtemModal, setShowbirthtemModal] = useState(false);
  const [selectedTemplatepre, setSelectedTemplatepre] = useState(null);
  const [bgColortem, setBgColortem] = useState("ffffff");
  const [previewContenttem, setPreviewContenttem] = useState([]);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isBirthPreviewOpen, setIsBirthPreviewOpen] = useState(false);
  const [isPreviewOpenauto, setIsPreviewOpenauto] = useState(false);
  const [bdycampaignname, setBdyCampaignname] = useState("");
  const [modalIndex, setModalIndex] = useState(null);

  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));
  const dropdownRef = useRef(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeOption, setActiveOption] = useState("");
  const [groups, setGroups] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState("");
  const [message, setMessage] = useState("");
  const [emailData, setEmailData] = useState({ attachments: [] }); // Email data object
  const [previewtext, setPreviewtext] = useState("");
  const [aliasName, setAliasName] = useState("");
  const [replyTo, setReplyTo] = useState("");
  const [isLoadingreply, setIsLoadingreply] = useState(false); // State for loader
  const [aliasOptions, setAliasOptions] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [replyOptions, setReplyOptions] = useState([]);
  const [showModalreply, setShowModalreply] = useState(false);
  const [selectedGroupsub, setSelectedGroupsub] = useState(false);
  const [fieldNames, setFieldNames] = useState({});
  const [students, setStudents] = useState([]); // Stores all students
  const [users, setUsers] = useState([]);
  const [scheduledTime, setScheduledTime] = useState(""); // Stores the selected time
  const [excelData, setExcelData] = useState([]);
  const [fileName, setFileName] = useState("");
  const [isRuleOpen, setIsRuleOpen] = useState("");
  const [campaigns, setCampaigns] = useState([]);
  const [showautoModal, setShowautoModal] = useState(false);
  const [step, setStep] = useState(1);
  const [isDeleting, setIsDeleting] = useState(false);
  const [paymentdetails, setPaymentdetails] = useState([]);
  const [hours, minutes] = scheduledTime.split(":").map(Number); // scheduledTime is "HH:MM"
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteTemplateId, setDeleteTemplateId] = useState(null);
  const [showBirthDeleteModal, setShowBirthDeleteModal] = useState(false);
  const [deleteBirthTemplateId, setDeleteBirthTemplateId] = useState(null);
  const [activeTablayout, setActiveTablayout] = useState(false);
  const [galleryImages, setGalleryImages] = useState([]);
  const [selectedImageIndex, setSelectedImageIndex] = useState(null);
  const [selectedImageNumber, setSelectedImageNumber] = useState(null);
  const [showFolderModal, setShowFolderModal] = useState(false);
  const [newFolderName, setNewFolderName] = useState("");
  const [folderList, setFolderList] = useState([]);
  const [currentFolder, setCurrentFolder] = useState(null);
  const [hoveredId, setHoveredId] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [folderToDelete, setFolderToDelete] = useState(null);
  const [selectedDraggedImageId, setSelectedDraggedImageId] = useState(null);
  const [pendingFolderMove, setPendingFolderMove] = useState(null);
  const [showMoveConfirmModal, setShowMoveConfirmModal] = useState(false);
  const [totalCampaigns, setTotalCampaigns] = useState(0);
  const [totalContacts, setTotalContacts] = useState([]);
  const [totalAutomation, setTotalAutomation] = useState(0);
  const username = users?.username || user?.username || "User";
  const today = new Date().toLocaleDateString();
  const [timelineData, setTimelineData] = useState([]);
  const [visible, setVisible] = useState({
    campaigns: true,
    contacts: true,
    automation: false,
    templates: false,
  });
  const [selectedTemplates, setSelectedTemplates] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [showDeleteModaltemall, setShowDeleteModaltemall] = useState(false);
  const [showDeleteModalbirthtemall, setShowDeleteModalbirthtemall] =
    useState(false);
  const handleSelectTemplate = (id) => {
    setSelectedTemplates((prev) =>
      prev.includes(id) ? prev.filter((_id) => _id !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedTemplates([]);
    } else {
      setSelectedTemplates(templates.map((t) => t._id));
    }
    setSelectAll(!selectAll);
  };

  const handleDeleteTemplates = async () => {
    try {
      await axios.post(
        `${apiConfig.baseURL}/api/stud/templates/delete-multiple`,
        {
          ids: selectedTemplates,
        }
      );

      setTemplates((prev) =>
        prev.filter((t) => !selectedTemplates.includes(t._id))
      );
      setSelectedTemplates([]);
      setSelectAll(false);
      setShowDeleteModaltemall(false);

      toast.success("Templates deleted successfully!");
    } catch (err) {
      console.error("Delete failed", err);
      toast.error("Failed to delete templates. Please try again.");
    }
  };

  const handleDeleteTemplatesbirth = async () => {
    try {
      await axios.post(
        `${apiConfig.baseURL}/api/stud/birth-templates/delete-multiple`,
        {
          ids: selectedTemplates,
        }
      );

      setTemplates((prev) =>
        prev.filter((t) => !selectedTemplates.includes(t._id))
      );
      setSelectedTemplates([]);
      setSelectAll(false);
      setShowDeleteModalbirthtemall(false);

      toast.success("Templates deleted successfully!");
    } catch (err) {
      console.error("Delete failed", err);
      toast.error("Failed to delete templates. Please try again.");
    }
  };

  const toggleLine = (key) => {
    setVisible((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  useEffect(() => {
    if (!campaigns || !students || !templates) return;

    const today = new Date();
    const past10Days = Array.from({ length: 10 })
      .map((_, i) => {
        const d = new Date(today);
        d.setDate(today.getDate() - i);
        return d.toISOString().split("T")[0]; // YYYY-MM-DD
      })
      .reverse();

    const dataMap = {};
    past10Days.forEach((date) => {
      dataMap[date] = {
        date,
        campaigns: 0,
        automation: 0,
        contacts: 0,
        templates: 0,
      };
    });

    campaigns.forEach((c) => {
      if (!c.createdAt) return;
      const created = new Date(c.createdAt);
      if (isNaN(created)) return;

      const date = created.toISOString().split("T")[0];
      const name = c.campaignname?.toLowerCase() || "";

      if (dataMap[date]) {
        if (name.includes("birthday")) {
          dataMap[date].automation += 1;
        } else {
          dataMap[date].campaigns += 1;
        }
      }
    });

    students.forEach((s) => {
      if (!s.createdAt) return;
      const created = new Date(s.createdAt);
      if (isNaN(created)) return;

      const date = created.toISOString().split("T")[0];
      if (dataMap[date]) {
        dataMap[date].contacts += 1;
      }
    });

    templates.forEach((t) => {
      if (!t.createdAt) return;
      const created = new Date(t.createdAt);
      if (isNaN(created)) return;

      const date = created.toISOString().split("T")[0];
      if (dataMap[date]) {
        dataMap[date].templates += 1;
      }
    });

    setTimelineData(Object.values(dataMap));
  }, [campaigns, students, templates]);

  // dashboard total campaign
  useEffect(() => {
    const fetchCampaignsCount = async () => {
      if (!user?.id) return;
      try {
        const response = await axios.get(
          `${apiConfig.baseURL}/api/stud/campaigns/${user.id}`
        );
        // Filter out birthday campaigns if needed, like in CampaignTable
        const filtered = response.data.filter((campaign) => {
          const name = campaign.campaignname?.toLowerCase() || "";
          return !name.includes("birthday campaign");
        });
        setTotalCampaigns(filtered.length);
      } catch (error) {
        setTotalCampaigns(0);
      }
    };
    fetchCampaignsCount();
  }, [user?.id]);

  // dashboard total automation
  useEffect(() => {
    const fetchAutomationCount = async () => {
      if (!user?.id) return;
      try {
        const response = await axios.get(
          `${apiConfig.baseURL}/api/stud/campaigns/${user.id}`
        );
        // Filter out birthday campaigns if needed, like in CampaignTable
        const filtered = response.data.filter((campaign) => {
          const name = campaign.campaignname?.toLowerCase() || "";
          return name.includes("birthday campaign");
        });
        setTotalAutomation(filtered.length);
      } catch (error) {
        setTotalAutomation(0);
      }
    };
    fetchAutomationCount();
  }, [user?.id]);

  useEffect(() => {
    const fetchContactsCount = async () => {
      try {
        const response = await axios.get(
          `${apiConfig.baseURL}/api/stud/studentscount?user=${user.id}`
        );
        setTotalContacts(response.data.count || 0);
        // console.log("rec contact",response.data);

      } catch (error) {
        console.error("Error fetching contacts:", error);
        setTotalContacts(0);
      }
    };

    if (user?.id) {
      fetchContactsCount();
    }
  }, [user?.id]);

  const handleDeleteFolder = async () => {
    try {
      const response = await axios.delete(
        `${apiConfig.baseURL}/api/stud/folder/${folderToDelete.name}`
      );
      if (response.data.success) {
        setFolderList((prev) =>
          prev.filter((f) => f.name !== folderToDelete.name)
        );
        toast.success("Deleted Successfully");
        setTimeout(() => {
          setModalVisible(false);
          setFolderToDelete(null);
        }, 2000);
      } else {
        toast.error("Failed to delete folder.");
      }
    } catch (err) {
      console.error("Error deleting folder:", err);
      toast.error("Error deleting folder.");
    }
  };

  const fetchFolders = async () => {
    try {
      const res = await axios.get(
        `${apiConfig.baseURL}/api/stud/folders/${user.id}`
      );

      // Sort by createdAt in descending order (latest first)
      const sortedFolders = res.data.sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );

      setFolderList(sortedFolders);
    } catch (err) {
      console.error("Error fetching folders", err);
    }
  };

  const createFolder = async () => {
    if (!newFolderName.trim()) return;
    try {
      const res = await axios.post(
        `${apiConfig.baseURL}/api/stud/create-folder`,
        {
          userId: user.id,
          folderName: newFolderName,
        }
      );

      toast.success("Folder Created");
      setNewFolderName("");
      setShowFolderModal(false);

      // Add newly created folder to the list without refetching
      setFolderList((prev) => [...prev, res.data.folder]);

      // Optionally still call fetchFolders() to sync with DB
      setTimeout(() => {
        fetchFolders();
      }, 100); // slight delay to ensure re-render
    } catch (err) {
      toast.error("Failed to create folder");
    }
  };

  const uploadImagefile = async () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.multiple = true;

    input.onchange = async (e) => {
      const files = Array.from(e.target.files);
      if (files.length > 10) {
        toast.error("Maximum 10 files allowed.");
        return;
      }

      const formData = new FormData();
      for (const file of files) {
        formData.append("image", file); // append each file under same key
      }
      formData.append("userId", user.id);
      formData.append("folderName", currentFolder || "Sample");

      try {
        const uploadRes = await axios.post(
          `${apiConfig.baseURL}/api/stud/upload`,
          formData,
          { headers: { "Content-Type": "multipart/form-data" } }
        );

        const imageUrls = uploadRes?.data?.imageUrls || [];

        // ✅ Save all images to DB
        await Promise.all(
          imageUrls.map((imageUrl) =>
            axios.post(`${apiConfig.baseURL}/api/stud/save-image`, {
              userId: user.id,
              imageUrl,
              folderName: currentFolder || "Sample",
            })
          )
        );
        fetchImages();
      } catch (err) {
        console.error(err);
        toast.error("Upload failed");
      }
    };

    input.click();
  };
  const fetchImages = async () => {
    try {
      const res = await axios.get(
        `${apiConfig.baseURL}/api/stud/images/${user.id}`,
        { params: { folderName: currentFolder || "Sample" } }
      );

      const sortedImages = res.data.sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );
      setGalleryImages(sortedImages);
    } catch (err) {
      console.error("Error fetching images", err);
    }
  };

  const deleteImage = async (id) => {
    try {
      // Find image in previewContent by id
      const imageToDelete = galleryImages.find((img) => img._id === id);
      if (!imageToDelete || !imageToDelete.imageUrl) {
        toast.error("Image not found");
        return;
      }

      // Extract the S3 key from the URL
      const s3Key = decodeURIComponent(
        imageToDelete.imageUrl.split(".amazonaws.com/")[1]
      );
      if (!s3Key) {
        toast.error("Invalid image URL");
        return;
      }

      // Step 1: Delete file from S3 using backend API
      const s3DeleteResponse = await fetch(
        `${apiConfig.baseURL}/api/stud/file?key=${encodeURIComponent(s3Key)}`,
        { method: "DELETE" }
      );

      if (!s3DeleteResponse.ok) {
        const err = await s3DeleteResponse.json();
        throw new Error(err?.error || "Error deleting file from S3");
      }

      // Step 2: Delete DB record by id
      const dbDeleteResponse = await axios.delete(
        `${apiConfig.baseURL}/api/stud/images/${id}`
      );
      if (dbDeleteResponse.status !== 200) {
        throw new Error("Failed to delete image record from DB");
      }

      toast.success("Image deleted successfully");
      fetchImages(); // Refresh gallery
    } catch (err) {
      toast.error("Delete failed");
      console.error(err);
    }
  };
  useEffect(() => {
    fetchFolders();
  }, []); // Only once on mount

  useEffect(() => {
    fetchImages();
  }, [currentFolder]); // Only images need folderName

  let daysRemaining = null;

  if (paymentdetails?.expiryDate) {
    const expiryDate = new Date(paymentdetails.expiryDate);
    const today = new Date();

    const expiryMidnight = new Date(
      expiryDate.getFullYear(),
      expiryDate.getMonth(),
      expiryDate.getDate()
    );
    const todayMidnight = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate()
    );

    const timeDiff = expiryMidnight.getTime() - todayMidnight.getTime();
    daysRemaining = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
  }

  useEffect(() => {
    const interval = setInterval(async () => {
      const token = localStorage.getItem("token");

      if (!token) return;

      try {
        const res = await axios.get(`${apiConfig.baseURL}/api/stud/validate`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.data.user.isActive) {
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          toast.error(
            "Your account is expired. Please renew your subscription."
          );
          setTimeout(() => {
            window.location.href = "/user-login";
          }, 5000); // 5 second delay
        }
      } catch (err) {
        console.log("Validation failed:", err.message);
      }
    }, 30000); // Every 30 sec

    return () => clearInterval(interval);
  }, []);

useEffect(() => {
  if (!user?.id) return;

  // Fetch students with pagination (limit first 50)
  axios
    .get(`${apiConfig.baseURL}/api/stud/students?user=${user.id}`)
    .then((res) => setStudents(res.data))
    .catch((err) => console.error("Students fetch error", err));

  // Fetch templates separately with pagination
  axios
    .get(`${apiConfig.baseURL}/api/stud/templates/${user.id}`)
    .then((res) => {
      setTemplates([
        educationalTemplate,
        foodTemplate,
        travelTemplate,
        agricultureTemplate,
        pharmacyTemplate,
        gymTemplate,
        ...res.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)),
      ]);
    })
    .catch((err) => console.error("Template fetch error", err));

  // Fetch other data
  Promise.all([
    axios.get(`${apiConfig.baseURL}/api/stud/campaigns/${user.id}`),
    axios.get(`${apiConfig.baseURL}/api/stud/groups/${user.id}`),
    axios.get(`${apiConfig.baseURL}/api/stud/birthtemplates/${user.id}`),
    axios.get(`${apiConfig.baseURL}/api/stud/userdata/${user.id}`),
    axios.get(`${apiConfig.baseURL}/api/stud/payment-history-latest/${user.id}`),
  ])
    .then(([campaignsRes, groupsRes, birthtemplatesRes, userdataRes, paymentdetailsRes]) => {
      setCampaigns(campaignsRes.data);
      setGroups(groupsRes.data);
      setBirthTemplates(
        birthtemplatesRes.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      );
      setUsers(userdataRes.data);
      setPaymentdetails(paymentdetailsRes.data);
    })
    .catch((err) => console.error("Init dashboard fetch error", err));
}, [user?.id]);

// Lazy load metrics
useEffect(() => {
  if (!campaigns.length || !user?.id) return;

  const timeout = setTimeout(async () => {
    const metrics = {};

    await Promise.all(
      campaigns.map(async (campaign) => {
        try {
          const [openRes, clickRes] = await Promise.all([
            axios.get(`${apiConfig.baseURL}/api/stud/get-email-open-count?userId=${user.id}&campaignId=${campaign._id}`),
            axios.get(`${apiConfig.baseURL}/api/stud/get-click?userId=${user.id}&campaignId=${campaign._id}`),
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
  }, 3000); // delay metrics fetch to avoid blocking UI

  return () => clearTimeout(timeout);
}, [campaigns, user?.id]);


  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setSelectedGroupsub(false); // Close dropdown
        setFieldNames([]);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const fetchaliasname = async () => {
      if (!user?.id) {
        navigate("/user-login"); // Redirect to login if user is not found
        return;
      }

      try {
        const res = await axios.get(
          `${apiConfig.baseURL}/api/stud/aliasname/${user.id}`
        );
        setAliasOptions(res.data);
      } catch (err) {
        console.error(err);
        console.log("Failed to fetch aliasname");
      }
    };

    fetchaliasname();
  }, [user?.id, navigate]); // Ensure useEffect is dependent on `user` and `navigate`

  const handleAddAlias = () => {
    if (!user || !user.id) {
      toast.error("Please ensure the user is valid");
      return; // Stop further execution if user is invalid
    }
    if (!aliasName) {
      toast.error("Aliasname cannot be empty");
      return; // Stop further execution if aliasname is empty
    }

    // Proceed with aliasname creation
    setIsLoading(true); // Start loading
    if (aliasName && user && user.id) {
      axios
        .post(`${apiConfig.baseURL}/api/stud/aliasname`, {
          aliasname: aliasName,
          userId: user.id,
        })
        .then((response) => {
          setAliasOptions([...aliasOptions, response.data]);
          toast.success("Aliasname created");
          setShowModal(false);
          setAliasName("");
          setIsLoading(false);
        })
        .catch((error) => {
          setIsLoading(false); // Stop loading
          // Handle error response
          console.error("Error:", error);
          // Dismiss previous toasts before showing a new one
          toast.dismiss();

          if (
            error.response &&
            error.response.data &&
            error.response.data.message
          ) {
            toast.warning(error.response.data.message, { autoClose: 3000 });
          } else {
            toast.error("Failed to create aliasname", { autoClose: 3000 });
          }
        });
    } else {
      toast.error("Please ensure all fields are filled and user is valid");
    }
  };

  useEffect(() => {
    const fetchreplyto = async () => {
      if (!user?.id) {
        navigate("/user-login"); // Redirect to login if user is not found
        return;
      }

      try {
        const res = await axios.get(
          `${apiConfig.baseURL}/api/stud/replyTo/${user.id}`
        );
        setReplyOptions(res.data);
      } catch (err) {
        console.error(err);
        console.log("Failed to fetch replyto mail");
      }
    };

    fetchreplyto();
  }, [user?.id, navigate]); // Ensure useEffect is dependent on `user` and `navigate`

  const handleAddReply = () => {
    if (!user || !user.id) {
      toast.error("Please ensure the user is valid");
      return; // Stop further execution if user is invalid
    }
    if (!replyTo) {
      toast.error("Reply to mail cannot be empty");
      return; // Stop further execution if replyto is empty
    }

    // Proceed with replyto creation
    setIsLoadingreply(true); // Start loading
    if (replyTo && user && user.id) {
      axios
        .post(`${apiConfig.baseURL}/api/stud/replyTo`, {
          replyTo,
          userId: user.id,
        })
        .then((response) => {
          setReplyOptions([...replyOptions, response.data]);
          toast.success("Replyto mail created");
          setShowModalreply(false);
          setReplyTo("");
          setIsLoadingreply(false);
        })
        .catch((error) => {
          setIsLoadingreply(false); // Stop loading
          // Handle error response
          console.error("Error:", error);
          // Dismiss previous toasts before showing a new one
          toast.dismiss();

          if (
            error.response &&
            error.response.data &&
            error.response.data.message
          ) {
            toast.warning(error.response.data.message, { autoClose: 3000 });
          } else {
            toast.error("Failed to create reply to mail", { autoClose: 3000 });
          }
        });
    } else {
      toast.error("Please ensure all fields are filled and user is valid");
    }
  };

  const handleDelete = async (templateId) => {
    setIsDeleting(true);
    try {
      const response = await axios.delete(
        `${apiConfig.baseURL}/api/stud/templates/${templateId}`
      );

      if (response.status === 200) {
        toast.success("Template deleted successfully!");
        setIsDeleting(false);
        setIsPreviewOpen(false);
        setShowtemModal(true); // Reset loading state
        setTemplates((prevTemplates) =>
          prevTemplates.filter((template) => template._id !== templateId)
        );
      }
    } catch (error) {
      console.error("Error deleting template:", error);
      if (error.response && error.response.data) {
        console.log(
          `Failed to delete template: ${error.response.data.message}`
        );
      } else {
        console.log("Failed to delete template.");
      }
    } finally {
      setIsDeleting(false);
    }
  };

  const handlebirthDelete = async (templateId) => {
    try {
      const response = await axios.delete(
        `${apiConfig.baseURL}/api/stud/birthtemplates/${templateId}`
      );

      if (response.status === 200) {
        toast.success("Template deleted successfully!");
        setIsBirthPreviewOpen(false);
        setShowbirthtemModal(true); // Reset loading state
        setBirthTemplates((prevTemplates) =>
          prevTemplates.filter((template) => template._id !== templateId)
        );
      }
    } catch (error) {
      console.error("Error deleting template:", error);
      if (error.response && error.response.data) {
        console.log(
          `Failed to delete template: ${error.response.data.message}`
        );
      } else {
        console.log("Failed to delete template.");
      }
    } finally {
      setIsDeleting(false);
    }
  };

  const handleGroupChangesubject = (e) => {
    const groupName = e.target.value;

    // Reset and reopen the dropdown instantly
    setSelectedGroupsub("");
    setTimeout(() => setSelectedGroupsub(groupName), 0);

    if (!students?.length) {
      console.log("No students available yet.");
      return;
    }

    // Filter students by selected group
    const filteredStudents = students.filter(
      (student) => student.group?._id === groupName
    );

    // Extract field names from the first student found
    const newFieldNames = filteredStudents.length
      ? Object.keys(filteredStudents[0]).filter(
          (key) =>
            ![
              "_id",
              "group",
              "__v",
              "lastSentYear",
              "user",
              "isUnsubscribed",
              "createdAt",
              "updatedAt",
            ].includes(key)
        )
      : [];

    setFieldNames(newFieldNames);
  };

  const handleInsertNamesubject = (value) => {
    setMessage((prev) => (prev ? `${prev} ${value}` : value));

    // Reset selected group dropdown properly
    setSelectedGroupsub(false);
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    setFileName(file.name);
    const reader = new FileReader();

    reader.onload = (e) => {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: "array" });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];

      const jsonData = XLSX.utils.sheet_to_json(sheet, { header: 1 });
      let headers = jsonData[0]; // Extract headers from first row
      const formattedData = jsonData
        .map((row, rowIndex) =>
          row.map((cell, colIndex) => {
            if (rowIndex > 0) {
              // Avoid modifying headers
              const header = headers[colIndex]?.toLowerCase(); // Normalize headers
              if (header.includes("date") && typeof cell === "number") {
                const jsDate = new Date(
                  Math.round((cell - 25569) * 86400 * 1000)
                );
                return jsDate.toISOString().split("T")[0]; // Convert only if column is a date
              }
            }
            return cell;
          })
        )
        .filter((row) => row.some((cell) => cell));

      setExcelData(formattedData);
      console.log(formattedData);
    };
    reader.readAsArrayBuffer(file);
  };

  // const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setActiveOption("");
  };

  const handleDashboardView = () => {
    setView("dashboard");
  };

  const toggleDropdown = () => {
    setIsEditingProfile(true);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };

    if (dropdownOpen) {
      window.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      window.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownOpen]);

  useEffect(() => {
    if (!user) {
      navigate("/signup");
      toast.warning("Signup first to access Homepage");
    } else {
      const modalShown = localStorage.getItem("modalShown");
      if (!modalShown) {
        setShowPopup(true); // Show modal on first navigation
        localStorage.setItem("modalShown", "true"); // Mark modal as shown
      }
    }
  }, [user, navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("campaign");
    localStorage.removeItem("modalShown"); // Reset modalShown for next login
    localStorage.setItem("hasvisit", true);
    navigate("/user-login");
  };
  const handlepayment = () => {
    navigate(`/userpayment/${user.id}`);
  };

  const closePopup = () => {
    setShowPopup(false); // Close the modal
  };
  const handleMainView = () => {
    setView("dashboard");
  };

  const handleTemplateView = () => {
    setView("template");
  };

  const handleCampaignView = () => {
    setView("campaign");
  };
  const handleaddcontact = () => {
    setView("addcontact");
  };

  const handleRemainderrview = () => {
    setView("remainder");
  };
  const handleselectremainder = () => {
    setView("selectremainder");
  };
  const handleContactView = () => {
    setView("contact");
  };
  const handleCreateContactView = () => {
    setView("create-contact");
  };
  const handlenavigatecampaign = () => {
    navigate("/campaigntable");
  };
  const handlePreview = (template, fromSavedTemplate = false) => {
    setIsPreviewOpen(true);
    setSelectedTemplatepre(template);
    setBgColortem(template.bgColor || "#ffffff");
    setPreviewContenttem(template.previewContent || []);
    setIsFromSavedTemplate(fromSavedTemplate); // update state
  };

  // const handlePreviewbirth = (template) => {
  //   setShowbirthtemModal(false);
  //   setIsBirthPreviewOpen(true);
  //   setSelectedTemplatepre(template);
  //   setBgColortem(template.bgColor || "#ffffff"); // Update background color
  //   setPreviewContenttem(template.previewContent || []); // Update previewContent
  // };
  const handlePreviewautomate = (template) => {
    setIsPreviewOpenauto(true);
    setSelectedTemplatepre(template);
    setBgColortem(template.bgColor || "#ffffff"); // Update background color
    setPreviewContenttem(template.previewContent || []); // Update previewContent
    setBdyCampaignname(template.camname);
  };
  const handleCloseModalpre = () => {
    setIsPreviewOpen(false);

    if (isFromSavedTemplate) {
      setShowtemModal(true); // only if preview was from saved template modal
      setIsFromSavedTemplate(false); // reset after use
    }
  };

  const handleCloseModalpreauto = () => {
    setIsPreviewOpenauto(false);
  };
  const handleCloseModalprebirth = () => {
    setIsBirthPreviewOpen(false);
  };
  const handleprevcampaignname = () => {
    setShowCampaignModalTem(true);
  };
  // Open modal
  const openModal = () => {
    setShowautoModal(true);
    setStep(0); // Reset steps on open
  };

  const handleopenbirthtem = () => {
    setShowbirthtemModal(true);
  };
  const handlebirthtemclose = () => {
    setShowbirthtemModal(false);
  };
  const handletemclose = () => {
    setShowtemModal(false);
  };

  const handleCreateCampaign = () => {
    setShowCampaignModal(true);
  };
  const handleCreateTemplate = () => {
    setShowTemplateModal(true);
  };
  const handleviewcontacts = () => {
    setShowListPageModal(true);
  };
  const handleTemplateHistory = () => {
    setShowtemModal(true);
  };

  const handleaddfilecontacts = () => {
    setShowfileGroupModal(true);
  };
  const handleaddsinglefilecontacts = () => {
    setShowfilesingleGroupModal(true);
  };

  const handleCreateButtonTem = () => {
    if (!user || !user.id) {
      toast.error("Please ensure the user is valid");
      return;
    }
    if (!templateName) {
      toast.error("Please enter a template name");
      return;
    }

    setIsLoading(true);

    axios
      .post(`${apiConfig.baseURL}/api/stud/create-template`, {
        temname: templateName, // Ensure the field matches backend
        userId: user.id,
      })
      .then((response) => {
        localStorage.setItem(
          "template",
          JSON.stringify(response.data.template)
        );
        setIsLoading(false);
        setShowTemplateModal(false);
        setTemplateName("");
        navigate("/create-template"); // Redirect to template creation page
      })
      .catch((error) => {
        setIsLoading(false);
        console.error("Error:", error);
        toast.dismiss();

        if (
          error.response &&
          error.response.data &&
          error.response.data.message
        ) {
          toast.warning(error.response.data.message, { autoClose: 3000 });
        } else {
          toast.error("Failed to create template", { autoClose: 3000 });
        }
      });
  };

  const handleCreateButton = () => {
    if (!user || !user.id) {
      toast.error("Please ensure the user is valid");
      return;
    }
    if (!campaignName) {
      toast.error("Please enter a campaign name");
      return;
    }

    setIsLoading(true);

    axios
      .post(`${apiConfig.baseURL}/api/stud/campaign`, {
        camname: campaignName, // Ensure the field matches backend
        userId: user.id,
      })
      .then((response) => {
        localStorage.setItem(
          "campaign",
          JSON.stringify(response.data.campaign)
        );
        // console.log("Campaign created successfully");

        setIsLoading(false);
        setShowCampaignModal(false);
        setCampaignName("");

        if (window.innerWidth <= 900) {
          navigate("/campaign"); // Mobile
        } else {
          navigate("/editor"); // PC
        }
      })
      .catch((error) => {
        setIsLoading(false);
        console.error("Error:", error);
        toast.dismiss();

        if (
          error.response &&
          error.response.data &&
          error.response.data.message
        ) {
          toast.warning(error.response.data.message, { autoClose: 3000 });
        } else {
          toast.error("Failed to create campaign", { autoClose: 3000 });
        }
      });
  };
  const handlecreatebirthdayname = () => {
    setShowCampaignModalauto(true);
  };

  const handleCreateButtonauto = () => {
    if (!user || !user.id) {
      toast.error("Please ensure the user is valid");
      return;
    }
    if (!campaignName) {
      toast.error("Please enter a campaign name");
      return;
    }

    setIsLoading(true);

    axios
      .post(`${apiConfig.baseURL}/api/stud/campaign`, {
        camname: campaignName, // Ensure the field matches backend
        userId: user.id,
      })
      .then((response) => {
        localStorage.setItem(
          "campaign",
          JSON.stringify(response.data.campaign)
        );
        console.log("Campaign created successfully");

        setIsLoading(false);
        setShowCampaignModalauto(false);
        setCampaignName("");
        navigate("/birthdayedit");
      })
      .catch((error) => {
        setIsLoading(false);
        console.error("Error:", error);
        toast.dismiss();

        if (
          error.response &&
          error.response.data &&
          error.response.data.message
        ) {
          toast.warning(error.response.data.message, { autoClose: 3000 });
        } else {
          toast.error("Failed to create campaign", { autoClose: 3000 });
        }
      });
  };
  const handleCreateTemButton = () => {
    if (!user || !user.id) {
      toast.error("Please ensure the user is valid");
      return;
    }
    if (!campaignName) {
      toast.error("Please enter a campaign name");
      return;
    }

    setIsLoading(true);

    axios
      .post(`${apiConfig.baseURL}/api/stud/campaign`, {
        camname: campaignName, // Ensure the field matches backend
        userId: user.id,
      })
      .then((response) => {
        localStorage.setItem(
          "campaign",
          JSON.stringify(response.data.campaign)
        );
        console.log("Campaign created successfully");

        setIsLoading(false);
        setShowCampaignModal(false);
        setCampaignName("");

        if (window.innerWidth <= 768) {
          navigate("/campaign"); // Mobile
        } else {
          navigate("/TemMainpage", {
            state: { previewContenttem, bgColortem, selectedTemplatepre },
          }); // PC
        }
      })
      .catch((error) => {
        setIsLoading(false);
        console.error("Error:", error);

        // Dismiss previous toasts before showing a new one
        toast.dismiss();

        if (
          error.response &&
          error.response.data &&
          error.response.data.message
        ) {
          toast.warning(error.response.data.message, { autoClose: 3000 });
        } else {
          toast.error("Failed to create campaign", { autoClose: 3000 });
        }
      });
  };
  const handlecampaignhistory = () => {
    navigate("/campaigntable");
  };
  const handleremainderhistory = () => {
    navigate("/remaindertable");
  };
  const handlesetpaymentremainder = async () => {
    if (excelData.length === 0) {
      toast.error("Please upload an Excel file first.");
      return;
    }

    if (excelData.length <= 1) {
      toast.error("Ensure excel data is uploaded.");
      return;
    }

    const [headers, ...rows] = excelData;

    if (!headers.includes("Email")) {
      toast.error("Excel file must have an 'Email' column.");
      return;
    }

    const emailIndex = headers.indexOf("Email");

    if (!previewtext) {
      toast.error("Please Enter Previewtext.");
      return;
    }
    if (!aliasName) {
      toast.error("Please Enter Alias Name.");
      return;
    }
    if (!scheduledTime) {
      toast.error("Please Select Remainder time.");
      return;
    }

    if (!message) {
      toast.error("Please Enter Subject.");
      return;
    }
    setIsLoading(true);
    let sentEmails = [];
    let failedEmails = [];
    let attachments = [];
    if (emailData.attachments && emailData.attachments.length > 0) {
      const formData = new FormData();

      emailData.attachments.forEach((file) => {
        formData.append("attachments", file);
      });

      const uploadResponse = await axios.post(
        `${apiConfig.baseURL}/api/stud/uploadfile`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      console.log("Uploaded Files:", uploadResponse.data);
      // Structure the uploaded files with original name and URL
      attachments = uploadResponse.data.fileUrls.map((file, index) => ({
        originalName: emailData.attachments[index].name, // Get original file name
        fileUrl: file, // Cloudinary URL
      }));
    }

    // Convert Excel data into an array of objects
    const formattedExcelData = rows.map((row) => {
      return headers.reduce((obj, header, index) => {
        obj[header] = row[index] || "";
        return obj;
      }, {});
    });
    const now = new Date(); // Current date

    // Set selected time
    now.setHours(hours);
    now.setMinutes(minutes);
    now.setSeconds(0);
    now.setMilliseconds(0);

    // This gives you a Date object with today's date + selected time
    const finalDateTime = now.toISOString(); // or just `now` if you want to send a Date object

    // 1. Fetch existing payment campaigns for this user
    const existingCampaigns = campaigns.filter(
      (campaign) =>
        campaign.campaignname.startsWith("Payment Remainder") &&
        campaign.user === user.id
    );

    // 2. Determine suffix (if needed)
    let campaignName = "Payment Remainder";
    if (existingCampaigns.length > 0) {
      campaignName = `Payment Remainder-${existingCampaigns.length}`;
    }

    try {
      // Store initial campaign history with "Pending" status
      const campaignHistoryData = {
        campaignname: campaignName,
        groupname: "Instant Send",
        totalcount: rows.filter((row) => row[emailIndex]).length, // Count non-empty emails
        sendcount: 0,
        recipients: "no mail",
        failedcount: 0,
        subject: message,
        previewtext,
        aliasName,
        previewContent: previewContenttem,
        bgColor: bgColortem,
        sentEmails,
        attachments,
        failedEmails,
        scheduledTime: finalDateTime, // Use the final date and time
        status: "Remainder On",
        senddate: new Date().toLocaleString(),
        user: user.id,
        progress: 0,
        groupId: "No id",
        exceldata: formattedExcelData, // Store Excel data inside campaign history
      };

      const campaignResponse = await axios.post(
        `${apiConfig.baseURL}/api/stud/camhistory`,
        campaignHistoryData
      );
      console.log("Initial Campaign History Saved:", campaignResponse.data);
      navigate("/remaindertable");
      sessionStorage.removeItem("firstVisit");
      sessionStorage.removeItem("toggled");
    } catch (error) {
      setIsLoading(false);
      toast.error("Failed to set payment remainder email.");
    } finally {
      setIsLoading(false);
    }
  };

  const handlesetbirthremainder = async () => {
    if (!selectedGroup) {
      toast.error("Please select a group.");
      return;
    }

    if (!previewtext) {
      toast.error("Please Enter Previewtext.");
      return;
    }
    if (!aliasName) {
      toast.error("Please Enter Alias Name.");
      return;
    }
    if (!replyTo) {
      toast.error("Please Enter Reply to mail.");
      return;
    }
    if (!scheduledTime) {
      toast.error("Please Select Remainder time.");
      return;
    }

    if (!message) {
      toast.error("Please Enter Subject.");
      return;
    }

    try {
      // Fetch students from the selected group
      const studentsResponse = await axios.get(
        `${apiConfig.baseURL}/api/stud/groups/${selectedGroup}/students`
      );
      const students = studentsResponse.data;

      if (students.length === 0) {
        toast.warning("No students found in the selected group.");
        return;
      }
      setIsLoading(true);
      let attachments = [];
      if (emailData.attachments && emailData.attachments.length > 0) {
        const formData = new FormData();

        emailData.attachments.forEach((file) => {
          formData.append("attachments", file);
        });

        const uploadResponse = await axios.post(
          `${apiConfig.baseURL}/api/stud/uploadfile`,
          formData,
          { headers: { "Content-Type": "multipart/form-data" } }
        );

        console.log("Uploaded Files:", uploadResponse.data);
        // Structure the uploaded files with original name and URL
        attachments = uploadResponse.data.fileUrls.map((file, index) => ({
          originalName: emailData.attachments[index].name, // Get original file name
          fileUrl: file, // Cloudinary URL
        }));
      }
      const now = new Date(); // Current date

      // Set selected time
      now.setHours(hours);
      now.setMinutes(minutes);
      now.setSeconds(0);
      now.setMilliseconds(0);

      // This gives you a Date object with today's date + selected time
      const finalDateTime = now.toISOString(); // or just `now` if you want to send a Date object

      // Store initial campaign history with "Pending" status
      const campaignHistoryData = {
        campaignname: bdycampaignname,
        groupname: groups.find((group) => group._id === selectedGroup)?.name, // Get the group name from the groups array
        totalcount: students.length,
        recipients: "no mail",
        sendcount: 0,
        failedcount: 0,
        failedEmails: 0,
        sentEmails: 0,
        subject: message,
        aliasName,
        replyTo,
        attachments,
        exceldata: [{}],
        previewtext,
        previewContent: previewContenttem,
        bgColor: bgColortem,
        scheduledTime: finalDateTime, // Use the final date and time
        status: "Remainder On",
        senddate: new Date().toLocaleString(),
        user: user.id,
        progress: 0,
        groupId: selectedGroup,
      };

      const campaignResponse = await axios.post(
        `${apiConfig.baseURL}/api/stud/camhistory`,
        campaignHistoryData
      );
      console.log(
        "Initial remainder Campaign History Saved:",
        campaignResponse.data
      );
      navigate("/remaindertable");
      setIsLoading(false);
      sessionStorage.removeItem("firstVisit");
      sessionStorage.removeItem("toggled");
    } catch (error) {
      setIsLoading(false);
      toast.error("Failed to set remainder email.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="sidebar-container">
        {/* Sidebar */}
        <div className="sidebar">
          <div>
            {/* <h2 className="sidebar-title" >
              Email<span style={{ color: "#f48c06" }}>Con</span>
            </h2> */}
            <img
              src={Logo}
              alt="img_logo"
              className="logo_img"
              onClick={handleMainView}
            />
            <div className="sidebar-btn-set">
              <div
                className={`sidebar-btn-flex ${
                  view === "dashboard" ? "active-tab" : ""
                }`}
                onClick={() => {
                  setView("dashboard");
                  handleDashboardView();
                }}
              >
                <FaTachometerAlt className="icons-side" />
                <button className="sidebar-button Dashboard-button">
                  Dashboard
                </button>
              </div>
              <div
                className={`sidebar-btn-flex ${
                  view === "campaign" ? "active-tab" : ""
                }`}
                onClick={() => {
                  setView("campaign");
                  handleCampaignView();
                }}
              >
                <FaBullhorn className="icons-side" />
                <button className="sidebar-button campaign-button">
                  Campaign
                </button>
              </div>

              <div
                className={`sidebar-btn-flex ${
                  view === "contact" ? "active-tab" : ""
                }`}
                onClick={() => {
                  setView("contact");
                  handleContactView();
                }}
              >
                <FaUserPlus className="icons-side contact-create-icon" />
                <button className="sidebar-button contact-button">
                  Contact
                </button>
              </div>

              <div
                className={`sidebar-btn-flex ${
                  view === "template" ? "active-tab" : ""
                }`}
                onClick={() => {
                  setView("template");
                  handleTemplateView();
                }}
              >
                <FaThLarge className="icons-side campaign-icon" />
                <button className="sidebar-button contact-button">
                  Templates
                </button>
              </div>

              <div
                className={`sidebar-btn-flex ${
                  view === "remainder" ? "active-tab" : ""
                }`}
                onClick={() => {
                  setView("remainder");
                  handleRemainderrview();
                }}
              >
                <FaListAlt className="icons-side campaign-template-icon" />
                <button className="sidebar-button contact-button">
                  Automation
                </button>
              </div>

              <div
                className="sidebar-btn-flex"
                onClick={() => {
                  setActiveTablayout(true);
                }}
              >
                <FaFolder className="icons-side campaign-template-icon" />
                <button className="sidebar-button contact-button">
                  File Manager
                </button>
              </div>
            </div>

            {/* <button
              className="sidebar-button contact-button"
              onClick={handlepayment}
            >
              Upgrade Plan
            </button> */}
          </div>

          {/* file manager modal */}
          <FileManagerModal activeTablayout={activeTablayout}>
            {activeTablayout && (
              <div className="modal-overlay-file-editor">
                <div
                  className="modal-content-file"
                  style={{
                    width: "90%",
                    maxWidth: "700px",
                    background: "#fff",
                    padding: "20px",
                    borderRadius: "10px",
                    position: "relative",
                    maxHeight: "90vh",
                    overflowY: "auto",
                  }}
                >
                  <div
                    className="modal-header-file"
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginBottom: "10px",
                    }}
                  >
                    <h2>File Manager</h2>
                    <button
                      onClick={() => {
                        setCurrentFolder(null);
                        setActiveTablayout(false);
                      }}
                      style={{
                        background: "transparent",
                        border: "none",
                        fontSize: "20px",
                        cursor: "pointer",
                        fontWeight: "bold",
                      }}
                    >
                      &times;
                    </button>
                  </div>

                  <div
                    style={{
                      display: "flex",
                      gap: "10px",
                      marginBottom: "15px",
                    }}
                  >
                    <button
                      onClick={uploadImagefile}
                      style={{
                        padding: "8px 16px",
                        background: "#007bff",
                        color: "#fff",
                        border: "none",
                        borderRadius: "4px",
                        cursor: "pointer",
                      }}
                    >
                      + Upload
                    </button>
                    <button
                      onClick={() => setShowFolderModal(true)}
                      style={{
                        padding: "8px 16px",
                        background: "#28a745",
                        color: "#fff",
                        border: "none",
                        borderRadius: "4px",
                        cursor: "pointer",
                      }}
                    >
                      + Folder
                    </button>
                    {currentFolder && (
                      <button
                        onClick={() => setCurrentFolder(null)}
                        style={{
                          padding: "8px 16px",
                          background: "#ffc107",
                          color: "#000",
                          border: "none",
                          borderRadius: "4px",
                          cursor: "pointer",
                        }}
                      >
                        ← Back
                      </button>
                    )}
                  </div>
                  {/* Folder display (only at root level) */}
                  {!currentFolder && (
                    <div
                      style={{
                        display: "flex",
                        flexWrap: "wrap",
                        gap: "12px",
                        marginBottom: "15px",
                      }}
                    >
                      {folderList.map((folder) => (
                        <div
                          key={folder._id}
                          onDragOver={(e) => e.preventDefault()}
                          onDrop={() => {
                            if (
                              selectedDraggedImageId &&
                              currentFolder === null
                            ) {
                              setPendingFolderMove({
                                imageId: selectedDraggedImageId,
                                targetFolder: folder.name,
                              });
                              setShowMoveConfirmModal(true);
                            }
                          }}
                          style={{
                            position: "relative",
                            cursor: "pointer",
                            color: "#007bff",
                            background: "#f1f1f1",
                            padding: "8px 12px",
                            borderRadius: "6px",
                            display: "flex",
                            alignItems: "center",
                            whiteSpace: "nowrap",
                          }}
                          onMouseEnter={() => setHoveredId(folder._id)}
                          onMouseLeave={() => setHoveredId(null)}
                        >
                          <span onClick={() => setCurrentFolder(folder.name)}>
                            📁 {folder.name}
                          </span>

                          {/* Delete icon on hover */}
                          {hoveredId === folder._id && (
                            <span
                              style={{
                                color: "#f48c06",
                                marginLeft: "5px",
                                fontSize: "12px",
                              }}
                              onClick={(e) => {
                                e.stopPropagation();
                                setFolderToDelete(folder);
                                setModalVisible(true);
                              }}
                            >
                              <FaTrash />
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Confirmation Modal */}
                  {modalVisible && (
                    <div
                      style={{
                        position: "fixed",
                        top: 0,
                        left: 0,
                        width: "100%",
                        height: "100%",
                        background: "rgba(0,0,0,0.5)",
                        display: "flex",
                        alignItems: "center",
                        zIndex: "99999",
                        justifyContent: "center",
                      }}
                    >
                      <div
                        style={{
                          background: "#fff",
                          padding: "20px",
                          borderRadius: "10px",
                          width: "300px",
                          textAlign: "center",
                        }}
                      >
                        <p>
                          Are you sure you want to delete folder{" "}
                          <strong>{folderToDelete?.name}</strong>?
                        </p>
                        <div style={{ marginTop: "15px" }}>
                          <button
                            style={{
                              marginRight: "10px",
                              padding: "6px 12px",
                              backgroundColor: "#ccc",
                              border: "none",
                              borderRadius: "4px",
                              cursor: "pointer",
                            }}
                            onClick={() => setModalVisible(false)}
                          >
                            Cancel
                          </button>
                          <button
                            style={{
                              padding: "6px 12px",
                              backgroundColor: "red",
                              color: "white",
                              border: "none",
                              borderRadius: "4px",
                              cursor: "pointer",
                            }}
                            onClick={handleDeleteFolder}
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Folder title */}
                  {currentFolder && (
                    <div style={{ marginBottom: "10px" }}>
                      📂 {currentFolder}
                    </div>
                  )}

                  {/* Images */}
                  <div className="gallery-scroll-container">
                    {galleryImages.length === 0 && (
                      <div className="no-images">No images found</div>
                    )}

                    {galleryImages.map((item) => (
                      <div
                        key={item._id}
                        className="gallery-item"
                        draggable={!currentFolder} // allow dragging only at root
                        onDragStart={() => setSelectedDraggedImageId(item._id)}
                      >
                        <img src={item.imageUrl} alt="Uploaded" />
                        <div className="gallery-actions">
                          <button
                            onClick={() =>
                              uploadImage(
                                selectedImageIndex,
                                selectedImageNumber,
                                item.imageUrl
                              )
                            }
                          >
                            <FaCheckCircle />
                          </button>
                          <button onClick={() => deleteImage(item._id)}>
                            <FaTrash />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Folder creation modal */}
                {showFolderModal && (
                  <div
                    style={{
                      position: "fixed",
                      background: "rgba(0,0,0,0.7)",
                      top: 0,
                      zIndex: 99999,
                      left: 0,
                      width: "100%",
                      height: "100%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <div
                      style={{
                        background: "#fff",
                        padding: "20px",
                        borderRadius: "8px",
                        width: "300px",
                      }}
                    >
                      <h3>Create Folder</h3>
                      <input
                        type="text"
                        value={newFolderName}
                        onChange={(e) => setNewFolderName(e.target.value)}
                        placeholder="Folder Name"
                        style={{
                          width: "95%",
                          padding: "8px",
                          marginBottom: "10px",
                        }}
                      />
                      <button
                        onClick={createFolder}
                        style={{
                          padding: "8px 12px",
                          background: "#2f327D",
                          color: "#fff",
                          border: "none",
                          borderRadius: "4px",
                        }}
                      >
                        Save
                      </button>
                      <button
                        onClick={() => setShowFolderModal(false)}
                        style={{
                          marginLeft: "10px",
                          padding: "8px 12px",
                          background: "#f48c06",
                          color: "#fff",
                          border: "none",
                          borderRadius: "4px",
                        }}
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </FileManagerModal>

          {showMoveConfirmModal && (
            <div className="move-confirm-modal-overlay">
              <div className="move-confirm-modal-content">
                <p>
                  Move image to folder{" "}
                  <strong>{pendingFolderMove?.targetFolder}</strong>?
                </p>
                <div className="move-confirm-button-group">
                  <button
                    className="move-confirm-btn-cancel"
                    onClick={() => {
                      setShowMoveConfirmModal(false);
                      setPendingFolderMove(null);
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    className="move-confirm-btn-yes"
                    onClick={async () => {
                      try {
                        const res = await axios.put(
                          `${apiConfig.baseURL}/api/stud/update-folder`,
                          {
                            imageId: pendingFolderMove.imageId,
                            newFolder: pendingFolderMove.targetFolder,
                          }
                        );

                        if (res.data.success) {
                          toast.success("Image moved successfully");
                          fetchImages();
                        } else {
                          toast.error("Failed to move image");
                        }
                      } catch (err) {
                        toast.error("Error moving image");
                        console.error(err);
                      } finally {
                        setShowMoveConfirmModal(false);
                        setPendingFolderMove(null);
                      }
                    }}
                  >
                    Yes, Move
                  </button>
                </div>
              </div>
            </div>
          )}

          <div className="side-img">
            <img src={imghome} alt="Home img" className="home-image" />
          </div>
        </div>

        {isModalOpen && (
          <div className="auto-overlay-unique">
            <div className="auto-modal-unique">
              <button className="auto-close-unique" onClick={handleCloseModal}>
                &times;
              </button>
              <h2 className="auto-title-unique">Choose Automation Option</h2>

              <div className="auto-options-unique">
                <button
                  className={`auto-option-btn-unique ${
                    activeOption === "birthday" ? "auto-active-unique" : ""
                  }`}
                  onClick={() => setActiveOption("birthday")}
                >
                  Birthday Remainder
                </button>
                <button
                  className={`auto-option-btn-unique ${
                    activeOption === "payment" ? "auto-active-unique" : ""
                  }`}
                  onClick={() => setActiveOption("payment")}
                >
                  Payment Remainder
                </button>
              </div>

              {/* Birthday Remainder */}
              {activeOption === "birthday" && (
                <div className="auto-section-unique">
                  <label>Select Template:</label>
                  <select
                    className="auto-select-unique"
                    onChange={(e) => {
                      const selectedId = e.target.value;
                      const selectedTemplate = templates.find(
                        (t) => t._id === selectedId
                      );
                      if (selectedTemplate)
                        handlePreviewautomate(selectedTemplate);
                    }}
                  >
                    <option>---Select Template---</option>
                    {templates.length > 0 ? (
                      templates.map((template) => (
                        <option key={template._id} value={template._id}>
                          {template.temname}
                        </option>
                      ))
                    ) : (
                      <option disabled>No templates found</option>
                    )}
                  </select>

                  <label htmlFor="group-select">Select Contact Group:</label>
                  <select
                    id="group-select"
                    value={selectedGroup}
                    onChange={(e) => setSelectedGroup(e.target.value)}
                  >
                    <option>---Select Contact---</option>
                    {groups.map((group) => (
                      <option key={group._id} value={group._id}>
                        {group.name}
                      </option>
                    ))}
                  </select>

                  <label htmlFor="subject-input">Alias Name:</label>
                  <input
                    type="text"
                    id="aliasName-input"
                    value={aliasName}
                    onChange={(e) => setAliasName(e.target.value)}
                    placeholder="Enter your alias name here"
                  />

                  <label htmlFor="subject-input">Subject:</label>
                  <input
                    type="text"
                    id="subject-input"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Enter your message here"
                  />
                  <div className="select-group-container-sub" ref={dropdownRef}>
                    {/* Select Group */}
                    <select
                      onChange={(e) => handleGroupChangesubject(e)}
                      value=""
                      className="select-variable"
                    >
                      <option value="" disabled className="template-title">
                        Add Variable
                      </option>
                      <option value="" disabled>
                        Select Group
                      </option>
                      {groups.map((group, idx) => (
                        <option key={idx} value={group._id}>
                          {group.name}
                        </option>
                      ))}
                    </select>

                    {/* Show fields only for the selected heading */}
                    {selectedGroupsub && (
                      <div className="dropdown-container-sub">
                        <p className="template-title">
                          <span>Add</span> Variable
                        </p>
                        {fieldNames && fieldNames.length > 0 ? (
                          <div>
                            {fieldNames.map((field, idx) => (
                              <div
                                className="list-field"
                                key={idx}
                                onClick={() =>
                                  handleInsertNamesubject(`{${field}}`)
                                }
                              >
                                {field}
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p className="no-variables">No Variables</p>
                        )}
                      </div>
                    )}
                  </div>

                  <label htmlFor="preview-text">Preview Text:</label>
                  <input
                    type="text"
                    id="preview-text"
                    value={previewtext}
                    onChange={(e) => setPreviewtext(e.target.value)}
                    placeholder="Enter your Preview text here"
                  />
                  {/* Attachment File Input */}
                  <label htmlFor="attachments">Attach Files(Max-10):</label>
                  {/* Attachment File Input */}
                  <input
                    type="file"
                    multiple
                    onChange={(e) => {
                      const newFiles = Array.from(e.target.files);
                      const allFiles = [
                        ...(emailData.attachments || []),
                        ...newFiles,
                      ];

                      if (allFiles.length > 10) {
                        toast.warning("You can only attach up to 10 files.");
                        return;
                      }

                      setEmailData({ ...emailData, attachments: allFiles });
                    }}
                  />

                  {/* Display Attached Files */}
                  <div className="file-list">
                    {emailData.attachments &&
                    emailData.attachments.length > 0 ? (
                      <ol>
                        {emailData.attachments.map((file, index) => (
                          <li key={index}>
                            {file.name} - {Math.round(file.size / 1024)} KB
                            <button
                              className="attach-close"
                              onClick={() => {
                                const newAttachments =
                                  emailData.attachments.filter(
                                    (_, i) => i !== index
                                  );
                                setEmailData({
                                  ...emailData,
                                  attachments: newAttachments,
                                });
                              }}
                            >
                              X
                            </button>
                          </li>
                        ))}
                      </ol>
                    ) : (
                      <p>No files selected</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="schedule-time">Set Remainder Time:</label>{" "}
                    <CustomHourSelect
                      scheduledTime={scheduledTime}
                      setScheduledTime={setScheduledTime}
                    />
                  </div>
                  <div className="auto-actions-unique">
                    <button
                      className="auto-save-unique"
                      onClick={handlesetbirthremainder}
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <span className="loader-create-remainder"></span> // Spinner
                      ) : (
                        "Set Remainder"
                      )}{" "}
                    </button>
                    <button
                      className="auto-cancel-unique"
                      onClick={handleCloseModal}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}

              {/* Payment Reminder */}
              {activeOption === "payment" && (
                <div className="auto-section-unique">
                  <label>Select Template:</label>
                  <select
                    className="auto-select-unique"
                    onChange={(e) => {
                      const selectedId = e.target.value;
                      const selectedTemplate = templates.find(
                        (t) => t._id === selectedId
                      );
                      if (selectedTemplate)
                        handlePreviewautomate(selectedTemplate);
                    }}
                  >
                    <option>---Select Template---</option>
                    {templates.length > 0 ? (
                      templates.map((template) => (
                        <option key={template._id} value={template._id}>
                          {template.temname}
                        </option>
                      ))
                    ) : (
                      <option disabled>No templates found</option>
                    )}
                  </select>

                  <label htmlFor="aliasName-input">Alias Name:</label>
                  <input
                    type="text"
                    id="aliasName-input"
                    value={aliasName}
                    onChange={(e) => setAliasName(e.target.value)}
                    placeholder="Enter Alias Name"
                  />
                  <label htmlFor="subject-input">Subject:</label>
                  <input
                    type="text"
                    id="subject-input"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Enter subject"
                  />
                  <label htmlFor="preview-input">Preview Text:</label>
                  <input
                    type="text"
                    id="preview-input"
                    value={previewtext}
                    onChange={(e) => setPreviewtext(e.target.value)}
                    placeholder="Enter Preview Text"
                  />
                  {/* Attachment File Input */}
                  <label htmlFor="attachments">Attach Files(Max-10):</label>
                  {/* Attachment File Input */}
                  <input
                    type="file"
                    multiple
                    onChange={(e) => {
                      const newFiles = Array.from(e.target.files);
                      const allFiles = [
                        ...(emailData.attachments || []),
                        ...newFiles,
                      ];

                      if (allFiles.length > 10) {
                        toast.warning("You can only attach up to 10 files.");
                        return;
                      }

                      setEmailData({ ...emailData, attachments: allFiles });
                    }}
                  />

                  {/* Display Attached Files */}
                  <div className="file-list">
                    {emailData.attachments &&
                    emailData.attachments.length > 0 ? (
                      <ol>
                        {emailData.attachments.map((file, index) => (
                          <li key={index}>
                            {file.name} - {Math.round(file.size / 1024)} KB
                            <button
                              className="attach-close"
                              onClick={() => {
                                const newAttachments =
                                  emailData.attachments.filter(
                                    (_, i) => i !== index
                                  );
                                setEmailData({
                                  ...emailData,
                                  attachments: newAttachments,
                                });
                              }}
                            >
                              X
                            </button>
                          </li>
                        ))}
                      </ol>
                    ) : (
                      <p>No files selected</p>
                    )}
                  </div>
                  <div className="excel-modal-body">
                    <h4>
                      Upload contact list
                      <FaInfoCircle
                        className="info-icon-rule"
                        onClick={() => {
                          setIsRuleOpen(true);
                        }}
                        style={{ cursor: "pointer", marginLeft: "5px" }}
                      />
                    </h4>
                    {/* Modal */}
                    {isRuleOpen && (
                      <div className="rule-modal-overlay">
                        <div className="rule-modal-container">
                          <h3>Steps to Upload a File</h3>
                          <ol>
                            <li>
                              The First Name, Last Name, and Email fields are
                              mandatory.
                            </li>
                            <li>
                              All other fields are optional. You can create
                              custom fields based on your requirements.
                            </li>
                          </ol>

                          <button
                            onClick={() => setIsRuleOpen(false)}
                            className="rule-close-button"
                          >
                            Close
                          </button>
                        </div>
                      </div>
                    )}
                    <img
                      src={sampleexcel}
                      alt="Sample Excel Format"
                      className="sample-excel-image"
                    />
                    <div style={{ display: "flex", gap: "10px" }}>
                      <a href="../file/democsvfile.csv" download>
                        <button className="modal-btn btn-download-sample">
                          Download Sample csv File
                        </button>
                      </a>
                      <a href="../file/demoexcelfile.xlsx" download>
                        <button className="modal-btn btn-download-sample">
                          Download Sample xlsx File
                        </button>
                      </a>
                    </div>
                    <h4>
                      Upload excel file
                      <FaInfoCircle
                        className="info-icon-rule"
                        onClick={() => {
                          setIsRuleOpen(true);
                        }}
                        style={{ cursor: "pointer", marginLeft: "5px" }}
                      />
                    </h4>
                    <input
                      type="file"
                      accept=".xlsx, .xls"
                      onChange={handleFileUpload}
                    />
                    {fileName && <p>Uploaded File: {fileName}</p>}
                    {excelData.length > 0 && (
                      <button
                        className="excel-modal-view-btn"
                        onClick={() => {
                          const table = document.getElementById("excel-table");
                          table.scrollIntoView({ behavior: "smooth" });
                        }}
                      >
                        Uploaded List
                      </button>
                    )}
                  </div>
                  {excelData.length > 0 && (
                    <div className="excel-table-container">
                      <table id="excel-table">
                        <thead>
                          <tr>
                            {excelData[0].map((header, index) => (
                              <th key={index}>{header}</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {excelData.slice(1).map((row, rowIndex) => (
                            <tr key={rowIndex}>
                              {row.map((cell, cellIndex) => (
                                <td key={cellIndex}>{cell}</td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                  <div>
                    <label htmlFor="schedule-time">Set Remainder Time:</label>{" "}
                    <CustomHourSelect
                      scheduledTime={scheduledTime}
                      setScheduledTime={setScheduledTime}
                    />
                  </div>

                  <div className="auto-actions-unique">
                    <button
                      className="auto-save-unique"
                      onClick={handlesetpaymentremainder}
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <span className="loader-create-remainder"></span> // Spinner
                      ) : (
                        "Set Remainder"
                      )}{" "}
                    </button>
                    <button
                      className="auto-cancel-unique"
                      onClick={handleCloseModal}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Main Content */}

        <div className="main-content">
          <nav className="navbars">
            <div className="logo_img-mobile">
              <img src={Logo} alt="img_logo" />
            </div>

            {/* <div className="expiry-date"> 
  {daysRemaining !== null && (
    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
      <p
        style={{
          color:
            daysRemaining <= 2 && daysRemaining > 0
              ? "red"
              : daysRemaining <= 0
              ? "#f18b05"
              : "green",
          fontWeight: "bold",
          margin: 0,
        }}
      >
        {daysRemaining > 0
          ? `Expires in ${daysRemaining} day${daysRemaining > 1 ? "s" : ""}`
          : "Account expired"}
      </p>
      <button className="upgrade-btn-home" onClick={handlepayment}>
        Renew
      </button>
    </div>
  )}
</div> */}

            <div className="nav-split">
              <h4>
                <span
                  style={{
                    transform: "scaleX(-1)",
                    display: "inline-block",
                    color: "gold",
                    marginRight: "5px",
                  }}
                >
                  <MdWavingHand size={17} />
                </span>{" "}
                Hey{" "}
                <span style={{ color: "#f48c06" }}>
                  {users?.username || user?.username}
                </span>
              </h4>

              <div className="profile-container" ref={dropdownRef}>
                <button onClick={toggleDropdown} className="profile-button">
                  <img
                    src={
                      users?.avatar ||
                      "https://cdn-icons-png.flaticon.com/512/847/847969.png"
                    }
                    alt="User Avatar"
                    className="profile-avatar"
                  />
                </button>
              </div>
            </div>
          </nav>

          {/* Conditionally Render EditProfile Component */}
          {isEditingProfile && (
            <EditProfile users={users} handleLogout={handleLogout} />
          )}
          <div className="main-content-sub">
            <div className="maincontent-main">
              {view === "main" && (
                <div className="card-grid">
                  <div className="cards" onClick={handleCampaignView}>
                    <FaRegClipboard className="icons campaign-icon" />
                    <span className="card-texts">Campaign</span>
                  </div>
                  <div className="cards" onClick={handleContactView}>
                    <FaAddressBook className="icons contact-icon" />
                    <span className="card-texts">Contact</span>
                  </div>
                </div>
              )}
              {view === "dashboard" && (
                <div className="dashboard-content">
                  <div className="dashboard-welcome-box">
                    <div className="dashboard-welcome-left">
                      <h2 className="dashboard-title-modern">
                        Welcome back, {username} 👋
                      </h2>
                      <p className="dashboard-subtitle-modern">
                        Today is {today}. Here's a quick summary of your
                        campaigns.
                      </p>
                    </div>
                  </div>

                  <div className="Home-cards-dashboard">
                    <div className="card-dashboard-container">
                      <div
                        className="cards-dashboard"
                        onClick={handlenavigatecampaign}
                      >
                        <div className="card-inner-text">
                          <FaBullhorn />
                        </div>
                        <p className="card-text-content">Total Campaigns</p>
                        <p className="card-text-highlight">{totalCampaigns}</p>
                      </div>

                      <div
                        className="cards-dashboard"
                        onClick={() => {
                          setView("contact");
                        }}
                      >
                        <div className="card-inner-text">
                          <FaUsers />
                        </div>
                        <p className="card-text-content">Total Contacts</p>
                        <p className="card-text-highlight">
                          {totalContacts}
                        </p>
                      </div>

                      <div
                        className="cards-dashboard"
                        onClick={() => {
                          setView("remainder");
                        }}
                      >
                        <div className="card-inner-text">
                          <FaCogs />
                        </div>
                        <p className="card-text-content">Total Automation</p>
                        <p className="card-text-highlight">{totalAutomation}</p>
                      </div>

                      <div
                        className="cards-dashboard"
                        onClick={() => {
                          setView("template");
                        }}
                      >
                        <div className="card-inner-text">
                          <FaSave />
                        </div>
                        <p className="card-text-content">Saved Template</p>
                        <p className="card-text-highlight">
                          {templates.length}
                        </p>
                      </div>
                    </div>
                    <div className="top-performers-container top-per-home">
                      <div className="top-header">
                        <div>
                          <h2 className="top-performers-title">
                            Top Performers
                          </h2>
                          <p className="top-performers-subtitle">
                            Best campaigns by engagement
                          </p>
                        </div>
                        <FaChartBar className="icon-right" />
                      </div>
                      <div className="top-performers-container-scroll-home">
                        {[...campaigns]
                          .sort((a, b) => {
                            const aOpen =
                              campaignMetrics[a._id]?.openCount || 0;
                            const bOpen =
                              campaignMetrics[b._id]?.openCount || 0;

                            const aClick =
                              campaignMetrics[a._id]?.clickCount || 0;
                            const bClick =
                              campaignMetrics[b._id]?.clickCount || 0;

                            const aTotal = a.totalcount || 1;
                            const bTotal = b.totalcount || 1;

                            const aAvg =
                              ((aOpen + aClick) / (2 * aTotal)) * 100;
                            const bAvg =
                              ((bOpen + bClick) / (2 * bTotal)) * 100;
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
                                onClick={handlenavigatecampaign}
                              >
                                <div
                                  className={`rank-badge ${
                                    item.status === "Failed"
                                      ? "badge-orange-light"
                                      : "badge-orange-his"
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
                                        <span className="highlight">
                                          {openRate}%
                                        </span>
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
                                          {item.sendcount || 0}/
                                          {item.totalcount || 0}
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

                  <div className="graph-card-container">
                    <div
                      className="engagement-container"
                      style={{ border: "none" }}
                    >
                      <div
                        className="engage-boxes"
                        style={{ marginBottom: "20px", gap: "20px" }}
                      >
                        <div>
                          <h2 style={{ marginBottom: "10px" }}>
                            Activity Timeline
                          </h2>
                          <p
                            className="engage-para"
                            style={{ fontSize: "1rem" }}
                          >
                            Daily trends of Campaigns, Contacts, Automations &
                            Templates over the past 10 days
                          </p>
                        </div>

                        <div className="button-group">
                          <button
                            className={`toggle-button ${
                              visible.campaigns ? "active" : ""
                            }`}
                            onClick={() => toggleLine("campaigns")}
                          >
                            <FaBullhorn style={{ marginRight: "6px" }} />{" "}
                            Campaigns
                          </button>

                          <button
                            className={`toggle-button ${
                              visible.contacts ? "active" : ""
                            }`}
                            onClick={() => toggleLine("contacts")}
                          >
                            <FaUserFriends style={{ marginRight: "6px" }} />{" "}
                            Contacts
                          </button>

                          <button
                            className={`toggle-button ${
                              visible.automation ? "active" : ""
                            }`}
                            onClick={() => toggleLine("automation")}
                          >
                            <FaCog style={{ marginRight: "6px" }} /> Automation
                          </button>

                          <button
                            className={`toggle-button ${
                              visible.templates ? "active" : ""
                            }`}
                            onClick={() => toggleLine("templates")}
                          >
                            <FaPuzzlePiece style={{ marginRight: "6px" }} />{" "}
                            Templates
                          </button>
                        </div>
                      </div>

                      <ResponsiveContainer width="95%" height={350}>
                        <LineChart data={timelineData}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis
                            dataKey="date"
                            stroke="#64748b"
                            fontSize={11}
                          />
                          <YAxis stroke="#64748b" fontSize={12} />
                          <Tooltip />
                          <Legend />
                          {visible.campaigns && (
                            <Line
                              type="monotone"
                              dataKey="campaigns"
                              stroke="#3b82f6"
                              strokeWidth={2}
                              dot={{ r: 3 }}
                            />
                          )}
                          {visible.contacts && (
                            <Line
                              type="monotone"
                              dataKey="contacts"
                              stroke="#10b981"
                              strokeWidth={2}
                              dot={{ r: 3 }}
                            />
                          )}
                          {visible.automation && (
                            <Line
                              type="monotone"
                              dataKey="automation"
                              stroke="#f59e0b"
                              strokeWidth={2}
                              dot={{ r: 3 }}
                            />
                          )}
                          {visible.templates && (
                            <Line
                              type="monotone"
                              dataKey="templates"
                              stroke="#8b5cf6"
                              strokeWidth={2}
                              dot={{ r: 3 }}
                            />
                          )}
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                  {/* --------------------------------- saved template new content ------------------------------------- */}
                  <div className="saved-template-display">
                    <div>
                      <h2 className="header-saved-template">Saved Template</h2>
                      <p className="header-head-para">
                        Monitor user engagement with saved campaigns,Spot trends
                        in saving, editing, and reusing content.
                      </p>
                    </div>
                    <div className="saved-template-gallery-home">
                      {templates
                        .slice((currentPage - 1) * 6, currentPage * 6)
                        .map((template, index) => {
                          const matchingCampaigns = campaigns
                            .filter((c) => c.temname === template.temname)
                            .sort(
                              (a, b) =>
                                new Date(b.createdAt) - new Date(a.createdAt)
                            ); // latest first

                          const usageCount = matchingCampaigns.length;
                          const latestCampaign = matchingCampaigns[0];

                          const metrics =
                            latestCampaign &&
                            campaignMetrics[latestCampaign._id]
                              ? campaignMetrics[latestCampaign._id]
                              : {};

                          const { openCount = 0, clickCount = 0 } = metrics;

                          const totalCount = parseInt(
                            latestCampaign?.totalcount || 0
                          );
                          const sendCount = parseInt(
                            latestCampaign?.sendcount || 0
                          );
                          const failedCount = parseInt(
                            latestCampaign?.failedcount || 0
                          );

                          const openRate =
                            sendCount > 0
                              ? ((openCount / totalCount) * 100).toFixed(0)
                              : 0;
                          const clickRate =
                            sendCount > 0
                              ? ((clickCount / totalCount) * 100).toFixed(0)
                              : 0;
                          const failRate =
                            sendCount > 0
                              ? ((failedCount / totalCount) * 100).toFixed(0)
                              : 0;
                          const sendRate =
                            sendCount > 0
                              ? ((sendCount / totalCount) * 100).toFixed(0)
                              : 0;

                          const lastUsedDate = latestCampaign?.createdAt
                            ? new Date(
                                latestCampaign.createdAt
                              ).toLocaleDateString()
                            : "N/A";

                          return (
                            <div className="template-thumbnail-container-home">
                              <div className="template-thumbnail-wrapper">
                                <div
                                  className="template-thumbnail-home"
                                 
                                >
                                  {template.previewContent?.map((item, idx) => (
                                    <div
                                      key={idx}
                                      style={{
                                        fontSize: "12px",
                                        marginBottom: "6px",
                                        backgroundColor:
                                      template.bgColor || "#ffffff",
                                      }}
                                      
                                      className="new-item-gallery-item"
                                    >
                                      {/* Heading */}
                                      {item.type === "head" && (
                                        <div ref={dropdownRef}>
                                          <p
                                            className="border"
                                            style={item.style}
                                          >
                                            {item.content}
                                          </p>
                                        </div>
                                      )}

                                      {/* Paragraph */}
                                      {item.type === "para" && (
                                        <div className="border para-container">
                                          <p
                                            className="border-para para-gallery"
                                            contentEditable
                                            suppressContentEditableWarning
                                            onClick={() => {
                                              setSelectedIndex(index);
                                              setIsModalOpen(true); // Open the modal
                                            }}
                                            style={item.style}
                                            dangerouslySetInnerHTML={{
                                              __html: item.content,
                                            }}
                                          />
                                        </div>
                                      )}

                                      {/* Image */}
                                      {item.type === "image" && (
                                        <div className="border">
                                          <img
                                            src={
                                              item.src 
                                            }
                                            alt="Preview"
                                            className="img gallery-img-image"
                                            style={item.style}
                                          />
                                        </div>
                                      )}

                                      {/* Banner*/}
                                      {item.type === "banner" && (
                                        <div className="border">
                                          <img
                                            src={
                                              item.src 
                                            }
                                            alt="Preview"
                                            className="img gallery-img-banner "
                                            style={item.style}
                                          />
                                        </div>
                                      )}

                                      {/* Button */}
                                      {item.type === "button" && (
                                        <div className="border-btn">
                                          <div className="border-btn">
                                            <a
                                              href={item.link || "#"}
                                              target={
                                                item.buttonType === "link"
                                                  ? "_blank"
                                                  : undefined
                                              }
                                              rel="noopener noreferrer"
                                              style={item.style}
                                              className="button-preview btn-gallery-whole"
                                            >
                                              {item.content ||
                                                (item.buttonType === "whatsapp"
                                                  ? "Connect on WhatsApp"
                                                  : item.buttonType ===
                                                    "contact"
                                                  ? "Call Now"
                                                  : "Visit Link")}
                                            </a>
                                          </div>
                                        </div>
                                      )}

                                    
                                      {/* Link */}
                                      {item.type === "link-image" && (
                                        <div className="border">
                                          <a
                                            href={item.link || "#"}
                                            onClick={(e) =>
                                              handleLinkClick(e, index)
                                            }
                                          >
                                            <img
                                              src={
                                                item.src 
                                              }
                                              alt="Editable"
                                              className="img gallery-img-image"
                                              style={item.style}
                                              onClick={() =>
                                                handleopenFiles(index, 1)
                                              }
                                              title="Upload Image"
                                            />
                                          </a>
                                        </div>
                                      )}

                                      {/* Break Line */}
                                      {item.type === "break" && (
                                        <div className="border-break gallery-line">
                                          <hr style={item.style} />
                                        </div>
                                      )}

                                      {/* Gap/Spacing */}
                                      {item.type === "gap" && (
                                        <div className="border-break">
                                          <div style={item.styles}></div>
                                        </div>
                                      )}
                                     

                                      {item.type === "cardimage" ? (
                                        <div
                                          className="card-image-container"
                                          style={item.style1}
                                        >
                                          <img
                                            src={
                                              item.src1 
                                            }
                                            style={item.style}
                                            alt="Editable"
                                            className="card-image"
                                            title="Upload Image"
                                            onClick={() =>
                                              handleopenFiles(index, 1)
                                            }
                                          />
                                          <p
                                            className="card-text"
                                            contentEditable
                                            suppressContentEditableWarning
                                            onClick={
                                              () => {
                                                setModalIndex(index);
                                                setIsModalOpen(true);
                                              } // Open the modal
                                            } // Open modal for this index
                                            style={item.style}
                                            dangerouslySetInnerHTML={{
                                              __html: item.content1,
                                            }}
                                          />
                                        </div>
                                      ) : null}

                                      {/* Logo */}
                                      {item.type === "logo" && (
                                        <div className="border">
                                          <img
                                            src={
                                              item.src 
                                            }
                                            alt="Editable"
                                            className="logo gallery-img"
                                            style={item.style}
                                            onClick={() =>
                                              handleopenFiles(index, 1)
                                            }
                                            title="Upload Image"
                                          />
                                        </div>
                                      )}

                                      {/* Image with Text */}
                                      {item.type === "imagewithtext" && (
                                        <div className="image-text-container">
                                          <div
                                            className="image-text-wrapper"
                                            id="gallery-imagewithtext"
                                            style={item.style1}
                                          >
                                            <img
                                              src={
                                                item.src1 
                                              }
                                              alt="Preview"
                                              className="image-item gallery-img-text-img"
                                            />
                                            <p
                                              className="text-item gallery-text-img"
                                              style={item.style}
                                            >
                                              {item.content1}
                                            </p>
                                          </div>
                                        </div>
                                      )}

                                      {/* Text with Image */}
                                      {item.type === "textwithimage" && (
                                        <div className="image-text-container">
                                          <div
                                            className="image-text-wrapper"
                                            id="gallery-imagewithtext"
                                            style={item.style}
                                          >
                                            <p
                                              className="text-item gallery-text-img"
                                              style={item.style}
                                            >
                                              {item.content2}
                                            </p>
                                            <img
                                              src={
                                                item.src2 
                                              }
                                              alt="Preview"
                                              className="image-item gallery-img-text-img"
                                            />
                                          </div>
                                        </div>
                                      )}

                                      {item.type === "multi-image" ? (
                                        <div className="Layout-img">
                                          <div className="Layout multi-gallery">
                                            <img
                                              src={
                                                item.src1 
                                              }
                                              alt="Editable"
                                              className="multiimg gallery-img-multi"
                                              title="Upload Image 240 x 240"
                                              style={item.style}
                                              onClick={() =>
                                                handleopenFiles(index, 1)
                                              }
                                            />
                                            <a
                                              href={item.link1}
                                              target="_blank"
                                              className="button-preview btn-gallery"
                                              rel="noopener noreferrer"
                                              style={item.buttonStyle1}
                                            >
                                              {item.content1}
                                            </a>
                                          </div>

                                          <div className="Layout multi-gallery">
                                            <img
                                              src={
                                                item.src2 
                                              }
                                              alt="Editable"
                                              className="multiimg gallery-img-multi"
                                              title="Upload Image 240 x 240"
                                              style={item.style}
                                              onClick={() =>
                                                handleopenFiles(index, 2)
                                              }
                                            />
                                            <a
                                              href={item.link2}
                                              target="_blank"
                                              rel="noopener noreferrer"
                                              className="button-preview btn-gallery"
                                              style={item.buttonStyle2}
                                            >
                                              {item.content2}
                                            </a>
                                          </div>
                                        </div>
                                      ) : null}

                                      {/* Multi Image Card */}
                                      {item.type === "multi-image-card" && (
                                        <div className="Layout-img">
                                          <div className="Layout multi-gallery">
                                            <img
                                              src={
                                                item.src1 
                                              }
                                              alt="Preview"
                                              className="multiimgcard gallery-img-multi"
                                              style={item.style}
                                            />
                                            <h3 className="card-text-image text-card">
                                              {item.title1 || " "}
                                            </h3>
                                            <p>
                                              <s>
                                                {item.originalPrice1
                                                  ? `₹${item.originalPrice1}`
                                                  : " "}
                                              </s>
                                            </p>
                                            <p>
                                              {item.offerPrice1
                                                ? `Off Price ₹${item.offerPrice1}`
                                                : " "}
                                            </p>
                                            <a
                                              href={item.link1}
                                              className="button-preview btn-gallery"
                                              style={item.buttonStyle1}
                                            >
                                              {item.content1}
                                            </a>
                                          </div>

                                          <div className="Layout multi-gallery">
                                            <img
                                              src={
                                                item.src2 
                                              }
                                              alt="Preview"
                                              className="multiimgcard"
                                              style={item.style}
                                            />
                                            <h3 className="card-text-image text-card">
                                              {item.title2 || " "}
                                            </h3>
                                            <p>
                                              <s>
                                                {item.originalPrice2
                                                  ? `₹${item.originalPrice2}`
                                                  : " "}
                                              </s>
                                            </p>
                                            <p>
                                              {item.offerPrice2
                                                ? `Off Price ₹${item.offerPrice2}`
                                                : " "}
                                            </p>
                                            <a
                                              href={item.link2}
                                              className="button-preview btn-gallery"
                                              style={item.buttonStyle2}
                                            >
                                              {item.content2}
                                            </a>
                                          </div>
                                        </div>
                                      )}

                                      {/* Multiple Images */}
                                      {item.type === "multipleimage" && (
                                        <div className="Layout-img">
                                          <div className="Layout multi-gallery">
                                            <img
                                              src={
                                                item.src1 
                                              }
                                              alt="Preview"
                                              className="multiple-img gallery-img-multi"
                                              style={item.style}
                                            />
                                          </div>
                                          <div className="Layout multi-gallery">
                                            <img
                                              src={
                                                item.src2 
                                              }
                                              alt="Preview"
                                              className="multiple-img gallery-img-multi"
                                              style={item.style}
                                            />
                                          </div>
                                        </div>
                                      )}

                                      {/* Video Icon */}
                                      {item.type === "video-icon" && (
                                        <div className="video-icon">
                                          <img
                                            src={
                                              item.src1 
                                            }
                                            alt="Preview"
                                            className="videoimg video-img"
                                            style={item.style}
                                          />
                                          <a href={item.link}>
                                            <img
                                              src={item.src2}
                                              className="video-btn"
                                              alt="Play"
                                            />
                                          </a>
                                        </div>
                                      )}

                                      {/* Social Icons */}
                                      {item.type === "icons" && (
                                        <div
                                          className="border"
                                          style={item.ContentStyle}
                                        >
                                          <div className="icon-containers">
                                            <a href={item.links1 || "#"}>
                                              <img
                                                src={item.iconsrc1}
                                                alt="Social"
                                                className="icon"
                                                style={item.style1}
                                              />
                                            </a>
                                            <a href={item.links2 || "#"}>
                                              <img
                                                src={item.iconsrc2}
                                                alt="Social"
                                                className="icon"
                                                style={item.style2}
                                              />
                                            </a>
                                            <a href={item.links3 || "#"}>
                                              <img
                                                src={item.iconsrc3}
                                                alt="Social"
                                                className="icon"
                                                style={item.style3}
                                              />
                                            </a>
                                            <a href={item.links4 || "#"}>
                                              <img
                                                src={item.iconsrc4}
                                                alt="Social"
                                                className="icon"
                                                style={item.style4}
                                              />
                                            </a>
                                          </div>
                                        </div>
                                      )}
                                    </div>
                                  ))}
                                  {/* Add overlay div */}
                                  <div
                                    className="template-overlay"
                                    onClick={() =>
                                      handlePreview(template, false)
                                    }
                                  >
                                    <div className="overlay-content">
                                      <span className="overlay-icon">
                                        <FaEye
                                          style={{
                                            color: "#ffffffff",
                                            fontSize: "15px",
                                          }}
                                        />
                                      </span>
                                      <span className="overlay-text">
                                        View Template
                                      </span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <div className="template-bottom">
                                <div className="inv-card-container">
                                  <div className="inv-card-header">
                                    <div>
                                      <h4 className="inv-card-title">
                                        {template.temname}
                                      </h4>
                                    </div>
                                    <div>
                                      <p className="inv-card-uses">
                                        {usageCount || 0} uses
                                      </p>
                                    </div>
                                  </div>
                                  <div className="inv-card-metrics">
                                    <div className="inv-card-metric">
                                      <p className="inv-text-green">
                                        {sendRate}%
                                      </p>
                                      <p>Send Rate</p>
                                    </div>
                                    <div className="inv-card-metric">
                                      <p className="inv-text-orange">
                                        {openRate}%
                                      </p>
                                      <p>Open Rate</p>
                                    </div>
                                    <div className="inv-card-metric">
                                      <p className="inv-text-green">
                                        {clickRate}%
                                      </p>
                                      <p>Click Rate</p>
                                    </div>
                                    <div className="inv-card-metric">
                                      <p className="inv-text-orange">
                                        {failRate}%
                                      </p>
                                      <p>Bounced</p>
                                    </div>
                                  </div>

                                  <div className="inv-card-sort">
                                    <div>
                                      last used:{lastUsedDate || "Nill"}
                                    </div>
                                    <div>
                                      <button
                                        className="btn-preview"
                                        onClick={() =>
                                          handlePreview(template, false)
                                        }
                                      >
                                        <FaEye
                                          style={{
                                            color: "#a2a1a1ff",
                                            fontSize: "15px",
                                          }}
                                        />
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                    </div>

                    <div className="dot-pagination">
                      {Array.from(
                        { length: Math.ceil(templates.length / 6) },
                        (_, index) => (
                          <span
                            key={index}
                            className={`dot ${
                              currentPage === index + 1 ? "active" : ""
                            }`}
                            onClick={() => setCurrentPage(index + 1)}
                          ></span>
                        )
                      )}
                    </div>
                  </div>
                </div>
              )}

              {view === "campaign" && (
                <div className="card-grid">
                  <div className="cards" onClick={handleCreateCampaign}>
                    <FaFileAlt className="icons campaign-create-icon" />
                    <span className="card-texts">Create Campaign</span>
                  </div>
                  <div className="cards" onClick={handlecampaignhistory}>
                    <FaHistory className="icons campaign-history-icon" />
                    <span className="card-texts">Campaign History</span>
                  </div>
                </div>
              )}

              {view === "template" && (
                <div className="card-grid">
                  <div className="cards" onClick={handleCreateTemplate}>
                    <FaThLarge className="icons campaign-create-icon" />
                    <span className="card-texts">Create Template</span>
                  </div>
                  <div className="cards" onClick={handleTemplateHistory}>
                    <FaHistory className="icons campaign-history-icon" />
                    <span className="card-texts">Saved Templates</span>
                  </div>
                </div>
              )}

              {view === "remainder" && (
                <div className="card-grid-auto">
                  <div className="cards cards-auto" onClick={openModal}>
                    <FaBell className="icons campaign-automation-icon" />
                    <span className="card-texts">Create Automation</span>
                  </div>
                  <div
                    className="cards cards-auto"
                    onClick={handleselectremainder}
                  >
                    <FaRegFileAlt className="icons campaign-create-icon" />
                    <span className="card-texts">
                      Create Automation Template
                    </span>
                  </div>
                  <div
                    className="cards cards-auto"
                    onClick={handleopenbirthtem}
                  >
                    <FaListAlt className="icons campaign-template-icon" />
                    <span className="card-texts">Automation Templates</span>
                  </div>
                  <div
                    className="cards cards-auto"
                    onClick={handleremainderhistory}
                  >
                    <FaHistory className="icons campaign-history-icon" />
                    <span className="card-texts">Automation History</span>
                  </div>
                </div>
              )}

              {view === "selectremainder" && (
                <div className="card-grid">
                  <div className="cards" onClick={handlecreatebirthdayname}>
                    <FaBirthdayCake className="icons campaign-create-icon" />
                    <span className="card-texts">
                      Birthday Automation Template
                    </span>
                  </div>
                </div>
              )}

              {view === "contact" && (
                <div className="card-grid">
                  <div className="cards" onClick={handleCreateContactView}>
                    <FaUserPlus className="icons contact-create-icon" />
                    <span className="card-texts">Create Contact</span>
                  </div>
                  <div className="cards" onClick={handleviewcontacts}>
                    <FaEye className="icons contact-view-icon" />
                    <span className="card-texts">View Contact </span>
                  </div>
                </div>
              )}

              {view === "create-contact" && (
                <div className="card-grid">
                  <div
                    className="cards"
                    onClick={() => {
                      setShowNewGroupModal((prev) => !prev); // Toggle state
                    }}
                  >
                    <FaUserPlus className="icons contact-create-icon" />
                    <span className="card-texts">New Group</span>
                  </div>
                  <div className="cards" onClick={handleaddcontact}>
                    <FaUser className="icons contact-view-icon" />
                    <span className="card-texts">Existing Group</span>
                  </div>
                </div>
              )}
              {view === "addcontact" && (
                <div className="card-grid">
                  <div className="cards" onClick={handleaddsinglefilecontacts}>
                    <FaUserPlus className="icons contact-create-icon" />
                    <span className="card-texts">Add Single Contact</span>
                  </div>
                  <div className="cards" onClick={handleaddfilecontacts}>
                    <FaUsers className="icons contact-view-icon" />
                    <span className="card-texts">Add Bulk Contact</span>
                  </div>
                </div>
              )}
            </div>
          </div>
          {/* create Automation section */}
          {showautoModal && (
            <div className="modal-overlay-automation">
              <div className="modal-content-automation">
                <div className="heading-automation">
                  <h2>Create Automation</h2>
                  <span
                    className="close-btn-automation"
                    onClick={() => {
                      setShowautoModal(false);
                    }}
                  >
                    ×
                  </span>
                </div>
                <div className="steps-container">
                  {/* Step 1 */}
                  <div className={`box box1 ${step >= 1 ? "active" : ""}`}>
                    <label>Select Template</label>
                    <select
                      className="auto-select-unique"
                      onChange={(e) => {
                        const selectedId = e.target.value;
                        const selectedTemplate = birthtemplates.find(
                          (t) => t._id === selectedId
                        );
                        if (selectedTemplate) {
                          handlePreviewautomate(selectedTemplate);
                          setStep(2); // Move to step 2
                        }
                      }}
                    >
                      <option>---Select Template---</option>
                      {birthtemplates.length > 0 ? (
                        birthtemplates.map((template) => (
                          <option key={template._id} value={template._id}>
                            {template.temname}
                          </option>
                        ))
                      ) : (
                        <option disabled>No templates found</option>
                      )}
                    </select>
                  </div>

                  {/* Arrow between Step 1 and 2 */}
                  <div
                    className={`arrow arrow1 ${step >= 2 ? "active" : ""}`}
                  ></div>

                  {/* Step 2 */}
                  <div className={`box box2 ${step >= 2 ? "active" : ""}`}>
                    <label>Select Contact Group</label>
                    <select
                      disabled={step < 2}
                      onChange={(e) => {
                        setSelectedGroup(e.target.value);
                        setStep(3);
                      }}
                    >
                      <option value="">---Select Contact---</option>
                      {groups.map((group) => (
                        <option key={group._id} value={group._id}>
                          {group.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Arrow between Step 2 and 3 */}
                  <div
                    className={`arrow arrow2 ${step >= 3 ? "active" : ""}`}
                  ></div>

                  {/* Step 3 */}
                  <div className={`box box3 ${step >= 3 ? "active" : ""}`}>
                    <label>Email Setup</label>

                    <div className="alias-container-wrapper">
                      <label
                        htmlFor="aliasName-select"
                        className="alias-container-label"
                      >
                        Alias Name:
                      </label>
                      <div className="alias-container-flex">
                        <select
                          style={{ padding: "10px" }}
                          id="aliasName-select"
                          value={aliasName}
                          onChange={(e) => setAliasName(e.target.value)}
                          className="alias-container-select"
                          disabled={step < 3}
                        >
                          <option value="">Select alias</option>
                          {aliasOptions.map((alias) => (
                            <option key={alias._id} value={alias.aliasName}>
                              {alias.aliasname}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="alias-container-add-button">
                        <button
                          type="button"
                          onClick={() => setShowModal(true)}
                        >
                          Add
                        </button>
                      </div>

                      {showModal && (
                        <div className="alias-container-modal-overlay">
                          <div className="alias-container-modal-box">
                            <h3>Add Alias Name</h3>
                            <input
                              type="text"
                              value={aliasName}
                              onChange={(e) => setAliasName(e.target.value)}
                              placeholder="Enter alias name"
                              className="alias-container-input"
                            />
                            <div className="alias-container-modal-actions">
                              <button
                                onClick={() => setShowModal(false)}
                                className="alias-container-cancel-btn"
                              >
                                Cancel
                              </button>
                              <button
                                onClick={handleAddAlias}
                                className="alias-container-save-btn"
                                disabled={isLoading}
                              >
                                {isLoading ? (
                                  <span className="loader-create"></span> // Spinner
                                ) : (
                                  "Save"
                                )}{" "}
                              </button>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="alias-container-wrapper">
                      <label
                        htmlFor="aliasName-select"
                        className="alias-container-label"
                      >
                        Reply To:
                      </label>
                      <div className="alias-container-flex">
                        <select
                          style={{ padding: "10px" }}
                          id="replyTo-select"
                          value={replyTo}
                          disabled={step < 3}
                          onChange={(e) => setReplyTo(e.target.value)}
                          className="alias-container-select"
                        >
                          <option value="">Select ReplyTo</option>
                          <option value={user.email}>{user.email}</option>
                          {replyOptions.map((reply) => (
                            <option key={reply._id} value={reply.replyTo}>
                              {reply.replyTo}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="alias-container-add-button">
                        <button
                          type="button"
                          onClick={() => setShowModalreply(true)}
                          disabled={step < 3}
                        >
                          Add
                        </button>
                      </div>

                      {showModalreply && (
                        <div className="alias-container-modal-overlay">
                          <div className="alias-container-modal-box">
                            <h3>Add Reply To Mail</h3>
                            <input
                              type="text"
                              value={replyTo}
                              onChange={(e) => setReplyTo(e.target.value)}
                              placeholder="Enter reply to mail"
                              className="alias-container-input"
                            />
                            <div className="alias-container-modal-actions">
                              <button
                                onClick={() => setShowModalreply(false)}
                                className="alias-container-cancel-btn"
                              >
                                Cancel
                              </button>
                              <button
                                onClick={handleAddReply}
                                className="alias-container-save-btn"
                                disabled={isLoadingreply}
                              >
                                {isLoadingreply ? (
                                  <span className="loader-create"></span> // Spinner
                                ) : (
                                  "Save"
                                )}{" "}
                              </button>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    <label htmlFor="subject-input">Subject:</label>
                    <input
                      type="text"
                      id="subject-input"
                      value={message}
                      disabled={step < 3}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Enter your message here"
                    />
                    <div
                      className="select-group-container-sub"
                      ref={dropdownRef}
                    >
                      {/* Select Group */}
                      <select
                        onChange={(e) => handleGroupChangesubject(e)}
                        value=""
                        disabled={step < 3}
                        className="select-variable"
                      >
                        <option value="" disabled className="template-title">
                          Add Variable
                        </option>
                        <option value="" disabled>
                          Select Group
                        </option>
                        {groups.map((group, idx) => (
                          <option key={idx} value={group._id}>
                            {group.name}
                          </option>
                        ))}
                      </select>
                      {/* Show fields only for the selected heading */}
                      {selectedGroupsub && (
                        <div className="dropdown-container-sub">
                          <p className="template-title">
                            <span>Add</span> Variable
                          </p>
                          {fieldNames && fieldNames.length > 0 ? (
                            <div>
                              {fieldNames.map((field, idx) => (
                                <div
                                  className="list-field"
                                  key={idx}
                                  onClick={() =>
                                    handleInsertNamesubject(`{${field}}`)
                                  }
                                >
                                  {field}
                                </div>
                              ))}
                            </div>
                          ) : (
                            <p className="no-variables">No Variables</p>
                          )}
                        </div>
                      )}
                    </div>

                    <label htmlFor="preview-text">Preview Text:</label>
                    <input
                      type="text"
                      id="preview-text"
                      disabled={step < 3}
                      value={previewtext}
                      onChange={(e) => setPreviewtext(e.target.value)}
                      placeholder="Enter your Preview text here"
                    />
                    {/* Attachment File Input */}
                    <label htmlFor="attachments">Attach Files(Max-10):</label>
                    {/* Attachment File Input */}
                    <input
                      type="file"
                      disabled={step < 3}
                      multiple
                      onChange={(e) => {
                        const newFiles = Array.from(e.target.files);
                        const allFiles = [
                          ...(emailData.attachments || []),
                          ...newFiles,
                        ];

                        if (allFiles.length > 10) {
                          toast.warning("You can only attach up to 10 files.");
                          return;
                        }

                        setEmailData({ ...emailData, attachments: allFiles });
                      }}
                    />

                    {/* Display Attached Files */}
                    <div className="file-list">
                      {emailData.attachments &&
                      emailData.attachments.length > 0 ? (
                        <ol>
                          {emailData.attachments.map((file, index) => (
                            <li key={index}>
                              {file.name} - {Math.round(file.size / 1024)} KB
                              <button
                                className="attach-close"
                                onClick={() => {
                                  const newAttachments =
                                    emailData.attachments.filter(
                                      (_, i) => i !== index
                                    );
                                  setEmailData({
                                    ...emailData,
                                    attachments: newAttachments,
                                  });
                                }}
                              >
                                X
                              </button>
                            </li>
                          ))}
                        </ol>
                      ) : (
                        <p>No files selected</p>
                      )}
                    </div>

                    <div>
                      <label htmlFor="schedule-time">Set Remainder Time:</label>{" "}
                      <CustomHourSelect
                        disabled={step < 3}
                        scheduledTime={scheduledTime}
                        setScheduledTime={setScheduledTime}
                      />
                    </div>
                  </div>
                </div>
                <div className="save-button-container">
                  <button
                    className="save-button"
                    onClick={handlesetbirthremainder}
                  >
                    Save
                  </button>
                </div>
              </div>
            </div>
          )}
          {/* show livepopup toast */}
          {/* <LivePopup userId={user?.id} /> */}

          {/* Show bulk add contact existing group modal */}
          {showfileGroupModal && (
            <GroupfileModal onClose={() => setShowfileGroupModal(false)} />
          )}
          {/* Show single add contact existing group modal */}

          {showfilesingleGroupModal && (
            <GroupfilesingleModal
              onClose={() => setShowfilesingleGroupModal(false)}
            />
          )}
          {/* Show new group modal    */}
          {showNewGroupModal && (
            <GroupModalnew onClose={() => setShowNewGroupModal(false)} />
          )}
          {/* show group list */}
          {showListPageModal && (
            <ListPage onClose={() => setShowListPageModal(false)} />
          )}
          {/* welcome popup */}
          {showPopup && (
            <div className="home-overlay overlay">
              <div className="home-modal">
                <div className="confetti-wrapper">
                  {[...Array(30)].map((_, index) => (
                    <div key={index} className="confetti"></div>
                  ))}
                </div>
                <button className="welcome-close-button" onClick={closePopup}>
                  <FaTimes className="text-red-500 cursor-pointer" />
                </button>
                <img
                  src={welcomeimg}
                  alt="Celebration"
                  className="celebration-icon"
                />
                <h2>Welcome {user.username}!</h2>
                <p>Explore the features and manage your groups efficiently.</p>
                <button className="welcome-button" onClick={closePopup}>
                  Let's go!
                </button>
              </div>
            </div>
          )}
          {/* Modal for template Details */}
          {showtemModal && (
            <div className="modal-overlay-tem">
              <div className="modal-content-tem">
                <div className="modal-nav-previews">
                  <h2>Saved Templates</h2>
                  <button className="close-button-tem" onClick={handletemclose}>
                    x
                  </button>
                </div>

                <div className="template-actions-delete">
                  <p className="select-all-tem">
                    <input
                      type="checkbox"
                      checked={selectAll}
                      onChange={handleSelectAll}
                    />{" "}
                    Select All
                  </p>
                  <button
                    onClick={() => {
                      if (selectedTemplates.length === 0) {
                        toast.warning("No template selected for deletion.");
                      } else {
                        setShowDeleteModaltemall(true);
                      }
                    }}
                    className="delete-all-btn-tem"
                  >
                    <FaTrash />
                  </button>
                </div>

                <div className="saved-template-gallery">
                  {templates.map((template, index) => (
                    <div
                      key={index}
                      className="template-thumbnail-container"
                      onClick={() => handlePreview(template, true)}
                    >
                      <div
                        className="template-thumbnail"
                        style={{
                          backgroundColor: template.bgColor || "#ffffff",
                          border: "1px solid #ccc",
                          padding: "10px",
                          margin: "10px",
                          borderRadius: "6px",
                          width: "250px",
                          height: "250px",
                          overflow: "scroll",
                          cursor: "pointer",
                        }}
                      >
                        {template.previewContent?.map((item, idx) => (
                          <div
                            key={idx}
                            style={{ fontSize: "12px", marginBottom: "6px" }}
                          >
                            {/* Heading */}
                            {item.type === "head" && (
                              <div ref={dropdownRef}>
                                <p className="border" style={item.style}>
                                  {item.content}
                                </p>
                              </div>
                            )}

                            {/* Paragraph */}
                            {item.type === "para" && (
                              <div className="border para-container">
                                <p
                                  className="border-para para-gallery"
                                  contentEditable
                                  suppressContentEditableWarning
                                  onClick={() => {
                                    setSelectedIndex(index);
                                    setIsModalOpen(true); // Open the modal
                                  }}
                                  style={item.style}
                                  dangerouslySetInnerHTML={{
                                    __html: item.content,
                                  }}
                                />
                              </div>
                            )}

                            {/* Image */}
                            {item.type === "image" && (
                              <div className="border">
                                <img
                                  src={
                                    item.src 
                                  }
                                  alt="Preview"
                                  className="img gallery-img-image"
                                  style={item.style}
                                />
                              </div>
                            )}

                            {/* Banner*/}
                            {item.type === "banner" && (
                              <div className="border">
                                <img
                                  src={
                                    item.src 
                                  }
                                  alt="Preview"
                                  className="img gallery-img-banner"
                                  style={item.style}
                                />
                              </div>
                            )}

                            {/* Button */}
                            {item.type === "button" && (
                              <div className="border-btn">
                                <div className="border-btn">
                                  <a
                                    href={item.link || "#"}
                                    target={
                                      item.buttonType === "link"
                                        ? "_blank"
                                        : undefined
                                    }
                                    rel="noopener noreferrer"
                                    style={item.style}
                                    className="button-preview btn-gallery-whole"
                                  >
                                    {item.content ||
                                      (item.buttonType === "whatsapp"
                                        ? "Connect on WhatsApp"
                                        : item.buttonType === "contact"
                                        ? "Call Now"
                                        : "Visit Link")}
                                  </a>
                                </div>
                              </div>
                            )}

                           

                            {/* Link */}
                            {item.type === "link-image" && (
                              <div className="border">
                                <a
                                  href={item.link || "#"}
                                  onClick={(e) => handleLinkClick(e, index)}
                                >
                                  <img
                                    src={
                                      item.src 
                                    }
                                    alt="Editable"
                                    className="img gallery-img-image"
                                    style={item.style}
                                    onClick={() => handleopenFiles(index, 1)}
                                    title="Upload Image"
                                  />
                                </a>
                              </div>
                            )}

                            {/* Break Line */}
                            {item.type === "break" && (
                              <div className="border-break gallery-line">
                                <hr style={item.style} />
                              </div>
                            )}

                            {/* Gap/Spacing */}
                            {item.type === "gap" && (
                              <div className="border-break">
                                <div style={item.styles}></div>
                              </div>
                            )}
                           
                            {item.type === "cardimage" ? (
                              <div
                                className="card-image-container"
                                style={item.style1}
                              >
                                <img
                                  src={
                                    item.src1 
                                  }
                                  style={item.style}
                                  alt="Editable"
                                  className="card-image"
                                  title="Upload Image"
                                  onClick={() => handleopenFiles(index, 1)}
                                />
                                <p
                                  className="card-text"
                                  contentEditable
                                  suppressContentEditableWarning
                                  onClick={
                                    () => {
                                      setModalIndex(index);
                                      setIsModalOpen(true);
                                    } // Open the modal
                                  } // Open modal for this index
                                  style={item.style}
                                  dangerouslySetInnerHTML={{
                                    __html: item.content1,
                                  }}
                                />
                              </div>
                            ) : null}

                            {/* Logo */}
                            {item.type === "logo" && (
                              <div className="border">
                                <img
                                  src={
                                    item.src 
                                  }
                                  alt="Editable"
                                  className="logo gallery-img"
                                  style={item.style}
                                  onClick={() => handleopenFiles(index, 1)}
                                  title="Upload Image"
                                />
                              </div>
                            )}

                            {/* Image with Text */}
                            {item.type === "imagewithtext" && (
                              <div className="image-text-container">
                                <div
                                  className="image-text-wrapper"
                                  id="gallery-imagewithtext"
                                  style={item.style1}
                                >
                                  <img
                                    src={
                                      item.src1 
                                    }
                                    alt="Preview"
                                    className="image-item gallery-img-text-img"
                                  />
                                  <p
                                    className="text-item gallery-text-img"
                                    style={item.style}
                                  >
                                    {item.content1}
                                  </p>
                                </div>
                              </div>
                            )}

                            {/* Text with Image */}
                            {item.type === "textwithimage" && (
                              <div className="image-text-container">
                                <div
                                  className="image-text-wrapper"
                                  id="gallery-imagewithtext"
                                  style={item.style}
                                >
                                  <p
                                    className="text-item gallery-text-img"
                                    style={item.style}
                                  >
                                    {item.content2}
                                  </p>
                                  <img
                                    src={
                                      item.src2 
                                    }
                                    alt="Preview"
                                    className="image-item gallery-img-text-img"
                                  />
                                </div>
                              </div>
                            )}

                            {item.type === "multi-image" ? (
                              <div className="Layout-img">
                                <div className="Layout multi-gallery">
                                  <img
                                    src={
                                      item.src1 
                                    }
                                    alt="Editable"
                                    className="multiimg gallery-img-multi"
                                    title="Upload Image 240 x 240"
                                    style={item.style}
                                    onClick={() => handleopenFiles(index, 1)}
                                  />
                                  <a
                                    href={item.link1}
                                    target="_blank"
                                    className="button-preview btn-gallery"
                                    rel="noopener noreferrer"
                                    style={item.buttonStyle1}
                                  >
                                    {item.content1}
                                  </a>
                                </div>

                                <div className="Layout multi-gallery">
                                  <img
                                    src={
                                      item.src2 
                                    }
                                    alt="Editable"
                                    className="multiimg gallery-img-multi"
                                    title="Upload Image 240 x 240"
                                    style={item.style}
                                    onClick={() => handleopenFiles(index, 2)}
                                  />
                                  <a
                                    href={item.link2}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="button-preview btn-gallery"
                                    style={item.buttonStyle2}
                                  >
                                    {item.content2}
                                  </a>
                                </div>
                              </div>
                            ) : null}

                            {/* Multi Image Card */}
                            {item.type === "multi-image-card" && (
                              <div className="Layout-img">
                                <div className="Layout multi-gallery">
                                  <img
                                    src={
                                      item.src1 
                                    }
                                    alt="Preview"
                                    className="multiimgcard gallery-img-multi"
                                    style={item.style}
                                  />
                                  <h3 className="card-text-image text-card">
                                    {item.title1 || " "}
                                  </h3>
                                  <p>
                                    <s>
                                      {item.originalPrice1
                                        ? `₹${item.originalPrice1}`
                                        : " "}
                                    </s>
                                  </p>
                                  <p>
                                    {item.offerPrice1
                                      ? `Off Price ₹${item.offerPrice1}`
                                      : " "}
                                  </p>
                                  <a
                                    href={item.link1}
                                    className="button-preview btn-gallery"
                                    style={item.buttonStyle1}
                                  >
                                    {item.content1}
                                  </a>
                                </div>

                                <div className="Layout multi-gallery">
                                  <img
                                    src={
                                      item.src2 
                                    }
                                    alt="Preview"
                                    className="multiimgcard"
                                    style={item.style}
                                  />
                                  <h3 className="card-text-image text-card">
                                    {item.title2 || " "}
                                  </h3>
                                  <p>
                                    <s>
                                      {item.originalPrice2
                                        ? `₹${item.originalPrice2}`
                                        : " "}
                                    </s>
                                  </p>
                                  <p>
                                    {item.offerPrice2
                                      ? `Off Price ₹${item.offerPrice2}`
                                      : " "}
                                  </p>
                                  <a
                                    href={item.link2}
                                    className="button-preview btn-gallery"
                                    style={item.buttonStyle2}
                                  >
                                    {item.content2}
                                  </a>
                                </div>
                              </div>
                            )}

                            {/* Multiple Images */}
                            {item.type === "multipleimage" && (
                              <div className="Layout-img">
                                <div className="Layout multi-gallery">
                                  <img
                                    src={
                                      item.src1 
                                    }
                                    alt="Preview"
                                    className="multiple-img gallery-img-multi"
                                    style={item.style}
                                  />
                                </div>
                                <div className="Layout multi-gallery">
                                  <img
                                    src={
                                      item.src2 
                                    }
                                    alt="Preview"
                                    className="multiple-img gallery-img-multi"
                                    style={item.style}
                                  />
                                </div>
                              </div>
                            )}

                            {/* Video Icon */}
                            {item.type === "video-icon" && (
                              <div className="video-icon">
                                <img
                                  src={
                                    item.src1 
                                  }
                                  alt="Preview"
                                  className="videoimg video-img"
                                  style={item.style}
                                />
                                <a href={item.link}>
                                  <img
                                    src={item.src2}
                                    className="video-btn"
                                    alt="Play"
                                  />
                                </a>
                              </div>
                            )}

                            {/* Social Icons */}
                            {item.type === "icons" && (
                              <div className="border" style={item.ContentStyle}>
                                <div className="icon-containers">
                                  <a href={item.links1 || "#"}>
                                    <img
                                      src={item.iconsrc1}
                                      alt="Social"
                                      className="icon"
                                      style={item.style1}
                                    />
                                  </a>
                                  <a href={item.links2 || "#"}>
                                    <img
                                      src={item.iconsrc2}
                                      alt="Social"
                                      className="icon"
                                      style={item.style2}
                                    />
                                  </a>
                                  <a href={item.links3 || "#"}>
                                    <img
                                      src={item.iconsrc3}
                                      alt="Social"
                                      className="icon"
                                      style={item.style3}
                                    />
                                  </a>
                                  <a href={item.links4 || "#"}>
                                    <img
                                      src={item.iconsrc4}
                                      alt="Social"
                                      className="icon"
                                      style={item.style4}
                                    />
                                  </a>
                                </div>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                      <div className="template-name">
                        <input
                          type="checkbox"
                          checked={selectedTemplates.includes(template._id)}
                          onClick={(e) => e.stopPropagation()} // stop click bubbling
                          onChange={() => handleSelectTemplate(template._id)} // handle state
                          className="template-checkbox"
                        />

                        <h4>{template.temname}</h4>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Modal for birthday template Details */}
          {showbirthtemModal && (
            <div className="modal-overlay-tem">
              <div className="modal-content-tem">
                <div className="modal-nav-previews">
                  <h2>Saved Birthday Templates</h2>
                  <button
                    className="close-button-tem"
                    onClick={handlebirthtemclose}
                  >
                    x
                  </button>
                </div>
                <div className="template-actions-delete">
                  <p className="select-all-tem">
                    <input
                      type="checkbox"
                      checked={selectAll}
                      onChange={handleSelectAll}
                    />{" "}
                    Select All
                  </p>
                  <button
                    onClick={() => {
                      if (selectedTemplates.length === 0) {
                        toast.warning("No template selected for deletion.");
                      } else {
                        setShowDeleteModalbirthtemall(true);
                      }
                    }}
                    className="delete-all-btn-tem"
                  >
                    <FaTrash />
                  </button>
                </div>

                <div className="saved-template-gallery">
                  {birthtemplates.map((template, index) => (
                    <div
                      key={index}
                      className="template-thumbnail-container"
                      onClick={() => handlePreview(template, false)}
                    >
                      <div
                        className="template-thumbnail"
                        style={{
                          backgroundColor: template.bgColor || "#ffffff",
                          border: "1px solid #ccc",
                          padding: "10px",
                          margin: "10px",
                          borderRadius: "6px",
                          width: "250px",
                          height: "250px",
                          overflow: "scroll",
                          cursor: "pointer",
                        }}
                      >
                        {template.previewContent?.map((item, idx) => (
                          <div
                            key={idx}
                            style={{ fontSize: "12px", marginBottom: "6px" }}
                          >
                            {/* Heading */}
                            {item.type === "head" && (
                              <div ref={dropdownRef}>
                                <p className="border" style={item.style}>
                                  {item.content}
                                </p>
                              </div>
                            )}

                            {/* Paragraph */}
                            {item.type === "para" && (
                              <div className="border para-container">
                                <p
                                  className="border-para para-gallery"
                                  contentEditable
                                  suppressContentEditableWarning
                                  onClick={() => {
                                    setSelectedIndex(index);
                                    setIsModalOpen(true); // Open the modal
                                  }}
                                  style={item.style}
                                  dangerouslySetInnerHTML={{
                                    __html: item.content,
                                  }}
                                />
                              </div>
                            )}

                            {/* Image */}
                            {item.type === "image" && (
                              <div className="border">
                                <img
                                  src={
                                    item.src 
                                  }
                                  alt="Preview"
                                  className="img gallery-img-image"
                                  style={item.style}
                                />
                              </div>
                            )}

                            {/* Banner*/}
                            {item.type === "banner" && (
                              <div className="border">
                                <img
                                  src={
                                    item.src 
                                  }
                                  alt="Preview"
                                  className="img gallery-img-banner"
                                  style={item.style}
                                />
                              </div>
                            )}

                            {/* Button */}
                            {item.type === "button" && (
                              <div className="border-btn">
                                <div className="border-btn">
                                  <a
                                    href={item.link || "#"}
                                    target={
                                      item.buttonType === "link"
                                        ? "_blank"
                                        : undefined
                                    }
                                    rel="noopener noreferrer"
                                    style={item.style}
                                    className="button-preview btn-gallery-whole"
                                  >
                                    {item.content ||
                                      (item.buttonType === "whatsapp"
                                        ? "Connect on WhatsApp"
                                        : item.buttonType === "contact"
                                        ? "Call Now"
                                        : "Visit Link")}
                                  </a>
                                </div>
                              </div>
                            )}

                           

                            {/* Link */}
                            {item.type === "link-image" && (
                              <div className="border">
                                <a
                                  href={item.link || "#"}
                                  onClick={(e) => handleLinkClick(e, index)}
                                >
                                  <img
                                    src={
                                      item.src 
                                    }
                                    alt="Editable"
                                    className="img gallery-img-image"
                                    style={item.style}
                                    onClick={() => handleopenFiles(index, 1)}
                                    title="Upload Image"
                                  />
                                </a>
                              </div>
                            )}

                            {/* Break Line */}
                            {item.type === "break" && (
                              <div className="border-break gallery-line">
                                <hr style={item.style} />
                              </div>
                            )}

                            {/* Gap/Spacing */}
                            {item.type === "gap" && (
                              <div className="border-break">
                                <div style={item.styles}></div>
                              </div>
                            )}
                           

                            {item.type === "cardimage" ? (
                              <div
                                className="card-image-container"
                                style={item.style1}
                              >
                                <img
                                  src={
                                    item.src1 
                                  }
                                  style={item.style}
                                  alt="Editable"
                                  className="card-image"
                                  title="Upload Image"
                                  onClick={() => handleopenFiles(index, 1)}
                                />
                                <p
                                  className="card-text"
                                  contentEditable
                                  suppressContentEditableWarning
                                  onClick={
                                    () => {
                                      setModalIndex(index);
                                      setIsModalOpen(true);
                                    } // Open the modal
                                  } // Open modal for this index
                                  style={item.style}
                                  dangerouslySetInnerHTML={{
                                    __html: item.content1,
                                  }}
                                />
                              </div>
                            ) : null}

                            {/* Logo */}
                            {item.type === "logo" && (
                              <div className="border">
                                <img
                                  src={
                                    item.src 
                                  }
                                  alt="Editable"
                                  className="logo gallery-img"
                                  style={item.style}
                                  onClick={() => handleopenFiles(index, 1)}
                                  title="Upload Image"
                                />
                              </div>
                            )}

                            {/* Image with Text */}
                            {item.type === "imagewithtext" && (
                              <div className="image-text-container">
                                <div
                                  className="image-text-wrapper"
                                  id="gallery-imagewithtext"
                                  style={item.style1}
                                >
                                  <img
                                    src={
                                      item.src1 
                                    }
                                    alt="Preview"
                                    className="image-item gallery-img-text-img"
                                  />
                                  <p
                                    className="text-item gallery-text-img"
                                    style={item.style}
                                  >
                                    {item.content1}
                                  </p>
                                </div>
                              </div>
                            )}

                            {/* Text with Image */}
                            {item.type === "textwithimage" && (
                              <div className="image-text-container">
                                <div
                                  className="image-text-wrapper"
                                  id="gallery-imagewithtext"
                                  style={item.style}
                                >
                                  <p
                                    className="text-item gallery-text-img"
                                    style={item.style}
                                  >
                                    {item.content2}
                                  </p>
                                  <img
                                    src={
                                      item.src2 
                                    }
                                    alt="Preview"
                                    className="image-item gallery-img-text-img"
                                  />
                                </div>
                              </div>
                            )}

                            {item.type === "multi-image" ? (
                              <div className="Layout-img">
                                <div className="Layout multi-gallery">
                                  <img
                                    src={
                                      item.src1 
                                    }
                                    alt="Editable"
                                    className="multiimg gallery-img-multi"
                                    title="Upload Image 240 x 240"
                                    style={item.style}
                                    onClick={() => handleopenFiles(index, 1)}
                                  />
                                  <a
                                    href={item.link1}
                                    target="_blank"
                                    className="button-preview btn-gallery"
                                    rel="noopener noreferrer"
                                    style={item.buttonStyle1}
                                  >
                                    {item.content1}
                                  </a>
                                </div>

                                <div className="Layout multi-gallery">
                                  <img
                                    src={
                                      item.src2 
                                    }
                                    alt="Editable"
                                    className="multiimg gallery-img-multi"
                                    title="Upload Image 240 x 240"
                                    style={item.style}
                                    onClick={() => handleopenFiles(index, 2)}
                                  />
                                  <a
                                    href={item.link2}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="button-preview btn-gallery"
                                    style={item.buttonStyle2}
                                  >
                                    {item.content2}
                                  </a>
                                </div>
                              </div>
                            ) : null}

                            {/* Multi Image Card */}
                            {item.type === "multi-image-card" && (
                              <div className="Layout-img">
                                <div className="Layout multi-gallery">
                                  <img
                                    src={
                                      item.src1 
                                    }
                                    alt="Preview"
                                    className="multiimgcard gallery-img-multi"
                                    style={item.style}
                                  />
                                  <h3 className="card-text-image text-card">
                                    {item.title1 || " "}
                                  </h3>
                                  <p>
                                    <s>
                                      {item.originalPrice1
                                        ? `₹${item.originalPrice1}`
                                        : " "}
                                    </s>
                                  </p>
                                  <p>
                                    {item.offerPrice1
                                      ? `Off Price ₹${item.offerPrice1}`
                                      : " "}
                                  </p>
                                  <a
                                    href={item.link1}
                                    className="button-preview btn-gallery"
                                    style={item.buttonStyle1}
                                  >
                                    {item.content1}
                                  </a>
                                </div>

                                <div className="Layout multi-gallery">
                                  <img
                                    src={
                                      item.src2 
                                    }
                                    alt="Preview"
                                    className="multiimgcard"
                                    style={item.style}
                                  />
                                  <h3 className="card-text-image text-card">
                                    {item.title2 || " "}
                                  </h3>
                                  <p>
                                    <s>
                                      {item.originalPrice2
                                        ? `₹${item.originalPrice2}`
                                        : " "}
                                    </s>
                                  </p>
                                  <p>
                                    {item.offerPrice2
                                      ? `Off Price ₹${item.offerPrice2}`
                                      : " "}
                                  </p>
                                  <a
                                    href={item.link2}
                                    className="button-preview btn-gallery"
                                    style={item.buttonStyle2}
                                  >
                                    {item.content2}
                                  </a>
                                </div>
                              </div>
                            )}

                            {/* Multiple Images */}
                            {item.type === "multipleimage" && (
                              <div className="Layout-img">
                                <div className="Layout multi-gallery">
                                  <img
                                    src={
                                      item.src1 
                                    }
                                    alt="Preview"
                                    className="multiple-img gallery-img-multi"
                                    style={item.style}
                                  />
                                </div>
                                <div className="Layout multi-gallery">
                                  <img
                                    src={
                                      item.src2 
                                    }
                                    alt="Preview"
                                    className="multiple-img gallery-img-multi"
                                    style={item.style}
                                  />
                                </div>
                              </div>
                            )}

                            {/* Video Icon */}
                            {item.type === "video-icon" && (
                              <div className="video-icon">
                                <img
                                  src={
                                    item.src1 
                                  }
                                  alt="Preview"
                                  className="videoimg video-img"
                                  style={item.style}
                                />
                                <a href={item.link}>
                                  <img
                                    src={item.src2}
                                    className="video-btn"
                                    alt="Play"
                                  />
                                </a>
                              </div>
                            )}

                            {/* Social Icons */}
                            {item.type === "icons" && (
                              <div className="border" style={item.ContentStyle}>
                                <div className="icon-containers">
                                  <a href={item.links1 || "#"}>
                                    <img
                                      src={item.iconsrc1}
                                      alt="Social"
                                      className="icon"
                                      style={item.style1}
                                    />
                                  </a>
                                  <a href={item.links2 || "#"}>
                                    <img
                                      src={item.iconsrc2}
                                      alt="Social"
                                      className="icon"
                                      style={item.style2}
                                    />
                                  </a>
                                  <a href={item.links3 || "#"}>
                                    <img
                                      src={item.iconsrc3}
                                      alt="Social"
                                      className="icon"
                                      style={item.style3}
                                    />
                                  </a>
                                  <a href={item.links4 || "#"}>
                                    <img
                                      src={item.iconsrc4}
                                      alt="Social"
                                      className="icon"
                                      style={item.style4}
                                    />
                                  </a>
                                </div>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                      <div className="template-name">
                        <input
                          type="checkbox"
                          checked={selectedTemplates.includes(template._id)}
                          onClick={(e) => e.stopPropagation()} // stop click bubbling
                          onChange={() => handleSelectTemplate(template._id)} // handle state
                          className="template-checkbox"
                        />
                        <h4>{template.temname}</h4>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
          {/* show templates in automation */}
          {isPreviewOpenauto && (
            <div className="preview-modal-overlay-tem">
              <div className="preview-modal-content-tem">
                <div className="modal-nav-previews-temps">
                  {selectedTemplatepre && (
                    <h3 className="temname">
                      {selectedTemplatepre.temname} Preview
                    </h3>
                  )}
                  <button
                    className="close-modal-read-pre"
                    onClick={handleCloseModalpreauto}
                  >
                    x
                  </button>
                </div>
                <div>
                  <div
                    style={{
                      backgroundColor: bgColortem,
                      borderRadius: "10px",
                      pointerEvents: "none",
                    }}
                  >
                    {previewContenttem.map((item, index) => {
                      if (!item || !item.type) return null;
                      return (
                        <div
                          className="content-item-preview"
                          style={item.style}
                          key={index}
                        >
                          {item.type === "para" && (
                            <>
                              <p
                                className="border"
                                contentEditable
                                suppressContentEditableWarning
                                onClick={() => {
                                  setSelectedIndex(index);
                                  setSelectedContent(item.content); // Store the correct content
                                  setIsModalOpen(true); // Open the modal
                                }}
                                style={item.style}
                                dangerouslySetInnerHTML={{
                                  __html: item.content,
                                }}
                              />
                              {isModalOpen && selectedIndex === index && (
                                <ParaEditor
                                  isOpen={isModalOpen}
                                  content={selectedContent} // Pass the correct content
                                  style={item.style}
                                  onSave={(newContent) => {
                                    updateContent(index, {
                                      content: newContent,
                                    }); // Save the new content
                                    setIsModalOpen(false);
                                  }}
                                  onClose={() => setIsModalOpen(false)}
                                />
                              )}
                            </>
                          )}

                          {item.type === "multi-image-card" ? (
                            <div className="Layout-img">
                              <div className="Layout">
                                <img
                                  src={
                                    item.src1 
                                  }
                                  alt="Editable"
                                  className="multiimgcard"
                                  title="Upload Image"
                                  style={item.style}
                                  onClick={() => handleopenFiles(index, 1)}
                                />
                                <h3 className="card-text-image">
                                  {item.title1 || " "}
                                </h3>
                                <p>
                                  <s>
                                    {item.originalPrice1
                                      ? `₹${item.originalPrice1}`
                                      : " "}
                                  </s>
                                </p>
                                <p>
                                  {item.offerPrice1
                                    ? `Off Price ₹${item.offerPrice1}`
                                    : " "}
                                </p>
                                <a
                                  href={item.link1}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="button-preview"
                                  style={item.buttonStyle1}
                                >
                                  {item.content1}
                                </a>
                              </div>

                              <div className="Layout">
                                <img
                                  src={
                                    item.src2 
                                  }
                                  alt="Editable"
                                  className="multiimgcard"
                                  title="Upload Image"
                                  style={item.style}
                                  onClick={() => handleopenFiles(index, 2)}
                                />
                                <h3 className="card-text-image">
                                  {item.title2 || " "}
                                </h3>
                                <p>
                                  <s>
                                    {item.originalPrice2
                                      ? `₹${item.originalPrice2}`
                                      : " "}
                                  </s>
                                </p>
                                <p>
                                  {item.offerPrice2
                                    ? `Off Price ₹${item.offerPrice2}`
                                    : " "}
                                </p>
                                <a
                                  href={item.link2}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="button-preview"
                                  style={item.buttonStyle2}
                                >
                                  {item.content2}
                                </a>
                              </div>
                            </div>
                          ) : null}

                          {item.type === "multipleimage" ? (
                            <div className="Layout-img">
                              <div className="Layout">
                                <img
                                  src={
                                    item.src1 
                                  }
                                  alt="Editable"
                                  className="multiple-img"
                                  title="Upload Image"
                                  style={item.style}
                                  onClick={() => handleopenFiles(index, 1)}
                                />
                              </div>

                              <div className="Layout">
                                <img
                                  src={
                                    item.src2 
                                  }
                                  alt="Editable"
                                  className="multiple-img"
                                  title="Upload Image"
                                  style={item.style}
                                  onClick={() => handleopenFiles(index, 2)}
                                />
                              </div>
                            </div>
                          ) : null}

                          {item.type === "multi-image" ? (
                            <div className="Layout-img">
                              <div className="Layout">
                                <img
                                  src={
                                    item.src1 
                                  }
                                  alt="Editable"
                                  className="multiimg"
                                  title="Upload Image"
                                  style={item.style}
                                  onClick={() => handleopenFiles(index, 1)}
                                />
                                <a
                                  href={item.link1}
                                  target="_blank"
                                  className="button-preview"
                                  rel="noopener noreferrer"
                                  style={item.buttonStyle1}
                                >
                                  {item.content1}
                                </a>
                              </div>

                              <div className="Layout">
                                <img
                                  src={
                                    item.src2 
                                  }
                                  alt="Editable"
                                  className="multiimg"
                                  title="Upload Image"
                                  style={item.style}
                                  onClick={() => handleopenFiles(index, 2)}
                                />
                                <a
                                  href={item.link2}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="button-preview"
                                  style={item.buttonStyle2}
                                >
                                  {item.content2}
                                </a>
                              </div>
                            </div>
                          ) : null}

                          {item.type === "video-icon" ? (
                            <div className="video-icon">
                              <img
                                src={
                                  item.src1 
                                }
                                alt="Editable"
                                className="videoimg"
                                title="Upload Thumbnail Image"
                                style={item.style}
                                onClick={() => handleopenFiles(index, 1)}
                              />
                              <a
                                href={item.link}
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                <img
                                  src={item.src2}
                                  className="video-btn"
                                  alt="icon"
                                />
                              </a>
                            </div>
                          ) : null}

                          {item.type === "cardimage" ? (
                            <div
                              className="card-image-container"
                              style={item.style1}
                            >
                              <img
                                src={
                                  item.src1 
                                }
                                style={item.style}
                                alt="Editable"
                                className="card-image"
                                title="Upload Image"
                                onClick={() => handleopenFiles(index, 1)}
                              />
                              <p
                                className="card-text"
                                contentEditable
                                suppressContentEditableWarning
                                //  onClick={() => setModalIndex(index)} // Open modal for this index
                                style={item.style}
                                dangerouslySetInnerHTML={{
                                  __html: item.content1,
                                }}
                              />

                              {modalIndex === index && ( // Open only for the selected index
                                <ParaEditor
                                  isOpen={true}
                                  content={item.content1}
                                  onSave={(newContent) => {
                                    updateContent(index, {
                                      content1: newContent,
                                    });
                                    setModalIndex(null); // Close modal after save
                                  }}
                                  onClose={() => setModalIndex(null)}
                                />
                              )}
                            </div>
                          ) : null}

                          {item.type === "head" && (
                            <div ref={dropdownRef}>
                              <p
                                className="border"
                                contentEditable
                                suppressContentEditableWarning
                                onBlur={(e) =>
                                  updateContent(index, {
                                    content: e.target.textContent,
                                  })
                                }
                                onMouseUp={(e) =>
                                  handleCursorPosition(e, index)
                                }
                                onSelect={(e) => handleCursorPosition(e, index)}
                                style={item.style}
                              >
                                {item.content}
                              </p>

                              {/* Local state for each heading */}
                              <div className="select-group-container">
                                {/* Select Group */}
                                {/* <select
                                  onChange={(e) => handleGroupChange(e, index)}
                                  value={selectedGroup[index] || ""}
                                  className="select-variable"
                                >
                                  <option
                                                         value=""
                                                         disabled
                                                         className="template-title"
                                                       >
                                                         Add Variable
                                                       </option> 
                                  <option value="" disabled>
                                    Select Group
                                  </option>
                                  {groups.map((group, idx) => (
                                    <option key={idx} value={group._id}>
                                      {group.name}
                                    </option>
                                  ))}
                                </select> */}

                                {/* Show fields only for the selected heading */}
                                {selectedGroup[index] &&
                                  openedGroups[index] && (
                                    <div className="dropdown-container">
                                      <p className="template-title">
                                        <span>Add</span> Variable
                                      </p>
                                      {fieldNames[index] &&
                                      fieldNames[index].length > 0 ? (
                                        <div>
                                          {fieldNames[index].map(
                                            (field, idx) => (
                                              <div
                                                className="list-field"
                                                key={idx}
                                                onClick={() =>
                                                  handleInsertName(
                                                    index,
                                                    `{${field}}`
                                                  )
                                                }
                                              >
                                                {field}
                                              </div>
                                            )
                                          )}
                                        </div>
                                      ) : (
                                        <p className="no-variables">
                                          No Variables
                                        </p>
                                      )}
                                    </div>
                                  )}
                              </div>
                            </div>
                          )}
                          {item.type === "link-image" && (
                            <div className="border">
                              <a
                                href={item.link || "#"}
                                onClick={(e) => handleLinkClick(e, index)}
                              >
                                <img
                                  src={
                                    item.src 
                                  }
                                  alt="Editable"
                                  className="img"
                                  style={item.style}
                                  onClick={() => handleopenFiles(index, 1)}
                                  title="Upload Image"
                                />
                              </a>
                            </div>
                          )}
                          {item.type === "image" && (
                            <div className="border">
                              <img
                                src={
                                  item.src 
                                }
                                alt="Editable"
                                className="img"
                                style={item.style}
                                onClick={() => handleopenFiles(index, 1)}
                                title="Upload Image"
                              />
                            </div>
                          )}

                          {item.type === "icons" && (
                            <div
                              className="border"
                              style={item.ContentStyle}
                              key={index}
                            >
                              <div className="icon-containers">
                                <a
                                  href={item.links1 || "#"}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  onClick={(e) =>
                                    handleLinksClick2(e, item.links1)
                                  }
                                >
                                  <img
                                    src={item.iconsrc1}
                                    alt="Facebook"
                                    className="icon"
                                    style={item.style1}
                                  />
                                </a>

                                <a
                                  href={item.links2 || "#"}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  onClick={(e) =>
                                    handleLinksClick2(e, item.links2)
                                  }
                                >
                                  <img
                                    src={item.iconsrc2}
                                    alt="Twitter"
                                    className="icon"
                                    rel="noopener noreferrer"
                                    style={item.style2}
                                  />
                                </a>

                                <a
                                  href={item.links3 || "#"}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  onClick={(e) =>
                                    handleLinksClick2(e, item.links3)
                                  }
                                >
                                  <img
                                    src={item.iconsrc3}
                                    alt="Instagram"
                                    className="icon"
                                    style={item.style3}
                                  />
                                </a>

                                <a
                                  href={item.links4 || "#"}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  onClick={(e) =>
                                    handleLinksClick2(e, item.links4)
                                  }
                                >
                                  <img
                                    src={item.iconsrc4}
                                    alt="Youtube"
                                    className="icon"
                                    style={item.style4}
                                  />
                                </a>
                              </div>
                            </div>
                          )}
                          {item.type === "break" && (
                            <div className="border-break">
                              <hr style={item.style} />
                            </div>
                          )}

                          {item.type === "gap" && (
                            <div className="border-break">
                              {<div style={item.styles}></div>}
                            </div>
                          )}

                          {item.type === "imagewithtext" ? (
                            <div className="image-text-container">
                              <div
                                className="image-text-wrapper"
                                style={item.style1}
                              >
                                <img
                                  src={
                                    item.src1 
                                  }
                                  alt="Editable"
                                  className="image-item"
                                  title="Upload Image"
                                  onClick={() => handleopenFiles(index, 1)}
                                />
                                <p
                                  className="text-item"
                                  contentEditable
                                  suppressContentEditableWarning
                                  onClick={() => setModalIndex(index)} // Open modal for this index
                                  style={item.style}
                                  dangerouslySetInnerHTML={{
                                    __html: item.content1,
                                  }}
                                />
                              </div>
                              {modalIndex === index && ( // Open only for the selected index
                                <ParaEditor
                                  isOpen={true}
                                  content={item.content1}
                                  onSave={(newContent) => {
                                    updateContent(index, {
                                      content1: newContent,
                                    });
                                    setModalIndex(null); // Close modal after save
                                  }}
                                  onClose={() => setModalIndex(null)}
                                />
                              )}
                            </div>
                          ) : null}

                          {item.type === "banner" && (
                            <div className="border">
                              <img
                                src={
                                  item.src 
                                }
                                alt="Editable"
                                className="img"
                                style={item.style}
                                onClick={() => handleopenFiles(index, 1)}
                              />
                            </div>
                          )}

                          {item.type === "textwithimage" ? (
                            <div className="image-text-container">
                              <div
                                className="image-text-wrapper"
                                style={item.style}
                              >
                                <p
                                  className="text-item"
                                  contentEditable
                                  suppressContentEditableWarning
                                  onClick={() => setModalIndex(index)} // Open modal for this index
                                  style={item.style}
                                  dangerouslySetInnerHTML={{
                                    __html: item.content2,
                                  }}
                                />
                                <img
                                  src={
                                    item.src2 
                                  }
                                  alt="Editable"
                                  className="image-item"
                                  title="Upload Image"
                                  onClick={() => handleopenFiles(index, 2)}
                                />
                              </div>
                              {modalIndex === index && ( // Open only for the selected index
                                <ParaEditor
                                  isOpen={true}
                                  content={item.content2}
                                  onSave={(newContent) => {
                                    updateContent(index, {
                                      content2: newContent,
                                    });
                                    setModalIndex(null); // Close modal after save
                                  }}
                                  onClose={() => setModalIndex(null)}
                                />
                              )}
                            </div>
                          ) : null}

                          {item.type === "logo" && (
                            <div className="border">
                              <img
                                src={
                                  item.src 
                                }
                                alt="Editable"
                                className="logo"
                                style={item.style}
                                onClick={() => handleopenFiles(index, 1)}
                                title="Upload Image"
                              />
                            </div>
                          )}
                          {item.type === "button" && (
                            <div className="border-btn">
                              <a
                                href={item.link || "#"}
                                target="_blank"
                                rel="noopener noreferrer"
                                style={item.style}
                                className="button-preview"
                              >
                                {item.content}
                              </a>
                            </div>
                          )}
                          {item.type === "link" && (
                            <div className="border-btn">
                              <a
                                href={item.href || "#"}
                                onClick={(e) => handleLinkClick(e, index)}
                                style={item.style}
                              >
                                {item.content}
                              </a>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
                <div className="prev-select-btn">
                  <button
                    onClick={() => setIsPreviewOpenauto(false)}
                    className="preview-create-button"
                  >
                    Select
                  </button>
                  <button
                    onClick={() => setIsPreviewOpenauto(false)}
                    className="preview-create-button"
                    style={{ backgroundColor: "#f48c06" }}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* show birthday templates in automation */}
          {isBirthPreviewOpen && (
            <div className="preview-modal-overlay-tem">
              <div className="preview-modal-content-tem">
                <div className="modal-nav-previews-temps">
                  {selectedTemplatepre && (
                    <h3 className="temname">
                      {selectedTemplatepre.temname} Preview
                    </h3>
                  )}
                  <button
                    className="close-modal-read-pre"
                    onClick={handleCloseModalprebirth}
                  >
                    x
                  </button>
                </div>
                <div>
                  <div
                    style={{
                      backgroundColor: bgColortem,
                      borderRadius: "10px",
                      pointerEvents: "none",
                    }}
                  >
                    {previewContenttem.map((item, index) => {
                      if (!item || !item.type) return null;
                      return (
                        <div
                          className="content-item-preview"
                          style={item.style}
                          key={index}
                        >
                          {item.type === "para" && (
                            <>
                              <p
                                className="border"
                                contentEditable
                                suppressContentEditableWarning
                                onClick={() => {
                                  setSelectedIndex(index);
                                  setSelectedContent(item.content); // Store the correct content
                                  setIsModalOpen(true); // Open the modal
                                }}
                                style={item.style}
                                dangerouslySetInnerHTML={{
                                  __html: item.content,
                                }}
                              />
                              {isModalOpen && selectedIndex === index && (
                                <ParaEditor
                                  isOpen={isModalOpen}
                                  content={selectedContent} // Pass the correct content
                                  style={item.style}
                                  onSave={(newContent) => {
                                    updateContent(index, {
                                      content: newContent,
                                    }); // Save the new content
                                    setIsModalOpen(false);
                                  }}
                                  onClose={() => setIsModalOpen(false)}
                                />
                              )}
                            </>
                          )}

                          {item.type === "multi-image-card" ? (
                            <div className="Layout-img">
                              <div className="Layout">
                                <img
                                  src={
                                    item.src1 
                                  }
                                  alt="Editable"
                                  className="multiimgcard"
                                  title="Upload Image"
                                  style={item.style}
                                  onClick={() => handleopenFiles(index, 1)}
                                />
                                <h3 className="card-text-image">
                                  {item.title1 || " "}
                                </h3>
                                <p>
                                  <s>
                                    {item.originalPrice1
                                      ? `₹${item.originalPrice1}`
                                      : " "}
                                  </s>
                                </p>
                                <p>
                                  {item.offerPrice1
                                    ? `Off Price ₹${item.offerPrice1}`
                                    : " "}
                                </p>
                                <a
                                  href={item.link1}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="button-preview"
                                  style={item.buttonStyle1}
                                >
                                  {item.content1}
                                </a>
                              </div>

                              <div className="Layout">
                                <img
                                  src={
                                    item.src2 
                                  }
                                  alt="Editable"
                                  className="multiimgcard"
                                  title="Upload Image"
                                  style={item.style}
                                  onClick={() => handleopenFiles(index, 2)}
                                />
                                <h3 className="card-text-image">
                                  {item.title2 || " "}
                                </h3>
                                <p>
                                  <s>
                                    {item.originalPrice2
                                      ? `₹${item.originalPrice2}`
                                      : " "}
                                  </s>
                                </p>
                                <p>
                                  {item.offerPrice2
                                    ? `Off Price ₹${item.offerPrice2}`
                                    : " "}
                                </p>
                                <a
                                  href={item.link2}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="button-preview"
                                  style={item.buttonStyle2}
                                >
                                  {item.content2}
                                </a>
                              </div>
                            </div>
                          ) : null}

                          {item.type === "multipleimage" ? (
                            <div className="Layout-img">
                              <div className="Layout">
                                <img
                                  src={
                                    item.src1 
                                  }
                                  alt="Editable"
                                  className="multiple-img"
                                  title="Upload Image"
                                  style={item.style}
                                  onClick={() => handleopenFiles(index, 1)}
                                />
                              </div>

                              <div className="Layout">
                                <img
                                  src={
                                    item.src2 
                                  }
                                  alt="Editable"
                                  className="multiple-img"
                                  title="Upload Image"
                                  style={item.style}
                                  onClick={() => handleopenFiles(index, 2)}
                                />
                              </div>
                            </div>
                          ) : null}

                          {item.type === "multi-image" ? (
                            <div className="Layout-img">
                              <div className="Layout">
                                <img
                                  src={
                                    item.src1 
                                  }
                                  alt="Editable"
                                  className="multiimg"
                                  title="Upload Image"
                                  style={item.style}
                                  onClick={() => handleopenFiles(index, 1)}
                                />
                                <a
                                  href={item.link1}
                                  target="_blank"
                                  className="button-preview"
                                  rel="noopener noreferrer"
                                  style={item.buttonStyle1}
                                >
                                  {item.content1}
                                </a>
                              </div>

                              <div className="Layout">
                                <img
                                  src={
                                    item.src2 
                                  }
                                  alt="Editable"
                                  className="multiimg"
                                  title="Upload Image"
                                  style={item.style}
                                  onClick={() => handleopenFiles(index, 2)}
                                />
                                <a
                                  href={item.link2}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="button-preview"
                                  style={item.buttonStyle2}
                                >
                                  {item.content2}
                                </a>
                              </div>
                            </div>
                          ) : null}

                          {item.type === "video-icon" ? (
                            <div className="video-icon">
                              <img
                                src={
                                  item.src1 
                                }
                                alt="Editable"
                                className="videoimg"
                                title="Upload Thumbnail Image"
                                style={item.style}
                                onClick={() => handleopenFiles(index, 1)}
                              />
                              <a
                                href={item.link}
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                <img
                                  src={item.src2}
                                  className="video-btn"
                                  alt="icon"
                                />
                              </a>
                            </div>
                          ) : null}

                          {item.type === "cardimage" ? (
                            <div
                              className="card-image-container"
                              style={item.style1}
                            >
                              <img
                                src={
                                  item.src1 
                                }
                                style={item.style}
                                alt="Editable"
                                className="card-image"
                                title="Upload Image"
                                onClick={() => handleopenFiles(index, 1)}
                              />
                              <p
                                className="card-text"
                                contentEditable
                                suppressContentEditableWarning
                                onClick={() => setModalIndex(index)} // Open modal for this index
                                style={item.style}
                                dangerouslySetInnerHTML={{
                                  __html: item.content1,
                                }}
                              />

                              {modalIndex === index && ( // Open only for the selected index
                                <ParaEditor
                                  isOpen={true}
                                  content={item.content1}
                                  onSave={(newContent) => {
                                    updateContent(index, {
                                      content1: newContent,
                                    });
                                    setModalIndex(null); // Close modal after save
                                  }}
                                  onClose={() => setModalIndex(null)}
                                />
                              )}
                            </div>
                          ) : null}

                          {item.type === "head" && (
                            <div ref={dropdownRef}>
                              <p
                                className="border"
                                contentEditable
                                suppressContentEditableWarning
                                onBlur={(e) =>
                                  updateContent(index, {
                                    content: e.target.textContent,
                                  })
                                }
                                onMouseUp={(e) =>
                                  handleCursorPosition(e, index)
                                }
                                onSelect={(e) => handleCursorPosition(e, index)}
                                style={item.style}
                              >
                                {item.content}
                              </p>

                              {/* Local state for each heading */}
                              <div className="select-group-container">
                                {/* Select Group */}
                                {/* <select
                                  onChange={(e) => handleGroupChange(e, index)}
                                  value={selectedGroup[index] || ""}
                                  className="select-variable"
                                >
                                   <option
                                                         value=""
                                                         disabled
                                                         className="template-title"
                                                       >
                                                         Add Variable
                                                       </option> 
                                  <option value="" disabled>
                                    Select Group
                                  </option>
                                  {groups.map((group, idx) => (
                                    <option key={idx} value={group._id}>
                                      {group.name}
                                    </option>
                                  ))}
                                </select> */}

                                {/* Show fields only for the selected heading */}
                                {selectedGroup[index] &&
                                  openedGroups[index] && (
                                    <div className="dropdown-container">
                                      <p className="template-title">
                                        <span>Add</span> Variable
                                      </p>
                                      {fieldNames[index] &&
                                      fieldNames[index].length > 0 ? (
                                        <div>
                                          {fieldNames[index].map(
                                            (field, idx) => (
                                              <div
                                                className="list-field"
                                                key={idx}
                                                onClick={() =>
                                                  handleInsertName(
                                                    index,
                                                    `{${field}}`
                                                  )
                                                }
                                              >
                                                {field}
                                              </div>
                                            )
                                          )}
                                        </div>
                                      ) : (
                                        <p className="no-variables">
                                          No Variables
                                        </p>
                                      )}
                                    </div>
                                  )}
                              </div>
                            </div>
                          )}
                          {item.type === "link-image" && (
                            <div className="border">
                              <a
                                href={item.link || "#"}
                                onClick={(e) => handleLinkClick(e, index)}
                              >
                                <img
                                  src={
                                    item.src 
                                  }
                                  alt="Editable"
                                  className="img"
                                  style={item.style}
                                  onClick={() => handleopenFiles(index, 1)}
                                  title="Upload Image"
                                />
                              </a>
                            </div>
                          )}
                          {item.type === "image" && (
                            <div className="border">
                              <img
                                src={
                                  item.src 
                                }
                                alt="Editable"
                                className="img"
                                style={item.style}
                                onClick={() => handleopenFiles(index, 1)}
                                title="Upload Image"
                              />
                            </div>
                          )}

                          {item.type === "icons" && (
                            <div
                              className="border"
                              style={item.ContentStyle}
                              key={index}
                            >
                              <div className="icon-containers">
                                <a
                                  href={item.links1 || "#"}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  onClick={(e) =>
                                    handleLinksClick2(e, item.links1)
                                  }
                                >
                                  <img
                                    src={item.iconsrc1}
                                    alt="Facebook"
                                    className="icon"
                                    style={item.style1}
                                  />
                                </a>

                                <a
                                  href={item.links2 || "#"}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  onClick={(e) =>
                                    handleLinksClick2(e, item.links2)
                                  }
                                >
                                  <img
                                    src={item.iconsrc2}
                                    alt="Twitter"
                                    className="icon"
                                    rel="noopener noreferrer"
                                    style={item.style2}
                                  />
                                </a>

                                <a
                                  href={item.links3 || "#"}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  onClick={(e) =>
                                    handleLinksClick2(e, item.links3)
                                  }
                                >
                                  <img
                                    src={item.iconsrc3}
                                    alt="Instagram"
                                    className="icon"
                                    style={item.style3}
                                  />
                                </a>

                                <a
                                  href={item.links4 || "#"}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  onClick={(e) =>
                                    handleLinksClick2(e, item.links4)
                                  }
                                >
                                  <img
                                    src={item.iconsrc4}
                                    alt="Youtube"
                                    className="icon"
                                    style={item.style4}
                                  />
                                </a>
                              </div>
                            </div>
                          )}
                          {item.type === "break" && (
                            <div className="border-break">
                              <hr style={item.style} />
                            </div>
                          )}

                          {item.type === "gap" && (
                            <div className="border-break">
                              {<div style={item.styles}></div>}
                            </div>
                          )}

                          {item.type === "imagewithtext" ? (
                            <div className="image-text-container">
                              <div
                                className="image-text-wrapper"
                                style={item.style1}
                              >
                                <img
                                  src={
                                    item.src1 
                                  }
                                  alt="Editable"
                                  className="image-item"
                                  title="Upload Image"
                                  onClick={() => handleopenFiles(index, 1)}
                                />
                                <p
                                  className="text-item"
                                  contentEditable
                                  suppressContentEditableWarning
                                  onClick={() => setModalIndex(index)} // Open modal for this index
                                  style={item.style}
                                  dangerouslySetInnerHTML={{
                                    __html: item.content1,
                                  }}
                                />
                              </div>
                              {modalIndex === index && ( // Open only for the selected index
                                <ParaEditor
                                  isOpen={true}
                                  content={item.content1}
                                  onSave={(newContent) => {
                                    updateContent(index, {
                                      content1: newContent,
                                    });
                                    setModalIndex(null); // Close modal after save
                                  }}
                                  onClose={() => setModalIndex(null)}
                                />
                              )}
                            </div>
                          ) : null}

                          {item.type === "banner" && (
                            <div className="border">
                              <img
                                src={
                                  item.src 
                                }
                                alt="Editable"
                                className="img"
                                style={item.style}
                                onClick={() => handleopenFiles(index, 1)}
                              />
                            </div>
                          )}

                          {item.type === "textwithimage" ? (
                            <div className="image-text-container">
                              <div
                                className="image-text-wrapper"
                                style={item.style}
                              >
                                <p
                                  className="text-item"
                                  contentEditable
                                  suppressContentEditableWarning
                                  onClick={() => setModalIndex(index)} // Open modal for this index
                                  style={item.style}
                                  dangerouslySetInnerHTML={{
                                    __html: item.content2,
                                  }}
                                />
                                <img
                                  src={
                                    item.src2 
                                  }
                                  alt="Editable"
                                  className="image-item"
                                  title="Upload Image"
                                  onClick={() => handleopenFiles(index, 2)}
                                />
                              </div>
                              {modalIndex === index && ( // Open only for the selected index
                                <ParaEditor
                                  isOpen={true}
                                  content={item.content2}
                                  onSave={(newContent) => {
                                    updateContent(index, {
                                      content2: newContent,
                                    });
                                    setModalIndex(null); // Close modal after save
                                  }}
                                  onClose={() => setModalIndex(null)}
                                />
                              )}
                            </div>
                          ) : null}

                          {item.type === "logo" && (
                            <div className="border">
                              <img
                                src={
                                  item.src 
                                }
                                alt="Editable"
                                className="logo"
                                style={item.style}
                                onClick={() => handleopenFiles(index, 1)}
                                title="Upload Image"
                              />
                            </div>
                          )}
                          {item.type === "button" && (
                            <div className="border-btn">
                              <a
                                href={item.link || "#"}
                                target="_blank"
                                rel="noopener noreferrer"
                                style={item.style}
                                className="button-preview"
                              >
                                {item.content}
                              </a>
                            </div>
                          )}
                          {item.type === "link" && (
                            <div className="border-btn">
                              <a
                                href={item.href || "#"}
                                onClick={(e) => handleLinkClick(e, index)}
                                style={item.style}
                              >
                                {item.content}
                              </a>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
                <div className="prev-select-btn">
                  <button
                    onClick={() => setIsBirthPreviewOpen(false)}
                    className="preview-create-button"
                    style={{ backgroundColor: "#f48c06" }}
                  >
                    Cancel
                  </button>
                  <button
                    className="preview-create-button"
                    onClick={() => {
                      setDeleteBirthTemplateId(selectedTemplatepre._id);
                      setShowBirthDeleteModal(true);
                    }}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          )}
          {showBirthDeleteModal && (
            <div
              style={{
                position: "fixed",
                top: 0,
                left: 0,
                width: "100vw",
                height: "100vh",
                background: "rgba(0,0,0,0.4)",
                zIndex: 9999,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <div
                style={{
                  background: "#fff",
                  borderRadius: 8,
                  padding: 32,
                  minWidth: 320,
                  boxShadow: "0 2px 16px rgba(0,0,0,0.2)",
                  textAlign: "center",
                }}
              >
                <div style={{ fontSize: 18, marginBottom: 20 }}>
                  Are you sure you want to delete this template?
                </div>
                <div
                  style={{ display: "flex", justifyContent: "center", gap: 16 }}
                >
                  <button
                    style={{
                      background: "#f48c06",
                      color: "#fff",
                      border: "none",
                      padding: "8px 24px",
                      borderRadius: 4,
                      cursor: "pointer",
                    }}
                    onClick={async () => {
                      await handlebirthDelete(deleteBirthTemplateId);
                      setShowBirthDeleteModal(false);
                    }}
                  >
                    OK
                  </button>
                  <button
                    style={{
                      background: "#2f327d",
                      color: "#fff",
                      border: "none",
                      padding: "8px 24px",
                      borderRadius: 4,
                      cursor: "pointer",
                    }}
                    onClick={() => setShowBirthDeleteModal(false)}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* show templates preview */}
          {isPreviewOpen && (
            <div className="preview-modal-overlay-tem">
              <div className="preview-modal-content-tem">
                <div className="modal-nav-previews-temps">
                  {selectedTemplatepre && (
                    <h3 className="temname">
                      {selectedTemplatepre.temname} Preview
                    </h3>
                  )}
                  <button
                    className="close-modal-read-pre"
                    onClick={handleCloseModalpre}
                  >
                    x
                  </button>
                </div>
                <div className="preview-add-content">
                  <div
                    style={{
                      backgroundColor: bgColortem,
                      borderRadius: "10px",
                      pointerEvents: "none",
                    }}
                  >
                    {previewContenttem.map((item, index) => {
                      if (!item || !item.type) return null;
                      return (
                        <div
                          className="content-item-preview"
                          style={item.style}
                          key={index}
                        >
                          {item.type === "para" && (
                            <>
                              <p
                                className="border"
                                contentEditable
                                suppressContentEditableWarning
                                onClick={() => {
                                  setSelectedIndex(index);
                                  setSelectedContent(item.content); // Store the correct content
                                  setIsModalOpen(true); // Open the modal
                                }}
                                style={item.style}
                                dangerouslySetInnerHTML={{
                                  __html: item.content,
                                }}
                              />
                              {isModalOpen && selectedIndex === index && (
                                <ParaEditor
                                  isOpen={isModalOpen}
                                  content={selectedContent} // Pass the correct content
                                  style={item.style}
                                  onSave={(newContent) => {
                                    updateContent(index, {
                                      content: newContent,
                                    }); // Save the new content
                                    setIsModalOpen(false);
                                  }}
                                  onClose={() => setIsModalOpen(false)}
                                />
                              )}
                            </>
                          )}

                          {item.type === "multi-image-card" ? (
                            <div className="Layout-img">
                              <div className="Layout">
                                <img
                                  src={
                                    item.src1 
                                  }
                                  alt="Editable"
                                  className="multiimgcard"
                                  title="Upload Image"
                                  style={item.style}
                                  onClick={() => handleopenFiles(index, 1)}
                                />
                                <h3 className="card-text-image">
                                  {item.title1 || " "}
                                </h3>
                                <p>
                                  <s>
                                    {item.originalPrice1
                                      ? `₹${item.originalPrice1}`
                                      : " "}
                                  </s>
                                </p>
                                <p>
                                  {item.offerPrice1
                                    ? `Off Price ₹${item.offerPrice1}`
                                    : " "}
                                </p>
                                <a
                                  href={item.link1}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="button-preview"
                                  style={item.buttonStyle1}
                                >
                                  {item.content1}
                                </a>
                              </div>

                              <div className="Layout">
                                <img
                                  src={
                                    item.src2 
                                  }
                                  alt="Editable"
                                  className="multiimgcard"
                                  title="Upload Image"
                                  style={item.style}
                                  onClick={() => handleopenFiles(index, 2)}
                                />
                                <h3 className="card-text-image">
                                  {item.title2 || " "}
                                </h3>
                                <p>
                                  <s>
                                    {item.originalPrice2
                                      ? `₹${item.originalPrice2}`
                                      : " "}
                                  </s>
                                </p>
                                <p>
                                  {item.offerPrice2
                                    ? `Off Price ₹${item.offerPrice2}`
                                    : " "}
                                </p>
                                <a
                                  href={item.link2}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="button-preview"
                                  style={item.buttonStyle2}
                                >
                                  {item.content2}
                                </a>
                              </div>
                            </div>
                          ) : null}

                          {item.type === "multipleimage" ? (
                            <div className="Layout-img">
                              <div className="Layout">
                                <img
                                  src={
                                    item.src1 
                                  }
                                  alt="Editable"
                                  className="multiple-img"
                                  title="Upload Image"
                                  style={item.style}
                                  onClick={() => handleopenFiles(index, 1)}
                                />
                              </div>

                              <div className="Layout">
                                <img
                                  src={
                                    item.src2 
                                  }
                                  alt="Editable"
                                  className="multiple-img"
                                  title="Upload Image"
                                  style={item.style}
                                  onClick={() => handleopenFiles(index, 2)}
                                />
                              </div>
                            </div>
                          ) : null}

                          {item.type === "multi-image" ? (
                            <div className="Layout-img">
                              <div className="Layout">
                                <img
                                  src={
                                    item.src1 
                                  }
                                  alt="Editable"
                                  className="multiimg"
                                  title="Upload Image"
                                  style={item.style}
                                  onClick={() => handleopenFiles(index, 1)}
                                />
                                <a
                                  href={item.link1}
                                  target="_blank"
                                  className="button-preview"
                                  rel="noopener noreferrer"
                                  style={item.buttonStyle1}
                                >
                                  {item.content1}
                                </a>
                              </div>

                              <div className="Layout">
                                <img
                                  src={
                                    item.src2 
                                  }
                                  alt="Editable"
                                  className="multiimg"
                                  title="Upload Image"
                                  style={item.style}
                                  onClick={() => handleopenFiles(index, 2)}
                                />
                                <a
                                  href={item.link2}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="button-preview"
                                  style={item.buttonStyle2}
                                >
                                  {item.content2}
                                </a>
                              </div>
                            </div>
                          ) : null}

                          {item.type === "video-icon" ? (
                            <div className="video-icon">
                              <img
                                src={
                                  item.src1 
                                }
                                alt="Editable"
                                className="videoimg"
                                title="Upload Thumbnail Image"
                                style={item.style}
                                onClick={() => handleopenFiles(index, 1)}
                              />
                              <a
                                href={item.link}
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                <img
                                  src={item.src2}
                                  className="video-btn"
                                  alt="icon"
                                />
                              </a>
                            </div>
                          ) : null}

                          {item.type === "cardimage" ? (
                            <div
                              className="card-image-container"
                              style={item.style1}
                            >
                              <img
                                src={
                                  item.src1 
                                }
                                style={item.style}
                                alt="Editable"
                                className="card-image"
                                title="Upload Image"
                                onClick={() => handleopenFiles(index, 1)}
                              />
                              <p
                                className="card-text"
                                contentEditable
                                suppressContentEditableWarning
                                onClick={() => setModalIndex(index)} // Open modal for this index
                                style={item.style}
                                dangerouslySetInnerHTML={{
                                  __html: item.content1,
                                }}
                              />

                              {modalIndex === index && ( // Open only for the selected index
                                <ParaEditor
                                  isOpen={true}
                                  content={item.content1}
                                  onSave={(newContent) => {
                                    updateContent(index, {
                                      content1: newContent,
                                    });
                                    setModalIndex(null); // Close modal after save
                                  }}
                                  onClose={() => setModalIndex(null)}
                                />
                              )}
                            </div>
                          ) : null}

                          {item.type === "head" && (
                            <div ref={dropdownRef}>
                              <p
                                className="border"
                                contentEditable
                                suppressContentEditableWarning
                                onBlur={(e) =>
                                  updateContent(index, {
                                    content: e.target.textContent,
                                  })
                                }
                                onMouseUp={(e) =>
                                  handleCursorPosition(e, index)
                                }
                                onSelect={(e) => handleCursorPosition(e, index)}
                                style={item.style}
                              >
                                {item.content}
                              </p>

                              {/* Local state for each heading */}
                              <div className="select-group-container">
                                {/* Select Group */}
                                {/* <select
                                  onChange={(e) => handleGroupChange(e, index)}
                                  value={selectedGroup[index] || ""}
                                  className="select-variable"
                                >
                                  <option
                                                         value=""
                                                         disabled
                                                         className="template-title"
                                                       >
                                                         Add Variable
                                                       </option> 
                                  <option value="" disabled>
                                    Select Group
                                  </option>
                                  {groups.map((group, idx) => (
                                    <option key={idx} value={group._id}>
                                      {group.name}
                                    </option>
                                  ))}
                                </select> */}

                                {/* Show fields only for the selected heading */}
                                {selectedGroup[index] &&
                                  openedGroups[index] && (
                                    <div className="dropdown-container">
                                      <p className="template-title">
                                        <span>Add</span> Variable
                                      </p>
                                      {fieldNames[index] &&
                                      fieldNames[index].length > 0 ? (
                                        <div>
                                          {fieldNames[index].map(
                                            (field, idx) => (
                                              <div
                                                className="list-field"
                                                key={idx}
                                                onClick={() =>
                                                  handleInsertName(
                                                    index,
                                                    `{${field}}`
                                                  )
                                                }
                                              >
                                                {field}
                                              </div>
                                            )
                                          )}
                                        </div>
                                      ) : (
                                        <p className="no-variables">
                                          No Variables
                                        </p>
                                      )}
                                    </div>
                                  )}
                              </div>
                            </div>
                          )}
                          {item.type === "link-image" && (
                            <div className="border">
                              <a
                                href={item.link || "#"}
                                onClick={(e) => handleLinkClick(e, index)}
                              >
                                <img
                                  src={
                                    item.src 
                                  }
                                  alt="Editable"
                                  className="img"
                                  style={item.style}
                                  onClick={() => handleopenFiles(index, 1)}
                                  title="Upload Image"
                                />
                              </a>
                            </div>
                          )}
                          {item.type === "image" && (
                            <div className="border">
                              <img
                                src={
                                  item.src 
                                }
                                alt="Editable"
                                className="img"
                                style={item.style}
                                onClick={() => handleopenFiles(index, 1)}
                                title="Upload Image"
                              />
                            </div>
                          )}

                          {item.type === "icons" && (
                            <div
                              className="border"
                              style={item.ContentStyle}
                              key={index}
                            >
                              <div className="icon-containers">
                                <a
                                  href={item.links1 || "#"}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  onClick={(e) =>
                                    handleLinksClick2(e, item.links1)
                                  }
                                >
                                  <img
                                    src={item.iconsrc1}
                                    alt="Facebook"
                                    className="icon"
                                    style={item.style1}
                                  />
                                </a>

                                <a
                                  href={item.links2 || "#"}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  onClick={(e) =>
                                    handleLinksClick2(e, item.links2)
                                  }
                                >
                                  <img
                                    src={item.iconsrc2}
                                    alt="Twitter"
                                    className="icon"
                                    rel="noopener noreferrer"
                                    style={item.style2}
                                  />
                                </a>

                                <a
                                  href={item.links3 || "#"}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  onClick={(e) =>
                                    handleLinksClick2(e, item.links3)
                                  }
                                >
                                  <img
                                    src={item.iconsrc3}
                                    alt="Instagram"
                                    className="icon"
                                    style={item.style3}
                                  />
                                </a>

                                <a
                                  href={item.links4 || "#"}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  onClick={(e) =>
                                    handleLinksClick2(e, item.links4)
                                  }
                                >
                                  <img
                                    src={item.iconsrc4}
                                    alt="Youtube"
                                    className="icon"
                                    style={item.style4}
                                  />
                                </a>
                              </div>
                            </div>
                          )}
                          {item.type === "break" && (
                            <div className="border-break">
                              <hr style={item.style} />
                            </div>
                          )}

                          {item.type === "gap" && (
                            <div className="border-break">
                              {<div style={item.styles}></div>}
                            </div>
                          )}

                          {item.type === "imagewithtext" ? (
                            <div className="image-text-container">
                              <div
                                className="image-text-wrapper"
                                style={item.style1}
                              >
                                <img
                                  src={
                                    item.src1 
                                  }
                                  alt="Editable"
                                  className="image-item"
                                  title="Upload Image"
                                  onClick={() => handleopenFiles(index, 1)}
                                />
                                <p
                                  className="text-item"
                                  contentEditable
                                  suppressContentEditableWarning
                                  onClick={() => setModalIndex(index)} // Open modal for this index
                                  style={item.style}
                                  dangerouslySetInnerHTML={{
                                    __html: item.content1,
                                  }}
                                />
                              </div>
                              {modalIndex === index && ( // Open only for the selected index
                                <ParaEditor
                                  isOpen={true}
                                  content={item.content1}
                                  onSave={(newContent) => {
                                    updateContent(index, {
                                      content1: newContent,
                                    });
                                    setModalIndex(null); // Close modal after save
                                  }}
                                  onClose={() => setModalIndex(null)}
                                />
                              )}
                            </div>
                          ) : null}

                          {item.type === "banner" && (
                            <div className="border">
                              <img
                                src={
                                  item.src 
                                }
                                alt="Editable"
                                className="img"
                                style={item.style}
                                onClick={() => handleopenFiles(index, 1)}
                              />
                            </div>
                          )}

                          {item.type === "textwithimage" ? (
                            <div className="image-text-container">
                              <div
                                className="image-text-wrapper"
                                style={item.style}
                              >
                                <p
                                  className="text-item"
                                  contentEditable
                                  suppressContentEditableWarning
                                  onClick={() => setModalIndex(index)} // Open modal for this index
                                  style={item.style}
                                  dangerouslySetInnerHTML={{
                                    __html: item.content2,
                                  }}
                                />
                                <img
                                  src={
                                    item.src2
                                  }
                                  alt="Editable"
                                  className="image-item"
                                  title="Upload Image"
                                  onClick={() => handleopenFiles(index, 2)}
                                />
                              </div>
                              {modalIndex === index && ( // Open only for the selected index
                                <ParaEditor
                                  isOpen={true}
                                  content={item.content2}
                                  onSave={(newContent) => {
                                    updateContent(index, {
                                      content2: newContent,
                                    });
                                    setModalIndex(null); // Close modal after save
                                  }}
                                  onClose={() => setModalIndex(null)}
                                />
                              )}
                            </div>
                          ) : null}

                          {item.type === "logo" && (
                            <div className="border">
                              <img
                                src={
                                  item.src 
                                }
                                alt="Editable"
                                className="logo"
                                style={item.style}
                                onClick={() => handleopenFiles(index, 1)}
                                title="Upload Image"
                              />
                            </div>
                          )}
                          {item.type === "button" && (
                            <div className="border-btn">
                              <a
                                href={item.link || "#"}
                                target="_blank"
                                rel="noopener noreferrer"
                                style={item.style}
                                className="button-preview"
                              >
                                {item.content}
                              </a>
                            </div>
                          )}
                          {item.type === "link" && (
                            <div className="border-btn">
                              <a
                                href={item.href || "#"}
                                onClick={(e) => handleLinkClick(e, index)}
                                style={item.style}
                              >
                                {item.content}
                              </a>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
                <div className="prev-select-btn">
                  <button
                    onClick={handleprevcampaignname}
                    className="preview-create-button"
                  >
                    Select
                  </button>
                  <button
                    onClick={() => setIsPreviewOpen(false)}
                    className="preview-create-button"
                    style={{ backgroundColor: "#f48c06" }}
                  >
                    Cancel
                  </button>
                 {selectedTemplatepre && 
   ![foodTemplate, educationalTemplate, agricultureTemplate,travelTemplate,pharmacyTemplate,gymTemplate].includes(selectedTemplatepre) && (
    <button
      className="preview-create-button"
      disabled={isDeleting}
      onClick={() => {
        setDeleteTemplateId(selectedTemplatepre._id);
        setShowDeleteModal(true);
      }}
    >
      {isDeleting ? (
        <span
          style={{ color: "#ffffff" }}
          className="loader-create"
        ></span>
      ) : (
        "Delete"
      )}
    </button>
  )}

                </div>
              </div>
            </div>
          )}
          {showDeleteModal && (
            <div
              style={{
                position: "fixed",
                top: 0,
                left: 0,
                width: "100vw",
                height: "100vh",
                background: "rgba(0,0,0,0.4)",
                zIndex: 9999,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <div
                style={{
                  background: "#fff",
                  borderRadius: 8,
                  padding: 32,
                  minWidth: 320,
                  boxShadow: "0 2px 16px rgba(0,0,0,0.2)",
                  textAlign: "center",
                }}
              >
                <div style={{ fontSize: 18, marginBottom: 20 }}>
                  Are you sure you want to delete this template?
                </div>
                <div
                  style={{ display: "flex", justifyContent: "center", gap: 16 }}
                >
                  <button
                    style={{
                      background: "#f48c06",
                      color: "#fff",
                      border: "none",
                      padding: "8px 24px",
                      borderRadius: 4,
                      cursor: "pointer",
                    }}
                    onClick={async () => {
                      await handleDelete(deleteTemplateId);
                      setShowDeleteModal(false);
                    }}
                    disabled={isDeleting}
                  >
                    {isDeleting ? (
                      <span className="loader-create"></span>
                    ) : (
                      "Delete"
                    )}
                  </button>
                  <button
                    style={{
                      background: "#2f327d",
                      color: "#fff",
                      border: "none",
                      padding: "8px 24px",
                      borderRadius: 4,
                      cursor: "pointer",
                    }}
                    onClick={() => setShowDeleteModal(false)}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}

          {showDeleteModaltemall && (
            <div
              style={{
                position: "fixed",
                top: 0,
                left: 0,
                width: "100vw",
                height: "100vh",
                background: "rgba(0,0,0,0.4)",
                zIndex: 9999,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <div
                style={{
                  background: "#fff",
                  borderRadius: 8,
                  padding: 32,
                  minWidth: 320,
                  boxShadow: "0 2px 16px rgba(0,0,0,0.2)",
                  textAlign: "center",
                }}
              >
                <div style={{ fontSize: 18, marginBottom: 20 }}>
                  Are you sure you want to delete this template?
                </div>
                <div
                  style={{ display: "flex", justifyContent: "center", gap: 16 }}
                >
                  <button
                    style={{
                      background: "#f48c06",
                      color: "#fff",
                      border: "none",
                      padding: "8px 24px",
                      borderRadius: 4,
                      cursor: "pointer",
                    }}
                    onClick={handleDeleteTemplates}
                    disabled={isDeleting}
                  >
                    {isDeleting ? (
                      <span className="loader-create"></span>
                    ) : (
                      "Delete"
                    )}
                  </button>
                  <button
                    style={{
                      background: "#2f327d",
                      color: "#fff",
                      border: "none",
                      padding: "8px 24px",
                      borderRadius: 4,
                      cursor: "pointer",
                    }}
                    onClick={() => setShowDeleteModaltemall(false)}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* delete birth template all */}
          {showDeleteModalbirthtemall && (
            <div
              style={{
                position: "fixed",
                top: 0,
                left: 0,
                width: "100vw",
                height: "100vh",
                background: "rgba(0,0,0,0.4)",
                zIndex: 9999,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <div
                style={{
                  background: "#fff",
                  borderRadius: 8,
                  padding: 32,
                  minWidth: 320,
                  boxShadow: "0 2px 16px rgba(0,0,0,0.2)",
                  textAlign: "center",
                }}
              >
                <div style={{ fontSize: 18, marginBottom: 20 }}>
                  Are you sure you want to delete this template?
                </div>
                <div
                  style={{ display: "flex", justifyContent: "center", gap: 16 }}
                >
                  <button
                    style={{
                      background: "#f48c06",
                      color: "#fff",
                      border: "none",
                      padding: "8px 24px",
                      borderRadius: 4,
                      cursor: "pointer",
                    }}
                    onClick={handleDeleteTemplatesbirth}
                    disabled={isDeleting}
                  >
                    {isDeleting ? (
                      <span className="loader-create"></span>
                    ) : (
                      "Delete"
                    )}
                  </button>
                  <button
                    style={{
                      background: "#2f327d",
                      color: "#fff",
                      border: "none",
                      padding: "8px 24px",
                      borderRadius: 4,
                      cursor: "pointer",
                    }}
                    onClick={() => setShowDeleteModalbirthtemall(false)}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}
          {/* Modal for Creating Campaign */}
          {showCampaignModal && (
            <div className="campaign-modal-overlay">
              <div className="campaign-modal-content">
                <h3>Create Campaign</h3>
                <input
                  type="text"
                  value={campaignName}
                  onChange={(e) => setCampaignName(e.target.value)}
                  placeholder="Enter Campaign Name Max 15 letter"
                  className="modal-input"
                  maxLength={15}
                />
                <button
                  className="modal-create-button"
                  onClick={handleCreateButton}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <span className="loader-create"></span> // Spinner
                  ) : (
                    "Create"
                  )}{" "}
                </button>
                <button
                  onClick={() => setShowCampaignModal(false)}
                  className="modal-create-button-cancel-modal"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
          {/* Modal for Creating Template */}
          {showTemplateModal && (
            <div className="campaign-modal-overlay">
              <div className="campaign-modal-content">
                <h3>Create Template</h3>
                <input
                  type="text"
                  value={templateName}
                  onChange={(e) => setTemplateName(e.target.value)}
                  placeholder="Enter Template Name Max 15 letter"
                  className="modal-input"
                  maxLength={15}
                />
                <button
                  className="modal-create-button"
                  onClick={handleCreateButtonTem}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <span className="loader-create"></span> // Spinner
                  ) : (
                    "Create"
                  )}{" "}
                </button>
                <button
                  onClick={() => setShowTemplateModal(false)}
                  className="modal-create-button-cancel-modal"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          {/* Modal for Creating Campaign */}
          {showCampaignModalauto && (
            <div className="campaign-modal-overlay">
              <div className="campaign-modal-content">
                <h3>Create Campaign Name</h3>
                <p>eg:Staff Birthday Campaign</p>
                <input
                  type="text"
                  value={campaignName}
                  onChange={(e) => setCampaignName(e.target.value)}
                  placeholder="_________ Birthday Campaign"
                  className="modal-input"
                  maxLength={10}
                />
                <button
                  className="modal-create-button"
                  onClick={handleCreateButtonauto}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <span className="loader-create"></span> // Spinner
                  ) : (
                    "Create"
                  )}{" "}
                </button>
                <button
                  onClick={() => setShowCampaignModalauto(false)}
                  className="modal-create-button-cancel-modal"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
          {/* Modal for Creating Campaign */}
          {showCampaignModalTem && (
            <div className="campaign-modal-overlay">
              <div className="campaign-modal-content">
                <h3>Create Campaign </h3>
                <input
                  type="text"
                  value={campaignName}
                  onChange={(e) => setCampaignName(e.target.value)}
                  placeholder="Enter Campaign Name Max 15 letter"
                  className="modal-input"
                  maxLength={15}
                />
                <button
                  className="modal-create-button"
                  onClick={handleCreateTemButton}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <span className="loader-create"></span> // Spinner
                  ) : (
                    "Create"
                  )}{" "}
                </button>
                <button
                  onClick={() => setShowCampaignModalTem(false)}
                  className="modal-create-button-cancel-modal"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
          <SendbulkModal campaignName={campaignName} />
          <ToastContainer
            className="custom-toast"
            position="bottom-center"
            autoClose={2000}
            hideProgressBar={true} // Disable progress bar
            closeOnClick={false}
            closeButton={false}
            pauseOnHover={true}
            draggable={true}
            theme="light" // Optional: Choose theme ('light', 'dark', 'colored')
          />
        </div>
      </div>
      <div className="dwn-menu">
        <div className="mobile-menu">
          <button
            className="sidebar-button-mobile campaign-button"
            onClick={handleDashboardView}
          >
            Dashboard
          </button>
          <button
            className="sidebar-button-mobile campaign-button"
            onClick={handleCampaignView}
          >
            Campaign
          </button>

          <button
            className="sidebar-button-mobile contact-button"
            onClick={handleContactView}
          >
            Contact
          </button>

          <button
            className="sidebar-button-mobile contact-button"
            onClick={handleTemplateView}
          >
            Templates
          </button>

          <button
            className="sidebar-button-mobile contact-button"
            onClick={handleRemainderrview}
          >
            Automation
          </button>

          <button
            className="sidebar-button-mobile contact-button"
            onClick={() => setActiveTablayout(true)}
          >
            File Manager
          </button>
        </div>
      </div>
    </>
  );
};

export default Home;
