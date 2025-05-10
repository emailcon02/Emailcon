import React, { useState, useEffect } from "react";
import axios from "axios";
import "./GroupModal.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import apiConfig from "../apiconfig/apiConfig.js";

const GroupfilesingleModal = ({ onClose }) => {
  const [selectedGroupForUpload, setSelectedGroupForUpload] = useState(null);
  const [groups, setGroups] = useState([]);
  const [students, setStudents] = useState([]);
  const [contactForm, setContactForm] = useState({});
  const [contactKeys, setContactKeys] = useState([]);
  const [isLoadingsave, setIsLoadingsave] = useState(false);
  const user = JSON.parse(localStorage.getItem("user"));
  useEffect(() => {
    console.log(students); // Temporary usage to suppress the warning
  }, [students]);
  
  // Fetch only groups on mount
  useEffect(() => {
    const fetchGroups = async () => {
      try {
        const res = await axios.get(`${apiConfig.baseURL}/api/stud/groups/${user.id}`);
        setGroups(res.data);
      } catch (err) {
        console.error("Error fetching groups:", err);
      }
    };

    if (user?.id) fetchGroups();
  }, [user]);

  // Handle group selection and lazy-load students for that group
  const handleGroupSelect = async (selectedId) => {
    setSelectedGroupForUpload(selectedId);
    try {
      const { data: groupStudents } = await axios.get(
        `${apiConfig.baseURL}/api/stud/students?groupId=${selectedId}`
      );

      setStudents(groupStudents);
      const studentInGroup = groupStudents[0];

      if (studentInGroup) {
        const keys = Object.keys(studentInGroup).filter(
          (key) => !["_id", "group", "groupId", "lastSentYear", "__v"].includes(key)
        );

        const form = {};
        keys.forEach((key) => (form[key] = ""));
        setContactKeys(keys);
        setContactForm(form);
      } else {
        setContactKeys([]);
        setContactForm({});
        toast.info("No students found in this group.");
      }
    } catch (err) {
      console.error("Error fetching students:", err);
      toast.error("Failed to load students for group.");
    }
  };

  const handleSaveUploadedData = async () => {
    setIsLoadingsave(true);

    const emailKey = Object.keys(contactForm).find((key) => key.toLowerCase() === "email");
    const email = contactForm[emailKey]?.trim();

    if (!email) {
      toast.error("Email is required");
      setIsLoadingsave(false);
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error("Invalid email format");
      setIsLoadingsave(false);
      return;
    }

    try {
      const { data } = await axios.post(`${apiConfig.baseURL}/api/stud/students/check-duplicate`, {
        email,
        groupId: selectedGroupForUpload,
      });

      if (data.isDuplicate) {
        toast.warning("Contact with this email already exists in the selected group.");
        setIsLoadingsave(false);
        return;
      }

      const formattedForm = { ...contactForm };
      if (formattedForm.date) {
        const dateObj = new Date(formattedForm.date);
        formattedForm.date = dateObj.toISOString().split("T")[0];
      }

      await axios.post(`${apiConfig.baseURL}/api/stud/students/manual`, {
        ...formattedForm,
        group: selectedGroupForUpload,
      });

      toast.success("Contact added!");
      setContactForm({});
      setContactKeys([]);
      setIsLoadingsave(false);
      setTimeout(onClose, 2000);
    } catch (error) {
      console.error(error);
      toast.error("Error saving contact");
      setIsLoadingsave(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-group">
        <button className="modal-close-btn" onClick={onClose}>
          &times;
        </button>
        <div className="modal-content">
          <div className="excel-uploader">
            <h2 className="modal-title">Add Existing Group</h2>
            <h3 className="modal-section-title">Add Single Contact</h3>

            <select
              value={selectedGroupForUpload || ""}
              onChange={(e) => handleGroupSelect(e.target.value)}
              className="modal-select modal-group-select"
            >
              <option value="" disabled>
                Select Group
              </option>
              {groups.map((group) => (
                <option key={group._id} value={group._id}>
                  {group.name}
                </option>
              ))}
            </select>

            {selectedGroupForUpload && contactKeys.length > 0 && (
              <div className="single-contact-fields">
                {contactKeys.map((key) => {
                  const inputType = key.toLowerCase().includes("date")
                    ? "date"
                    : key.toLowerCase().includes("email")
                    ? "email"
                    : "text";

                  return (
                    <div key={key} className="input-group">
                      <label htmlFor={key} className="input-label">
                        {key.charAt(0).toUpperCase() + key.slice(1)}
                      </label>
                      <input
                        type={inputType}
                        id={key}
                        name={key}
                        value={contactForm[key] || ""}
                        onChange={(e) =>
                          setContactForm({ ...contactForm, [key]: e.target.value })
                        }
                        placeholder={`Enter ${key}`}
                        className="edit-student-input"
                        required={key.toLowerCase() === "email"}
                      />
                    </div>
                  );
                })}
              </div>
            )}

            <button
              className="modal-btn btn-save-uploaded-data"
              onClick={handleSaveUploadedData}
              disabled={isLoadingsave}
            >
              {isLoadingsave ? <span className="loader-create"></span> : "Save"}
            </button>
            <button className="modal-create-button-cancel-add" onClick={onClose}>
              Cancel
            </button>
          </div>
        </div>
      </div>
      <ToastContainer
        className="custom-toast"
        position="bottom-center"
        autoClose={3000}
        hideProgressBar={true}
        closeOnClick={false}
        closeButton={false}
        pauseOnHover={true}
        draggable={true}
        theme="light"
      />
    </div>
  );
};

export default GroupfilesingleModal;
