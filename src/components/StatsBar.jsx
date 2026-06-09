import React from "react";

// Statuses that mean the employer has engaged in some way.
const RESPONDED_STATUSES = ['awaiting-interview', 'interviewed', 'awaiting-response', 'offer', 'rejected'];
const INTERVIEW_STATUSES = ['awaiting-interview', 'interviewed'];

export default function StatsBar({ applications }) {
    const total = applications.length;
    const responded = applications.filter(app => RESPONDED_STATUSES.includes(app.status)).length;
    const interviews = applications.filter(app => INTERVIEW_STATUSES.includes(app.status)).length;
    const rejections = applications.filter(app => app.status === 'rejected').length;
    const responseRate = total === 0 ? 0 : Math.round((responded / total) * 100);

    const stats = [
        { label: 'Applied', value: total, icon: 'fa-briefcase', accent: 'var(--status-applied)' },
        { label: 'Response rate', value: `${responseRate}%`, icon: 'fa-reply', accent: 'var(--status-interviewed)' },
        { label: 'Interviews', value: interviews, icon: 'fa-comments', accent: 'var(--status-awaiting-interview)' },
        { label: 'Rejections', value: rejections, icon: 'fa-heart-crack', accent: 'var(--status-rejected)' },
    ];

    return (
        <div className="statsBar">
            {stats.map(stat => (
                <div className="statCard" key={stat.label} style={{ '--stat-accent': stat.accent }}>
                    <i className={`fa-solid ${stat.icon} statIcon`}></i>
                    <div className="statText">
                        <span className="statValue">{stat.value}</span>
                        <span className="statLabel">{stat.label}</span>
                    </div>
                </div>
            ))}
        </div>
    );
}
