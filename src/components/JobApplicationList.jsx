import React from "react";
import JobApplicationItem from "./JobApplicationItem";
import JobApplicationInput from "./JobApplicationInput";
import { useState } from "react";

export default function JobApplicationList({ applications, handleUpdateApplication, handleDeleteApplication, handleAddApplication }) {
    const [applicationData, setApplicationData] = useState({
        company: "",
        position: "",
        status: "applying",
        source: "",
        notes: "",
        labels: []
    });
    // Filter out rejected applications
    const activeApplications = applications.filter(app => app.status !== 'rejected');
    
    // Group applications by date (fallback to today if missing/invalid)
    const groupedApplications = activeApplications.reduce((groups, application) => {
        let date = application.dateApplied;
        if (!date || isNaN(new Date(date).getTime())) {
            // fallback to today
            date = new Date().toISOString().slice(0, 10);
        }
        if (!groups[date]) {
            groups[date] = [];
        }
        groups[date].push(application);
        return groups;
    }, {});

    // Sort dates in descending order (newest first)
    const sortedDates = Object.keys(groupedApplications).sort((a, b) => new Date(b) - new Date(a));

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        if (isNaN(date.getTime())) return dateString;
        return date.toLocaleDateString('en-US', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        });
    };

    return (
        <div className="main">
            <JobApplicationInput
                handleAddApplication={handleAddApplication}
                applicationData={applicationData}
                setApplicationData={setApplicationData}
                applications={applications}
            />
            {sortedDates.map(date => (
                <div key={date} className="dateGroup">
                    <h2 className="dateHeader">
                      {formatDate(date)}
                      {' '}({groupedApplications[date].length})
                    </h2>
                    <div className="applicationsGroup">
                        {[...groupedApplications[date]].reverse().map(application => (
                            <JobApplicationItem
                                key={application.id}
                                application={application}
                                handleUpdateApplication={handleUpdateApplication}
                                handleDeleteApplication={handleDeleteApplication}
                            />
                        ))}
                    </div>
                </div>
            ))}
            {applications.length === 0 && (
                <p className="emptyState">No job applications yet. Add your first application above!</p>
            )}
            {applications.length > 0 && activeApplications.length === 0 && (
                <p className="emptyState">All applications have been moved to the rejection pile.</p>
            )}
        </div>
    );
}