import React, { useState, useRef, useEffect } from "react";
import { ChromePicker } from "react-color";

const ColorPalettePicker = ({ label, onChange }) => {
  const [showPicker, setShowPicker] = useState(false);
  const pickerRef = useRef(null);

  // Close picker on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (pickerRef.current && !pickerRef.current.contains(event.target)) {
        setShowPicker(false);
      }
    };

    if (showPicker) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showPicker]);

  return (
    <div style={{ marginBottom: "10px", position: "relative" }} ref={pickerRef}>
      <button
        className="editor-button bg-color-palete"
        onClick={() => setShowPicker(!showPicker)}
        style={{
          display: "flex",
          alignItems: "center",
          gap: "10px",
          background: "none",
          border: "1px solid #ccc",
          padding: "5px 10px",
          borderRadius: "6px",
          cursor: "pointer",
        }}
      >
        <div style={{
          width: "20px",
          height: "20px",
          marginLeft:"22px",
          backgroundColor: label,
          borderRadius: "50%",
          border: "1px solid #aaa"
        }} />
        Template-Bg
      </button>

      {showPicker && (
        <div
          style={{
            position: "absolute",
            top: "-50%",
            right:"95%",
            zIndex: 2,
            height: "170px",
            maxHeight: "200px",
            overflow: "auto",
          }}
        >
          <ChromePicker
            color={label}
            onChange={(color) => onChange(color.hex)}
            disableAlpha
          />
        </div>
      )}
    </div>
  );
};

export default ColorPalettePicker;
