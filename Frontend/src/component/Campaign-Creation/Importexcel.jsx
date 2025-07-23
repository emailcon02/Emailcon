import React, { useState, useEffect } from "react";
import { read, utils } from "xlsx";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./Importexcel.css";
import { FaInfoCircle } from "react-icons/fa";
import sampleexcel from "../../Images/excelsheet.png";
import apiConfig from "../../apiconfig/apiConfig";
import { useNavigate } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const ExcelModal = ({ isOpen, onClose, previewContent = [], bgColor,temname }) => {
  const [excelData, setExcelData] = useState([]);
  const [fileName, setFileName] = useState("");
  const [message, setMessage] = useState("");
  const [aliasName, setAliasName] = useState("");
  const [replyTo, setReplyTo] = useState("");
   const [aliasOptions, setAliasOptions] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [replyOptions, setReplyOptions] = useState([]);
    const [showModalreply, setShowModalreply] = useState(false);
  const [isRuleOpen, setIsRuleOpen] = useState("");
  const [emailData, setEmailData] = useState({ attachments: [] }); // Email data object
  const [isScheduled, setIsScheduled] = useState(false); // Toggle state
  const [previewtext, setPreviewtext] = useState("");
  const [scheduledTime, setScheduledTime] = useState("");
  const user = JSON.parse(localStorage.getItem("user"));
  const [isLoading, setIsLoading] = useState(false); // State for loader
  const [isLoadingreply, setIsLoadingreply] = useState(false); // State for loader
  const [isLoadingsch, setIsLoadingsch] = useState(false); // State for loader
  const campaign = JSON.parse(localStorage.getItem("campaign"));
  const navigate = useNavigate();

  // useEffect(() => {
  //   if (isOpen) {
  //     console.log("previewContent in SendexcelModal:", previewContent, bgColor);
  //   }
  // }, [isOpen, previewContent, bgColor]);

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
      const handleSpamCheck = () => {
        if(!message || message.trim() === "") {
          toast.warning("Please enter a subject to check for spam.");
          return;
        }
        const spamWords = [
        // Promotions / Urgency
        "free", "winner", "cash", "prize", "click here", "urgent", "money", "guaranteed",
        "offer", "buy now", "unsubscribe", "earn", "credit card", "lottery", "investment",
        "act now", "apply now", "limited time", "order now", "get started", "exclusive deal",
        "instant access", "risk-free", "don't delete", "this isn't spam", "urgent response needed",
      
        // Financial
        "congratulations", "no cost", "lowest price", "double your income", "extra income",
        "get out of debt", "increase sales", "increase traffic", "make money", "online biz opportunity",
        "financial freedom", "while you sleep", "work from home", "save big money", "fast cash",
        "zero cost", "hidden charges", "guaranteed income",
      
        // Scams / Tricks
        "act immediately", "this won’t last", "winner", "you are selected", "pre-approved",
        "no obligation", "easy terms", "no strings attached", "trial offer", "miracle", "access now",
        "free gift", "free info", "get paid", "cash bonus", "exclusive deal",
      
        // Shady behavior
        "bulk email", "this is not spam", "why pay more", "you have been selected", "important information",
        "claim now", "increase your income", "stop snoring", "lose weight", "viagra", "cheap meds",
        "refinance", "get loan", "click below", "act quickly", "special promotion",
      
        // Scam tactics
        "as seen on", "100% free", "credit repair", "hidden charges", "order today",
        "satisfaction guaranteed", "meet singles", "eliminate bad credit", "amazing stuff"
      ];
      
      
        const lowerCaseMessage = message.toLowerCase();
        const foundSpamWords = spamWords.filter(word => lowerCaseMessage.includes(word));
      
        if (foundSpamWords.length > 0) {
          toast.warning(`Spam content found: ${foundSpamWords.join(", ")}`);
        } else {
          toast.success("No spam detected!");
        }
      };


  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    setFileName(file.name);
    const reader = new FileReader();

    reader.onload = (e) => {
      const data = new Uint8Array(e.target.result);
      const workbook = read(data, { type: "array" });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];

      const jsonData = utils.sheet_to_json(sheet, { header: 1 });
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
    };
    reader.readAsArrayBuffer(file);
  };
  const sendscheduleExcel = async () => {
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
      toast.error("Please Select Alias Name.");
      return;
    }
    if (!replyTo) {
      toast.error("Please Select Replyto.");
      return;
    }
    if (!scheduledTime) {
      toast.error("Please Select Date And Time");
      return;
    }

    if (!message) {
      toast.error("Please Enter Subject.");
      return;
    }
    setIsLoadingsch(true); // Show loader
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

    try {
      // Store initial campaign history with "Pending" status
      const campaignHistoryData = {
        campaignname: campaign.camname,
        temname:temname,
        groupname: "Instant Send",
        totalcount: rows.filter((row) => row[emailIndex]).length, // Count non-empty emails
        sendcount: 0,
        recipients: "no mail",
        failedcount: 0,
        subject: message,
        previewtext,
        aliasName,replyTo,
        previewContent,
        bgColor,
        sentEmails,
        attachments,
        failedEmails,
        scheduledTime: new Date(scheduledTime).toISOString(),
        status: "Scheduled On",
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
      toast.success("Email scheduled successfully!");
      navigate("/campaigntable");
      sessionStorage.removeItem("firstVisit");
      sessionStorage.removeItem("toggled");
    } catch (error) {
      console.error("Error scheduling email:", error);
      toast.error("Failed to schedule email.");
    } finally {
      setIsLoadingsch(false);
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
  if (excelData.length === 0 || excelData.length <= 1) {
    toast.error("Please upload a valid Excel file.");
    return;
  }

  const [headers, ...rows] = excelData;
  if (!headers.includes("Email")) {
    toast.error("Excel must include an 'Email' column.");
    return;
  }



  if (!previewtext || !aliasName || !message || !replyTo) {
    toast.error("Please fill all required fields: Previewtext, Alias Name, ReplyTo, Subject.");
    return;
  }

  setIsLoading(true);
 // Set refresh flag and navigate AFTER all operations complete
    localStorage.setItem("refreshCampaigns", "true");
    sessionStorage.removeItem("firstVisit");
    sessionStorage.removeItem("toggled");
    
    navigate("/campaigntable");

  let attachments = [];

  try {
    // Upload attachments if any
    if (emailData.attachments && emailData.attachments.length > 0) {
      const formData = new FormData();
      emailData.attachments.forEach((file) => formData.append("attachments", file));
      formData.append("userId", user.id); // Include user ID in the form data

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

    // Format Excel rows into JSON objects
    const formattedExcelData = rows.map((row) =>
      headers.reduce((obj, header, index) => {
        obj[header] = row[index] || "";
        return obj;
      }, {})
    );

    const totalEmails = formattedExcelData.length;

    const payload = {
      campaignname: campaign.camname,
      temname:temname,
      groupname: "Instant Send",
      totalcount: totalEmails,
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
      groupId: "No id",
      students: formattedExcelData, 
    };

    // Send to backend for processing & sending
    await axios.post(`${apiConfig.baseURL}/api/stud/start-campaign`, payload);

    // Optional: toast.success("Campaign initiated successfully!");
  } catch (error) {
    console.error("🔥 Campaign initiation failed:", error.response?.data || error.message);
    toast.error("Failed to start campaign.");
  } finally {
    setIsLoading(false);
  }
};

 
  if (!isOpen) return null;

  return (
    <div className="excel-modal-overlay">
      <div className="excel-modal-content">
        <button className="excel-modal-close-btn" onClick={onClose}>
          &times;
        </button>
        <h2>Upload and Send Emails</h2>
        <div className="alias-container-wrapper">
      <label htmlFor="aliasName-select" className="alias-container-label">Alias Name:</label>
      <div className="alias-container-flex">
        <select
        style={{padding:"10px"}}
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
          style={{padding:"10px"}}
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
        <input
          type="text"
          id="subject-input"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Enter subject"
        />
        
 <div className="alias-container-add-button">
      <button type="button"onClick={handleSpamCheck}>
         Spam Check
      </button>
      </div>
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
        <div className="excel-modal-body">
          <h4>
            Sample excel format
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
                    The First Name, Last Name, and Email fields are mandatory.
                  </li>
                  <li>
                    All other fields are optional. You can create custom fields
                    based on your requirements.
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
          <input type="file" accept=".xlsx, .xls" onChange={handleFileUpload} />
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
         <div>
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
          className="excel-modal-send-btn"
          onClick={handleSend}
          disabled={isLoading || isScheduled} // Disable if scheduled is enabled
        >
          {isLoading ? "Processing..." : "Send Now"}
        </button>

        <button
          onClick={sendscheduleExcel}
          className="excel-modal-send-btn"
          disabled={isLoadingsch || !isScheduled} // Disable if scheduled is not enabled
        >
          {isLoadingsch ? "Processing..." : "Scheduled"}
        </button>
        <button
          onClick={onClose}
          className="modal-create-button-cancel-Instant"
        >
          Cancel
        </button>
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

export default ExcelModal;
