import React from "react";

export default function JobApplicationInput(props) {
    const { handleAddApplication, applicationData, setApplicationData } = props;

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
                status: "applying"
            });
        }
    };

    return (
        <header>
            <form onSubmit={handleSubmit}>
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
                <button type="submit">
                    Add Application
                </button>
            </form>
        </header>
    );
}