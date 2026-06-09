import React, { useState } from "react";
import JobApplicationItem from "./JobApplicationItem";

export default function RejectionPile({ rejectedApplications, handleUpdateApplication, handleDeleteApplication, onDrop, onDragOver }) {
    const [showTooltip, setShowTooltip] = useState(false);
    const [tooltipMessage, setTooltipMessage] = useState("");
    const [collapsed, setCollapsed] = useState(true);

    const tooltipMessages = [
        "What's for ye, won't pass ye by",
        "They didn't deserve you anyway"
    ];

    const getRandomTooltipMessage = () => {
        const randomIndex = Math.floor(Math.random() * tooltipMessages.length);
        return tooltipMessages[randomIndex];
    };

    const handleDrop = (e) => {
        e.preventDefault();
        const applicationId = e.dataTransfer.getData("text/plain");
        
        // Show tooltip with random message
        setTooltipMessage(getRandomTooltipMessage());
        setShowTooltip(true);
        
        // Hide tooltip after 3 seconds
        setTimeout(() => {
            setShowTooltip(false);
        }, 3000);
        
        onDrop(applicationId);
        onDragOver(false);
        setCollapsed(false); // reveal the newly rejected application
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        onDragOver(true);
        setCollapsed(false); // open the drop zone while dragging over it
    };

    const handleDragLeave = (e) => {
        e.preventDefault();
        onDragOver(false);
    };

    return (
        <div
            className={`rejectionPile ${collapsed ? 'collapsed' : ''}`}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
        >
            <button
                type="button"
                className="rejectionHeader"
                onClick={() => setCollapsed(c => !c)}
                aria-expanded={!collapsed}
            >
                <i className="fa-solid fa-trash"></i>
                <span>Rejection Pile ({rejectedApplications.length})</span>
                <i className={`fa-solid fa-chevron-${collapsed ? 'down' : 'up'} rejectionChevron`}></i>
            </button>

            {showTooltip && (
                <div className="rejectionTooltip">
                    <i className="fa-solid fa-heart"></i>
                    <span>{tooltipMessage}</span>
                </div>
            )}

            {!collapsed && (
                <div className="rejectedApplications">
                    {rejectedApplications.length === 0 ? (
                        <p className="emptyRejectionState">Drag rejected applications here</p>
                    ) : (
                        [...rejectedApplications].reverse().map(application => (
                            <JobApplicationItem
                                key={application.id}
                                application={application}
                                handleUpdateApplication={handleUpdateApplication}
                                handleDeleteApplication={handleDeleteApplication}
                                isDraggable={false}
                            />
                        ))
                    )}
                </div>
            )}
        </div>
    );
}
