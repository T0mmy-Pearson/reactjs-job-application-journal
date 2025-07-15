import React, { useEffect } from "react";

const themes = [
  { name: "Default", className: "combo-1" },
  { name: "Inverse", className: "combo-2" },
  { name: "Purple", className: "theme-purple" },
  { name: "Yellow", className: "theme-yellow" },
  { name: "Cyan", className: "theme-cyan" },
  { name: "Orange", className: "theme-orange" },
];

export default function SettingsModal({ currentTheme, onChangeTheme, onClose, onFeedback }) {
  useEffect(() => {
    function handleEsc(e) {
      if (e.key === "Escape" && onClose) onClose();
    }
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  return (
    <div>
      <div className="authModalOverlay">
        <div className="authModal" style={{ minWidth: 320 }}>
          <button className="authModalClose" onClick={onClose} title="Close">✕</button>
          <h2>Settings</h2>
          <div style={{ margin: "1.5rem 0" }}>
            <label style={{ fontWeight: "bold" }}>Colour Scheme:</label>
            <div style={{ display: "flex", flexDirection: "column", gap: 12, marginTop: 12 }}>
              {themes.map(theme => (
                <button
                  key={theme.className}
                  style={{
                    padding: "10px 18px",
                    borderRadius: 8,
                    border: currentTheme === theme.className ? "2px solid var(--color-2)" : "1px solid var(--color-2)",
                    background: currentTheme === theme.className ? "var(--color-2)" : "var(--color-1)",
                    color: currentTheme === theme.className ? "var(--color-1)" : "var(--color-2)",
                    fontWeight: currentTheme === theme.className ? "bold" : "normal",
                    cursor: "pointer"
                  }}
                  onClick={() => onChangeTheme(theme.className)}
                >
                  {theme.name}
                </button>
              ))}
            </div>
          </div>
          <div style={{ marginTop: 24, textAlign: "center" }}>
            <button
              style={{
                background: "var(--color-2)",
                color: "var(--color-1)",
                border: "none",
                borderRadius: 8,
                padding: "10px 18px",
                fontWeight: "bold",
                cursor: "pointer"
              }}
              onClick={onFeedback}
            >
              Send Feedback
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
