import React, { useEffect, useRef } from "react";
import JobApplicationItem from "./JobApplicationItem";

export default function JobApplicationList({ applications, handleUpdateApplication, handleDeleteApplication, focusedDate }) {
    const scrollRef = useRef(null);

    // Filter out rejected applications
    const activeApplications = applications.filter(app => app.status !== 'rejected');

    // Group applications by date (same key the calendar uses; fallback to today)
    const groupedApplications = activeApplications.reduce((groups, application) => {
        let date = application.dateApplied || application.date;
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

    // When a date is picked on the calendar, scroll its group into view
    useEffect(() => {
        if (!focusedDate) return;
        const container = scrollRef.current;
        if (!container) return;
        const target = container.querySelector(`[data-date="${focusedDate}"]`);
        if (target) {
            target.scrollIntoView({ behavior: "smooth", block: "start" });
        }
    }, [focusedDate]);

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
            <div className="applicationsWindow">
            <div className="applicationsListScroll" ref={scrollRef}>
                {sortedDates.map(date => (
                    <div
                        key={date}
                        data-date={date}
                        className={`dateGroup${date === focusedDate ? " dateGroup--focus" : ""}`}
                    >
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
            </div>
        </div>
    );
}