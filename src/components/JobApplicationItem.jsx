import React, { useState, useRef } from "react";

export default function JobApplicationItem({ application, handleUpdateApplication, handleDeleteApplication, isDraggable = true }) {
    const [showNotes, setShowNotes] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editData, setEditData] = useState({ ...application });
    const menuRef = useRef(null);

    // Close menu on outside click
    React.useEffect(() => {
        function handleClickOutside(event) {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setMenuOpen(false);
            }
        }
        if (menuOpen) {
            document.addEventListener("mousedown", handleClickOutside);
        } else {
            document.removeEventListener("mousedown", handleClickOutside);
        }
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [menuOpen]);

    const handleStatusChange = (newStatus) => {
        handleUpdateApplication(application.id, { ...application, status: newStatus });
    };

    const handleHeardBackChange = (checked) => {
        handleUpdateApplication(application.id, { ...application, heardBack: checked });
    };

    const isValidUrl = (string) => {
        try {
            new URL(string);
            return true;
        } catch (_) {
            return false;
        }
    };

    const renderSource = () => {
        if (!application.source) return null;
        if (isValidUrl(application.source)) {
            return (
                <p className="source">
                    Source: <a href={application.source} target="_blank" rel="noopener noreferrer">
                        {application.source}
                    </a>
                </p>
            );
        }
        return <p className="source">Source: {application.source}</p>;
    };

    const toggleNotes = () => {
        setShowNotes(!showNotes);
    };

    const handleDragStart = (e) => {
        e.dataTransfer.setData("text/plain", application.id);
        e.dataTransfer.effectAllowed = "move";
    };

    // Edit logic
    const handleEditClick = () => {
        setEditData({ ...application });
        setIsEditing(true);
        setMenuOpen(false);
    };
    const handleEditChange = (e) => {
        const { name, value } = e.target;
        setEditData((prev) => ({ ...prev, [name]: value }));
    };
    const handleEditSave = () => {
        handleUpdateApplication(application.id, { ...application, ...editData });
        setIsEditing(false);
    };
    const handleEditCancel = () => {
        setIsEditing(false);
        setEditData({ ...application });
    };

    return (
        <div 
            className={`applicationItem ${isDraggable ? 'draggable' : ''}`}
            draggable={isDraggable && application.status !== 'rejected'}
            onDragStart={handleDragStart}
        >
            {/* More menu button */}
            <div style={{ position: 'absolute', top: 10, right: 10 }}>
                <button
                    className="moreButton"
                    onClick={() => setMenuOpen((v) => !v)}
                    aria-label="More options"
                    style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-1)', fontSize: 20 }}
                >
                    <i className="fa-solid fa-ellipsis-vertical"></i>
                </button>
                {menuOpen && (
                    <div className="moreMenu" ref={menuRef} style={{ position: 'absolute', right: 0, top: 30, background: 'var(--color-2)', color: 'var(--color-1)', border: '1px solid var(--color-1)', borderRadius: 6, zIndex: 10, minWidth: 100 }}>
                        <button className="moreMenuItem" style={{ background: 'none', border: 'none', color: 'inherit', width: '100%', padding: 8, textAlign: 'left', cursor: 'pointer' }} onClick={handleEditClick}>
                            <i className="fa-solid fa-pen-to-square" style={{ marginRight: 8 }}></i> Edit
                        </button>
                        <button className="moreMenuItem" style={{ background: 'none', border: 'none', color: 'inherit', width: '100%', padding: 8, textAlign: 'left', cursor: 'pointer' }} onClick={() => { handleDeleteApplication(application.id); setMenuOpen(false); }}>
                            <i className="fa-solid fa-trash" style={{ marginRight: 8 }}></i> Delete
                        </button>
                    </div>
                )}
            </div>

            {/* Card content: view or edit mode */}
            {!isEditing ? (
                <>
                    <div className="applicationInfo">
                        <h3>{application.company}</h3>
                        <p>{application.position}</p>
                        {renderSource()}
                        {application.labels && application.labels.length > 0 && (
                            <div className="labelsDisplay">
                                {application.labels.map((label, index) => (
                                    <span key={index} className="labelTag">
                                        {label}
                                    </span>
                                ))}
                            </div>
                        )}
                        {application.notes && (
                            <div className="notesSection">
                                <button 
                                    className="notesToggle"
                                    onClick={toggleNotes}
                                    type="button"
                                >
                                    <i className={`fa-solid ${showNotes ? 'fa-chevron-up' : 'fa-chevron-down'}`} style={{ color: 'var(--color-1)' }}></i>
                                    Notes
                                </button>
                                {showNotes && (
                                    <div className="notesContent">
                                        <p>{application.notes}</p>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                    <div className="statusContainer">
                        <select
                            value={application.status}
                            onChange={(e) => handleStatusChange(e.target.value)}
                            className={`statusSelect status-${application.status}`}
                        >
                            <option value="applying">Applying</option>
                            <option value="applied">Applied</option>
                            <option value="awaiting-interview">Awaiting Interview</option>
                            <option value="interviewed">Interviewed</option>
                            <option value="awaiting-response">Awaiting Response</option>
                            <option value="offer">Offer Received</option>
                            <option value="rejected">Rejected</option>
                        </select>
                    </div>
                    <div className="heardBackContainer">
                        <label>
                            <input
                                type="checkbox"
                                checked={application.heardBack}
                                onChange={(e) => handleHeardBackChange(e.target.checked)}
                            />
                            Heard back
                        </label>
                    </div>
                </>
            ) : (
                <form className="applicationInfo" onSubmit={e => { e.preventDefault(); handleEditSave(); }} style={{ width: '100%' }}>
                    <input
                        name="company"
                        value={editData.company}
                        onChange={handleEditChange}
                        className="editInput"
                        style={{ marginBottom: 8 }}
                        required
                    />
                    <input
                        name="position"
                        value={editData.position}
                        onChange={handleEditChange}
                        className="editInput"
                        style={{ marginBottom: 8 }}
                        required
                    />
                    <input
                        name="source"
                        value={editData.source}
                        onChange={handleEditChange}
                        className="editInput"
                        style={{ marginBottom: 8 }}
                        placeholder="Source (URL or text)"
                    />
                    <textarea
                        name="notes"
                        value={editData.notes}
                        onChange={handleEditChange}
                        className="editInput"
                        style={{ marginBottom: 8 }}
                        placeholder="Notes"
                    />
                    {/* Labels editing could be added here if needed */}
                    <div style={{ display: 'flex', gap: 8 }}>
                        <button type="submit" className="submitButton" style={{ flex: 1 }}>Save</button>
                        <button type="button" className="closeButton" style={{ flex: 1 }} onClick={handleEditCancel}>Cancel</button>
                    </div>
                </form>
            )}
            <div className="actionsContainer">
                <button onClick={() => handleDeleteApplication(application.id)} style={{ display: 'none' }}>
                    Delete
                </button>
            </div>
        </div>
    );
}