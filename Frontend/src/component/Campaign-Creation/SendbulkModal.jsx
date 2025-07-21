import React, { useState, useEffect,useRef } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./SendbulkModal.css";
import apiConfig from "../../apiconfig/apiConfig";
import { useNavigate } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const SendbulkModal = ({ isOpen, onClose, previewContent = [], bgColor,temname }) => {
  const [groups, setGroups] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState("");
  const [message, setMessage] = useState("");
  const [emailData, setEmailData] = useState({ attachments: [] }); // Email data object
  const [isProcessing, setIsProcessing] = useState(false);
  const [isProcessingsch, setIsProcessingsch] = useState(false);
  const [isScheduled, setIsScheduled] = useState(false); // Toggle state
  const [previewtext, setPreviewtext] = useState("");
  const [aliasName, setAliasName] = useState("");
  const [replyTo, setReplyTo] = useState("");
  const [scheduledTime, setScheduledTime] = useState("");
  const [selectedGroupsub,setSelectedGroupsub]= useState(false);
  const [fieldNames, setFieldNames] = useState({});
  const [students, setStudents] = useState([]); // Stores all students
  const [aliasOptions, setAliasOptions] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [replyOptions, setReplyOptions] = useState([]);
  const [showModalreply, setShowModalreply] = useState(false);
  const [isLoading,setIsLoading] = useState(false);
  const [isLoadingreply,setIsLoadingreply] = useState(false);
  const user = JSON.parse(localStorage.getItem("user"));
  const campaign = JSON.parse(localStorage.getItem("campaign"));
  const navigate = useNavigate();
  const dropdownRef=useRef(null);
  
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
            aliasname:aliasName,
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
        (key) => !["_id", "group", "__v","lastSentYear","user","isUnsubscribed","createdAt","updatedAt"].includes(key)
        )
      : [];
  
    setFieldNames(newFieldNames);
  };

  const handleInsertNamesubject = (value) => {
    setMessage((prev) => (prev ? `${prev} ${value}` : value));
  
    // Reset selected group dropdown properly
    setSelectedGroupsub(false);
  };
  
  useEffect(() => {
    if (!user?.id) {
      console.warn("User ID is missing. Skipping data fetch.");
      return;
    }
    const fetchGroupsAndStudents = async () => {
      try {
        
        const [groupsResponse, studentsResponse] = await Promise.all([
          axios.get(`${apiConfig.baseURL}/api/stud/groups/${user.id}`),
          axios.get(`${apiConfig.baseURL}/api/stud/students?user=${user.id}`)
        ]);

        setGroups(groupsResponse.data);
        setStudents(studentsResponse.data);
      } catch (err) {
        console.error('Fetch error:', err);
        console.log('Failed to load data. Please try again.');
      }
    };

    fetchGroupsAndStudents(); 
  }, [user?.id]);
  
  // useEffect(() => {
  //   if (isOpen) {
  //     console.log("PreviewContent in SendbulkModal:", previewContent); // Log to verify
  //   }
  // }, [isOpen, previewContent]);



  const sendscheduleBulk = async () => {
       if (!previewContent || previewContent.length === 0) {
      toast.warning("No preview content available.");
      return;
    }
     if (!temname) {
  toast.warning("Please save your template before proceeding.");
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
    if (!selectedGroup || !message || !previewtext || !aliasName || !replyTo) {
      toast.warning(
        "Please ensure all field are filled"
      );
      return;
    }

 
    if (!scheduledTime) {
      toast.error("Please Select Date And Time");
      return;
    }

    setIsProcessingsch(true);

    try {
      // Fetch students from the selected group
      const studentsResponse = await axios.get(
        `${apiConfig.baseURL}/api/stud/groups/${selectedGroup}/students`
      );
      const students = studentsResponse.data;

      if (students.length === 0) {
        toast.warning("No students found in the selected group.");
        setIsProcessingsch(false);
        return;
      }
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

      // Store initial campaign history with "Pending" status
      const campaignHistoryData = {
        campaignname: campaign.camname,
        temname:temname,
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
        previewContent,
        bgColor,
        scheduledTime: new Date(scheduledTime).toISOString(),
        status: "Scheduled On",
        senddate: new Date().toLocaleString(),
        user: user.id,
        progress: 0,
        groupId: selectedGroup,
      };

      const campaignResponse = await axios.post(
        `${apiConfig.baseURL}/api/stud/camhistory`,
        campaignHistoryData
      );
      console.log("Initial Campaign History Saved:", campaignResponse.data);
      toast.success("Email scheduled successfully!");
      navigate("/campaigntable");
      sessionStorage.removeItem("firstVisit");
      sessionStorage.removeItem("toggled");
    } catch (error) {
      console.error("Error scheduling email:", error);
      toast.error("Failed to schedule email.");
    } finally {
      setIsProcessingsch(false);
    }
  };

const handleSend = async () => {
  if (!previewContent || previewContent.length === 0) {
      toast.warning("No preview content available.");
      return;
    }
    if (!temname) {
  toast.warning("Please save your template before proceeding.");
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
  if (!selectedGroup || !message || !previewtext || !aliasName || !replyTo) {
    toast.warning("Please ensure all fields are selected.");
    return;
  }


  setIsProcessing(true);

  try {
    let attachments = [];

    // File upload logic
    if (emailData.attachments?.length > 0) {
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

    // Get students
    const studentsResponse = await axios.get(
      `${apiConfig.baseURL}/api/stud/groups/${selectedGroup}/students`
    );
    const students = studentsResponse.data;

    if (students.length === 0) {
      toast.warning("No students found in the selected group.");
      setIsProcessing(false);
      return;
    }
 // Set refresh flag and navigate AFTER all operations complete
    localStorage.setItem("refreshCampaigns", "true");
    sessionStorage.removeItem("firstVisit");
    sessionStorage.removeItem("toggled");
    
    navigate("/campaigntable");
    // Prepare payload
    const payload = {
      campaignname: campaign.camname,
      temname:temname,
      groupname: groups.find((group) => group._id === selectedGroup)?.name,
      totalcount: students.length,
      subject: message,
      attachments,
      previewtext,
      aliasName,
      replyTo,
      previewContent,
      bgColor,
      scheduledTime: new Date(),
      senddate: new Date().toLocaleString(),
      user: user.id,
      groupId: selectedGroup,
      students
    };

    // Start campaign
    await axios.post(`${apiConfig.baseURL}/api/stud/start-campaign`, payload);
    
   

  } catch (error) {
    console.error("Campaign initiation failed:", error);
    toast.error("Failed to start campaign.");
  } finally {
    setIsProcessing(false);
  }
};



  if (!isOpen) return null;

  return (
    <div className="send-modal-overlay">
      <div className="send-modal-content">
        <button className="send-modal-close-btn" onClick={onClose}>
          &times;
        </button>
        <h2>Send Bulk Mail</h2>
        <div className="send-modal-form">
          <label htmlFor="group-select">Select Group:</label>
          <select
            id="group-select"
            value={selectedGroup}
            onChange={(e) => setSelectedGroup(e.target.value)}>
            <option value="">-- Select Group --</option>
            {groups.map((group) => (
              <option key={group._id} value={group._id}>
                {group.name}
              </option>
            ))}
          </select>
          <div className="alias-container-wrapper">
      <label htmlFor="aliasName-select" className="alias-container-label">Alias Name:</label>
      <div className="alias-container-flex">
        <select
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
      <button type="button" onClick={() => setShowModal(true)} >
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
              <button onClick={() => setShowModal(false)} className="alias-container-cancel-btn">Cancel</button>
              <button onClick={handleAddAlias} className="alias-container-save-btn"
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
      <label htmlFor="aliasName-select" className="alias-container-label">Reply To:</label>
      <div className="alias-container-flex">
        <select
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
      <button type="button" onClick={() => setShowModalreply(true)} >
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
              <button onClick={() => setShowModalreply(false)} className="alias-container-cancel-btn">Cancel</button>
              <button onClick={handleAddReply} className="alias-container-save-btn"
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
          <textarea
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
                        {fieldNames&& fieldNames.length > 0 ? (
                          <div>
                            {fieldNames.map((field, idx) => (
                              <div
                                className="list-field"
                                key={idx}
                                onClick={() => handleInsertNamesubject(`{${field}}`)}
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
          <textarea
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
              const allFiles = [...(emailData.attachments || []), ...newFiles];

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
                        const newAttachments = emailData.attachments.filter(
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
  <div style={{marginBottom:"10px"}}>
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

          <div className="action-btn">
            <button
              className="send-modal-submit-btn"
              onClick={handleSend}
              disabled={isProcessing || isScheduled} // Disable if scheduled is enabled
            >
              {isProcessing ? "Processing..." : "Send Now"}
            </button>

            <button
              onClick={sendscheduleBulk}
              className="send-modal-submit-btn"
              disabled={isProcessingsch || !isScheduled} // Disable if scheduled is not enabled
            >
              {isProcessingsch ? "Processing..." : "Scheduled"}
            </button>
            <button
              onClick={onClose}
              className="modal-create-button-cancel-bulk"
            >
              Cancel
            </button>
          </div>
        </div>
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
  );
};

export default SendbulkModal;
