import React, { useState, useEffect } from "react";
import LabelsInput from "./LabelsInput";

const EMPTY_APPLICATION = {
    company: "",
    position: "",
    status: "applying",
    source: "",
    notes: "",
    labels: []
};

export default function JobApplicationInput({ handleAddApplication }) {
    const [applicationData, setApplicationData] = useState(EMPTY_APPLICATION);
    const [showForm, setShowForm] = useState(false);

    useEffect(() => {
        if (!showForm) return;
        function handleEsc(e) {
            if (e.key === "Escape") setShowForm(false);
        }
        window.addEventListener("keydown", handleEsc);
        return () => window.removeEventListener("keydown", handleEsc);
    }, [showForm]);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (applicationData.company && applicationData.position) {
            handleAddApplication({
                ...applicationData,
                id: Date.now(),
                dateApplied: new Date().toISOString().split('T')[0],
                heardBack: false
            });
            setApplicationData(EMPTY_APPLICATION);
            setShowForm(false);
        }
    };

    const toggleForm = () => {
        setShowForm(!showForm);
    };

    return (
        <>
            <button
                type="button"
                className="addApplicationBtn"
                onClick={toggleForm}
                title="Add new job application"
            >
                <i className="fa-solid fa-plus"></i>
                <span>Add</span>
            </button>
            {showForm && (
                <div className="authModalOverlay" onClick={toggleForm}>
                <form onSubmit={handleSubmit} className="applicationForm" onClick={e => e.stopPropagation()}>
                    <div className="formHeader">
                        <button 
                            type="button" 
                            className="authModalClose responsiveCloseBtn"
                            onClick={toggleForm}
                            title="Close"
                        >
                            <i className="fa-solid fa-times"></i>
                        </button>
                        <h3>Add New Job Application</h3>
                    </div>
                    <div className="formFields">
                        <input
                            value={applicationData.company}
                            onChange={(e) => setApplicationData({...applicationData, company: e.target.value})}
                            placeholder="Company name..."
                            required
                        />
                        <input
                            value={applicationData.position}
                            onChange={(e) => setApplicationData({...applicationData, position: e.target.value})}
                            placeholder="Position title..."
                            required
                        />
                        <input
                            value={applicationData.source}
                            onChange={(e) => setApplicationData({...applicationData, source: e.target.value})}
                            placeholder="Source (job board, company website, referral, etc.)..."
                        />
                        <textarea
                            value={applicationData.notes}
                            onChange={(e) => setApplicationData({...applicationData, notes: e.target.value})}
                            placeholder="Notes (optional - salary info, requirements, interview details, etc.)..."
                            rows="3"
                            className="notesInput"
                        />
                        <LabelsInput
                            labels={applicationData.labels}
                            onChange={(newLabels) => setApplicationData({...applicationData, labels: newLabels})}
                        />
                        <select
                            value={applicationData.status}
                            onChange={(e) => setApplicationData({...applicationData, status: e.target.value})}
                        >
                            <option value="applying">Applying</option>
                            <option value="applied">Applied</option>
                            <option value="awaiting-interview">Awaiting Interview</option>
                            <option value="interviewed">Interviewed</option>
                            <option value="awaiting-response">Awaiting Response</option>
                            <option value="offer">Offer Received</option>
                            <option value="rejected">Rejected</option>
                        </select>
                        <button type="submit" className="submitButton">
                            <i className="fa-solid fa-check"></i>
                            Add Application
                        </button>
                    </div>
                </form>
                </div>
            )}
        </>
    );
}