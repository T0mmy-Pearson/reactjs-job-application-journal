import React, { useState } from "react";

export default function LabelsInput({ labels, onChange }) {
    const [inputValue, setInputValue] = useState("");

    const addLabel = (e) => {
        e.preventDefault();
        if (inputValue.trim() && !labels.includes(inputValue.trim())) {
            onChange([...labels, inputValue.trim()]);
            setInputValue("");
        }
    };

    const removeLabel = (labelToRemove) => {
        onChange(labels.filter(label => label !== labelToRemove));
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            addLabel(e);
        } else if (e.key === 'Backspace' && inputValue === '' && labels.length > 0) {
            // Remove last label when backspace is pressed on empty input
            removeLabel(labels[labels.length - 1]);
        }
    };

    return (
        <div className="labelsInput">
            <div className="labelsContainer">
                {labels.map((label, index) => (
                    <span key={index} className="label">
                        {label}
                        <button
                            type="button"
                            onClick={() => removeLabel(label)}
                            className="labelRemove"
                            title="Remove label"
                        >
                            <i className="fa-solid fa-times" style={{ color: 'var(--color-1)' }}></i>
                        </button>
                    </span>
                ))}
                <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder={labels.length === 0 ? "Add labels (press Enter to add)..." : "Add another label..."}
                    className="labelInput"
                />
            </div>
            <div className="labelsHint">
                <small>Press Enter to add labels. Examples: "Remote", "Senior", "Frontend", "Startup"</small>
            </div>
        </div>
    );
}
