import React, { useEffect, useState } from "react";
import axios from "axios";
import "./CampaignTable.css";
import { FaArrowLeft, FaSearch,FaEdit } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import apiConfig from "../apiconfig/apiConfig";

function RemainderTable() {
  const [campaigns, setCampaigns] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [isPreviewOpenauto, setIsPreviewOpenauto] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [selectedTemplatepre, setSelectedTemplatepre] = useState(null);
  const [bgColortem, setBgColortem] = useState("#ffffff"); // Default background color
  const [previewContenttem, setPreviewContenttem] = useState([]); // Default preview content
  const [bdyCampaignname, setBdyCampaignname] = useState("");
  const [showcampaigneditModal, setShowcampaigneditModal] = useState(false);
  const [step, setStep] = useState(1);
  const [groups, setGroups] = useState([]);
  const [birthtemplates, setBirthTemplates] = useState([]);
  const [failedEmails, setFailedEmails] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newTime, setNewTime] = useState({});
   const [activeeditorCampaignId, setActiveeditorCampaignId] = useState(null); // Track the active campaign's modal
    const [activeCampaignId, setActiveCampaignId] = useState(null); // Track the active campaign's modal
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
      const fetchAllGroup = async () => {
        if (!user?.id) {
          console.warn("User ID is missing. Skipping data fetch.");
          return;
        }
    
        try {
          const [groupsRes,birthtemplatesRes,campaignRes] = await Promise.all([
            axios.get(`${apiConfig.baseURL}/api/stud/groups/${user.id}`),
            axios.get(`${apiConfig.baseURL}/api/stud/birthtemplates/${user.id}`), 
            axios.get(`${apiConfig.baseURL}/api/stud/campaigns/${user.id}`)

          ]);
          setCampaigns(campaignRes.data);
          setGroups(groupsRes.data);
          setBirthTemplates(birthtemplatesRes.data);
        } catch (error) {
          console.error("Error fetching student dashboard data:", {
            message: error.message,
            stack: error.stack,
            response: error.response?.data,
          });
        }
      };
    
      fetchAllGroup();
    }, [user?.id]);
    
  
    const handlePreviewautomate = (template) => {
      setIsPreviewOpenauto(true);
      setSelectedTemplatepre(template);
      setBgColortem(template.bgColor || "#ffffff"); // Update background color
      setPreviewContenttem(template.previewContent || []); // Update previewContent
      setBdyCampaignname(template.camname);
    };
    const handleCloseModalpreauto = () => {
      setIsPreviewOpenauto(false);
    };

  const handleBackCampaign = () => {
    navigate("/home");
  };

  const handleViewFailedEmails = (emails) => {
    setFailedEmails(emails);
    setShowModal(true);
  };
  const handleview = (userId, campaignId) => {
    navigate(`/readreportremainder/${userId}/${campaignId}`);
  };
   const handleOpenModal = (campaignId, scheduledTime) => {
      console.log(
        "Opening modal for campaign:",
        campaignId,
        "Scheduled Time:",
        scheduledTime
      );
      setNewTime((prev) => ({ ...prev, [campaignId]: scheduledTime || "" })); // Ensure campaign-specific time
      setActiveCampaignId(campaignId); // Track the active campaign's modal
      setIsModalOpen(true); // Open the modal
    };
const handlesaveEditcampaign = async (campaignId) => {
  try {
    const response = await axios.put(`${apiConfig.baseURL}/api/stud/bdycamhistory/${campaignId}`,
      {
        campaignname: bdyCampaignname,
        previewContent: previewContenttem,
        bgColor: bgColortem,
        groupname: groups.find((group) => group._id === selectedGroup)?.name, // Get the group name from the groups array
        groupId:selectedGroup,
      });
    if (response.status === 200) {
      toast.success("Campaign updated successfully!");
      setShowcampaigneditModal(false);
      setActiveeditorCampaignId(null); // Reset active campaign ID
    } else {
      toast.error("Failed to update campaign. Please try again.");
    }
  } catch (error) {
    console.error("Error updating campaign:", error);
    toast.error("Failed to update campaign. Please try again.");
  }
};
        

    const handleTimeChange = (e, campaignId) => {
        const selectedTime = e.target.value; // "HH:MM"
        console.log("Selected Time:", selectedTime, campaignId);
        setNewTime((prev) => ({ ...prev, [campaignId]: selectedTime }));
      };
      
      const handleSaveTime = async () => {
        const timeOnly = newTime[activeCampaignId];
        if (!timeOnly) {
          toast.error("Please select a valid time");
          return;
        }
      
        try {
          // Get original campaign
          const originalCampaign = campaigns.find(c => c._id === activeCampaignId);
          const originalDate = new Date(originalCampaign.scheduledTime);
      
          // Extract hours and minutes from selected time
          const [hours, minutes] = timeOnly.split(":").map(Number);
      
          // Create new Date with same date but updated time
          const updatedDate = new Date(originalDate);
          updatedDate.setHours(hours);
          updatedDate.setMinutes(minutes);
          updatedDate.setSeconds(0);
          updatedDate.setMilliseconds(0);
      
          const updatedTimeISO = updatedDate.toISOString();
      
          console.log(
            "Updating campaign:",
            activeCampaignId,
            "with new time:",
            updatedTimeISO
          );
      
          await axios.put(
            `${apiConfig.baseURL}/api/stud/camhistory/${activeCampaignId}`,
            {
              scheduledTime: updatedTimeISO,
            }
          );
      
          // Update local state
          setCampaigns((prevCampaigns) =>
            prevCampaigns.map((c) =>
              c._id === activeCampaignId
                ? { ...c, scheduledTime: updatedTimeISO }
                : c
            )
          );
      
          toast.success("Scheduled time updated successfully!");
          setIsModalOpen(false);
          setActiveCampaignId(null);
        } catch (error) {
          console.error("Error updating scheduled time:", error);
          toast.error("Failed to update scheduled time");
        }
      };
      
      const handleToggle = async (e, campaignId) => {
        const isChecked = e.target.checked;
      
        try {
          // If toggle is ON, always set to Remainder On
          const newStatus = isChecked ? "Remainder On" : "Remainder Off";
      
          await axios.put(`${apiConfig.baseURL}/api/stud/camhistory/${campaignId}`, {
            status: newStatus,
          });
      
          console.log(`Campaign ${campaignId} status updated to ${newStatus}`);
        } catch (error) {
          console.error("Error updating remainder campaign status:", error);
        }
      };
      
  const filteredCampaigns = campaigns.filter(campaign => {
    const campaignName = campaign.campaignname?.toLowerCase() || "";
    const searchContent = Object.values(campaign).join(" ").toLowerCase();
    
    // Only include birthday campaigns
    if (!campaignName.includes("birthday") && !campaignName.includes("birthday campaign")) {
      return false;
    }

    return searchContent.includes(searchTerm.toLowerCase());
  });
  
  return (
    <div className="admin-dashboard-page">
      <div className="admin-nav">
        <div className="nav-mobile-btn">
          <h2 className="admin-dashboard-header">Automation Campaign History</h2>
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
        <div className="search-container">
          <FaSearch className="search-icon" />
          <input
            type="text"
            placeholder="Search campaigns..."
            className="search-input"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
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
      <div className="cam-scroll" style={{ overflowX: "auto" }}>
        <table className="cam-dashboard-table">
          <thead>
            <tr>
              <th>Set Date</th>
              <th>Campaign Name</th>
              <th>Alias Name</th>
              <th>Group Name</th>
              <th>Total Count</th>
              <th>Send Count</th>
              <th>Failed Count</th>
              <th>Scheduled Time</th>
              <th>Status</th>
              <th>Action</th>
              <th>Report</th>
              <th>Edit Campaign</th>
            </tr>
          </thead>
          <tbody>
            {campaigns.length > 0 ? (
              filteredCampaigns.map((campaign) => (
                <tr key={campaign._id}>
                  <td>{campaign.senddate}</td>
                  <td>{campaign.campaignname}</td>
                  <td>{campaign.aliasName}</td>
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
                 <td
  title="Edit"
  style={{ cursor: "pointer", textDecoration: "underline" }}
  onClick={(e) => {
    e.stopPropagation();
    handleOpenModal(campaign._id, campaign.scheduledTime);
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
          type="time"
          value={newTime[activeCampaignId] || ""}
          onChange={(e) =>
            handleTimeChange(e, activeCampaignId)
          }
        />

        <div className="modal-actions-schedule">
          <button onClick={handleSaveTime}>Save</button>
          <button onClick={() => setIsModalOpen(false)}>Cancel</button>
        </div>
      </div>
    </div>
  )}

  {/* View time only */}
  {new Date(campaign.scheduledTime).toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
    timeZone: "Asia/Kolkata",
  })}
</td>                
                  <td
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent:
                        campaign.status === "Remainder On" ||
                        campaign.status === "Remainder Off"
                          ? "center"
                          : "flex-start",
                      fontWeight: "bold",
                      color:
                        campaign.status === "Remainder On"
                          ? "green"
                          : campaign.status === "Remainder Off"
                          ? "red"
                          : "#2f327d",
                    }}
                  >{campaign.status}-{campaign.progress}% 
                  </td>
                  <td> <label
                          className="toggle-switch"
                          style={{ marginLeft: "15px" }}
                        >
                          <input
                            type="checkbox"
                            checked={campaign.status === "Remainder On"}
                            onChange={(e) => handleToggle(e, campaign._id)}
                          />
                          <span className="slider"></span>
                        </label>
                        </td>
                  <td>
                    <button
                      className="resend-btn"
                      onClick={() => handleview(user.id, campaign._id)}
                    >
                      View
                    </button>
                  </td>
                  <td>
                    <button
                      className="resend-btn edit-btn-campaign"
                      onClick={() => {
                        setShowcampaigneditModal(true);
                        setActiveeditorCampaignId(campaign._id); // Track the active campaign's modal
                      }}
                      >
<FaEdit/>
</button>
                  </td>

                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" style={{ textAlign: "center" }}>
                  No Remainder History
                </td>
              </tr>
            )}
          </tbody>
        </table>
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


 {/* create Automation section */}
 {showcampaigneditModal && (
          <div className="modal-overlay-automation">
            <div className="modal-content-automation">
              <div className="heading-automation">
              <h2>Update Automation Campaign</h2>
              <span className="close-btn-automation" onClick={() => {setShowcampaigneditModal(false)
                setActiveeditorCampaignId(null); // Reset active campaign ID
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
                           
              </div>
              <div className="save-button-container">
                <button className="save-button" onClick={()=>{handlesaveEditcampaign(activeeditorCampaignId)}}>
                  Save
                </button>
              </div>
            </div>
          </div>
        )}

         {/* show templates in automation */}
         {isPreviewOpenauto && (
            <div className="preview-modal-overlay-tem">
              <div className="preview-modal-content-tem">
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
                                  item.src1 || "https://via.placeholder.com/200"
                                }
                                alt="Editable"
                                className="videoimg"
                                title="Upload Thumbnail Image"
                                style={item.style}
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
                                  item.src1 || "https://via.placeholder.com/200"
                                }
                                style={item.style}
                                alt="Editable"
                                className="card-image"
                                title="Upload Image"
                              />
                              <p
                                className="card-text"
                                style={item.style}
                                dangerouslySetInnerHTML={{
                                  __html: item.content1,
                                }}
                              />
                            </div>
                          ) : null}

                          {item.type === "head" && (
                            <div>
                              <p className="border" style={item.style}>
                                {item.content}
                              </p>
                            </div>
                          )}

                          {item.type === "link-image" && (
                            <div className="border">
                              <a href={item.link || "#"}>
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
                                  item.src || "https://via.placeholder.com/200"
                                }
                                alt="Editable"
                                className="img"
                                style={item.style}
                              />
                            </div>
                          )}

                          {item.type === "icons" && (
                            <div
                              className="border-icons"
                              style={item.ContentStyle}
                              key={index}
                            >
                              <div className="icon-containers">
                                <a
                                  href={item.links1 || "#"}
                                  target="_blank"
                                  rel="noopener noreferrer"
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
                                />
                                <p
                                  className="text-item"
                                  style={item.style}
                                  dangerouslySetInnerHTML={{
                                    __html: item.content1,
                                  }}
                                />
                              </div>
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
                                />
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
                                />
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
                                />
                              </div>
                            </div>
                          ) : null}

                          {item.type === "logo" && (
                            <div className="border">
                              <img
                                src={
                                  item.src || "https://via.placeholder.com/200"
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
                              <a href={item.href || "#"} style={item.style}>
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

export default RemainderTable;
