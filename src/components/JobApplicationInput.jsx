import React, { useState } from "react";
import SearchBar from "./SearchBar";
import LabelsInput from "./LabelsInput";

export default function JobApplicationInput(props) {
    const { handleAddApplication, applicationData, setApplicationData, applications, onSearchResults } = props;
    const [showForm, setShowForm] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (applicationData.company && applicationData.position) {
            handleAddApplication({
                ...applicationData,
                id: Date.now(),
                dateApplied: new Date().toISOString().split('T')[0],
                heardBack: false
            });
            setApplicationData({
                company: "",
                position: "",
                status: "applying",
                source: "",
                notes: "",
                labels: []
            });
            setShowForm(false); // Hide form after successful submission
        }
    };

    const toggleForm = () => {
        setShowForm(!showForm);
    };

    return (
        <header>
            {!showForm ? (
                <div className="headerControls">
                    <div className="addApplicationToggle">
                        <button 
                            type="button" 
                            className="toggleButton"
                            onClick={toggleForm}
                            title="Add new job application"
                        >
                            <i className="fa-solid fa-plus"></i>
                            <span>Add Job Application</span>
                        </button>
                    </div>
                </div>
            ) : (
                <form onSubmit={handleSubmit} className="applicationForm">
                    <div className="formHeader">
                        <h3>Add New Job Application</h3>
                        <button 
                            type="button" 
                            className="closeButton"
                            onClick={toggleForm}
                            title="Close form"
                        >
                            <i className="fa-solid fa-times"></i>
                        </button>
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
            )}
        </header>
    );
}