import { ChromePicker } from "react-color";
import { useState, useRef, useEffect } from "react";

const GradientBackgroundPicker = ({
  label,
  objectKey,
  previewContent,
  selectedIndex,
  updateContent,
}) => {
  const [displayPicker, setDisplayPicker] = useState(false);
  const [color1, setColor1] = useState("#000000");
  const [color2, setColor2] = useState("#ffffff");
  const [currentColor, setCurrentColor] = useState("#000000");

  const pickerRef = useRef(null);

  // On mount or change, extract gradient values
  useEffect(() => {
    const currentStyle = previewContent[selectedIndex];
    const value =
      objectKey.split(".").reduce((obj, key) => obj?.[key], currentStyle) || "#000000";

    setCurrentColor(value);

    if (typeof value === "string" && value.includes("linear-gradient")) {
      const match = value.match(
        /linear-gradient\(.*?,\s*(#[0-9a-fA-F]{3,6}).*?,\s*(#[0-9a-fA-F]{3,6})/
      );
      if (match) {
        setColor1(match[1]);
        setColor2(match[2]);
      }
    } else {
      setColor1(value);
    }
  }, [previewContent, selectedIndex, objectKey]);

  // Outside click to close
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (pickerRef.current && !pickerRef.current.contains(event.target)) {
        setDisplayPicker(false);
      }
    };
    if (displayPicker) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [displayPicker]);

  const applyGradient = (c1, c2) => {
    const gradient = `linear-gradient(90deg, ${c1}, ${c2})`;
    const newContent = JSON.parse(JSON.stringify(previewContent[selectedIndex]));
    let temp = newContent;
    const keys = objectKey.split(".");
    for (let i = 0; i < keys.length - 1; i++) {
      if (!temp[keys[i]]) temp[keys[i]] = {};
      temp = temp[keys[i]];
    }
    temp[keys[keys.length - 1]] = gradient;
    updateContent(selectedIndex, newContent);
    setCurrentColor(gradient);
  };

  const handleGradientChange = (color, which) => {
    if (which === 1) {
      setColor1(color.hex);
      applyGradient(color.hex, color2);
    } else {
      setColor2(color.hex);
      applyGradient(color1, color.hex);
    }
  };

  return (
    <div ref={pickerRef} className="editor-bg" style={{ position: "relative" }}>
      
        {label}

      <div
        style={{
        display: "inline-block",
          width: "30px",
          height: "30px",
          background: currentColor,
          border: "1px solid  rgb(150, 149, 149)",
          cursor: "pointer",
          marginLeft: "10px",
          padding: "0",
          overflow: "hidden",
          borderRadius: "50%",
        }}
        onClick={() => setDisplayPicker(!displayPicker)}
      />

      {displayPicker && (
        <div className="gradient-colorpicker"
          style={{
            position: "absolute",
            top: "40px",
            zIndex: 99999,
            background: "#fff",
            border: "1px solid #ccc",
            padding: "10px",
            display: "flex",
            gap: "20px",
            width: "180px",
            overflowX: "auto",
          }}
        >
          <div>
            <div>Color 1</div>
            <ChromePicker color={color1} onChange={(c) => handleGradientChange(c, 1)} />
          </div>
          <div>
            <div>Color 2</div>
            <ChromePicker color={color2} onChange={(c) => handleGradientChange(c, 2)} />
          </div>
        </div>
      )}
    </div>
  );
};

export default GradientBackgroundPicker;
