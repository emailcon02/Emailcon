import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import apiConfig from "../../apiconfig/apiConfig.js";
import { motion } from "framer-motion";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { Editor } from "@tinymce/tinymce-react";
import "./ParaEditor.css";
import { Send, Loader2, Clipboard } from "lucide-react";
import aiicon from "../../Images/google-gemini-icon.png";

const ParaEditorbutton = ({ isOpen, content, onSave, onClose }) => {
  const [editorContent, setEditorContent] = useState(content);
  const [aiInput, setAiInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [aiResponse, setAiResponse] = useState("");
  const [chatbotVisible, setChatbotVisible] = useState(false);
  const [tooltipVisible, setTooltipVisible] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState(false);
  const [fieldNames, setFieldNames] = useState({});
  const [groups, setGroups] = useState([]); // Stores group names
  const [students, setStudents] = useState([]); // Stores all students
  const user = JSON.parse(localStorage.getItem("user"));
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setSelectedGroup(""); // Close dropdown
        setFieldNames([]);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (!user?.id) return;

    const fetchGroupsAndStudents = async () => {
      try {
        const groupsResponse = await axios.get(
          `${apiConfig.baseURL}/api/stud/groups/${user.id}`
        );
        setGroups(groupsResponse.data);

        const studentsResponse = await axios.get(
        `${apiConfig.baseURL}/api/stud/students?user=${user.id}`        );
        setStudents(studentsResponse.data);
      } catch (err) {
        console.log("Error fetching data:", err);
      }
    };

    fetchGroupsAndStudents();
  }, [user.id]);

  const handleGroupChange = (e) => {
    const groupName = e.target.value;

    // Force the dropdown to open every time by resetting selectedGroup
    setSelectedGroup("");
    setTimeout(() => setSelectedGroup(groupName), 0);

    if (!students || students.length === 0) {
      console.log("No students available yet.");
      return;
    }

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

    setFieldNames(newFieldNames);
  };

  const editorRef = useRef(null);

  const geminiApiKey = import.meta.env.VITE_GEMINI_API_KEY;
  const genAI = new GoogleGenerativeAI(geminiApiKey);
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  const handleInsertVariable = (value) => {
    if (editorRef.current?.editor) {
      const editor = editorRef.current.editor;
      editor.focus();
      editor.selection.setContent(value);
    }
    setSelectedGroup(false);
  };

  const handleCopyResponse = () => {
    navigator.clipboard
      .writeText(aiResponse)
      .then(() => {
        setTooltipVisible(true);
        setTimeout(() => setTooltipVisible(false), 2000);
      })
      .catch((err) => console.error("Copy failed", err));
  };

  const handleGenerateAIContent = async () => {
    if (!aiInput.trim()) return;
    setIsLoading(true);

    try {
      const result = await model.generateContent(aiInput);
      const res = await result.response.text();
      setAiResponse(res || "AI content could not be generated.");
    } catch (error) {
      console.error("AI Error:", error);
      setAiResponse("Failed to generate AI content.");
    }

    setIsLoading(false);
  };

  const handleOpenChatbot = () => {
    setChatbotVisible(!chatbotVisible);
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay-para">
      <div className="modal-content-para">
       <Editor
  apiKey="hddpazfss5mb3ppinipav37ap1zt3pqs9oz3c897fidqfddq"
  value={editorContent}
  onEditorChange={(newContent) => setEditorContent(newContent)}
  onInit={(evt, editor) => (editorRef.current = { editor })}
  init={{
    menubar: true,
    zIndex: 10000, // Higher than your modal
    branding: false,
    
    plugins: [
      'lists',
      'link',
      'code',
      'quickbars',
      'advlist',
      'autolink',
      'charmap',
      'table'
    ],
    toolbar: `undo redo | bold italic underline | fontfamily fontsize | 
              alignleft aligncenter alignright | bullist numlist | 
              forecolor backcolor | code`,
    // Color settings
    quickbars_selection_toolbar: 'bold italic | forecolor backcolor',
    color_cols: 5,
    color_map: [
      "000000", "Black",
      "FFFFFF", "White",
      "FF0000", "Red",
      "00FF00", "Green",
      "0000FF", "Blue"
    ],
    
    // Font settings
    font_size_formats: "8px 10px 12px 14px 16px 18px 20px 24px 28px 32px 36px 48px",
    font_family_formats: "Andale Mono=andale mono,times; Arial=arial,helvetica,sans-serif; Arial Black=arial black,avant garde; Book Antiqua=book antiqua,palatino; Comic Sans MS=comic sans ms,sans-serif; Courier New=courier new,courier; Georgia=georgia,palatino; Helvetica=helvetica; Impact=impact,chicago; Symbol=symbol; Tahoma=tahoma,arial,helvetica,sans-serif; Terminal=terminal,monaco; Times New Roman=times new roman,times; Trebuchet MS=trebuchet ms,geneva; Verdana=verdana,geneva; Webdings=webdings; Wingdings=wingdings,zapf dingbats",
    
    // Other settings
    forced_root_block: 'p',
    // content_style: "body { font-family: Arial; font-size: 14px; }",
    skin: 'oxide',
    content_css: 'default'
  }}
/>
        <div className="button-group-para">
          <button className="para-btn" onClick={() => onSave(editorContent)}>
            Save
          </button>
          <button className="para-btn" onClick={onClose}>
            Cancel
          </button>
        
          <p className="ai-btn" onClick={handleOpenChatbot}>
            <img src={aiicon} alt="Gemini AI" className="gemini-icon" />
          </p>
        </div>

        {/* Animated AI Chatbot */}
        {chatbotVisible && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.3 }}
            className="chatbot-container"
          >
            <div className="chatbot-header">
              <span>AI Chatbot</span>
              <motion.button
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.9 }}
                className="close-btn-chat"
                onClick={handleOpenChatbot}
              >
                X
              </motion.button>
            </div>

            <div className="chatbot-body">
              <div
                className="chatbot-response"
                style={{ maxHeight: "150px", overflowY: "auto" }}
              >
                {aiResponse && (
                  <>
                    <div className="copy-container">
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className="copy-btn-chat"
                        onClick={handleCopyResponse}
                      >
                        <Clipboard /> Copy
                      </motion.button>
                      {tooltipVisible && (
                        <span className="tooltip">Copied!</span>
                      )}
                    </div>
                    <pre>{aiResponse}</pre>
                  </>
                )}
              </div>

              <input
                type="text"
                className="ai-input"
                placeholder="Ask AI to generate content..."
                value={aiInput}
                onChange={(e) => setAiInput(e.target.value)}
              />

              {/* Animated Send Button */}
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="send-btn-chat"
                onClick={handleGenerateAIContent}
                disabled={isLoading}
              >
                {isLoading ? (
                  <Loader2 className="spinner animate-spin" />
                ) : (
                  <Send />
                )}
              </motion.button>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default ParaEditorbutton;
