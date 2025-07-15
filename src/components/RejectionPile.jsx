import React, { useState } from "react";
import JobApplicationItem from "./JobApplicationItem";

export default function RejectionPile({ rejectedApplications, handleUpdateApplication, handleDeleteApplication, onDrop, onDragOver }) {
    const [showTooltip, setShowTooltip] = useState(false);
    const [tooltipMessage, setTooltipMessage] = useState("");

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
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        onDragOver(true);
    };

    const handleDragLeave = (e) => {
        e.preventDefault();
        onDragOver(false);
    };

    return (
        <div 
            className="rejectionPile"
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
        >
            <h2 className="rejectionHeader">
                <i className="fa-solid fa-trash"></i> Rejection Pile ({rejectedApplications.length})
            </h2>
            
            {showTooltip && (
                <div className="rejectionTooltip">
                    <i className="fa-solid fa-heart"></i>
                    <span>{tooltipMessage}</span>
                </div>
            )}
            
            <div className="rejectedApplications">
                {rejectedApplications.length === 0 ? (
                    <p className="emptyRejectionState">Drag rejected applications here</p>
                ) : (
                    rejectedApplications.map(application => (
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
        </div>
    );
}
