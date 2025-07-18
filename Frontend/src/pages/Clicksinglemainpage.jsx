import React, { useState, useRef, useEffect, useCallback } from "react";
import axios from "axios";
import "./Readmainpage.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  FaBars,
  FaCheckCircle,
  FaFileExport,
  FaFolderOpen,
  FaTimes,
  FaTrash,
} from "react-icons/fa";
import { useParams, useLocation } from "react-router-dom";
import { FiEdit } from "react-icons/fi"; // Importing icons

import {
  FaParagraph,
  FaImage,
  FaHeading,
  FaPlusSquare,
  FaGlobe,
  FaIdCard,
  FaFileImage,
  FaVideo,
} from "react-icons/fa";
import { FaUser, FaUsers, FaRocket } from "react-icons/fa"; // Import icons
import { MdSend } from "react-icons/md";
import { FaDesktop, FaSave, FaEye } from "react-icons/fa";
import { MdPhoneAndroid } from "react-icons/md";
import { MdAddPhotoAlternate } from "react-icons/md";
import { FiTrash2 } from "react-icons/fi";
import ParaEditor from "../component/Campaign-Creation/ParaEditor.jsx";
import SendexcelModal from "../component/Campaign-Creation/Importexcel.jsx";
import SendbulkModal from "../component/Campaign-Creation/SendbulkModal.jsx";
import { FaArrowLeft } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import apiConfig from "../apiconfig/apiConfig.js";
import ColorPicker from "./ColorPicker.jsx";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import FileManagerModal from "./FilemanagerModal.jsx";
import ParaEditorbutton from "../component/Campaign-Creation/ParaEditorbutton.jsx";
import ColorPalettePicker from "./ColorPalettePicker.jsx";

const Clicksinglemainpage = () => {
  const [activeTab, setActiveTab] = useState("button1");
  const [isLoading, setIsLoading] = useState(false); // State for loader
  const [isLoadingsch, setIsLoadingsch] = useState(false); // State for loader
  const [bgColor, setBgColor] = useState("#ffffff");
  const [bgColorpre, setBgColorpre] = useState("#ffffff");
  const [showTemplateModal, setShowTemplateModal] = useState(false);
  const [templateName, setTemplateName] = useState("");
  const [isMobileView, setIsMobileView] = useState(false);
  const [selectedContent, setSelectedContent] = useState(""); // Store selected content
  const { campaignId } = useParams();
  const location = useLocation();
  const singleemails = location.state?.emails || []; // Get emails from state
  const [clickcampaigns, setClickcampaigns] = useState({});
  const [modalOpen, setModalOpen] = useState(false);
  const [aliasName, setAliasName] = useState("");
  const [replyTo, setReplyTo] = useState("");
  const [scheduledTime, setScheduledTime] = useState("");
  const [emailData, setEmailData] = useState({
    recipient: "",
    subject: "",
    previewtext: "",
    attachments: [],
  });
  const [isLoadingreply, setIsLoadingreply] = useState(false); // State for loader
  const [aliasOptions, setAliasOptions] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [replyOptions, setReplyOptions] = useState([]);
  const [showModalreply, setShowModalreply] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(null); // Track selected content index
  const [modalIndex, setModalIndex] = useState(null);
  const dragIndex = useRef(null);
  const [undoStack, setUndoStack] = useState([]);
  const [redoStack, setRedoStack] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showSendexcelModal, setShowSendexcelModal] = useState(false); // State for opening Sendexcelmail
  const [isScheduled, setIsScheduled] = useState(false); // Toggle state
  const [showSendModal, setShowSendModal] = useState(false); // State for opening SendbulkModal
  const [previewContent, setPreviewContent] = useState([]);
  const [previewContentpre, setPreviewContentpre] = useState([]);
  const user = JSON.parse(localStorage.getItem("user"));
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const modalRef = useRef(null);
  const [isNavOpen, setIsNavOpen] = useState(false);
  const [isMobilestyle, setIsMobilestyle] = useState(window.innerWidth <= 600);
  const [isModalOpenstyle, setIsModalOpenstyle] = useState(false);
  const [isOpentemplate, setIsOpentemplate] = useState(false); // Manage dropdown visibility
  const [templates, setTemplates] = useState([]); // Store fetched templates
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [selectedTemplatepre, setSelectedTemplatepre] = useState(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [groups, setGroups] = useState([]); // Stores group names
  const [students, setStudents] = useState([]); // Stores all students
  const [selectedGroup, setSelectedGroup] = useState({});
  const [fieldNames, setFieldNames] = useState({});
  const templateRef = useRef(null);
  const [openedGroups, setOpenedGroups] = useState({});
  const dropdownRef = useRef(null);
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
  const [editorType, setEditorType] = useState(null);
  const [selectedDraggedImageId, setSelectedDraggedImageId] = useState(null);
  const [pendingFolderMove, setPendingFolderMove] = useState(null);
  const [showMoveConfirmModal, setShowMoveConfirmModal] = useState(false);
  const [isMobilestylecolor, setIsMobilestylecolor] = useState(
    window.innerWidth <= 900
  );
  useEffect(() => {
    const handleResizecolor = () => {
      setIsMobilestylecolor(window.innerWidth <= 900);
    };

    window.addEventListener("resize", handleResizecolor);
    return () => window.removeEventListener("resize", handleResizecolor);
  }, []);

  function convertToWhatsAppText(html) {
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = html;

    const processNode = (node) => {
      if (node.nodeType === 3) return node.textContent; // plain text

      let tag = node.tagName ? node.tagName.toLowerCase() : "";
      let result = "";

      node.childNodes.forEach((child) => {
        result += processNode(child);
      });

      // Use double newline for paragraph-like tags
      if (["p", "div", "li", "tr"].includes(tag)) {
        result += "\n\n";
      } else if (tag === "br") {
        result += "\n";
      }

      if (tag === "b" || tag === "strong") {
        result = `*${result.trim()}*`;
      }

      if (tag === "i" || tag === "em") {
        result = `_${result.trim()}_`;
      }

      return result;
    };

    const text = processNode(tempDiv)
      .replace(/\n{3,}/g, "\n\n") // collapse triple+ to double newlines
      .replace(/[ \t]+\n/g, "\n") // trim line ends
      .trim();

    return text;
  }

  function formatPreviewContent(message) {
    return message; // Don't strip HTML here
  }

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

  const VerticalSpacingIcon = () => (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "8px",
      }}
    >
      <div
        style={{
          width: "18px",
          height: "2px",
          backgroundColor: "#313030",
          borderRadius: "4px",
        }}
      ></div>
      <div
        style={{
          width: "18px",
          height: "2px",
          backgroundColor: "#313030",
          borderRadius: "4px",
        }}
      ></div>
    </div>
  );

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

  const handleGroupChange = (e, index) => {
    const groupName = e.target.value;

    setSelectedGroup((prev) => ({
      ...prev,
      [index]: groupName,
    }));

    // Allow reopening if selecting the same group again
    setOpenedGroups((prev) => ({
      ...prev,
      [index]: !prev[index] || prev[index] !== groupName, // Toggle if same group selected
    }));

    if (!students || students.length === 0) {
      console.log("No students available yet.");
      return;
    }

    console.log(`All students:`, students);
    console.log(`Selected Group for Heading ${index}:`, groupName);

    const filteredStudents = students.filter(
      (student) => student.group && student.group._id === groupName
    );

    const sampleStudent =
      filteredStudents.length > 0 ? filteredStudents[0] : null;

    const newFieldNames = sampleStudent
      ? Object.keys(sampleStudent).filter(
          (key) => key !== "_id" && key !== "group" && key !== "__v" && key !== "lastSentYear" &&
                                key !== "user" &&
                                key !== "isUnsubscribed" &&
                                key !== "createdAt" &&
                                key !== "updatedAt" 
        )
      : [];

    setFieldNames((prev) => ({
      ...prev,
      [index]: newFieldNames,
    }));
  };
  const handleClickOutsidegroup = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setOpenedGroups({});
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutsidegroup);
    return () => {
      document.removeEventListener("mousedown", handleClickOutsidegroup);
    };
  }, []);

  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        const res = await axios.get(
          `${apiConfig.baseURL}/api/stud/getcamhistory/${campaignId}`
        );
        setClickcampaigns(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchCampaigns();
  }, [campaignId]);

  const toggletemplate = (event) => {
    event.stopPropagation(); // Prevent event from bubbling up
    setIsOpentemplate((prev) => !prev);
  };
  const styleControlsRef = useRef(null);

  useEffect(() => {
    if (selectedIndex !== null && styleControlsRef.current) {
      styleControlsRef.current.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  }, [selectedIndex]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (templateRef.current && !templateRef.current.contains(event.target)) {
        setIsOpentemplate(false);
      }
    };

    window.addEventListener("mousedown", handleClickOutside);

    return () => {
      window.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Fetch groups and students only
  useEffect(() => {
    const fetchGroupsAndStudents = async () => {
      if (!user?.id) {
        console.warn("User ID is missing. Skipping groups/students fetch.");
        return;
      }

      try {
        const [groupsRes, studentsRes] = await Promise.all([
          axios.get(`${apiConfig.baseURL}/api/stud/groups/${user.id}`),
          axios.get(`${apiConfig.baseURL}/api/stud/students?user=${user.id}`),
        ]);
        setGroups(groupsRes.data);
        setStudents(studentsRes.data);
      } catch (error) {
        console.error("Error fetching groups/students:", {
          message: error.message,
          stack: error.stack,
          response: error.response?.data,
        });
      }
    };

    fetchGroupsAndStudents();
  }, [user?.id]);

  useEffect(() => {
    if (!user?.id) {
      console.warn("User ID is missing. Skipping template fetch.");
      return;
    }
    fetchTemplates();
  }, [user?.id]);

  const fetchTemplates = async () => {
    if (!user?.id) {
      console.warn("User ID is missing. Skipping template fetch.");
      return;
    }

    try {
      const templatesRes = await axios.get(
        `${apiConfig.baseURL}/api/stud/templates/${user.id}`
      );
      setTemplates(templatesRes.data);
    } catch (error) {
      console.error("Error fetching templates:", {
        message: error.message,
        stack: error.stack,
        response: error.response?.data,
      });
    }
  };

  useEffect(() => {
    const handleResize = () => {
      setIsMobilestyle(window.innerWidth <= 600);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  const handlePreview = (template) => {
    setIsOpentemplate(false); // Close the dropdown
    setIsNavOpen(false);
    setIsPreviewOpen(true);
    setSelectedTemplatepre(template);
    setBgColorpre(template.bgColor || "#ffffff"); // Update background color
    setPreviewContentpre(template.previewContent || []); // Update previewContent
  };
  const handlecancel = () => {
    setIsPreviewOpen(false);
    setShowTemplateModal(false);
    setIsNavOpen(false);
  };
  const handleTemplateSelect = (template) => {
    setIsPreviewOpen(false);
    setIsNavOpen(false);
    setIsOpentemplate(false); // Close the dropdown
    setSelectedTemplate(template);
    setBgColor(template.bgColor || "#ffffff"); // Update background color
    setPreviewContent(template.previewContent || []); // Update previewContent
  };

  const handlebackcampaign = () => {
    navigate("/home");
    sessionStorage.removeItem("firstVisit");
    sessionStorage.removeItem("toggled");
    localStorage.removeItem("campaign");
    localStorage.removeItem("template");
  };

  // Add new text
  const addText = () => {
    saveToUndoStack(); // Save the current state before deleting

    setPreviewContent([
      ...previewContent,
      {
        type: "para",
        content: "Replace Your Content...",
        style: {
          fontSize: "15px",
          borderRadius: "0px",
          textAlign: "left",
          color: "#000000",
          backgroundColor: "#f4f4f4",
          padding: "10px 10px",
        },
      },
    ]);
  };

  const addMultipleImage = () => {
    setPreviewContent([
      ...previewContent,
      {
        type: "multipleimage",
        src1: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTjCoUtOal33JWLqals1Wq7p6GGCnr3o-lwpQ&s",
        src2: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTjCoUtOal33JWLqals1Wq7p6GGCnr3o-lwpQ&s",
        style: {
          width: "100%",
          height: "auto",
          borderRadius: "10px",
          textAlign: "center",
        },
      },
    ]);
  };

  // addBreak
  const addBreak = () => {
    setPreviewContent([
      ...previewContent,
      {
        type: "break",
        style: {
          width: "100%",
          backgroundColor: "#000000",
          margin: "30px 0", // optional: adds spacing above and below
        },
      },
    ]);
  };

  //  add Gap
  const addGap = () => {
    setPreviewContent([
      ...previewContent,
      {
        type: "gap",
        style: {
          width: "100%",
          height: "40px",
          backgroundColor: "#000000", // optional, usually gaps are transparent or white
          margin: "30px 0", // optional spacing
        },
      },
    ]);
  };

  const addCardImage = () => {
    setPreviewContent([
      ...previewContent,
      {
        type: "cardimage",
        style: {
          width: "80%",
          height: "auto",
          margin: "0px auto",
        },
        src1: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTjCoUtOal33JWLqals1Wq7p6GGCnr3o-lwpQ&s", // Default image source
        content1:
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.", // Default paragraph text", // Default paragraph text
        style1: {
          color: "#000000",
          backgroundColor: "#f4f4f4",
        },
      },
    ]);
  };

  const addHeading = () => {
    saveToUndoStack(); // Save the current state before deleting

    setPreviewContent([
      ...previewContent,
      {
        type: "head",
        content: "Heading",
        style: {
          fontSize: "25px",
          borderRadius: "0px",
          textAlign: "center",
          color: "#000000",
          padding: "10px 0px 10px 5px",
          fontWeight: "bold",
        },
      },
    ]);
  };

  const addBanner = () => {
    setPreviewContent([
      ...previewContent,
      {
        type: "banner",
        src: "https://reviverestore.org/wp-content/uploads/2017/05/placeholder-image-cropped-768x432.jpg",
        url: "https://reviverestore.org/wp-content/uploads/2017/05/placeholder-image-cropped-768x432.jpg",
        style: {
          width: "100%",
          height: "auto",
          borderRadius: "0px",
          textAlign: "center",
        },
      },
    ]);
  };

  //add multimage with button
  const addMultiImagecard = () => {
    const isMobile = window.innerWidth <= 600; // Check if screen width is 600px or less

    setPreviewContent([
      ...previewContent,
      {
        type: "multi-image-card",
        src1: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTjCoUtOal33JWLqals1Wq7p6GGCnr3o-lwpQ&s",
        src2: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTjCoUtOal33JWLqals1Wq7p6GGCnr3o-lwpQ&s",
        link1: "",
        link2: "",
        title1: "Name of the product", // Title for the first section
        title2: "Name of the product", // Title for the second section
        originalPrice1: "9000", // Original price for the first section
        originalPrice2: "8000", // Original price for the second section
        offerPrice1: "5999", // Offer price for the first section
        offerPrice2: "4999", // Offer price for the second section
        buttonStyle1: {
          textAlign: "center",
          padding: isMobile ? "8px 8px" : "12px 15px", // Adjust padding based on screen size
          backgroundColor: "#000000",
          color: "#ffffff",
          width: "80%", // Full width for buttons
          marginTop: "20px",
          alignItems: "center",
          borderRadius: "0px",
          fontWeight: "bold",
          fontSize: "15px",
        },
        buttonStyle2: {
          textAlign: "center",
          padding: isMobile ? "8px 8px" : "12px 15px", // Adjust padding based on screen size
          backgroundColor: "#000000",
          color: "#ffffff",
          width: "80%", // Full width for buttons
          marginTop: "20px",
          alignItems: "center",
          borderRadius: "0px",
          fontWeight: "bold",
          fontSize: "15px",
        },
        content1: "Buy Now", // Button text for the first section
        content2: "Buy Now", // Button text for the second section
        style: {
          width: "100%", // Full width for the card
          height: "auto",
          borderRadius: "10px",
          textAlign: "center",
        },
      },
    ]);
  };

  const addImage = () => {
    setPreviewContent([
      ...previewContent,
      {
        type: "image",
        src: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTjCoUtOal33JWLqals1Wq7p6GGCnr3o-lwpQ&s", // Default image source
        url: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTjCoUtOal33JWLqals1Wq7p6GGCnr3o-lwpQ&s", // Default image source
        style: {
          width: "100%",
          height: "auto",
          borderRadius: "0px",
          textAlign: "center",
          margin: "5px auto",
        },
      },
    ]);
  };

  const addLogo = () => {
    setPreviewContent([
      ...previewContent,
      {
        type: "logo",
        src: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTjCoUtOal33JWLqals1Wq7p6GGCnr3o-lwpQ&s", // Default image source
        url: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTjCoUtOal33JWLqals1Wq7p6GGCnr3o-lwpQ&s", // Default image source
        style: {
          width: "50%",
          height: "auto",
          borderRadius: "0px",
          textAlign: "center",
          margin: "5px auto",
        },
      },
    ]);
  };

  const handleopenFiles = (index, imageNumber) => {
    setSelectedImageIndex(index);
    setSelectedImageNumber(imageNumber);
    setActiveTablayout(true);
  };

  const uploadImage = async (index, imageNumber, imageurl) => {
    console.log(
      "Uploading image for index:",
      index,
      "imageNumber:",
      imageNumber,
      "imageurl:",
      imageurl
    );
    const imageUrl3 =
      imageurl ||
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTjCoUtOal33JWLqals1Wq7p6GGCnr3o-lwpQ&s"; // Default image URL
    try {
      setPreviewContent((prev) =>
        prev.map((item, i) =>
          i === index
            ? {
                ...item,
                url: imageUrl3,
                src: imageUrl3,
                [imageNumber === 1 ? "src1" : "src2"]: imageUrl3,
              }
            : item
        )
      );
      setActiveTablayout(false);
    } catch (err) {
      toast.error("Image upload failed");
    }
  };

  //add  clickable image
  const addlinkImage = () => {
    setPreviewContent([
      ...previewContent,
      {
        type: "link-image",
        src: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTjCoUtOal33JWLqals1Wq7p6GGCnr3o-lwpQ&s", // Default image source
        url: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTjCoUtOal33JWLqals1Wq7p6GGCnr3o-lwpQ&s", // Default image source
        style: {
          width: "100%",
          height: "auto",
          borderRadius: "0px",
          textAlign: "center",
          margin: "5px auto",
        },
        link: "",
      },
    ]);
  };

  const addImageText = () => {
    setPreviewContent([
      ...previewContent,
      {
        type: "imagewithtext",
        src1: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTjCoUtOal33JWLqals1Wq7p6GGCnr3o-lwpQ&s", // Default image source
        content1:
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.", // Default paragraph text", // Default paragraph text
        style1: {
          color: "#000000",
          backgroundColor: "#f4f4f4",
        },
      },
    ]);
  };

  const addTextImage = () => {
    setPreviewContent([
      ...previewContent,
      {
        type: "textwithimage",
        src2: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTjCoUtOal33JWLqals1Wq7p6GGCnr3o-lwpQ&s", // Default image source
        content2:
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.", // Default paragraph text", // Default paragraph text
        style: {
          color: "#000000",
          backgroundColor: "#f4f4f4",
        },
      },
    ]);
  };

  //add video with icon
  const addVideo = () => {
    const isMobile = window.innerWidth <= 600; // Check if screen width is 600px or less

    setPreviewContent([
      ...previewContent,
      {
        type: "video-icon",
        src1: "https://zawiya.org/wp-content/themes/zawiyah/images/thumbnail-default.jpg",
        src2: "https://media1.giphy.com/media/v1.Y2lkPTc5MGI3NjExb2J2eGkwZHZ6ZmQxMzV2OWQzOG1qazZsNGs1dXNxaWV3NTJqbHd0YSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9cw/gcBq6Nom44PGBoUhWm/giphy.gif",
        link: "",
        style: {
          width: "100%",
          height: isMobile ? "230px" : "350px", // Adjust height based on screen size
          borderRadius: "0px",
          textAlign: "center",
          margin: "5px auto",
        },
      },
    ]);
  };
  const addSocialMedia = () => {
    setPreviewContent([
      ...previewContent,
      {
        type: "icons",
        iconsrc1:
          "https://res.cloudinary.com/diytyjnla/image/upload/v1748582430/facebook_crpxwo.png",
        style1: { width: "30px", height: "30px" },
        links1: "https://www.facebook.com",

        iconsrc2:
          "https://res.cloudinary.com/diytyjnla/image/upload/v1748582461/twitter_g6czs3.png",
        style2: { width: "30px", height: "30px" },
        links2: "https://www.twitter.com",

        iconsrc3:
          "https://res.cloudinary.com/diytyjnla/image/upload/v1748582448/Instagram_fj4sqm.png",
        style3: { width: "30px", height: "30px" },
        links3: "https://www.instagram.com",

        iconsrc4:
          "https://res.cloudinary.com/diytyjnla/image/upload/v1748582471/youtube_egb71v.png",
        style4: { width: "30px", height: "30px" },
        links4: "https://www.youtube.com",

        ContentStyle: {
          width: "100%",
          backgroundColor: "white",
          borderRadius: "0px",
          textAlign: "center",
        },
      },
    ]);
  };
  const handleLinksClick2 = (e, link) => {
    if (link) {
      window.open(link.startsWith("http") ? link : `http://${link}`, "_blank");
    }
  };

  //add multimage with button
  const addMultiImage = () => {
    const isMobile = window.innerWidth <= 600; // Check if screen width is 600px or less
    setPreviewContent([
      ...previewContent,
      {
        type: "multi-image",
        src1: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTjCoUtOal33JWLqals1Wq7p6GGCnr3o-lwpQ&s",
        src2: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTjCoUtOal33JWLqals1Wq7p6GGCnr3o-lwpQ&s",
        link1: "",
        link2: "",
        buttonStyle1: {
          textAlign: "center",
          padding: isMobile ? "8px 8px" : "12px 25px", // Adjust padding based on screen size
          backgroundColor: "#000000",
          color: "#ffffff",
          width: "auto",
          marginTop: "20px",
          alignItems: "center",
          borderRadius: "px",
          fontWeight: "bold",
          fontSize: "18px",
        },
        buttonStyle2: {
          textAlign: "center",
          padding: isMobile ? "8px 8px" : "12px 25px", // Adjust padding based on screen size
          backgroundColor: "#000000",
          color: "#ffffff",
          width: "auto",
          marginTop: "20px",
          alignItems: "center",
          borderRadius: "px",
          fontWeight: "bold",
          fontSize: "18px",
        },
        content1: "Click Me",
        content2: "Click Me",
        style: {
          width: "100%",
          height: "auto",
          borderRadius: "10px",
          textAlign: "center",
        },
      },
    ]);
  };

  const addButton = () => {
    saveToUndoStack();
    setPreviewContent([
      ...previewContent,
      {
        type: "button",
        buttonType: "link", // Default to link
        content: "Click Me",
        whatsappNumber: "",
        whatsappMessage: "Hello, I want to connect with you!",
        contactNumber: "",
        style: {
          textAlign: "center",
          padding: "12px 25px",
          backgroundColor: "#000000",
          color: "#ffffff",
          width: "auto",
          marginTop: "5px",
          fontWeight: "bold",
          fontSize: "15px",
          alignItem: "center",
          borderRadius: "0px",
        },
        link: "",
      },
    ]);
  };
  // Handle content editing
  const updateContent = (index, newContent) => {
    saveToUndoStack(); // Save the current state before deleting
    const updated = [...previewContent];
    updated[index] = { ...updated[index], ...newContent };
    setPreviewContent(updated);
  };

  const handleItemClick = (index) => {
    setSelectedIndex(index); // Set the selected index when an item is clicked
    // Scroll to style controls after a short delay to ensure rendering
    setTimeout(() => {
      const styleControlsElement = document.querySelector(".style-controls");
      if (styleControlsElement) {
        styleControlsElement.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      }
    }, 100);
  };
  const handleItemClickdesktop = (index) => {
    setSelectedIndex(index); // Set the selected index when an item is clicked
  };
  //delete
  const deleteContent = (index) => {
    saveToUndoStack(); // Save the current state before deleting
    const updated = previewContent.filter((_, i) => i !== index);
    setPreviewContent(updated);
    if (selectedIndex === index) {
      setSelectedIndex(null); // Reset selection if the deleted item was selected
    } else if (selectedIndex > index) {
      setSelectedIndex(selectedIndex - 1); // Adjust index
    }
  };

  const saveToUndoStack = () => {
    setUndoStack([...undoStack, [...previewContent]]);
    setRedoStack([]); // Clear redo stack whenever a new action is performed
  };

  // Undo action
  const undo = () => {
    if (undoStack.length > 0) {
      const previousState = undoStack.pop(); // Pop the last state
      setRedoStack([...redoStack, [...previewContent]]); // Save current state to redo stack
      setPreviewContent(previousState); // Revert to the previous state
    }
  };

  // Redo action
  const redo = () => {
    if (redoStack.length > 0) {
      const nextState = redoStack.pop(); // Pop the redo state
      setUndoStack([...undoStack, [...previewContent]]); // Save current state to undo stack
      setPreviewContent(nextState); // Reapply the redo state
    }
  };
  const handleSaveasButton = () => {
    if (!user || !user.id) {
      toast.error("Please ensure the user is valid");
      return; // Stop further execution if user is invalid
    }
    if (!templateName) {
      toast.error("Please enter a Template name");
    }
    if (!previewContent || previewContent.length === 0) {
      toast.warning("No preview content available.");
      return;
    }
    // Check for missing links and show individual toasts
    let hasInvalidLink = false;
    previewContent.forEach((item, index) => {
      if (item.type === "multi-image" || item.type === "multi-image-card") {
        if (!item.link1?.trim()) {
          toast.error(`Please fill in Link 1 in ${item.type}`);
          hasInvalidLink = true;
        }
        if (!item.link2?.trim()) {
          toast.error(`Please fill in Link 2 in ${item.type}`);
          hasInvalidLink = true;
        }
      } else if (item.type === "video-icon" || item.type === "button") {
        if (!item.link?.trim()) {
          toast.error(`Please fill in the Link in ${item.type}`);
          hasInvalidLink = true;
        }
      }
    });

    if (hasInvalidLink) {
      return;
    }

    setIsLoading(true);
    if (templateName && user && user.id && previewContent) {
      axios
        .post(`${apiConfig.baseURL}/api/stud/template`, {
          temname: templateName,
          userId: user.id,
          previewContent,
          bgColor,
          camname: clickcampaigns?.campaignname?.trim() || "",
        })
        .then((res) => {
          console.log("Template saved successfully:", res.data);
          toast.success("Template Saved Successfully");
          setTimeout(() => {
            setShowTemplateModal(false);
            setIsLoading(false);
          }, 2000);
          fetchTemplates(); // Refresh templates after saving
        })
        .catch((error) => {
          setIsLoading(false);
          // Dismiss previous toasts before showing a new one
          toast.dismiss();
          if (
            error.response &&
            error.response.data &&
            error.response.data.message
          ) {
            toast.warning(error.response.data.message, { autoClose: 3000 });
          } else {
            toast.error("Failed to Save template", { autoClose: 3000 });
          }
        });
    } else {
      setIsLoading(false);
      toast.error("Please ensure all fields are filled and user is valid");
    }
  };
  const handleSaveButton = useCallback(async () => {
    if (!user || !user.id) {
      toast.error("User not found. Please log in again.");
      return;
    }
    if (!previewContent || previewContent.length === 0) {
      toast.warning("No content to save. Please create or edit the template.");
      return;
    }

    // Check for missing links and show individual toasts
    let hasInvalidLink = false;
    previewContent.forEach((item, index) => {
      if (item.type === "multi-image" || item.type === "multi-image-card") {
        if (!item.link1?.trim()) {
          toast.error(`Please fill in Link 1 in ${item.type}`);
          hasInvalidLink = true;
        }
        if (!item.link2?.trim()) {
          toast.error(`Please fill in Link 2 in ${item.type}`);
          hasInvalidLink = true;
        }
      } else if (item.type === "video-icon" || item.type === "button") {
        if (!item.link?.trim()) {
          toast.error(`Please fill in the Link in ${item.type}`);
          hasInvalidLink = true;
        }
      }
    });

    if (hasInvalidLink) {
      return; // Stop if any links are invalid
    }

    if (!templateName || templateName.trim() === "") {
      toast.warning(
        "Please use 'Save As' to enter a template name before saving."
      );
      return;
    }

    try {
      const checkRes = await axios.get(
        `${
          apiConfig.baseURL
        }/api/stud/template/check?temname=${encodeURIComponent(
          templateName
        )}&userId=${user.id}`
      );

      const existingTemplate = checkRes.data;

      if (existingTemplate) {
        // Update existing template
        await axios.put(
          `${apiConfig.baseURL}/api/stud/template/${existingTemplate._id}`,
          {
            previewContent,
            bgColor,
            camname: campaign?.camname || "",
          }
        );
        toast.success("Template updated successfully.");
      } else {
        // Template doesn't exist, tell user to use Save As
        toast.info(
          "Template not found. Please use 'Save As' to save it the first time."
        );
      }

      fetchTemplates();
    } catch (error) {
      setIsLoading(false);
      toast.dismiss();
      toast.error(
        error?.response?.data?.message || "Failed to update template.",
        { autoClose: 3000 }
      );
    }
  }, [
    user,
    previewContent,
    templateName,
    bgColor,
    clickcampaigns?.campaignname?.trim() || "",
    fetchTemplates,
  ]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "s") {
        e.preventDefault();
        handleSaveButton();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleSaveButton]);

  const sendscheduleEmail = async () => {
    if (!previewContent || previewContent.length === 0) {
      toast.warning("No preview content available.");
      return;
    }
    // Check for missing links and show individual toasts
    let hasInvalidLink = false;
    previewContent.forEach((item, index) => {
      if (item.type === "multi-image" || item.type === "multi-image-card") {
        if (!item.link1?.trim()) {
          toast.error(`Please fill in Link 1 in ${item.type}`);
          hasInvalidLink = true;
        }
        if (!item.link2?.trim()) {
          toast.error(`Please fill in Link 2 in ${item.type}`);
          hasInvalidLink = true;
        }
      } else if (item.type === "video-icon" || item.type === "button") {
        if (!item.link?.trim()) {
          toast.error(`Please fill in the Link in ${item.type}`);
          hasInvalidLink = true;
        }
      }
    });

    if (hasInvalidLink) {
      return;
    }
    if (
      !emailData ||
      !singleemails.length ||
      !emailData.subject ||
      !emailData.previewtext ||
      !aliasName ||
      !replyTo ||
      !scheduledTime
    ) {
      toast.warning("Please fill in all required fields.");
      return;
    }
    setIsLoadingsch(true);

    try {
      let recipients = singleemails.map((email) => email); // Simply copy the array
      console.log("Valid Recipients:", recipients);
      let attachments = [];

      if (emailData.attachments && emailData.attachments.length > 0) {
        const formData = new FormData();

        emailData.attachments.forEach((file) => {
          formData.append("attachments", file);
        });
        formData.append("userId", user.id);

        const uploadResponse = await axios.post(
          `${apiConfig.baseURL}/api/stud/uploadfile`,
          formData,
          { headers: { "Content-Type": "multipart/form-data" } }
        );

        attachments = uploadResponse.data.fileUrls.map((file, index) => ({
          originalName: emailData.attachments[index].name,
          fileUrl: file,
        }));
      }
      // Ensure campaign name follows Click-Retarget pattern
      let campaignName = clickcampaigns?.campaignname?.trim() || "";

      // If campaign name doesn't already contain "Click-Retarget", prepend it
      if (!campaignName.includes("IndividualClick-Retarget")) {
        campaignName = `IndividualClick-Retarget ${campaignName}`;
      } else {
        // Extract count and increment if it already has Click-Retarget
        let match = campaignName.match(/IndividualClick-Retarget(?:-(\d+))?/);
        let count = match && match[1] ? parseInt(match[1]) + 1 : 2;

        campaignName = campaignName.replace(
          /IndividualClick-Retarget(?:-\d+)?/,
          `IndividualClick-Retarget-${count}`
        );
      }

      // Store campaign history with uploaded file data
      const campaignHistoryData = {
        campaignname: campaignName.trim(),
        groupname: "No Group",
        totalcount: recipients.length,
        recipients: recipients.join(","), // Convert array to a single string
        sendcount: 0,
        failedcount: 0,
        sendEmails: 0,
        failedEmails: 0,
        subject: emailData.subject,
        previewtext: emailData.previewtext,
        aliasName,
        replyTo,
        attachments,
        previewContent,
        bgColor,
        exceldata: [{}],
        status: "Scheduled On",
        progress: 0,
        scheduledTime: new Date(scheduledTime).toISOString(),
        senddate: new Date().toLocaleString(),
        user: user.id,
        groupId: "no group",
      };

      await axios.post(
        `${apiConfig.baseURL}/api/stud/camhistory`,
        campaignHistoryData
      );

      toast.success("Email scheduled successfully!");
      navigate("/campaigntable");
    } catch (error) {
      console.error("Error scheduling email:", error);
      toast.error("Failed to schedule email.");
    } finally {
      setIsLoadingsch(false);
    }
  };

  //Normal Send Email
  const sendEmail = async () => {
    if (!previewContent || previewContent.length === 0) {
      toast.warning("No preview content available.");
      return;
    }
    // Check for missing links and show individual toasts
    let hasInvalidLink = false;
    previewContent.forEach((item, index) => {
      if (item.type === "multi-image" || item.type === "multi-image-card") {
        if (!item.link1?.trim()) {
          toast.error(`Please fill in Link 1 in ${item.type}`);
          hasInvalidLink = true;
        }
        if (!item.link2?.trim()) {
          toast.error(`Please fill in Link 2 in ${item.type}`);
          hasInvalidLink = true;
        }
      } else if (item.type === "video-icon" || item.type === "button") {
        if (!item.link?.trim()) {
          toast.error(`Please fill in the Link in ${item.type}`);
          hasInvalidLink = true;
        }
      }
    });

    if (hasInvalidLink) {
      return;
    }
    if (
      !emailData ||
      !singleemails.length ||
      !emailData.subject ||
      !emailData.previewtext ||
      !aliasName ||
      !replyTo
    ) {
      toast.warning("Please fill in all required fields.");
      return;
    }

    setIsLoading(true);
    navigate("/campaigntable");
    sessionStorage.removeItem("firstVisit");
    sessionStorage.removeItem("toggled");

    try {
      let recipients = singleemails.map((email) => email); // Simply copy the array
      console.log("Valid Recipients:", recipients);
      if (!recipients || recipients.length === 0) {
        console.error("No recipients found!");
        return;
      }
      let sentEmails = [];
      let failedEmails = [];
      let attachments = [];
      if (emailData.attachments && emailData.attachments.length > 0) {
        const formData = new FormData();

        emailData.attachments.forEach((file) => {
          formData.append("attachments", file);
        });
        formData.append("userId", user.id);

        const uploadResponse = await axios.post(
          `${apiConfig.baseURL}/api/stud/uploadfile`,
          formData,
          { headers: { "Content-Type": "multipart/form-data" } }
        );

        // Structure the uploaded files with original name and URL
        attachments = uploadResponse.data.fileUrls.map((file, index) => ({
          originalName: emailData.attachments[index].name, // Get original file name
          fileUrl: file, // Cloudinary URL
        }));
      }
      // Ensure campaign name follows Click-Retarget pattern
      let campaignName = clickcampaigns?.campaignname?.trim() || "";

      // If campaign name doesn't already contain "Click-Retarget", prepend it
      if (!campaignName.includes("IndividualClick-Retarget")) {
        campaignName = ` IndividualClick-Retarget ${campaignName}`;
      } else {
        // Extract count and increment if it already has Click-Retarget
        let match = campaignName.match(/IndividualClick-Retarget(?:-(\d+))?/);
        let count = match && match[1] ? parseInt(match[1]) + 1 : 2;

        campaignName = campaignName.replace(
          /IndividualClick-Retarget(?:-\d+)?/,
          `IndividualClick-Retarget-${count}`
        );
      }

      // Store initial campaign history with "Pending" status
      const campaignHistoryData = {
        campaignname: campaignName.trim(),
        groupname: "No Group",
        totalcount: recipients.length,
        recipients: "no mail",
        sendcount: 0,
        failedcount: 0,
        sendEmails: 0,
        failedEmails: 0,
        subject: emailData.subject,
        previewtext: emailData.previewtext,
        aliasName,
        replyTo,
        previewContent,
        attachments,
        bgColor,
        exceldata: [{}],
        scheduledTime: new Date(),
        status: "Pending",
        senddate: new Date().toLocaleString(),
        user: user.id,
        groupId: "no group",
        progress: 0, // Track progress in DB
      };

      const campaignResponse = await axios.post(
        `${apiConfig.baseURL}/api/stud/camhistory`,
        campaignHistoryData
      );
      const campaignId = campaignResponse.data.id;
      console.log("Initial Campaign History Saved:", campaignResponse.data);

      for (const email of recipients) {
        try {
          const response = await axios.post(
            `${apiConfig.baseURL}/api/stud/sendtestmail`,
            {
              emailData: { ...emailData, recipient: email },
              previewContent,
              bgColor,
              aliasName,
              replyTo,
              attachments,
              campaignId,
              userId: user.id,
            }
          );

          if (response.status === 200) {
            sentEmails.push(email);
          } else {
            console.error(`Failed to send email to ${email}:`, response);
            failedEmails.push(email);
          }
        } catch (err) {
          console.error(`Error sending email to ${email}:`, err);
          failedEmails.push(email);
        }
      }
      // Final progress & status
      const failedCount = failedEmails.length;
      const successCount = sentEmails.length;
      const totalEmails = recipients.length;
      const progress =
        failedCount > 0 ? Math.round((failedCount / totalEmails) * 100) : 100;
      const finalStatus = failedCount > 0 ? "Failed" : "Success";

      await axios.put(
        `${apiConfig.baseURL}/api/stud/camhistory/${campaignId}`,
        {
          sendcount: successCount,
          failedcount: failedCount,
          sentEmails,
          failedEmails,
          status: finalStatus,
          progress,
        }
      );
      console.log("Emails sent successfully");
    } catch (error) {
      console.error("Error in sendEmail:", error);
    } finally {
      setIsLoading(false);
    }
  };

  //add variable
  const handleInsertName = (index, name) => {
    const updatedPreviewContent = [...previewContent];

    // Append {fname} or {lname} at the end of the existing content
    updatedPreviewContent[index].content += name;

    setPreviewContent(updatedPreviewContent);
    setSelectedGroup(false);
  };

  const handleCursorPosition = (e, index) => {
    const cursorPosition = e.target.selectionStart; // Get the cursor position inside the content
    const updatedPreviewContent = [...previewContent];
    updatedPreviewContent[index].cursorPosition = cursorPosition;

    setPreviewContent(updatedPreviewContent);
  };

  // Drag and drop logic
  const handleDragStart = (index) => {
    dragIndex.current = index;
  };

  const handleDrop = (dropIndex) => {
    if (dragIndex.current !== null) {
      const tempContent = [...previewContent];
      const [draggedItem] = tempContent.splice(dragIndex.current, 1);
      tempContent.splice(dropIndex, 0, draggedItem);
      setPreviewContent(tempContent);
      dragIndex.current = null;
    }
  };

  const handleEditorDrop = (e) => {
    e.preventDefault();
    const type = dragIndex.current;
    if (type === "para") addText();
    else if (type === "head") addHeading();
    else if (type === "image") addImage();
    else if (type === "logo") addLogo();
    else if (type === "button") addButton();
    else if (type === "multi-image") addMultiImage();
    else if (type === "link-image") addlinkImage();
    else if (type === "imagewithtext") addImageText();
    else if (type === "textwithimage") addTextImage();
    else if (type === "video-icon") addVideo();
    else if (type === "icons") addSocialMedia();
    else if (type === "multipleimage") addMultipleImage();
    else if (type === "cardimage") addCardImage();
    else if (type === "break") addBreak();
    else if (type === "gap") addGap();
    else if (type === "banner") addBanner();
    else if (type === "multi-image-card") addMultiImagecard();

    dragIndex.current = null; // Reset the type after drop
  };

  const handleDragOver = (e) => {
    e.preventDefault(); // Allow drop by preventing default
  };

  //  // Toggle function that only works on mobile devices
  //  const handleToggle = () => {
  //    if (window.matchMedia("(max-width: 768px)").matches) {
  //      setShowMobileContent((prev) => !prev);
  //    }
  //  };

  const handleLinkClick = (e, index) => {
    e.preventDefault(); // Prevent default navigation
    const link = previewContent[index]?.link || "";
    if (link) {
      window.open(link.startsWith("http") ? link : `http://${link}`, "_blank");
    }
  };

  return (
    <div>
      <div className="mobile-content">
        <div className={`desktop-nav ${activeTablayout ? "hide-nav" : ""}`}>
          <nav className="navbar-read">
            <div>
              <h5 className="company-name-read">
                <span style={{ color: "#2f327D" }}>
                  {(() => {
                    let name = clickcampaigns?.campaignname || ""; // Ensure it's a string

                    if (!name.includes("IndividualClick-Retarget")) {
                      return `IndividualClick-Retarget ${name}`; // If not present, add Click-Retarget
                    }

                    let match = name.match(
                      /IndividualClick-Retarget(?:-(\d+))?/
                    );
                    let count = match && match[1] ? parseInt(match[1]) + 1 : 2; // If present, increment count

                    return name.replace(
                      /IndividualClick-Retarget(?:-\d+)?/,
                      `IndividualClick-Retarget-${count}`
                    );
                  })()}
                </span>
                <span style={{ color: "#f48c06" }}> Campaign</span>
              </h5>
            </div>
            <div>
              <button
                onClick={undo}
                disabled={undoStack.length === 0}
                className="undo-btn"
                data-tooltip="Undo" // Custom tooltip using data attribute
              >
                <i className="fas fa-undo-alt"></i>
              </button>

              <button
                onClick={redo}
                disabled={redoStack.length === 0}
                className="redo-btn"
                data-tooltip="Redo" // Custom tooltip using data attribute
              >
                <i className="fas fa-redo-alt"></i>
              </button>

              <button
                onClick={() => setIsMobileView(false)}
                className="navbar-button-Desktop"
              >
                <span className="Nav-icons">
                  <FaDesktop />
                </span>{" "}
                {/* <span className="nav-names">Desktop</span> */}
              </button>
              <button
                onClick={() => setIsMobileView(true)}
                className="navbar-button-Desktop"
              >
                <span className="Nav-icons">
                  <MdPhoneAndroid />
                </span>{" "}
                {/* <span className="nav-names">Mobile</span> */}
              </button>

              <button
                onClick={handleSaveButton}
                className="navbar-button-Desktop"
                data-tooltip="Save" // Custom tooltip using data attribute
              >
                <span className="Nav-icons">
                  <FaSave />
                </span>{" "}
              </button>

              <button
                onClick={() => setShowTemplateModal(true)}
                className="navbar-button-send"
              >
                <span className="Nav-icons">
                  <FaFileExport />
                </span>{" "}
                <span className="nav-names">Save As</span>
              </button>

              <button
                ref={templateRef}
                onClick={(e) => toggletemplate(e)}
                className="navbar-button-send"
              >
                <span className="Nav-icons">
                  <FaEye />
                </span>{" "}
                <span className="nav-names">Templates</span>
              </button>

              {/* Template List - Shown below View button when isOpen is true */}
              {isOpentemplate && (
                <div className="template-list" ref={templateRef}>
                  <p className="template-title">
                    <span>Select</span> Template
                  </p>
                  {templates.length > 0 ? (
                    <div className="template-container">
                      {templates.map((template) => (
                        <div
                          key={template._id}
                          className="template-item"
                          onClick={() => handlePreview(template)}
                        >
                          {template.temname}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="no-template">No templates available</div>
                  )}
                </div>
              )}

              <button
                onClick={() => setModalOpen(true)}
                className="navbar-button-send"
              >
                <span className="Nav-icons">
                  <MdSend />
                </span>{" "}
                <span className="nav-names">Send Mail</span>
              </button>
              <button onClick={handlebackcampaign} className="navbar-button">
                <span className="Nav-icons">
                  <FaArrowLeft />
                </span>{" "}
                <span className="nav-names">Home</span>
              </button>
            </div>
          </nav>
        </div>
        <div className="Mobile-nav">
          <nav className="navbar-read">
            <div className="navbar-header">
              <h5 className="company-name-read">
                <span style={{ color: "#2f327D" }}>
                  {(() => {
                    let name = clickcampaigns?.campaignname || ""; // Ensure it's a string

                    if (!name.includes("IndividualClick-Retarget")) {
                      return `IndividualClick-Retarget ${name}`; // If not present, add Click-Retarget
                    }

                    let match = name.match(
                      /IndividualClick-Retarget(?:-(\d+))?/
                    );
                    let count = match && match[1] ? parseInt(match[1]) + 1 : 2; // If present, increment count

                    return name.replace(
                      /IndividualClick-Retarget(?:-\d+)?/,
                      `IndividualClick-Retarget-${count}`
                    );
                  })()}
                </span>
                <span style={{ color: "#f48c06" }}> Campaign</span>
              </h5>
            </div>
            <div className="nav-edit">
              <div>
                <button
                  onClick={undo}
                  disabled={undoStack.length === 0}
                  className="undo-btn"
                  data-tooltip="Undo"
                >
                  <i className="fas fa-undo-alt"></i>
                </button>
              </div>
              <div>
                <button
                  onClick={redo}
                  disabled={redoStack.length === 0}
                  className="redo-btn"
                  data-tooltip="Redo"
                >
                  <i className="fas fa-redo-alt"></i>
                </button>
              </div>
              <div>
                <button
                  className="toggle-btn"
                  onClick={() => setIsNavOpen(!isNavOpen)}
                >
                  {isNavOpen ? <FaTimes /> : <FaBars />}
                </button>
              </div>
            </div>

            {isNavOpen && (
              <div className="navbar-content">
                <button
                  onClick={handleSaveButton}
                  className="navbar-button-send"
                >
                  <span className="Nav-icons">
                    <FaSave />
                  </span>{" "}
                  <span className="nav-names">Save</span>
                </button>

                <button
                  onClick={() => {
                    setShowTemplateModal(true);
                    if (window.innerWidth < 768) {
                      setIsNavOpen(false); // Close toggle only in mobile view
                    }
                  }}
                  className="navbar-button-sends"
                >
                  <span className="Nav-icons">
                    <FaFileExport />
                  </span>{" "}
                  <span className="nav-names">Save As</span>
                </button>

                <button
                  onClick={(e) => toggletemplate(e)}
                  className="navbar-button-send"
                >
                  <span className="Nav-icons">
                    <FaEye />
                  </span>{" "}
                  <span className="nav-names">Templates</span>
                </button>

                {/* Template List - Shown below View button when isOpen is true */}
                {isOpentemplate && (
                  <div className="template-list" ref={templateRef}>
                    <p className="template-title">
                      <span>Select</span> Template
                    </p>
                    {templates.length > 0 ? (
                      <div className="template-container">
                        {templates.map((template) => (
                          <div
                            key={template._id}
                            className="template-item"
                            onClick={() => handlePreview(template)}
                          >
                            {template.temname}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="no-template">No templates available</div>
                    )}
                  </div>
                )}
                <button className="navbar-button-send">
                  <span className="Nav-icons">
                    <MdSend />
                  </span>{" "}
                  <span className="nav-names">Send Mail</span>
                </button>

                <button onClick={handlebackcampaign} className="navbar-button">
                  <span className="Nav-icons">
                    <FaArrowLeft />
                  </span>
                  <span className="nav-names">Home</span>
                </button>
              </div>
            )}
          </nav>
        </div>

        <div className="app-container">
          {/* Left Editor */}
          <div className="editor item-2">
            <div className="tabs">
              <button className="tab">Components</button>
            </div>

            {/* Tab Content */}
            <div className="edit-btn">
              <div className="content-tab">
                <button
                  onClick={addLogo}
                  className="editor-button"
                  draggable
                  onDragStart={(e) => handleDragStart("logo")}
                >
                  <MdAddPhotoAlternate /> Logo
                </button>
                <button
                  onClick={addBanner}
                  className="editor-button"
                  draggable
                  onDragStart={(e) => handleDragStart("banner")}
                >
                  <FaImage />
                  Banner
                </button>
                <button
                  onClick={addHeading}
                  className="editor-button"
                  draggable
                  onDragStart={(e) => handleDragStart("head")}
                >
                  <FaHeading /> Heading
                </button>
                <button
                  onClick={addText}
                  className="editor-button"
                  draggable
                  onDragStart={(e) => handleDragStart("para")}
                >
                  <FaParagraph /> Paragraph
                </button>
                <button
                  onClick={addImage}
                  className="editor-button"
                  draggable
                  onDragStart={(e) => handleDragStart("image")}
                >
                  <FaImage /> Image
                </button>
                <button
                  onClick={addlinkImage}
                  className="editor-button"
                  draggable
                  onDragStart={(e) => handleDragStart("link-image")}
                >
                  <FaImage />
                  Clickable Image
                </button>
                <button
                  onClick={addMultiImage}
                  className="editor-button"
                  draggable
                  onDragStart={(e) => handleDragStart("multi-image")}
                >
                  <FaImage /> Multi-Image-Button
                </button>
                <button
                  onClick={addMultiImagecard}
                  className="editor-button"
                  draggable
                  onDragStart={(e) => handleDragStart("multi-image-card")}
                >
                  <FaImage /> Multi-Image-card
                </button>
                <button
                  onClick={addMultipleImage}
                  className="editor-button"
                  draggable
                  onDragStart={(e) => handleDragStart("multipleimage")}
                >
                  <FaImage /> Multi-Image
                </button>
                <button
                  onClick={addCardImage}
                  className="editor-button"
                  draggable
                  onDragStart={(e) => handleDragStart("cardimage")}
                >
                  <FaIdCard /> Image-Card
                </button>

                <button
                  onClick={addTextImage}
                  className="editor-button"
                  draggable
                  onDragStart={(e) => handleDragStart("textwithimage")}
                >
                  <FaFileImage /> Text-Image
                </button>
                <button
                  onClick={addImageText}
                  className="editor-button"
                  draggable
                  onDragStart={(e) => handleDragStart("imagewithtext")}
                >
                  <FaFileImage /> Image-Text
                </button>

                <button
                  onClick={addVideo}
                  className="editor-button"
                  draggable
                  onDragStart={(e) => handleDragStart("video-icon")}
                >
                  <FaVideo />
                  Video
                </button>
                <button
                  onClick={addSocialMedia}
                  className="editor-button"
                  draggable
                  onDragStart={(e) => handleDragStart("icons")}
                >
                  <FaGlobe />
                  Social Icons
                </button>
                <button
                  onClick={addBreak}
                  className="editor-button"
                  draggable
                  onDragStart={(e) => handleDragStart("break")}
                >
                  <svg
                    className="horizontal-line-icon"
                    width="24"
                    height="2"
                    viewBox="0 0 24 2"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <rect width="24" height="4" fill="#555" />
                  </svg>
                  Line Break
                </button>
                <button
                  onClick={addGap}
                  className="editor-button"
                  draggable
                  onDragStart={(e) => handleDragStart("gap")}
                >
                  <VerticalSpacingIcon />
                  Gap
                </button>
                <button
                  onClick={addButton}
                  className="editor-button"
                  draggable
                  onDragStart={(e) => handleDragStart("button")}
                >
                  <FaPlusSquare /> Button
                </button>

                {isMobilestylecolor ? (
                  <ColorPalettePicker
                    label={bgColor}
                    onChange={(color) => setBgColor(color)}
                  />
                ) : (
                  <button className="editor-button">
                    <input
                      type="color"
                      value={bgColor}
                      onChange={(e) => setBgColor(e.target.value)}
                      className="bg-color-pic"
                    />
                    Template-Bg
                  </button>
                )}
              </div>
            </div>
            <button
              onClick={() => setActiveTablayout(true)}
              className="file-manager-btn"
            >
              <FaFolderOpen /> File Manager
            </button>

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
                          onDragStart={() =>
                            setSelectedDraggedImageId(item._id)
                          }
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
            </FileManagerModal>

            {/* Styling Controls */}
            <>
              {selectedIndex !== null && previewContent[selectedIndex] && (
                <>
                  {" "}
                  {isMobilestyle ? (
                    <>
                      {isModalOpenstyle && (
                        <div className="modal-overlay-style">
                          <div className="modal-content-style">
                            <div className="modal-nav-style-control">
                              <h3 className="preview-title">Style Controls</h3>
                              <button
                                className="close-btn-style"
                                onClick={() => setIsModalOpenstyle(false)}
                              >
                                X
                              </button>
                            </div>
                            <div className="style-item">
                              {previewContent[selectedIndex].type ===
                                "para" && (
                                <>
                                  <ColorPicker
                                    label="Text Color"
                                    objectKey="style.color"
                                    previewContent={previewContent}
                                    selectedIndex={selectedIndex}
                                    updateContent={updateContent}
                                  />
                                  <ColorPicker
                                    label="Text Background"
                                    objectKey="style.backgroundColor"
                                    previewContent={previewContent}
                                    selectedIndex={selectedIndex}
                                    updateContent={updateContent}
                                  />
                                  <label>Border Radius (%):</label>
                                  <input
                                    type="range"
                                    min="0"
                                    max="50"
                                    value={parseInt(
                                      previewContent[
                                        selectedIndex
                                      ].style.borderRadius.replace("px", "")
                                    )}
                                    onChange={(e) =>
                                      updateContent(selectedIndex, {
                                        style: {
                                          ...previewContent[selectedIndex]
                                            .style,
                                          borderRadius: `${e.target.value}px`,
                                        },
                                      })
                                    }
                                  />
                                  <span>
                                    {parseInt(
                                      previewContent[
                                        selectedIndex
                                      ].style.borderRadius.replace("%", "")
                                    )}
                                    %
                                  </span>
                                </>
                              )}

                              {previewContent[selectedIndex].type ===
                                "multipleimage" && (
                                <>
                                  <h3 className="no-style">
                                    No Style Available For Multiple Image
                                  </h3>
                                </>
                              )}

                              {previewContent[selectedIndex].type === "gap" && (
                                <>
                                  <h3 className="no-style">
                                    No Style Available For Gap
                                  </h3>
                                </>
                              )}
                              {previewContent[selectedIndex].type ===
                                "break" && (
                                <>
                                  <h3 className="no-style">
                                    No Style Available For Break
                                  </h3>
                                </>
                              )}

                              {previewContent[selectedIndex].type ===
                                "head" && (
                                <>
                                  <label>Font Size:</label>
                                  <input
                                    type="number"
                                    value={parseInt(
                                      previewContent[
                                        selectedIndex
                                      ].style.fontSize.replace("px", "")
                                    )}
                                    onChange={(e) =>
                                      updateContent(selectedIndex, {
                                        style: {
                                          ...previewContent[selectedIndex]
                                            .style,
                                          fontSize: `${e.target.value}px`,
                                        },
                                      })
                                    }
                                  />
                                  <ColorPicker
                                    label="Text Color"
                                    objectKey="style.color"
                                    previewContent={previewContent}
                                    selectedIndex={selectedIndex}
                                    updateContent={updateContent}
                                  />
                                  <ColorPicker
                                    label="Text Background"
                                    objectKey="style.backgroundColor"
                                    previewContent={previewContent}
                                    selectedIndex={selectedIndex}
                                    updateContent={updateContent}
                                  />
                                  <label>Text Alignment:</label>
                                  <select
                                    value={
                                      previewContent[selectedIndex].style
                                        .textAlign
                                    }
                                    onChange={(e) =>
                                      updateContent(selectedIndex, {
                                        style: {
                                          ...previewContent[selectedIndex]
                                            .style,
                                          textAlign: e.target.value,
                                        },
                                      })
                                    }
                                  >
                                    <option value="left">Left</option>
                                    <option value="center">Center</option>
                                    <option value="right">Right</option>
                                  </select>
                                </>
                              )}
                              {previewContent[selectedIndex].type ===
                                "multipleimage" && (
                                <>
                                  <h3 className="no-style">
                                    No Style Available For Multiple Image
                                  </h3>
                                </>
                              )}

                              {previewContent[selectedIndex].type === "gap" && (
                                <>
                                  <h3 className="no-style">
                                    No Style Available For Gap
                                  </h3>
                                </>
                              )}
                              {previewContent[selectedIndex].type ===
                                "break" && (
                                <>
                                  <h3 className="no-style">
                                    No Style Available For Break
                                  </h3>
                                </>
                              )}

                              {previewContent[selectedIndex].type ===
                                "button" && (
                                <>
                                  <div className="button-type-selector">
                                    <label>Button Type:</label>
                                    <select
                                      value={
                                        previewContent[selectedIndex].buttonType
                                      }
                                      onChange={(e) =>
                                        updateContent(selectedIndex, {
                                          buttonType: e.target.value,
                                        })
                                      }
                                    >
                                      <option value="link">Link Button</option>
                                      <option value="whatsapp">WhatsApp</option>
                                      <option value="contact">Phone</option>
                                    </select>
                                  </div>
                                  {previewContent[selectedIndex].buttonType ===
                                    "whatsapp" && (
                                    <div className="whatsapp-message-container">
                                      <label>WhatsApp Number:</label>
                                      <input
                                        type="text"
                                        placeholder="Number with country code"
                                        value={
                                          previewContent[selectedIndex]
                                            .whatsappNumber || ""
                                        }
                                        onChange={(e) => {
                                          const updatedNumber = e.target.value;
                                          const message =
                                            previewContent[selectedIndex]
                                              .whatsappMessage ||
                                            "Hello, I want to connect with you!";
                                          updateContent(selectedIndex, {
                                            whatsappNumber: updatedNumber,
                                            link: `https://wa.me/${updatedNumber}?text=${encodeURIComponent(
                                              convertToWhatsAppText(message)
                                            )}`,
                                          });
                                        }}
                                      />

                                      <label>Default Message:</label>
                                      <div
                                        className="whatsapp-preview"
                                        onClick={() => {
                                          setSelectedContent(
                                            previewContent[selectedIndex]
                                              .whatsappMessage ||
                                              "Hello, I want to connect with you!"
                                          );
                                          setEditorType("whatsappMessage");
                                          setIsModalOpen(true);
                                        }}
                                        dangerouslySetInnerHTML={{
                                          __html: formatPreviewContent(
                                            previewContent[selectedIndex]
                                              .whatsappMessage ||
                                              "Hello, I want to connect with you!"
                                          ),
                                        }}
                                      />

                                      {isModalOpen &&
                                        editorType === "whatsappMessage" && (
                                          <ParaEditorbutton
                                            isOpen={isModalOpen}
                                            content={selectedContent}
                                            onSave={(newMessage) => {
                                              const number =
                                                previewContent[selectedIndex]
                                                  .whatsappNumber;
                                              updateContent(selectedIndex, {
                                                whatsappMessage: newMessage,
                                                link: `https://wa.me/${number}?text=${encodeURIComponent(
                                                  convertToWhatsAppText(
                                                    newMessage
                                                  )
                                                )}`,
                                              });
                                              setIsModalOpen(false);
                                            }}
                                            onClose={() =>
                                              setIsModalOpen(false)
                                            }
                                          />
                                        )}
                                    </div>
                                  )}

                                  {previewContent[selectedIndex].buttonType ===
                                    "contact" && (
                                    <div>
                                      <label>Phone Number:</label>
                                      <input
                                        type="text"
                                        placeholder="Number with country code"
                                        value={
                                          previewContent[selectedIndex]
                                            .contactNumber || ""
                                        }
                                        onChange={(e) => {
                                          const number = e.target.value;
                                          updateContent(selectedIndex, {
                                            contactNumber: number,
                                            link: `tel:${number}`,
                                          });
                                        }}
                                      />
                                    </div>
                                  )}

                                  {previewContent[selectedIndex].buttonType ===
                                    "link" && (
                                    <div>
                                      <label>Link URL:</label>
                                      <input
                                        type="text"
                                        placeholder="Enter URL"
                                        value={
                                          previewContent[selectedIndex].link ||
                                          ""
                                        }
                                        onChange={(e) =>
                                          updateContent(selectedIndex, {
                                            link: e.target.value,
                                          })
                                        }
                                      />
                                    </div>
                                  )}
                                  <label>Button name:</label>
                                  <input
                                    type="text"
                                    placeholder="Enter button name"
                                    value={
                                      previewContent[selectedIndex]
                                        .buttonType === "contact"
                                        ? `📞 ${
                                            previewContent[
                                              selectedIndex
                                            ].content?.replace(/^📞\s*/, "") ||
                                            ""
                                          }`
                                        : previewContent[selectedIndex]
                                            .content || ""
                                    }
                                    onChange={(e) => {
                                      const value = e.target.value;
                                      const buttonType =
                                        previewContent[selectedIndex]
                                          .buttonType;

                                      updateContent(selectedIndex, {
                                        content:
                                          buttonType === "contact"
                                            ? `📞 ${value.replace(
                                                /^📞\s*/,
                                                ""
                                              )}`
                                            : value,
                                      });
                                    }}
                                  />
                                  <ColorPicker
                                    label="Text Color"
                                    objectKey="style.color"
                                    previewContent={previewContent}
                                    selectedIndex={selectedIndex}
                                    updateContent={updateContent}
                                  />
                                  <ColorPicker
                                    label="Text Background"
                                    objectKey="style.backgroundColor"
                                    previewContent={previewContent}
                                    selectedIndex={selectedIndex}
                                    updateContent={updateContent}
                                  />
                                  <label>Text Alignment:</label>
                                  <select
                                    value={
                                      previewContent[selectedIndex]?.style
                                        ?.textAlign || ""
                                    }
                                    onChange={(e) =>
                                      updateContent(selectedIndex, {
                                        style: {
                                          ...previewContent[selectedIndex]
                                            .style,
                                          textAlign: e.target.value,
                                        },
                                      })
                                    }
                                  >
                                    <option value="left">Left</option>
                                    <option value="center">Center</option>
                                    <option value="right">Right</option>
                                  </select>
                                  <label>Button Size:</label>
                                  <div>
                                    <button
                                      className="modal-btn-size"
                                      onClick={() =>
                                        updateContent(selectedIndex, {
                                          style: {
                                            ...previewContent[selectedIndex]
                                              .style,
                                            width: "50%",
                                            margin: "0 auto", // Centering the button
                                          },
                                        })
                                      }
                                    >
                                      Small
                                    </button>
                                    <button
                                      className="modal-btn-size"
                                      onClick={() =>
                                        updateContent(selectedIndex, {
                                          style: {
                                            ...previewContent[selectedIndex]
                                              .style,
                                            width: "70%",
                                            margin: "0 auto",
                                          },
                                        })
                                      }
                                    >
                                      Medium
                                    </button>
                                    <button
                                      className="modal-btn-size"
                                      onClick={() =>
                                        updateContent(selectedIndex, {
                                          style: {
                                            ...previewContent[selectedIndex]
                                              .style,
                                            width: "90%",
                                            margin: "0 auto",
                                          },
                                        })
                                      }
                                    >
                                      Large
                                    </button>
                                  </div>

                                  <label>Border Radius (%):</label>
                                  <input
                                    type="range"
                                    min="0"
                                    max="50"
                                    value={parseInt(
                                      previewContent[
                                        selectedIndex
                                      ].style.borderRadius.replace("px", "")
                                    )}
                                    onChange={(e) =>
                                      updateContent(selectedIndex, {
                                        style: {
                                          ...previewContent[selectedIndex]
                                            .style,
                                          borderRadius: `${e.target.value}px`,
                                        },
                                      })
                                    }
                                  />
                                  <span>
                                    {parseInt(
                                      previewContent[
                                        selectedIndex
                                      ].style.borderRadius.replace("%", "")
                                    )}
                                    %
                                  </span>
                                  <label>Button Text Size:</label>
                                  <input
                                    type="range"
                                    min="10"
                                    max="30"
                                    value={parseInt(
                                      (
                                        previewContent[selectedIndex]?.style
                                          ?.fontSize || "15px"
                                      ).replace("px", "")
                                    )}
                                    onChange={(e) =>
                                      updateContent(selectedIndex, {
                                        style: {
                                          ...previewContent[selectedIndex]
                                            .style,
                                          fontSize: `${e.target.value}px`,
                                        },
                                      })
                                    }
                                  />
                                </>
                              )}

                              {/* New Editor for Multi-Image Links and Button Styling */}
                              {previewContent[selectedIndex].type ===
                                "multi-image" && (
                                <div>
                                  <div className="tab-container-style">
                                    <button
                                      className={`tab-style ${
                                        activeTab === "button1" ? "active" : ""
                                      }`}
                                      onClick={() => setActiveTab("button1")}
                                    >
                                      Button-1
                                    </button>
                                    <button
                                      className={`tab-style ${
                                        activeTab === "button2" ? "active" : ""
                                      }`}
                                      onClick={() => setActiveTab("button2")}
                                    >
                                      Button-2
                                    </button>
                                  </div>

                                  {activeTab === "button1" && (
                                    <div className="style-editor">
                                      <h4>Button-1 Styles</h4>
                                      <label>Button Name:</label>
                                      <input
                                        type="text"
                                        placeholder="Enter button name"
                                        value={
                                          previewContent[selectedIndex]
                                            .content1 || ""
                                        }
                                        onChange={(e) =>
                                          updateContent(selectedIndex, {
                                            content1: e.target.value,
                                          })
                                        }
                                      />
                                      <label>Button Link:</label>
                                      <input
                                        type="text"
                                        placeholder="Enter URL"
                                        value={
                                          previewContent[selectedIndex].link1
                                        }
                                        onChange={(e) =>
                                          updateContent(selectedIndex, {
                                            link1: e.target.value,
                                          })
                                        }
                                      />

                                      <ColorPicker
                                        label="Button Text Color"
                                        objectKey="buttonStyle1.color"
                                        previewContent={previewContent}
                                        selectedIndex={selectedIndex}
                                        updateContent={updateContent}
                                      />
                                      <ColorPicker
                                        label="Button Text Background"
                                        objectKey="buttonStyle1.backgroundColor"
                                        previewContent={previewContent}
                                        selectedIndex={selectedIndex}
                                        updateContent={updateContent}
                                      />

                                      <label>Text Alignment:</label>
                                      <select
                                        value={
                                          previewContent[selectedIndex]
                                            ?.buttonStyle1?.textAlign || ""
                                        }
                                        onChange={(e) =>
                                          updateContent(selectedIndex, {
                                            buttonStyle1: {
                                              ...previewContent[selectedIndex]
                                                .buttonStyle1,
                                              textAlign: e.target.value,
                                            },
                                          })
                                        }
                                      >
                                        <option value="left">Left</option>
                                        <option value="center">Center</option>
                                        <option value="right">Right</option>
                                      </select>
                                      <label>Button Size:</label>
                                      <div>
                                        <button
                                          className="modal-btn-size"
                                          onClick={() =>
                                            updateContent(selectedIndex, {
                                              buttonStyle1: {
                                                ...previewContent[selectedIndex]
                                                  .buttonStyle1,
                                                width: "auto",
                                              },
                                            })
                                          }
                                        >
                                          Small
                                        </button>
                                        <button
                                          className="modal-btn-size"
                                          onClick={() =>
                                            updateContent(selectedIndex, {
                                              buttonStyle1: {
                                                ...previewContent[selectedIndex]
                                                  .buttonStyle1,
                                                width: "50%",
                                              },
                                            })
                                          }
                                        >
                                          Medium
                                        </button>
                                        <button
                                          className="modal-btn-size"
                                          onClick={() =>
                                            updateContent(selectedIndex, {
                                              buttonStyle1: {
                                                ...previewContent[selectedIndex]
                                                  .buttonStyle1,
                                                width: "80%",
                                              },
                                            })
                                          }
                                        >
                                          Large
                                        </button>
                                      </div>

                                      <label>Border Radius (%):</label>
                                      <input
                                        type="range"
                                        min="0"
                                        max="50"
                                        value={parseInt(
                                          previewContent[
                                            selectedIndex
                                          ].buttonStyle1.borderRadius.replace(
                                            "px",
                                            ""
                                          )
                                        )}
                                        onChange={(e) =>
                                          updateContent(selectedIndex, {
                                            buttonStyle1: {
                                              ...previewContent[selectedIndex]
                                                .buttonStyle1,
                                              borderRadius: `${e.target.value}px`,
                                            },
                                          })
                                        }
                                      />
                                      <span>
                                        {parseInt(
                                          previewContent[
                                            selectedIndex
                                          ].buttonStyle1.borderRadius.replace(
                                            "%",
                                            ""
                                          )
                                        )}
                                        %
                                      </span>
                                    </div>
                                  )}

                                  {activeTab === "button2" && (
                                    <div className="style-editor">
                                      <h4>Button-2 Styles</h4>
                                      <label>Button Name:</label>
                                      <input
                                        type="text"
                                        placeholder="Enter button name"
                                        value={
                                          previewContent[selectedIndex]
                                            .content2 || ""
                                        }
                                        onChange={(e) =>
                                          updateContent(selectedIndex, {
                                            content2: e.target.value,
                                          })
                                        }
                                      />
                                      <label>Button Link:</label>
                                      <input
                                        type="text"
                                        placeholder="Enter URL"
                                        value={
                                          previewContent[selectedIndex].link2
                                        }
                                        onChange={(e) =>
                                          updateContent(selectedIndex, {
                                            link2: e.target.value,
                                          })
                                        }
                                      />
                                      <ColorPicker
                                        label="Button Text Color"
                                        objectKey="buttonStyle2.color"
                                        previewContent={previewContent}
                                        selectedIndex={selectedIndex}
                                        updateContent={updateContent}
                                      />
                                      <ColorPicker
                                        label="Button Text Background"
                                        objectKey="buttonStyle2.backgroundColor"
                                        previewContent={previewContent}
                                        selectedIndex={selectedIndex}
                                        updateContent={updateContent}
                                      />

                                      <label>Text Alignment:</label>
                                      <select
                                        value={
                                          previewContent[selectedIndex]
                                            ?.buttonStyle2?.textAlign || ""
                                        }
                                        onChange={(e) =>
                                          updateContent(selectedIndex, {
                                            buttonStyle2: {
                                              ...previewContent[selectedIndex]
                                                .buttonStyle2,
                                              textAlign: e.target.value,
                                            },
                                          })
                                        }
                                      >
                                        <option value="left">Left</option>
                                        <option value="center">Center</option>
                                        <option value="right">Right</option>
                                      </select>

                                      <label>Button Size:</label>
                                      <div>
                                        <button
                                          className="modal-btn-size"
                                          onClick={() =>
                                            updateContent(selectedIndex, {
                                              buttonStyle2: {
                                                ...previewContent[selectedIndex]
                                                  .buttonStyle2,
                                                width: "auto",
                                              },
                                            })
                                          }
                                        >
                                          Small
                                        </button>
                                        <button
                                          className="modal-btn-size"
                                          onClick={() =>
                                            updateContent(selectedIndex, {
                                              buttonStyle2: {
                                                ...previewContent[selectedIndex]
                                                  .buttonStyle2,
                                                width: "50%",
                                              },
                                            })
                                          }
                                        >
                                          Medium
                                        </button>
                                        <button
                                          className="modal-btn-size"
                                          onClick={() =>
                                            updateContent(selectedIndex, {
                                              buttonStyle2: {
                                                ...previewContent[selectedIndex]
                                                  .buttonStyle2,
                                                width: "80%",
                                              },
                                            })
                                          }
                                        >
                                          Large
                                        </button>
                                      </div>

                                      <label>Border Radius (%):</label>
                                      <input
                                        type="range"
                                        min="0"
                                        max="50"
                                        value={parseInt(
                                          previewContent[
                                            selectedIndex
                                          ].buttonStyle2.borderRadius.replace(
                                            "px",
                                            ""
                                          )
                                        )}
                                        onChange={(e) =>
                                          updateContent(selectedIndex, {
                                            buttonStyle2: {
                                              ...previewContent[selectedIndex]
                                                .buttonStyle2,
                                              borderRadius: `${e.target.value}px`,
                                            },
                                          })
                                        }
                                      />
                                      <span>
                                        {parseInt(
                                          previewContent[
                                            selectedIndex
                                          ].buttonStyle2.borderRadius.replace(
                                            "%",
                                            ""
                                          )
                                        )}
                                        %
                                      </span>
                                    </div>
                                  )}
                                </div>
                              )}

                              {/* btn card with muliple-image content  */}
                              {/* New Editor for Multi-Image Links and Button Styling */}
                              {previewContent[selectedIndex].type ===
                                "multi-image-card" && (
                                <div>
                                  <div className="tab-container-style">
                                    <button
                                      className={`tab-style ${
                                        activeTab === "button1" ? "active" : ""
                                      }`}
                                      onClick={() => setActiveTab("button1")}
                                    >
                                      Card Style-1
                                    </button>
                                    <button
                                      className={`tab-style ${
                                        activeTab === "button2" ? "active" : ""
                                      }`}
                                      onClick={() => setActiveTab("button2")}
                                    >
                                      Card Style-2
                                    </button>
                                  </div>

                                  {activeTab === "button1" && (
                                    <div className="style-editor">
                                      <h4 className="preview-title-card">
                                        Product-1
                                      </h4>
                                      {/* Title 1 */}
                                      <label>Product Title:</label>
                                      <input
                                        type="text"
                                        placeholder="Enter product title"
                                        value={
                                          previewContent[selectedIndex]
                                            .title1 || ""
                                        }
                                        onChange={(e) =>
                                          updateContent(selectedIndex, {
                                            title1: e.target.value,
                                          })
                                        }
                                      />

                                      {/* Original Price 1 */}
                                      <label>Original Price:</label>
                                      <input
                                        type="number"
                                        placeholder="Enter original price"
                                        value={
                                          previewContent[selectedIndex]
                                            .originalPrice1 || ""
                                        }
                                        onChange={(e) =>
                                          updateContent(selectedIndex, {
                                            originalPrice1: e.target.value,
                                          })
                                        }
                                      />

                                      {/* Offer Price 1 */}
                                      <label>Offer Price:</label>
                                      <input
                                        type="number"
                                        placeholder="Enter offer price"
                                        value={
                                          previewContent[selectedIndex]
                                            .offerPrice1 || ""
                                        }
                                        onChange={(e) =>
                                          updateContent(selectedIndex, {
                                            offerPrice1: e.target.value,
                                          })
                                        }
                                      />

                                      <h4 className="preview-title-card">
                                        Button-1
                                      </h4>

                                      <label>Button Name:</label>
                                      <input
                                        type="text"
                                        placeholder="Enter button name"
                                        value={
                                          previewContent[selectedIndex]
                                            .content1 || ""
                                        }
                                        onChange={(e) =>
                                          updateContent(selectedIndex, {
                                            content1: e.target.value,
                                          })
                                        }
                                      />
                                      <label>Button Link:</label>
                                      <input
                                        type="text"
                                        placeholder="Enter URL"
                                        value={
                                          previewContent[selectedIndex].link1
                                        }
                                        onChange={(e) =>
                                          updateContent(selectedIndex, {
                                            link1: e.target.value,
                                          })
                                        }
                                      />
                                      <ColorPicker
                                        label="Button Text Color"
                                        objectKey="buttonStyle1.color"
                                        previewContent={previewContent}
                                        selectedIndex={selectedIndex}
                                        updateContent={updateContent}
                                      />
                                      <ColorPicker
                                        label="Button Text Background"
                                        objectKey="buttonStyle1.backgroundColor"
                                        previewContent={previewContent}
                                        selectedIndex={selectedIndex}
                                        updateContent={updateContent}
                                      />

                                      <label>Text Alignment:</label>
                                      <select
                                        value={
                                          previewContent[selectedIndex]
                                            ?.buttonStyle1?.textAlign || ""
                                        }
                                        onChange={(e) =>
                                          updateContent(selectedIndex, {
                                            buttonStyle1: {
                                              ...previewContent[selectedIndex]
                                                .buttonStyle1,
                                              textAlign: e.target.value,
                                            },
                                          })
                                        }
                                      >
                                        <option value="left">Left</option>
                                        <option value="center">Center</option>
                                        <option value="right">Right</option>
                                      </select>
                                      <label>Button Size:</label>
                                      <div>
                                        <button
                                          className="modal-btn-size"
                                          onClick={() =>
                                            updateContent(selectedIndex, {
                                              buttonStyle1: {
                                                ...previewContent[selectedIndex]
                                                  .buttonStyle1,
                                                width: "auto",
                                              },
                                            })
                                          }
                                        >
                                          Small
                                        </button>
                                        <button
                                          className="modal-btn-size"
                                          onClick={() =>
                                            updateContent(selectedIndex, {
                                              buttonStyle1: {
                                                ...previewContent[selectedIndex]
                                                  .buttonStyle1,
                                                width: "50%",
                                              },
                                            })
                                          }
                                        >
                                          Medium
                                        </button>
                                        <button
                                          className="modal-btn-size"
                                          onClick={() =>
                                            updateContent(selectedIndex, {
                                              buttonStyle1: {
                                                ...previewContent[selectedIndex]
                                                  .buttonStyle1,
                                                width: "80%",
                                              },
                                            })
                                          }
                                        >
                                          Large
                                        </button>
                                      </div>
                                      <label>Border Radius (%):</label>
                                      <input
                                        type="range"
                                        min="0"
                                        max="50"
                                        value={parseInt(
                                          previewContent[
                                            selectedIndex
                                          ].buttonStyle1.borderRadius.replace(
                                            "px",
                                            ""
                                          )
                                        )}
                                        onChange={(e) =>
                                          updateContent(selectedIndex, {
                                            buttonStyle1: {
                                              ...previewContent[selectedIndex]
                                                .buttonStyle1,
                                              borderRadius: `${e.target.value}px`,
                                            },
                                          })
                                        }
                                      />
                                      <span>
                                        {parseInt(
                                          previewContent[
                                            selectedIndex
                                          ].buttonStyle1.borderRadius.replace(
                                            "%",
                                            ""
                                          )
                                        )}
                                        %
                                      </span>
                                    </div>
                                  )}

                                  {activeTab === "button2" && (
                                    <div className="style-editor">
                                      {/* Title 2 */}
                                      <h4 className="preview-title-card">
                                        Product-2
                                      </h4>
                                      <label>Product Title:</label>
                                      <input
                                        type="text"
                                        placeholder="Enter product title"
                                        value={
                                          previewContent[selectedIndex]
                                            .title2 || ""
                                        }
                                        onChange={(e) =>
                                          updateContent(selectedIndex, {
                                            title2: e.target.value,
                                          })
                                        }
                                      />

                                      {/* Original Price 2 */}
                                      <label>Original Price:</label>
                                      <input
                                        type="number"
                                        placeholder="Enter original price"
                                        value={
                                          previewContent[selectedIndex]
                                            .originalPrice2 || ""
                                        }
                                        onChange={(e) =>
                                          updateContent(selectedIndex, {
                                            originalPrice2: e.target.value,
                                          })
                                        }
                                      />

                                      {/* Offer Price 2 */}
                                      <label>Offer Price:</label>
                                      <input
                                        type="number"
                                        placeholder="Enter offer price"
                                        value={
                                          previewContent[selectedIndex]
                                            .offerPrice2 || ""
                                        }
                                        onChange={(e) =>
                                          updateContent(selectedIndex, {
                                            offerPrice2: e.target.value,
                                          })
                                        }
                                      />

                                      <h4 className="preview-title-card">
                                        Button-2
                                      </h4>
                                      <label>Button Name:</label>
                                      <input
                                        type="text"
                                        placeholder="Enter button name"
                                        value={
                                          previewContent[selectedIndex]
                                            .content2 || ""
                                        }
                                        onChange={(e) =>
                                          updateContent(selectedIndex, {
                                            content2: e.target.value,
                                          })
                                        }
                                      />
                                      <label>Button Link:</label>
                                      <input
                                        type="text"
                                        placeholder="Enter URL"
                                        value={
                                          previewContent[selectedIndex].link2
                                        }
                                        onChange={(e) =>
                                          updateContent(selectedIndex, {
                                            link2: e.target.value,
                                          })
                                        }
                                      />
                                      <ColorPicker
                                        label="Button Text Color"
                                        objectKey="buttonStyle2.color"
                                        previewContent={previewContent}
                                        selectedIndex={selectedIndex}
                                        updateContent={updateContent}
                                      />
                                      <ColorPicker
                                        label="Button Text Background"
                                        objectKey="buttonStyle2.backgroundColor"
                                        previewContent={previewContent}
                                        selectedIndex={selectedIndex}
                                        updateContent={updateContent}
                                      />
                                      <label>Text Alignment:</label>
                                      <select
                                        value={
                                          previewContent[selectedIndex]
                                            ?.buttonStyle2?.textAlign || ""
                                        }
                                        onChange={(e) =>
                                          updateContent(selectedIndex, {
                                            buttonStyle2: {
                                              ...previewContent[selectedIndex]
                                                .buttonStyle2,
                                              textAlign: e.target.value,
                                            },
                                          })
                                        }
                                      >
                                        <option value="left">Left</option>
                                        <option value="center">Center</option>
                                        <option value="right">Right</option>
                                      </select>

                                      <label>Button Size:</label>
                                      <div>
                                        <button
                                          className="modal-btn-size"
                                          onClick={() =>
                                            updateContent(selectedIndex, {
                                              buttonStyle2: {
                                                ...previewContent[selectedIndex]
                                                  .buttonStyle2,
                                                width: "auto",
                                              },
                                            })
                                          }
                                        >
                                          Small
                                        </button>
                                        <button
                                          className="modal-btn-size"
                                          onClick={() =>
                                            updateContent(selectedIndex, {
                                              buttonStyle2: {
                                                ...previewContent[selectedIndex]
                                                  .buttonStyle2,
                                                width: "50%",
                                              },
                                            })
                                          }
                                        >
                                          Medium
                                        </button>
                                        <button
                                          className="modal-btn-size"
                                          onClick={() =>
                                            updateContent(selectedIndex, {
                                              buttonStyle2: {
                                                ...previewContent[selectedIndex]
                                                  .buttonStyle2,
                                                width: "80%",
                                              },
                                            })
                                          }
                                        >
                                          Large
                                        </button>
                                      </div>

                                      <label>Border Radius (%):</label>
                                      <input
                                        type="range"
                                        min="0"
                                        max="50"
                                        value={parseInt(
                                          previewContent[
                                            selectedIndex
                                          ].buttonStyle2.borderRadius.replace(
                                            "px",
                                            ""
                                          )
                                        )}
                                        onChange={(e) =>
                                          updateContent(selectedIndex, {
                                            buttonStyle2: {
                                              ...previewContent[selectedIndex]
                                                .buttonStyle2,
                                              borderRadius: `${e.target.value}px`,
                                            },
                                          })
                                        }
                                      />
                                      <span>
                                        {parseInt(
                                          previewContent[
                                            selectedIndex
                                          ].buttonStyle2.borderRadius.replace(
                                            "%",
                                            ""
                                          )
                                        )}
                                        %
                                      </span>
                                    </div>
                                  )}
                                </div>
                              )}

                              {previewContent[selectedIndex]?.type ===
                                "icons" && (
                                <>
                                  <ColorPicker
                                    label="Background Color"
                                    objectKey="ContentStyle.backgroundColor"
                                    previewContent={previewContent}
                                    selectedIndex={selectedIndex}
                                    updateContent={updateContent}
                                  />
                                  <label>Link1:</label>
                                  <input
                                    type="text"
                                    placeholder="Enter URL"
                                    value={
                                      previewContent[selectedIndex].links1 || ""
                                    }
                                    onChange={(e) =>
                                      updateContent(selectedIndex, {
                                        links1: e.target.value,
                                      })
                                    }
                                  />

                                  <label>Link2:</label>
                                  <input
                                    type="text"
                                    placeholder="Enter URL"
                                    value={
                                      previewContent[selectedIndex].links2 || ""
                                    }
                                    onChange={(e) =>
                                      updateContent(selectedIndex, {
                                        links2: e.target.value,
                                      })
                                    }
                                  />

                                  <label>Link3:</label>
                                  <input
                                    type="text"
                                    placeholder="Enter URL"
                                    value={
                                      previewContent[selectedIndex].links3 || ""
                                    }
                                    onChange={(e) =>
                                      updateContent(selectedIndex, {
                                        links3: e.target.value,
                                      })
                                    }
                                  />

                                  <label>Link4:</label>
                                  <input
                                    type="text"
                                    placeholder="Enter URL"
                                    value={
                                      previewContent[selectedIndex].links4 || ""
                                    }
                                    onChange={(e) =>
                                      updateContent(selectedIndex, {
                                        links4: e.target.value,
                                      })
                                    }
                                  />
                                </>
                              )}

                              {previewContent[selectedIndex].type ===
                                "link-image" && (
                                <>
                                  <label>Size (%):</label>
                                  <input
                                    type="range"
                                    min="10"
                                    max="100"
                                    value={parseInt(
                                      previewContent[
                                        selectedIndex
                                      ].style.width.replace("%", "")
                                    )}
                                    onChange={(e) => {
                                      const newSize = e.target.value;
                                      updateContent(selectedIndex, {
                                        style: {
                                          ...previewContent[selectedIndex]
                                            .style,
                                          width: `${newSize}%`,
                                          // height: `${newSize * 5}px`, // Adjusting height based on size percentage
                                        },
                                      });
                                    }}
                                  />
                                  <span>
                                    {parseInt(
                                      previewContent[
                                        selectedIndex
                                      ].style.width.replace("%", "")
                                    )}
                                    %
                                  </span>

                                  <label>Border Radius (%):</label>
                                  <input
                                    type="range"
                                    min="0"
                                    max="50"
                                    value={parseInt(
                                      previewContent[
                                        selectedIndex
                                      ].style.borderRadius.replace("px", "")
                                    )}
                                    onChange={(e) =>
                                      updateContent(selectedIndex, {
                                        style: {
                                          ...previewContent[selectedIndex]
                                            .style,
                                          borderRadius: `${e.target.value}px`,
                                        },
                                      })
                                    }
                                  />
                                  <span>
                                    {parseInt(
                                      previewContent[
                                        selectedIndex
                                      ].style.borderRadius.replace("%", "")
                                    )}
                                    %
                                  </span>

                                  <ColorPicker
                                    label="Image Background"
                                    objectKey="style.backgroundColor"
                                    previewContent={previewContent}
                                    selectedIndex={selectedIndex}
                                    updateContent={updateContent}
                                  />

                                  <label>Link:</label>
                                  <input
                                    type="text"
                                    placeholder="Enter URL"
                                    value={
                                      previewContent[selectedIndex].link || ""
                                    }
                                    onChange={(e) =>
                                      updateContent(selectedIndex, {
                                        link: e.target.value,
                                      })
                                    }
                                  />
                                </>
                              )}

                              {previewContent[selectedIndex].type ===
                                "logo" && (
                                <>
                                  <label>Size (%):</label>
                                  <input
                                    type="range"
                                    min="10"
                                    max="100"
                                    value={
                                      parseInt(
                                        previewContent[
                                          selectedIndex
                                        ].style.width.replace("%", "")
                                      ) || 50
                                    }
                                    onChange={(e) => {
                                      const newSize = e.target.value;
                                      updateContent(selectedIndex, {
                                        style: {
                                          ...previewContent[selectedIndex]
                                            .style,
                                          width: `${newSize}%`,
                                          // height: `${newSize * 5}px`, // Adjusting height based on size percentage
                                        },
                                      });
                                    }}
                                  />
                                  <span>
                                    {parseInt(
                                      previewContent[
                                        selectedIndex
                                      ].style.width.replace("%", "")
                                    ) || 50}
                                    %
                                  </span>

                                  <label>Border Radius (%):</label>
                                  <input
                                    type="range"
                                    min="0"
                                    max="50"
                                    value={parseInt(
                                      previewContent[
                                        selectedIndex
                                      ].style.borderRadius.replace("px", "")
                                    )}
                                    onChange={(e) =>
                                      updateContent(selectedIndex, {
                                        style: {
                                          ...previewContent[selectedIndex]
                                            .style,
                                          borderRadius: `${e.target.value}px`,
                                        },
                                      })
                                    }
                                  />
                                  <span>
                                    {parseInt(
                                      previewContent[
                                        selectedIndex
                                      ].style.borderRadius.replace("%", "")
                                    )}
                                    %
                                  </span>

                                  <ColorPicker
                                    label="Image Background"
                                    objectKey="style.backgroundColor"
                                    previewContent={previewContent}
                                    selectedIndex={selectedIndex}
                                    updateContent={updateContent}
                                  />
                                </>
                              )}

                              {previewContent[selectedIndex].type ===
                                "textwithimage" && (
                                <>
                                  <ColorPicker
                                    label="Text Color"
                                    objectKey="style.color"
                                    previewContent={previewContent}
                                    selectedIndex={selectedIndex}
                                    updateContent={updateContent}
                                  />
                                  <ColorPicker
                                    label="Text Background"
                                    objectKey="style.backgroundColor"
                                    previewContent={previewContent}
                                    selectedIndex={selectedIndex}
                                    updateContent={updateContent}
                                  />
                                </>
                              )}

                              {previewContent[selectedIndex].type ===
                                "imagewithtext" && (
                                <>
                                  <ColorPicker
                                    label="Text Color"
                                    objectKey="style1.color"
                                    previewContent={previewContent}
                                    selectedIndex={selectedIndex}
                                    updateContent={updateContent}
                                  />
                                  <ColorPicker
                                    label="Text Background"
                                    objectKey="style1.backgroundColor"
                                    previewContent={previewContent}
                                    selectedIndex={selectedIndex}
                                    updateContent={updateContent}
                                  />
                                </>
                              )}

                              {previewContent[selectedIndex].type ===
                                "cardimage" && (
                                <>
                                  <label>Size (%):</label>
                                  <input
                                    type="range"
                                    min="70"
                                    max="100"
                                    value={parseInt(
                                      previewContent[
                                        selectedIndex
                                      ].style.width.replace("%", "")
                                    )}
                                    onChange={(e) => {
                                      const newSize = e.target.value;
                                      updateContent(selectedIndex, {
                                        style: {
                                          ...previewContent[selectedIndex]
                                            .style,
                                          width: `${newSize}%`,
                                          // height: `${newSize * 5}px`, // Adjusting height based on size percentage
                                        },
                                      });
                                    }}
                                  />
                                  <span>
                                    {parseInt(
                                      previewContent[
                                        selectedIndex
                                      ].style.width.replace("%", "")
                                    )}
                                    %
                                  </span>

                                  <ColorPicker
                                    label="Text Color"
                                    objectKey="style1.color"
                                    previewContent={previewContent}
                                    selectedIndex={selectedIndex}
                                    updateContent={updateContent}
                                  />
                                  <ColorPicker
                                    label="Text Background"
                                    objectKey="style1.backgroundColor"
                                    previewContent={previewContent}
                                    selectedIndex={selectedIndex}
                                    updateContent={updateContent}
                                  />
                                </>
                              )}

                              {previewContent[selectedIndex].type ===
                                "video-icon" && (
                                <>
                                  <label>Size (%):</label>
                                  <input
                                    type="range"
                                    min="50"
                                    max="100"
                                    value={parseInt(
                                      previewContent[
                                        selectedIndex
                                      ].style.width.replace("%", "")
                                    )}
                                    onChange={(e) => {
                                      const newSize = e.target.value;
                                      updateContent(selectedIndex, {
                                        style: {
                                          ...previewContent[selectedIndex]
                                            .style,
                                          width: `${newSize}%`,
                                          // height: `${newSize}px`, // Adjusting height based on size percentage
                                        },
                                      });
                                    }}
                                  />
                                  <span>
                                    {parseInt(
                                      previewContent[
                                        selectedIndex
                                      ].style.width.replace("%", "")
                                    )}
                                    %
                                  </span>

                                  <label>Border Radius (%):</label>
                                  <input
                                    type="range"
                                    min="0"
                                    max="50"
                                    value={parseInt(
                                      previewContent[
                                        selectedIndex
                                      ].style.borderRadius.replace("px", "")
                                    )}
                                    onChange={(e) =>
                                      updateContent(selectedIndex, {
                                        style: {
                                          ...previewContent[selectedIndex]
                                            .style,
                                          borderRadius: `${e.target.value}px`,
                                        },
                                      })
                                    }
                                  />
                                  <span>
                                    {parseInt(
                                      previewContent[
                                        selectedIndex
                                      ].style.borderRadius.replace("%", "")
                                    )}
                                    %
                                  </span>

                                  <label>Link:</label>
                                  <input
                                    type="text"
                                    placeholder="Enter URL"
                                    value={
                                      previewContent[selectedIndex].link || ""
                                    }
                                    onChange={(e) =>
                                      updateContent(selectedIndex, {
                                        link: e.target.value,
                                      })
                                    }
                                  />
                                </>
                              )}
                              {previewContent[selectedIndex].type ===
                                "banner" && (
                                <>
                                  <label>Border Radius (%):</label>
                                  <input
                                    type="range"
                                    min="0"
                                    max="50"
                                    value={parseInt(
                                      previewContent[
                                        selectedIndex
                                      ].style.borderRadius.replace("px", "")
                                    )}
                                    onChange={(e) =>
                                      updateContent(selectedIndex, {
                                        style: {
                                          ...previewContent[selectedIndex]
                                            .style,
                                          borderRadius: `${e.target.value}px`,
                                        },
                                      })
                                    }
                                  />
                                  <span>
                                    {parseInt(
                                      previewContent[
                                        selectedIndex
                                      ].style.borderRadius.replace("%", "")
                                    )}
                                    %
                                  </span>

                                  <ColorPicker
                                    label="Image Background"
                                    objectKey="style.backgroundColor"
                                    previewContent={previewContent}
                                    selectedIndex={selectedIndex}
                                    updateContent={updateContent}
                                  />
                                </>
                              )}

                              {previewContent[selectedIndex].type ===
                                "image" && (
                                <>
                                  <label>Size (%):</label>
                                  <input
                                    type="range"
                                    min="10"
                                    max="100"
                                    value={parseInt(
                                      previewContent[
                                        selectedIndex
                                      ].style.width.replace("%", "")
                                    )}
                                    onChange={(e) => {
                                      const newSize = e.target.value;
                                      updateContent(selectedIndex, {
                                        style: {
                                          ...previewContent[selectedIndex]
                                            .style,
                                          width: `${newSize}%`,
                                          // height: `${newSize * 5}px`, // Adjusting height based on size percentage
                                        },
                                      });
                                    }}
                                  />
                                  <span>
                                    {parseInt(
                                      previewContent[
                                        selectedIndex
                                      ].style.width.replace("%", "")
                                    )}
                                    %
                                  </span>
                                  <label>Border Radius (%):</label>
                                  <input
                                    type="range"
                                    min="0"
                                    max="50"
                                    value={parseInt(
                                      previewContent[
                                        selectedIndex
                                      ].style.borderRadius.replace("px", "")
                                    )}
                                    onChange={(e) =>
                                      updateContent(selectedIndex, {
                                        style: {
                                          ...previewContent[selectedIndex]
                                            .style,
                                          borderRadius: `${e.target.value}px`,
                                        },
                                      })
                                    }
                                  />
                                  <span>
                                    {parseInt(
                                      previewContent[
                                        selectedIndex
                                      ].style.borderRadius.replace("%", "")
                                    )}
                                    %
                                  </span>

                                  <ColorPicker
                                    label="Image Background"
                                    objectKey="style.backgroundColor"
                                    previewContent={previewContent}
                                    selectedIndex={selectedIndex}
                                    updateContent={updateContent}
                                  />
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="style-controls" ref={styleControlsRef}>
                      <h3>Style Controls</h3>
                      <div className="style-item">
                        {previewContent[selectedIndex].type === "para" && (
                          <>
                            <div className="editor-bg">
                              Text Color
                              <input
                                type="color"
                                value={
                                  previewContent[selectedIndex].style.color
                                }
                                onChange={(e) =>
                                  updateContent(selectedIndex, {
                                    style: {
                                      ...previewContent[selectedIndex].style,
                                      color: e.target.value,
                                    },
                                  })
                                }
                              />
                            </div>
                            <div className="editor-bg">
                              Text Background
                              <input
                                type="color"
                                value={
                                  previewContent[selectedIndex].style
                                    .backgroundColor || "#ffffff"
                                }
                                onChange={(e) =>
                                  updateContent(selectedIndex, {
                                    style: {
                                      ...previewContent[selectedIndex].style,
                                      backgroundColor: e.target.value,
                                    },
                                  })
                                }
                              />
                            </div>
                            <label>Border Radius (%):</label>
                            <input
                              type="range"
                              min="0"
                              max="50"
                              value={parseInt(
                                previewContent[
                                  selectedIndex
                                ].style.borderRadius.replace("px", "")
                              )}
                              onChange={(e) =>
                                updateContent(selectedIndex, {
                                  style: {
                                    ...previewContent[selectedIndex].style,
                                    borderRadius: `${e.target.value}px`,
                                  },
                                })
                              }
                            />
                            <span>
                              {parseInt(
                                previewContent[
                                  selectedIndex
                                ].style.borderRadius.replace("%", "")
                              )}
                              %
                            </span>
                          </>
                        )}

                        {previewContent[selectedIndex].type === "head" && (
                          <>
                            <label>Font Size:</label>
                            <input
                              type="number"
                              value={parseInt(
                                previewContent[
                                  selectedIndex
                                ].style.fontSize.replace("px", "")
                              )}
                              onChange={(e) =>
                                updateContent(selectedIndex, {
                                  style: {
                                    ...previewContent[selectedIndex].style,
                                    fontSize: `${e.target.value}px`,
                                  },
                                })
                              }
                            />
                            <div className="editor-bg">
                              Text Color
                              <input
                                type="color"
                                value={
                                  previewContent[selectedIndex].style.color
                                }
                                onChange={(e) =>
                                  updateContent(selectedIndex, {
                                    style: {
                                      ...previewContent[selectedIndex].style,
                                      color: e.target.value,
                                    },
                                  })
                                }
                              />
                            </div>
                            <div className="editor-bg">
                              Text Background
                              <input
                                type="color"
                                value={
                                  previewContent[selectedIndex].style
                                    .backgroundColor || "#ffffff"
                                }
                                onChange={(e) =>
                                  updateContent(selectedIndex, {
                                    style: {
                                      ...previewContent[selectedIndex].style,
                                      backgroundColor: e.target.value,
                                    },
                                  })
                                }
                              />
                            </div>
                            <label>Text Alignment:</label>
                            <select
                              value={
                                previewContent[selectedIndex].style.textAlign
                              }
                              onChange={(e) =>
                                updateContent(selectedIndex, {
                                  style: {
                                    ...previewContent[selectedIndex].style,
                                    textAlign: e.target.value,
                                  },
                                })
                              }
                            >
                              <option value="left">Left</option>
                              <option value="center">Center</option>
                              <option value="right">Right</option>
                            </select>
                          </>
                        )}
                        {previewContent[selectedIndex].type === "button" && (
                          <>
                            <div className="button-type-selector">
                              <label>Button Type:</label>
                              <select
                                value={previewContent[selectedIndex].buttonType}
                                onChange={(e) =>
                                  updateContent(selectedIndex, {
                                    buttonType: e.target.value,
                                  })
                                }
                              >
                                <option value="link">Link Button</option>
                                <option value="whatsapp">WhatsApp</option>
                                <option value="contact">Phone</option>
                              </select>
                            </div>

                            {previewContent[selectedIndex].buttonType ===
                              "whatsapp" && (
                              <div className="whatsapp-message-container">
                                <label>WhatsApp Number:</label>
                                <input
                                  type="text"
                                  placeholder="Number with country code"
                                  value={
                                    previewContent[selectedIndex]
                                      .whatsappNumber || ""
                                  }
                                  onChange={(e) => {
                                    const updatedNumber = e.target.value;
                                    const message =
                                      previewContent[selectedIndex]
                                        .whatsappMessage ||
                                      "Hello, I want to connect with you!";
                                    updateContent(selectedIndex, {
                                      whatsappNumber: updatedNumber,
                                      link: `https://wa.me/${updatedNumber}?text=${encodeURIComponent(
                                        convertToWhatsAppText(message)
                                      )}`,
                                    });
                                  }}
                                />

                                <label>Default Message:</label>
                                <div
                                  className="whatsapp-preview"
                                  onClick={() => {
                                    setSelectedContent(
                                      previewContent[selectedIndex]
                                        .whatsappMessage ||
                                        "Hello, I want to connect with you!"
                                    );
                                    setEditorType("whatsappMessage");
                                    setIsModalOpen(true);
                                  }}
                                  dangerouslySetInnerHTML={{
                                    __html: formatPreviewContent(
                                      previewContent[selectedIndex]
                                        .whatsappMessage ||
                                        "Hello, I want to connect with you!"
                                    ),
                                  }}
                                />

                                {isModalOpen &&
                                  editorType === "whatsappMessage" && (
                                    <ParaEditorbutton
                                      isOpen={isModalOpen}
                                      content={selectedContent}
                                      onSave={(newMessage) => {
                                        const number =
                                          previewContent[selectedIndex]
                                            .whatsappNumber;
                                        updateContent(selectedIndex, {
                                          whatsappMessage: newMessage,
                                          link: `https://wa.me/${number}?text=${encodeURIComponent(
                                            convertToWhatsAppText(newMessage)
                                          )}`,
                                        });
                                        setIsModalOpen(false);
                                      }}
                                      onClose={() => setIsModalOpen(false)}
                                    />
                                  )}
                              </div>
                            )}

                            {previewContent[selectedIndex].buttonType ===
                              "contact" && (
                              <div>
                                <label>Phone Number:</label>
                                <input
                                  type="text"
                                  placeholder="Number with country code"
                                  value={
                                    previewContent[selectedIndex]
                                      .contactNumber || ""
                                  }
                                  onChange={(e) => {
                                    const number = e.target.value;
                                    updateContent(selectedIndex, {
                                      contactNumber: number,
                                      link: `tel:${number}`,
                                    });
                                  }}
                                />
                              </div>
                            )}

                            {previewContent[selectedIndex].buttonType ===
                              "link" && (
                              <div>
                                <label>Link URL:</label>
                                <input
                                  type="text"
                                  placeholder="Enter URL"
                                  value={
                                    previewContent[selectedIndex].link || ""
                                  }
                                  onChange={(e) =>
                                    updateContent(selectedIndex, {
                                      link: e.target.value,
                                    })
                                  }
                                />
                              </div>
                            )}
                            <label>Button name:</label>
                            <input
                              type="text"
                              placeholder="Enter button name"
                              value={
                                previewContent[selectedIndex].buttonType ===
                                "contact"
                                  ? `📞 ${
                                      previewContent[
                                        selectedIndex
                                      ].content?.replace(/^📞\s*/, "") || ""
                                    }`
                                  : previewContent[selectedIndex].content || ""
                              }
                              onChange={(e) => {
                                const value = e.target.value;
                                const buttonType =
                                  previewContent[selectedIndex].buttonType;

                                updateContent(selectedIndex, {
                                  content:
                                    buttonType === "contact"
                                      ? `📞 ${value.replace(/^📞\s*/, "")}`
                                      : value,
                                });
                              }}
                            />
                            <div className="editor-bg">
                              Background Color
                              <input
                                type="color"
                                value={
                                  previewContent[selectedIndex].style
                                    .backgroundColor
                                }
                                onChange={(e) =>
                                  updateContent(selectedIndex, {
                                    style: {
                                      ...previewContent[selectedIndex].style,
                                      backgroundColor: e.target.value,
                                    },
                                  })
                                }
                              />
                            </div>
                            <div className="editor-bg">
                              Text Color
                              <input
                                type="color"
                                value={
                                  previewContent[selectedIndex].style.color
                                }
                                onChange={(e) =>
                                  updateContent(selectedIndex, {
                                    style: {
                                      ...previewContent[selectedIndex].style,
                                      color: e.target.value,
                                    },
                                  })
                                }
                              />
                            </div>
                            <label>Text Alignment:</label>
                            <select
                              value={
                                previewContent[selectedIndex]?.style
                                  ?.textAlign || ""
                              }
                              onChange={(e) =>
                                updateContent(selectedIndex, {
                                  style: {
                                    ...previewContent[selectedIndex].style,
                                    textAlign: e.target.value,
                                  },
                                })
                              }
                            >
                              <option value="left">Left</option>
                              <option value="center">Center</option>
                              <option value="right">Right</option>
                            </select>
                            <label>Button Size:</label>
                            <div>
                              <button
                                className="modal-btn-size"
                                onClick={() =>
                                  updateContent(selectedIndex, {
                                    style: {
                                      ...previewContent[selectedIndex].style,
                                      width: "50%",
                                      margin: "0 auto", // Centering the button
                                    },
                                  })
                                }
                              >
                                Small
                              </button>
                              <button
                                className="modal-btn-size"
                                onClick={() =>
                                  updateContent(selectedIndex, {
                                    style: {
                                      ...previewContent[selectedIndex].style,
                                      width: "70%",
                                      margin: "0 auto",
                                    },
                                  })
                                }
                              >
                                Medium
                              </button>
                              <button
                                className="modal-btn-size"
                                onClick={() =>
                                  updateContent(selectedIndex, {
                                    style: {
                                      ...previewContent[selectedIndex].style,
                                      width: "90%",
                                      margin: "0 auto",
                                    },
                                  })
                                }
                              >
                                Large
                              </button>
                            </div>

                            <label>Border Radius (%):</label>
                            <input
                              type="range"
                              min="0"
                              max="50"
                              value={parseInt(
                                previewContent[
                                  selectedIndex
                                ].style.borderRadius.replace("px", "")
                              )}
                              onChange={(e) =>
                                updateContent(selectedIndex, {
                                  style: {
                                    ...previewContent[selectedIndex].style,
                                    borderRadius: `${e.target.value}px`,
                                  },
                                })
                              }
                            />
                            <span>
                              {parseInt(
                                previewContent[
                                  selectedIndex
                                ].style.borderRadius.replace("%", "")
                              )}
                              %
                            </span>
                            <label>Button Text Size:</label>
                            <input
                              type="range"
                              min="10"
                              max="30"
                              value={parseInt(
                                (
                                  previewContent[selectedIndex]?.style
                                    ?.fontSize || "15px"
                                ).replace("px", "")
                              )}
                              onChange={(e) =>
                                updateContent(selectedIndex, {
                                  style: {
                                    ...previewContent[selectedIndex].style,
                                    fontSize: `${e.target.value}px`,
                                  },
                                })
                              }
                            />

                            {/* <label>Link:</label>
                            <input
                              type="text"
                              placeholder="Enter URL"
                              value={previewContent[selectedIndex].link || ""}
                              onChange={(e) =>
                                updateContent(selectedIndex, {
                                  link: e.target.value,
                                })
                              }
                            /> */}
                          </>
                        )}
                        {/* New Editor for Multi-Image Links and Button Styling */}
                        {previewContent[selectedIndex].type ===
                          "multi-image-card" && (
                          <div>
                            <div className="tab-container-style">
                              <button
                                className={`tab-style ${
                                  activeTab === "button1" ? "active" : ""
                                }`}
                                onClick={() => setActiveTab("button1")}
                              >
                                Card Style-1
                              </button>
                              <button
                                className={`tab-style ${
                                  activeTab === "button2" ? "active" : ""
                                }`}
                                onClick={() => setActiveTab("button2")}
                              >
                                Card Style-2
                              </button>
                            </div>

                            {activeTab === "button1" && (
                              <div className="style-editor">
                                <h4 className="preview-title-card">
                                  Product-1
                                </h4>
                                {/* Title 1 */}
                                <label>Product Title:</label>
                                <input
                                  type="text"
                                  placeholder="Enter product title"
                                  value={
                                    previewContent[selectedIndex].title1 || ""
                                  }
                                  onChange={(e) =>
                                    updateContent(selectedIndex, {
                                      title1: e.target.value,
                                    })
                                  }
                                />

                                {/* Original Price 1 */}
                                <label>Original Price:</label>
                                <input
                                  type="number"
                                  placeholder="Enter original price"
                                  value={
                                    previewContent[selectedIndex]
                                      .originalPrice1 || ""
                                  }
                                  onChange={(e) =>
                                    updateContent(selectedIndex, {
                                      originalPrice1: e.target.value,
                                    })
                                  }
                                />

                                {/* Offer Price 1 */}
                                <label>Offer Price:</label>
                                <input
                                  type="number"
                                  placeholder="Enter offer price"
                                  value={
                                    previewContent[selectedIndex].offerPrice1 ||
                                    ""
                                  }
                                  onChange={(e) =>
                                    updateContent(selectedIndex, {
                                      offerPrice1: e.target.value,
                                    })
                                  }
                                />

                                <h4 className="preview-title-card">Button-1</h4>

                                <label>Button Name:</label>
                                <input
                                  type="text"
                                  placeholder="Enter button name"
                                  value={
                                    previewContent[selectedIndex].content1 || ""
                                  }
                                  onChange={(e) =>
                                    updateContent(selectedIndex, {
                                      content1: e.target.value,
                                    })
                                  }
                                />
                                <label>Button Link:</label>
                                <input
                                  type="text"
                                  placeholder="Enter URL"
                                  value={previewContent[selectedIndex].link1}
                                  onChange={(e) =>
                                    updateContent(selectedIndex, {
                                      link1: e.target.value,
                                    })
                                  }
                                />
                                <div className="editor-bg">
                                  Button Text Color:
                                  <input
                                    type="color"
                                    value={
                                      previewContent[selectedIndex].buttonStyle1
                                        .color
                                    }
                                    onChange={(e) =>
                                      updateContent(selectedIndex, {
                                        buttonStyle1: {
                                          ...previewContent[selectedIndex]
                                            .buttonStyle1,
                                          color: e.target.value,
                                        },
                                      })
                                    }
                                  />
                                </div>
                                <div className="editor-bg">
                                  Button Background Color:
                                  <input
                                    type="color"
                                    value={
                                      previewContent[selectedIndex].buttonStyle1
                                        .backgroundColor
                                    }
                                    onChange={(e) =>
                                      updateContent(selectedIndex, {
                                        buttonStyle1: {
                                          ...previewContent[selectedIndex]
                                            .buttonStyle1,
                                          backgroundColor: e.target.value,
                                        },
                                      })
                                    }
                                  />
                                </div>

                                <label>Text Alignment:</label>
                                <select
                                  value={
                                    previewContent[selectedIndex]?.buttonStyle1
                                      ?.textAlign || ""
                                  }
                                  onChange={(e) =>
                                    updateContent(selectedIndex, {
                                      buttonStyle1: {
                                        ...previewContent[selectedIndex]
                                          .buttonStyle1,
                                        textAlign: e.target.value,
                                      },
                                    })
                                  }
                                >
                                  <option value="left">Left</option>
                                  <option value="center">Center</option>
                                  <option value="right">Right</option>
                                </select>
                                <label>Button Size:</label>
                                <div>
                                  <button
                                    className="modal-btn-size"
                                    onClick={() =>
                                      updateContent(selectedIndex, {
                                        buttonStyle1: {
                                          ...previewContent[selectedIndex]
                                            .buttonStyle1,
                                          width: "auto",
                                        },
                                      })
                                    }
                                  >
                                    Small
                                  </button>
                                  <button
                                    className="modal-btn-size"
                                    onClick={() =>
                                      updateContent(selectedIndex, {
                                        buttonStyle1: {
                                          ...previewContent[selectedIndex]
                                            .buttonStyle1,
                                          width: "50%",
                                        },
                                      })
                                    }
                                  >
                                    Medium
                                  </button>
                                  <button
                                    className="modal-btn-size"
                                    onClick={() =>
                                      updateContent(selectedIndex, {
                                        buttonStyle1: {
                                          ...previewContent[selectedIndex]
                                            .buttonStyle1,
                                          width: "80%",
                                        },
                                      })
                                    }
                                  >
                                    Large
                                  </button>
                                </div>
                                <label>Border Radius (%):</label>
                                <input
                                  type="range"
                                  min="0"
                                  max="50"
                                  value={parseInt(
                                    previewContent[
                                      selectedIndex
                                    ].buttonStyle1.borderRadius.replace(
                                      "px",
                                      ""
                                    )
                                  )}
                                  onChange={(e) =>
                                    updateContent(selectedIndex, {
                                      buttonStyle1: {
                                        ...previewContent[selectedIndex]
                                          .buttonStyle1,
                                        borderRadius: `${e.target.value}px`,
                                      },
                                    })
                                  }
                                />
                                <span>
                                  {parseInt(
                                    previewContent[
                                      selectedIndex
                                    ].buttonStyle1.borderRadius.replace("%", "")
                                  )}
                                  %
                                </span>
                              </div>
                            )}

                            {activeTab === "button2" && (
                              <div className="style-editor">
                                {/* Title 2 */}
                                <h4 className="preview-title-card">
                                  Product-2
                                </h4>
                                <label>Product Title:</label>
                                <input
                                  type="text"
                                  placeholder="Enter product title"
                                  value={
                                    previewContent[selectedIndex].title2 || ""
                                  }
                                  onChange={(e) =>
                                    updateContent(selectedIndex, {
                                      title2: e.target.value,
                                    })
                                  }
                                />

                                {/* Original Price 2 */}
                                <label>Original Price:</label>
                                <input
                                  type="number"
                                  placeholder="Enter original price"
                                  value={
                                    previewContent[selectedIndex]
                                      .originalPrice2 || ""
                                  }
                                  onChange={(e) =>
                                    updateContent(selectedIndex, {
                                      originalPrice2: e.target.value,
                                    })
                                  }
                                />

                                {/* Offer Price 2 */}
                                <label>Offer Price:</label>
                                <input
                                  type="number"
                                  placeholder="Enter offer price"
                                  value={
                                    previewContent[selectedIndex].offerPrice2 ||
                                    ""
                                  }
                                  onChange={(e) =>
                                    updateContent(selectedIndex, {
                                      offerPrice2: e.target.value,
                                    })
                                  }
                                />

                                <h4 className="preview-title-card">Button-2</h4>
                                <label>Button Name:</label>
                                <input
                                  type="text"
                                  placeholder="Enter button name"
                                  value={
                                    previewContent[selectedIndex].content2 || ""
                                  }
                                  onChange={(e) =>
                                    updateContent(selectedIndex, {
                                      content2: e.target.value,
                                    })
                                  }
                                />
                                <label>Button Link:</label>
                                <input
                                  type="text"
                                  placeholder="Enter URL"
                                  value={previewContent[selectedIndex].link2}
                                  onChange={(e) =>
                                    updateContent(selectedIndex, {
                                      link2: e.target.value,
                                    })
                                  }
                                />
                                <div className="editor-bg">
                                  Button Text Color:
                                  <input
                                    type="color"
                                    value={
                                      previewContent[selectedIndex].buttonStyle2
                                        .color
                                    }
                                    onChange={(e) =>
                                      updateContent(selectedIndex, {
                                        buttonStyle2: {
                                          ...previewContent[selectedIndex]
                                            .buttonStyle2,
                                          color: e.target.value,
                                        },
                                      })
                                    }
                                  />
                                </div>

                                <div className="editor-bg">
                                  Button Background Color:
                                  <input
                                    type="color"
                                    value={
                                      previewContent[selectedIndex].buttonStyle2
                                        .backgroundColor
                                    }
                                    onChange={(e) =>
                                      updateContent(selectedIndex, {
                                        buttonStyle2: {
                                          ...previewContent[selectedIndex]
                                            .buttonStyle2,
                                          backgroundColor: e.target.value,
                                        },
                                      })
                                    }
                                  />
                                </div>

                                <label>Text Alignment:</label>
                                <select
                                  value={
                                    previewContent[selectedIndex]?.buttonStyle2
                                      ?.textAlign || ""
                                  }
                                  onChange={(e) =>
                                    updateContent(selectedIndex, {
                                      buttonStyle2: {
                                        ...previewContent[selectedIndex]
                                          .buttonStyle2,
                                        textAlign: e.target.value,
                                      },
                                    })
                                  }
                                >
                                  <option value="left">Left</option>
                                  <option value="center">Center</option>
                                  <option value="right">Right</option>
                                </select>

                                <label>Button Size:</label>
                                <div>
                                  <button
                                    className="modal-btn-size"
                                    onClick={() =>
                                      updateContent(selectedIndex, {
                                        buttonStyle2: {
                                          ...previewContent[selectedIndex]
                                            .buttonStyle2,
                                          width: "auto",
                                        },
                                      })
                                    }
                                  >
                                    Small
                                  </button>
                                  <button
                                    className="modal-btn-size"
                                    onClick={() =>
                                      updateContent(selectedIndex, {
                                        buttonStyle2: {
                                          ...previewContent[selectedIndex]
                                            .buttonStyle2,
                                          width: "50%",
                                        },
                                      })
                                    }
                                  >
                                    Medium
                                  </button>
                                  <button
                                    className="modal-btn-size"
                                    onClick={() =>
                                      updateContent(selectedIndex, {
                                        buttonStyle2: {
                                          ...previewContent[selectedIndex]
                                            .buttonStyle2,
                                          width: "80%",
                                        },
                                      })
                                    }
                                  >
                                    Large
                                  </button>
                                </div>

                                <label>Border Radius (%):</label>
                                <input
                                  type="range"
                                  min="0"
                                  max="50"
                                  value={parseInt(
                                    previewContent[
                                      selectedIndex
                                    ].buttonStyle2.borderRadius.replace(
                                      "px",
                                      ""
                                    )
                                  )}
                                  onChange={(e) =>
                                    updateContent(selectedIndex, {
                                      buttonStyle2: {
                                        ...previewContent[selectedIndex]
                                          .buttonStyle2,
                                        borderRadius: `${e.target.value}px`,
                                      },
                                    })
                                  }
                                />
                                <span>
                                  {parseInt(
                                    previewContent[
                                      selectedIndex
                                    ].buttonStyle2.borderRadius.replace("%", "")
                                  )}
                                  %
                                </span>
                              </div>
                            )}
                          </div>
                        )}

                        {/* New Editor for Multi-Image Links and Button Styling */}
                        {previewContent[selectedIndex].type ===
                          "multi-image" && (
                          <div>
                            <div className="tab-container-style">
                              <button
                                className={`tab-style ${
                                  activeTab === "button1" ? "active" : ""
                                }`}
                                onClick={() => setActiveTab("button1")}
                              >
                                Button-1
                              </button>
                              <button
                                className={`tab-style ${
                                  activeTab === "button2" ? "active" : ""
                                }`}
                                onClick={() => setActiveTab("button2")}
                              >
                                Button-2
                              </button>
                            </div>

                            {activeTab === "button1" && (
                              <div className="style-editor">
                                <h4>Button-1 Styles</h4>
                                <label>Button Name:</label>
                                <input
                                  type="text"
                                  placeholder="Enter button name"
                                  value={
                                    previewContent[selectedIndex].content1 || ""
                                  }
                                  onChange={(e) =>
                                    updateContent(selectedIndex, {
                                      content1: e.target.value,
                                    })
                                  }
                                />
                                <label>Button Link:</label>
                                <input
                                  type="text"
                                  placeholder="Enter URL"
                                  value={previewContent[selectedIndex].link1}
                                  onChange={(e) =>
                                    updateContent(selectedIndex, {
                                      link1: e.target.value,
                                    })
                                  }
                                />
                                <div className="editor-bg">
                                  Button Text Color:
                                  <input
                                    type="color"
                                    value={
                                      previewContent[selectedIndex].buttonStyle1
                                        .color
                                    }
                                    onChange={(e) =>
                                      updateContent(selectedIndex, {
                                        buttonStyle1: {
                                          ...previewContent[selectedIndex]
                                            .buttonStyle1,
                                          color: e.target.value,
                                        },
                                      })
                                    }
                                  />
                                </div>
                                <div className="editor-bg">
                                  Button Background Color:
                                  <input
                                    type="color"
                                    value={
                                      previewContent[selectedIndex].buttonStyle1
                                        .backgroundColor
                                    }
                                    onChange={(e) =>
                                      updateContent(selectedIndex, {
                                        buttonStyle1: {
                                          ...previewContent[selectedIndex]
                                            .buttonStyle1,
                                          backgroundColor: e.target.value,
                                        },
                                      })
                                    }
                                  />
                                </div>

                                <label>Text Alignment:</label>
                                <select
                                  value={
                                    previewContent[selectedIndex]?.buttonStyle1
                                      ?.textAlign || ""
                                  }
                                  onChange={(e) =>
                                    updateContent(selectedIndex, {
                                      buttonStyle1: {
                                        ...previewContent[selectedIndex]
                                          .buttonStyle1,
                                        textAlign: e.target.value,
                                      },
                                    })
                                  }
                                >
                                  <option value="left">Left</option>
                                  <option value="center">Center</option>
                                  <option value="right">Right</option>
                                </select>
                                <label>Button Size:</label>
                                <div>
                                  <button
                                    className="modal-btn-size"
                                    onClick={() =>
                                      updateContent(selectedIndex, {
                                        buttonStyle1: {
                                          ...previewContent[selectedIndex]
                                            .buttonStyle1,
                                          width: "auto",
                                        },
                                      })
                                    }
                                  >
                                    Small
                                  </button>
                                  <button
                                    className="modal-btn-size"
                                    onClick={() =>
                                      updateContent(selectedIndex, {
                                        buttonStyle1: {
                                          ...previewContent[selectedIndex]
                                            .buttonStyle1,
                                          width: "50%",
                                        },
                                      })
                                    }
                                  >
                                    Medium
                                  </button>
                                  <button
                                    className="modal-btn-size"
                                    onClick={() =>
                                      updateContent(selectedIndex, {
                                        buttonStyle1: {
                                          ...previewContent[selectedIndex]
                                            .buttonStyle1,
                                          width: "80%",
                                        },
                                      })
                                    }
                                  >
                                    Large
                                  </button>
                                </div>
                                <label>Border Radius (%):</label>
                                <input
                                  type="range"
                                  min="0"
                                  max="50"
                                  value={parseInt(
                                    previewContent[
                                      selectedIndex
                                    ].buttonStyle1.borderRadius.replace(
                                      "px",
                                      ""
                                    )
                                  )}
                                  onChange={(e) =>
                                    updateContent(selectedIndex, {
                                      buttonStyle1: {
                                        ...previewContent[selectedIndex]
                                          .buttonStyle1,
                                        borderRadius: `${e.target.value}px`,
                                      },
                                    })
                                  }
                                />
                                <span>
                                  {parseInt(
                                    previewContent[
                                      selectedIndex
                                    ].buttonStyle1.borderRadius.replace("%", "")
                                  )}
                                  %
                                </span>
                              </div>
                            )}

                            {activeTab === "button2" && (
                              <div className="style-editor">
                                <h4>Button-2 Styles</h4>
                                <label>Button Name:</label>
                                <input
                                  type="text"
                                  placeholder="Enter button name"
                                  value={
                                    previewContent[selectedIndex].content2 || ""
                                  }
                                  onChange={(e) =>
                                    updateContent(selectedIndex, {
                                      content2: e.target.value,
                                    })
                                  }
                                />
                                <label>Button Link:</label>
                                <input
                                  type="text"
                                  placeholder="Enter URL"
                                  value={previewContent[selectedIndex].link2}
                                  onChange={(e) =>
                                    updateContent(selectedIndex, {
                                      link2: e.target.value,
                                    })
                                  }
                                />
                                <div className="editor-bg">
                                  Button Text Color:
                                  <input
                                    type="color"
                                    value={
                                      previewContent[selectedIndex].buttonStyle2
                                        .color
                                    }
                                    onChange={(e) =>
                                      updateContent(selectedIndex, {
                                        buttonStyle2: {
                                          ...previewContent[selectedIndex]
                                            .buttonStyle2,
                                          color: e.target.value,
                                        },
                                      })
                                    }
                                  />
                                </div>

                                <div className="editor-bg">
                                  Button Background Color:
                                  <input
                                    type="color"
                                    value={
                                      previewContent[selectedIndex].buttonStyle2
                                        .backgroundColor
                                    }
                                    onChange={(e) =>
                                      updateContent(selectedIndex, {
                                        buttonStyle2: {
                                          ...previewContent[selectedIndex]
                                            .buttonStyle2,
                                          backgroundColor: e.target.value,
                                        },
                                      })
                                    }
                                  />
                                </div>

                                <label>Text Alignment:</label>
                                <select
                                  value={
                                    previewContent[selectedIndex]?.buttonStyle2
                                      ?.textAlign || ""
                                  }
                                  onChange={(e) =>
                                    updateContent(selectedIndex, {
                                      buttonStyle2: {
                                        ...previewContent[selectedIndex]
                                          .buttonStyle2,
                                        textAlign: e.target.value,
                                      },
                                    })
                                  }
                                >
                                  <option value="left">Left</option>
                                  <option value="center">Center</option>
                                  <option value="right">Right</option>
                                </select>

                                <label>Button Size:</label>
                                <div>
                                  <button
                                    className="modal-btn-size"
                                    onClick={() =>
                                      updateContent(selectedIndex, {
                                        buttonStyle2: {
                                          ...previewContent[selectedIndex]
                                            .buttonStyle2,
                                          width: "auto",
                                        },
                                      })
                                    }
                                  >
                                    Small
                                  </button>
                                  <button
                                    className="modal-btn-size"
                                    onClick={() =>
                                      updateContent(selectedIndex, {
                                        buttonStyle2: {
                                          ...previewContent[selectedIndex]
                                            .buttonStyle2,
                                          width: "50%",
                                        },
                                      })
                                    }
                                  >
                                    Medium
                                  </button>
                                  <button
                                    className="modal-btn-size"
                                    onClick={() =>
                                      updateContent(selectedIndex, {
                                        buttonStyle2: {
                                          ...previewContent[selectedIndex]
                                            .buttonStyle2,
                                          width: "80%",
                                        },
                                      })
                                    }
                                  >
                                    Large
                                  </button>
                                </div>

                                <label>Border Radius (%):</label>
                                <input
                                  type="range"
                                  min="0"
                                  max="50"
                                  value={parseInt(
                                    previewContent[
                                      selectedIndex
                                    ].buttonStyle2.borderRadius.replace(
                                      "px",
                                      ""
                                    )
                                  )}
                                  onChange={(e) =>
                                    updateContent(selectedIndex, {
                                      buttonStyle2: {
                                        ...previewContent[selectedIndex]
                                          .buttonStyle2,
                                        borderRadius: `${e.target.value}px`,
                                      },
                                    })
                                  }
                                />
                                <span>
                                  {parseInt(
                                    previewContent[
                                      selectedIndex
                                    ].buttonStyle2.borderRadius.replace("%", "")
                                  )}
                                  %
                                </span>
                              </div>
                            )}
                          </div>
                        )}

                        {previewContent[selectedIndex]?.type === "icons" && (
                          <>
                            <div className="editor-bg">
                              Background Color
                              <input
                                type="color"
                                value={
                                  previewContent[selectedIndex]?.ContentStyle
                                    ?.backgroundColor || "#ffffff"
                                }
                                onChange={(e) =>
                                  updateContent(selectedIndex, {
                                    ContentStyle: {
                                      ...previewContent[selectedIndex]
                                        .ContentStyle,
                                      backgroundColor: e.target.value,
                                    },
                                  })
                                }
                              />
                            </div>
                            <label>Link1:</label>
                            <input
                              type="text"
                              placeholder="Enter URL"
                              value={previewContent[selectedIndex].links1 || ""}
                              onChange={(e) =>
                                updateContent(selectedIndex, {
                                  links1: e.target.value,
                                })
                              }
                            />

                            <label>Link2:</label>
                            <input
                              type="text"
                              placeholder="Enter URL"
                              value={previewContent[selectedIndex].links2 || ""}
                              onChange={(e) =>
                                updateContent(selectedIndex, {
                                  links2: e.target.value,
                                })
                              }
                            />

                            <label>Link3:</label>
                            <input
                              type="text"
                              placeholder="Enter URL"
                              value={previewContent[selectedIndex].links3 || ""}
                              onChange={(e) =>
                                updateContent(selectedIndex, {
                                  links3: e.target.value,
                                })
                              }
                            />

                            <label>Link4:</label>
                            <input
                              type="text"
                              placeholder="Enter URL"
                              value={previewContent[selectedIndex].links4 || ""}
                              onChange={(e) =>
                                updateContent(selectedIndex, {
                                  links4: e.target.value,
                                })
                              }
                            />
                          </>
                        )}

                        {previewContent[selectedIndex].type ===
                          "link-image" && (
                          <>
                            <label>Size (%):</label>
                            <input
                              type="range"
                              min="10"
                              max="100"
                              value={parseInt(
                                previewContent[
                                  selectedIndex
                                ].style.width.replace("%", "")
                              )}
                              onChange={(e) => {
                                const newSize = e.target.value;
                                updateContent(selectedIndex, {
                                  style: {
                                    ...previewContent[selectedIndex].style,
                                    width: `${newSize}%`,
                                    // height: `${newSize * 5}px`, // Adjusting height based on size percentage
                                  },
                                });
                              }}
                            />
                            <span>
                              {parseInt(
                                previewContent[
                                  selectedIndex
                                ].style.width.replace("%", "")
                              )}
                              %
                            </span>

                            <label>Border Radius (%):</label>
                            <input
                              type="range"
                              min="0"
                              max="50"
                              value={parseInt(
                                previewContent[
                                  selectedIndex
                                ].style.borderRadius.replace("px", "")
                              )}
                              onChange={(e) =>
                                updateContent(selectedIndex, {
                                  style: {
                                    ...previewContent[selectedIndex].style,
                                    borderRadius: `${e.target.value}px`,
                                  },
                                })
                              }
                            />
                            <span>
                              {parseInt(
                                previewContent[
                                  selectedIndex
                                ].style.borderRadius.replace("%", "")
                              )}
                              %
                            </span>

                            <div className="editor-bg">
                              Image Background
                              <input
                                type="color"
                                value={
                                  previewContent[selectedIndex].style
                                    .backgroundColor || "#ffffff"
                                }
                                onChange={(e) =>
                                  updateContent(selectedIndex, {
                                    style: {
                                      ...previewContent[selectedIndex].style,
                                      backgroundColor: e.target.value,
                                    },
                                  })
                                }
                              />
                            </div>

                            <label>Link:</label>
                            <input
                              type="text"
                              placeholder="Enter URL"
                              value={previewContent[selectedIndex].link || ""}
                              onChange={(e) =>
                                updateContent(selectedIndex, {
                                  link: e.target.value,
                                })
                              }
                            />
                          </>
                        )}

                        {previewContent[selectedIndex].type === "logo" && (
                          <>
                            <label>Size (%):</label>
                            <input
                              type="range"
                              min="10"
                              max="100"
                              value={
                                parseInt(
                                  previewContent[
                                    selectedIndex
                                  ].style.width.replace("%", "")
                                ) || 50
                              }
                              onChange={(e) => {
                                const newSize = e.target.value;
                                updateContent(selectedIndex, {
                                  style: {
                                    ...previewContent[selectedIndex].style,
                                    width: `${newSize}%`,
                                    // height: `${newSize * 5}px`, // Adjusting height based on size percentage
                                  },
                                });
                              }}
                            />
                            <span>
                              {parseInt(
                                previewContent[
                                  selectedIndex
                                ].style.width.replace("%", "")
                              ) || 50}
                              %
                            </span>

                            <label>Border Radius (%):</label>
                            <input
                              type="range"
                              min="0"
                              max="50"
                              value={parseInt(
                                previewContent[
                                  selectedIndex
                                ].style.borderRadius.replace("px", "")
                              )}
                              onChange={(e) =>
                                updateContent(selectedIndex, {
                                  style: {
                                    ...previewContent[selectedIndex].style,
                                    borderRadius: `${e.target.value}px`,
                                  },
                                })
                              }
                            />
                            <span>
                              {parseInt(
                                previewContent[
                                  selectedIndex
                                ].style.borderRadius.replace("%", "")
                              )}
                              %
                            </span>

                            <div className="editor-bg">
                              Image Background
                              <input
                                type="color"
                                value={
                                  previewContent[selectedIndex].style
                                    .backgroundColor || "#ffffff"
                                }
                                onChange={(e) =>
                                  updateContent(selectedIndex, {
                                    style: {
                                      ...previewContent[selectedIndex].style,
                                      backgroundColor: e.target.value,
                                    },
                                  })
                                }
                              />
                            </div>
                          </>
                        )}

                        {previewContent[selectedIndex].type ===
                          "textwithimage" && (
                          <>
                            <div className="editor-bg">
                              Background Color
                              <input
                                type="color"
                                value={
                                  previewContent[selectedIndex].style
                                    .backgroundColor || "#ffffff"
                                }
                                onChange={(e) =>
                                  updateContent(selectedIndex, {
                                    style: {
                                      ...previewContent[selectedIndex].style,
                                      backgroundColor: e.target.value,
                                    },
                                  })
                                }
                              />
                            </div>
                            <div className="editor-bg">
                              Text Color
                              <input
                                type="color"
                                value={
                                  previewContent[selectedIndex].style.color ||
                                  "#ffffff"
                                }
                                onChange={(e) =>
                                  updateContent(selectedIndex, {
                                    style: {
                                      ...previewContent[selectedIndex].style,
                                      color: e.target.value,
                                    },
                                  })
                                }
                              />
                            </div>
                          </>
                        )}

                        {previewContent[selectedIndex].type ===
                          "imagewithtext" && (
                          <>
                            <div className="editor-bg">
                              Background Color
                              <input
                                type="color"
                                value={
                                  previewContent[selectedIndex].style1
                                    .backgroundColor || "#ffffff"
                                }
                                onChange={(e) =>
                                  updateContent(selectedIndex, {
                                    style1: {
                                      ...previewContent[selectedIndex].style1,
                                      backgroundColor: e.target.value,
                                    },
                                  })
                                }
                              />
                            </div>
                            <div className="editor-bg">
                              Text Color
                              <input
                                type="color"
                                value={
                                  previewContent[selectedIndex].style1.color ||
                                  "#ffffff"
                                }
                                onChange={(e) =>
                                  updateContent(selectedIndex, {
                                    style1: {
                                      ...previewContent[selectedIndex].style1,
                                      color: e.target.value,
                                    },
                                  })
                                }
                              />
                            </div>
                          </>
                        )}

                        {previewContent[selectedIndex].type === "cardimage" && (
                          <>
                            <label>Size (%):</label>
                            <input
                              type="range"
                              min="70"
                              max="100"
                              value={parseInt(
                                previewContent[
                                  selectedIndex
                                ].style.width.replace("%", "")
                              )}
                              onChange={(e) => {
                                const newSize = e.target.value;
                                updateContent(selectedIndex, {
                                  style: {
                                    ...previewContent[selectedIndex].style,
                                    width: `${newSize}%`,
                                    // height: `${newSize * 5}px`, // Adjusting height based on size percentage
                                  },
                                });
                              }}
                            />
                            <span>
                              {parseInt(
                                previewContent[
                                  selectedIndex
                                ].style.width.replace("%", "")
                              )}
                              %
                            </span>

                            <div className="editor-bg">
                              Background Color
                              <input
                                type="color"
                                value={
                                  previewContent[selectedIndex].style1
                                    .backgroundColor || "#ffffff"
                                }
                                onChange={(e) =>
                                  updateContent(selectedIndex, {
                                    style1: {
                                      ...previewContent[selectedIndex].style1,
                                      backgroundColor: e.target.value,
                                    },
                                  })
                                }
                              />
                            </div>
                            <div className="editor-bg">
                              Text Color
                              <input
                                type="color"
                                value={
                                  previewContent[selectedIndex].style1.color ||
                                  "#ffffff"
                                }
                                onChange={(e) =>
                                  updateContent(selectedIndex, {
                                    style1: {
                                      ...previewContent[selectedIndex].style1,
                                      color: e.target.value,
                                    },
                                  })
                                }
                              />
                            </div>
                          </>
                        )}

                        {previewContent[selectedIndex].type ===
                          "video-icon" && (
                          <>
                            <label>Size (%):</label>
                            <input
                              type="range"
                              min="50"
                              max="100"
                              value={parseInt(
                                previewContent[
                                  selectedIndex
                                ].style.width.replace("%", "")
                              )}
                              onChange={(e) => {
                                const newSize = e.target.value;
                                updateContent(selectedIndex, {
                                  style: {
                                    ...previewContent[selectedIndex].style,
                                    width: `${newSize}%`,
                                    // height: `${newSize}px`, // Adjusting height based on size percentage
                                  },
                                });
                              }}
                            />
                            <span>
                              {parseInt(
                                previewContent[
                                  selectedIndex
                                ].style.width.replace("%", "")
                              )}
                              %
                            </span>

                            <label>Border Radius (%):</label>
                            <input
                              type="range"
                              min="0"
                              max="50"
                              value={parseInt(
                                previewContent[
                                  selectedIndex
                                ].style.borderRadius.replace("px", "")
                              )}
                              onChange={(e) =>
                                updateContent(selectedIndex, {
                                  style: {
                                    ...previewContent[selectedIndex].style,
                                    borderRadius: `${e.target.value}px`,
                                  },
                                })
                              }
                            />
                            <span>
                              {parseInt(
                                previewContent[
                                  selectedIndex
                                ].style.borderRadius.replace("%", "")
                              )}
                              %
                            </span>

                            <label>Link:</label>
                            <input
                              type="text"
                              placeholder="Enter URL"
                              value={previewContent[selectedIndex].link || ""}
                              onChange={(e) =>
                                updateContent(selectedIndex, {
                                  link: e.target.value,
                                })
                              }
                            />
                          </>
                        )}

                        {previewContent[selectedIndex].type === "image" && (
                          <>
                            <label>Size (%):</label>
                            <input
                              type="range"
                              min="10"
                              max="100"
                              value={parseInt(
                                previewContent[
                                  selectedIndex
                                ].style.width.replace("%", "")
                              )}
                              onChange={(e) => {
                                const newSize = e.target.value;
                                updateContent(selectedIndex, {
                                  style: {
                                    ...previewContent[selectedIndex].style,
                                    width: `${newSize}%`,
                                    // height: `${newSize * 5}px`, // Adjusting height based on size percentage
                                  },
                                });
                              }}
                            />
                            <span>
                              {parseInt(
                                previewContent[
                                  selectedIndex
                                ].style.width.replace("%", "")
                              )}
                              %
                            </span>
                            <label>Border Radius (%):</label>
                            <input
                              type="range"
                              min="0"
                              max="50"
                              value={parseInt(
                                previewContent[
                                  selectedIndex
                                ].style.borderRadius.replace("px", "")
                              )}
                              onChange={(e) =>
                                updateContent(selectedIndex, {
                                  style: {
                                    ...previewContent[selectedIndex].style,
                                    borderRadius: `${e.target.value}px`,
                                  },
                                })
                              }
                            />
                            <span>
                              {parseInt(
                                previewContent[
                                  selectedIndex
                                ].style.borderRadius.replace("%", "")
                              )}
                              %
                            </span>

                            <div className="editor-bg">
                              Image Background
                              <input
                                type="color"
                                value={
                                  previewContent[selectedIndex].style
                                    .backgroundColor || "#ffffff"
                                }
                                onChange={(e) =>
                                  updateContent(selectedIndex, {
                                    style: {
                                      ...previewContent[selectedIndex].style,
                                      backgroundColor: e.target.value,
                                    },
                                  })
                                }
                              />
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  )}
                </>
              )}
            </>
          </div>

          {/* Right Preview */}
          <div className="preview-container item-1">
            {selectedTemplate && (
              <h3 className="temname">{selectedTemplate.temname} Template</h3>
            )}{" "}
            {/* Now it's used */}
            <div
              className={`template-preview ${
                isMobileView ? "mobile-view" : ""
              }`}
              style={{ backgroundColor: bgColor }}
              onDrop={handleEditorDrop}
              onDragOver={handleDragOver}
            >
              <div
                className="preview-card"
                style={{ backgroundColor: bgColor }}
              >
                {previewContent.map((item, index) => {
                  if (!item || !item.type) {
                    return null; // Skip rendering undefined or malformed items
                  }
                  return (
                    <div
                      key={index}
                      draggable
                      onDragStart={() => handleDragStart(index)}
                      onDragOver={(e) => e.preventDefault()}
                      onDrop={() => handleDrop(index)}
                      className="content-item"
                      onClick={() => handleItemClick(index)}
                      style={item.style}
                    >
                      {item.type === "para" && (
                        <>
                          <p
                            className="border-para"
                            contentEditable
                            suppressContentEditableWarning
                            onClick={() => {
                              setSelectedIndex(index);
                              setSelectedContent(item.content); // Store the correct content
                              setIsModalOpen(true); // Open the modal
                            }}
                            style={item.style}
                            dangerouslySetInnerHTML={{ __html: item.content }}
                          />
                          {isModalOpen && selectedIndex === index && (
                            <ParaEditor
                              isOpen={isModalOpen}
                              content={selectedContent} // Pass the correct content
                              style={item.style}
                              onSave={(newContent) => {
                                updateContent(index, { content: newContent }); // Save the new content
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
                                item.src1 || "https://via.placeholder.com/200"
                              }
                              alt="Editable"
                              className="multiimgcard"
                              title="Upload Image 240 x 240"
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
                                item.src2 || "https://via.placeholder.com/200"
                              }
                              alt="Editable"
                              className="multiimgcard"
                              title="Upload Image 240 x 240"
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
                                item.src1 || "https://via.placeholder.com/200"
                              }
                              alt="Editable"
                              className="multiple-img"
                              title="Upload Image 240 x 240"
                              style={item.style}
                              onClick={() => handleopenFiles(index, 1)}
                            />
                          </div>

                          <div className="Layout">
                            <img
                              src={
                                item.src2 || "https://via.placeholder.com/200"
                              }
                              alt="Editable"
                              className="multiple-img"
                              title="Upload Image 240 x 240"
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
                                item.src1 || "https://via.placeholder.com/200"
                              }
                              alt="Editable"
                              className="multiimg"
                              title="Upload Image 240 x 240"
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
                                item.src2 || "https://via.placeholder.com/200"
                              }
                              alt="Editable"
                              className="multiimg"
                              title="Upload Image 240 x 240"
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
                            src={item.src1 || "https://via.placeholder.com/200"}
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
                            src={item.src1 || "https://via.placeholder.com/200"}
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

                          {isModalOpen &&
                            modalIndex === index && ( // Open only for the selected index
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
                            onMouseUp={(e) => handleCursorPosition(e, index)}
                            onSelect={(e) => handleCursorPosition(e, index)}
                            style={item.style}
                          >
                            {item.content}
                          </p>

                          {/* Local state for each heading */}
                          <div className="select-group-container">
                            {/* Select Group */}
                            <select
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
                            </select>

                            {/* Show fields only for the selected heading */}
                            {selectedGroup[index] && openedGroups[index] && (
                              <div className="dropdown-container">
                                <p className="template-title">
                                  <span>Add</span> Variable
                                </p>
                                {fieldNames[index] &&
                                fieldNames[index].length > 0 ? (
                                  <div>
                                    {fieldNames[index].map((field, idx) => (
                                      <div
                                        className="list-field"
                                        key={idx}
                                        onClick={() =>
                                          handleInsertName(index, `{${field}}`)
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
                                item.src || "https://via.placeholder.com/200"
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
                            src={item.src || "https://via.placeholder.com/200"}
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
                              onClick={(e) => handleLinksClick2(e, item.links1)}
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
                              onClick={(e) => handleLinksClick2(e, item.links2)}
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
                              onClick={(e) => handleLinksClick2(e, item.links3)}
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
                              onClick={(e) => handleLinksClick2(e, item.links4)}
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
                                item.src1 || "https://via.placeholder.com/200"
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
                              onClick={() => {
                                setModalIndex(index);
                                setIsModalOpen(true); // Open the modal
                              }} // Open modal for this index
                              style={item.style}
                              dangerouslySetInnerHTML={{
                                __html: item.content1,
                              }}
                            />
                          </div>
                          {isModalOpen &&
                            modalIndex === index && ( // Open only for the selected index
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
                            src={item.src || "https://via.placeholder.com/200"}
                            alt="Editable"
                            className="img"
                            style={item.style}
                            title="Upload Image (1200 x 400)"
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
                              onClick={() => {
                                setModalIndex(index);
                                setIsModalOpen(true); // Open the modal
                              }} // Open modal for this index
                              style={item.style}
                              dangerouslySetInnerHTML={{
                                __html: item.content2,
                              }}
                            />
                            <img
                              src={
                                item.src2 || "https://via.placeholder.com/200"
                              }
                              alt="Editable"
                              className="image-item"
                              title="Upload Image"
                              onClick={() => handleopenFiles(index, 2)}
                            />
                          </div>
                          {isModalOpen &&
                            modalIndex === index && ( // Open only for the selected index
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
                            src={item.src || "https://via.placeholder.com/200"}
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
                            target={
                              item.buttonType === "link" ? "_blank" : undefined
                            }
                            rel="noopener noreferrer"
                            style={item.style}
                            className="button-preview"
                          >
                            {item.content ||
                              (item.buttonType === "whatsapp"
                                ? "Connect on WhatsApp"
                                : item.buttonType === "contact"
                                ? "Call Now"
                                : "Visit Link")}
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
                      <div className="del-edit-btn">
                        <button
                          className="delete-btn"
                          onClick={() => deleteContent(index)}
                        >
                          <FiTrash2 />
                        </button>
                        <button
                          className="edit-desktop-btn"
                          onClick={() => handleItemClickdesktop(index)}
                        >
                          <FiEdit />
                        </button>
                        <button
                          className="edit-con-btn"
                          onClick={() => setIsModalOpenstyle(true)}
                        >
                          <FiEdit />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Modal for preview Content */}
          {/* Right Preview */}

          {isPreviewOpen && (
            <div className="preview-modal-overlay-tem">
              <div className="preview-modal-content">
                <div className="preview-con item-1">
                  {selectedTemplatepre && (
                    <h3 className="temname">
                      {selectedTemplatepre.temname} Preview
                    </h3>
                  )}{" "}
                  {/* Now it's used */}
                  <div
                    className={`template-preview ${
                      isMobileView ? "mobile-view" : ""
                    }`}
                    style={{ backgroundColor: bgColorpre }}
                    onDrop={handleEditorDrop}
                    onDragOver={handleDragOver}
                  >
                    <div
                      className="preview-card"
                      style={{ backgroundColor: bgColorpre }}
                    >
                      {previewContentpre.map((item, index) => {
                        if (!item || !item.type) {
                          return null; // Skip rendering undefined or malformed items
                        }
                        return (
                          <div
                            className="content-item-preview"
                            style={item.style}
                          >
                            {item.type === "para" && (
                              <>
                                <p
                                  className="border-para"
                                  contentEditable
                                  suppressContentEditableWarning
                                  onClick={() => {
                                    setSelectedIndex(index);
                                    setIsModalOpen(true); // Open the modal
                                  }}
                                  style={item.style}
                                  dangerouslySetInnerHTML={{
                                    __html: item.content,
                                  }} // Render HTML content here
                                />
                              </>
                            )}

                            {item.type === "multi-image" ? (
                              <div className="Layout-img">
                                <div className="Layout">
                                  <img
                                    src={
                                      item.src1 ||
                                      "https://via.placeholder.com/200"
                                    }
                                    alt="Editable"
                                    className="multiimg"
                                    title="Upload Image"
                                    style={item.style}
                                    onClick={() => uploadImage(index, 1)}
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
                                      item.src2 ||
                                      "https://via.placeholder.com/200"
                                    }
                                    alt="Editable"
                                    className="multiimg"
                                    title="Upload Image"
                                    style={item.style}
                                    onClick={() => uploadImage(index, 2)}
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
                                    item.src1 ||
                                    "https://via.placeholder.com/200"
                                  }
                                  alt="Editable"
                                  className="videoimg"
                                  title="Upload Thumbnail Image"
                                  style={item.style}
                                  onClick={() => uploadImage(index, 1)}
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
                                    item.src1 ||
                                    "https://via.placeholder.com/200"
                                  }
                                  style={item.style}
                                  alt="Editable"
                                  className="card-image"
                                  title="Upload Image"
                                  onClick={() => uploadImage(index, 1)}
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

                            {item.type === "banner" && (
                              <div className="border">
                                <img
                                  src={
                                    item.src ||
                                    "https://via.placeholder.com/200"
                                  }
                                  alt="Editable"
                                  className="img"
                                  style={item.style}
                                />
                              </div>
                            )}
                            {item.type === "multi-image-card" ? (
                              <div className="Layout-img">
                                <div className="Layout">
                                  <img
                                    src={
                                      item.src1 ||
                                      "https://via.placeholder.com/200"
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
                                      item.src2 ||
                                      "https://via.placeholder.com/200"
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

                            {item.type === "head" && (
                              <div>
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
                                  onSelect={(e) =>
                                    handleCursorPosition(e, index)
                                  }
                                  style={item.style}
                                >
                                  {item.content}
                                </p>
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
                                      item.src ||
                                      "https://via.placeholder.com/200"
                                    }
                                    alt="Editable"
                                    className="img"
                                    style={item.style}
                                  />
                                </a>
                              </div>
                            )}
                            {item.type === "image" && (
                              <div className="border">
                                <img
                                  src={
                                    item.src ||
                                    "https://via.placeholder.com/200"
                                  }
                                  alt="Editable"
                                  className="img"
                                  style={item.style}
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

                            {item.type === "imagewithtext" ? (
                              <div className="image-text-container">
                                <div
                                  className="image-text-wrapper"
                                  style={item.style1}
                                >
                                  <img
                                    src={
                                      item.src1 ||
                                      "https://via.placeholder.com/200"
                                    }
                                    alt="Editable"
                                    className="image-item"
                                    title="Upload Image"
                                    onClick={() => uploadImage(index, 1)}
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

                            {item.type === "multipleimage" ? (
                              <div className="Layout-img">
                                <div className="Layout">
                                  <img
                                    src={
                                      item.src1 ||
                                      "https://via.placeholder.com/200"
                                    }
                                    alt="Editable"
                                    className="multiple-img"
                                    title="Upload Image"
                                    style={item.style}
                                    onClick={() => uploadImage(index, 1)}
                                  />
                                  {/* <a
                              href={item.link1}
                              target="_blank"
                              className="button-preview"
                              rel="noopener noreferrer"
                              style={item.buttonStyle1}
                            >
                              {item.content1}
                            </a> */}
                                </div>

                                <div className="Layout">
                                  <img
                                    src={
                                      item.src2 ||
                                      "https://via.placeholder.com/200"
                                    }
                                    alt="Editable"
                                    className="multiple-img"
                                    title="Upload Image"
                                    style={item.style}
                                    onClick={() => uploadImage(index, 2)}
                                  />
                                  {/* <a
                              href={item.link2}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="button-preview"
                              style={item.buttonStyle2}
                            >
                              {item.content2}
                            </a> */}
                                </div>
                              </div>
                            ) : null}

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
                                      item.src2 ||
                                      "https://via.placeholder.com/200"
                                    }
                                    alt="Editable"
                                    className="image-item"
                                    title="Upload Image"
                                    onClick={() => uploadImage(index, 2)}
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
                                    item.src ||
                                    "https://via.placeholder.com/200"
                                  }
                                  alt="Editable"
                                  className="logo"
                                  style={item.style}
                                />
                              </div>
                            )}
                            {item.type === "button" && (
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
                                  className="button-preview"
                                >
                                  {item.content ||
                                    (item.buttonType === "whatsapp"
                                      ? "Connect on WhatsApp"
                                      : item.buttonType === "contact"
                                      ? "Call Now"
                                      : "Visit Link")}
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
                </div>
                <button
                  className="preview-create-button"
                  onClick={() => handleTemplateSelect(selectedTemplatepre)}
                >
                  Select
                </button>
                <button
                  onClick={() => setIsPreviewOpen(false)}
                  className="preview-create-button"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          {/* Modal for Save Template */}
          {showTemplateModal && (
            <div className="campaign-modal-overlay-tem">
              <div className="campaign-modal-content">
                <h3>Save Template</h3>
                <input
                  type="text"
                  value={templateName}
                  onChange={(e) => setTemplateName(e.target.value)}
                  placeholder="Enter Template Name"
                  className="modal-input"
                />
                <button
                  className="modal-create-button"
                  onClick={handleSaveasButton}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <span className="loader-create"></span> // Spinner
                  ) : (
                    "Save"
                  )}{" "}
                </button>
                <button
                  onClick={handlecancel}
                  className="modal-create-button-cancel"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          {/* Show SendBulkModal when button is clicked */}
          {showSendModal && (
            <SendbulkModal
              isOpen={showSendModal}
              onClose={() => setShowSendModal(false)}
              bgColor={bgColor}
              previewContent={previewContent} // Pass previewContent to Sendbulkmail
            />
          )}

          {/* Show Sendexcelmail when button is clicked */}
          {showSendexcelModal && (
            <SendexcelModal
              isOpen={showSendexcelModal}
              onClose={() => setShowSendexcelModal(false)}
              bgColor={bgColor}
              previewContent={previewContent} // Pass previewContent to Sendexcelmail
            />
          )}

          {/* send mail Modal */}
          {isOpen && (
            <div className="modal-overlay-send">
              <div className="modal-content-send" ref={modalRef}>
                <h2>Select an Option</h2>

                {/* Card Structure with Icons */}
                <div className="button-group-send">
                  <button
                    className="modal-btn-send"
                    onClick={() => setModalOpen(true)}
                  >
                    <FaUser className="icon-send" />
                    Send Single
                  </button>
                  <button
                    className="modal-btn-send"
                    onClick={() => setShowSendModal(true)}
                  >
                    <FaUsers className="icon-send" />
                    Send Bulk
                  </button>
                  <button
                    className="modal-btn-send"
                    onClick={() => setShowSendexcelModal(true)}
                  >
                    <FaRocket className="icon-send" />
                    Send Bulk Instant
                  </button>
                </div>

                {/* Close Button */}
                <button
                  className="close-btn-send"
                  onClick={() => setIsOpen(false)}
                >
                  Close
                </button>
              </div>
            </div>
          )}

          {/* Modal */}
          {modalOpen && (
            <div className="modal">
              <div className="modal-content testmail-content">
                <h2>Send Single Mail</h2>
                <button
                  className="close-btn"
                  onClick={() => setModalOpen(false)}
                >
                  &times;
                </button>
                <label htmlFor="Email">Recipient Emails:</label>
                <div
                  style={{
                    maxHeight: "200px",
                    overflowY: "auto",
                    border: "1px solid #ccc",
                    padding: "10px",
                  }}
                >
                  <h3>Click-Retargert Email List</h3>
                  <ul style={{ listStyleType: "none", padding: 0 }}>
                    {singleemails.length > 0 ? (
                      singleemails.map((email, index) => (
                        <li
                          key={index}
                          style={{
                            padding: "5px 0",
                            borderBottom: "1px solid #eee",
                          }}
                        >
                          {email}
                        </li>
                      ))
                    ) : (
                      <li>No emails found</li>
                    )}
                  </ul>
                </div>
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
                    <button type="button" onClick={() => setShowModal(true)}>
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
                <label htmlFor="subject">Subject:</label>
                <input
                  type="text"
                  placeholder="Subject"
                  value={emailData.subject}
                  onChange={(e) =>
                    setEmailData({ ...emailData, subject: e.target.value })
                  }
                />
                <label htmlFor="preview-text">Preview Text:</label>
                <input
                  type="text"
                  placeholder="Preview Text"
                  value={emailData.previewtext}
                  onChange={(e) =>
                    setEmailData({ ...emailData, previewtext: e.target.value })
                  }
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
                  {emailData.attachments && emailData.attachments.length > 0 ? (
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

                {/* Toggle Button for Scheduled Mail */}
                <div className="toggle-container">
                  <span>
                    {isScheduled
                      ? "Scheduled Mail Enabled :"
                      : "Scheduled Mail Disabled :"}
                  </span>
                  <label className="switch">
                    <input
                      type="checkbox"
                      checked={isScheduled}
                      onChange={() => setIsScheduled(!isScheduled)}
                    />
                    <span className="slider-send round"></span>
                  </label>
                </div>

                {/* Show scheduled time input only if the toggle is enabled */}
                {isScheduled && (
                  <div style={{ marginBottom: "10px" }}>
                    <label htmlFor="schedule-time">Set Schedule Time:</label>{" "}
                    <DatePicker
                      id="schedule-time"
                      selected={scheduledTime ? new Date(scheduledTime) : null}
                      onChange={(date) => setScheduledTime(date.toISOString())}
                      showTimeSelect
                      timeIntervals={10} // Shows minutes as 0, 10, 20...
                      dateFormat="dd-MM-yyyy h:mm aa"
                      placeholderText="DD-MM-YYYY H:MM"
                    />
                  </div>
                )}
                <button
                  onClick={sendEmail}
                  className="modal-button"
                  disabled={isLoading || isScheduled} // Disable if scheduled is enabled
                >
                  {isLoading ? "Processing..." : "Send Now"}
                </button>
                <button
                  onClick={sendscheduleEmail}
                  disabled={isLoadingsch || !isScheduled} // Disable if scheduled is not enabled
                  className="modal-button"
                >
                  {isLoadingsch ? "Processing..." : "Scheduled"}
                </button>
                <button
                  onClick={() => setModalOpen(false)}
                  className="modal-button"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
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
  );
};

export default Clicksinglemainpage;
