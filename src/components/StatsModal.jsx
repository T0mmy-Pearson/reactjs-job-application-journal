import React, { useEffect } from "react";
import StatsBar from "./StatsBar";

const STATUS_BREAKDOWN = [
    { key: 'applying', label: 'Applying' },
    { key: 'applied', label: 'Applied' },
    { key: 'awaiting-interview', label: 'Awaiting Interview' },
    { key: 'interviewed', label: 'Interviewed' },
    { key: 'awaiting-response', label: 'Awaiting Response' },
    { key: 'offer', label: 'Offer Received' },
    { key: 'rejected', label: 'Rejected' },
];

export default function StatsModal({ open, onClose, applications }) {
    useEffect(() => {
        function handleEsc(e) {
            if (e.key === "Escape" && onClose) onClose();
        }
        if (open) window.addEventListener("keydown", handleEsc);
        return () => window.removeEventListener("keydown", handleEsc);
    }, [open, onClose]);

    if (!open) return null;

    const total = applications.length;
    const breakdown = STATUS_BREAKDOWN.map(status => ({
        ...status,
        count: applications.filter(app => app.status === status.key).length,
    }));

    return (
        <div className="authModalOverlay" onClick={onClose}>
            <div className="statsModal" onClick={e => e.stopPropagation()}>
                <button className="authModalClose" onClick={onClose} title="Close">✕</button>
                <h2 className="statsModalTitle">Your Stats</h2>

                <StatsBar applications={applications} />

                <div className="statsBreakdown">
                    <h3 className="statsBreakdownTitle">Breakdown by status</h3>
                    {total === 0 ? (
                        <p className="statsEmpty">No applications yet.</p>
                    ) : (
                        breakdown.map(status => {
                            const pct = Math.round((status.count / total) * 100);
                            return (
                                <div className="breakdownRow" key={status.key}>
                                    <span className="breakdownLabel">{status.label}</span>
                                    <div className="breakdownTrack">
                                        <div
                                            className="breakdownFill"
                                            style={{ width: `${pct}%`, background: `var(--status-${status.key})` }}
                                        />
                                    </div>
                                    <span className="breakdownCount">{status.count}</span>
                                </div>
                            );
                        })
                    )}
                </div>
            </div>
        </div>
    );
}
