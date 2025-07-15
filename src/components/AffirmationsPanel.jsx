import React, { useState, useEffect, useRef } from "react";

export default function AffirmationsPanel() {
    const [currentIndex, setCurrentIndex] = useState(0);
    const intervalRef = useRef(null);

    const affirmations = [
        "You are capable of achieving great things in your career.",
        "Every 'no' brings you closer to the right 'yes'.",
        "Your skills and talents are valuable and in demand.",
        "The perfect opportunity is out there waiting for you.",
        "You have overcome challenges before, and you will again.",
        "Your persistence and dedication will pay off.",
        "You are worthy of a fulfilling and rewarding career.",
        "Each application is a step toward your dream job.",
        "Your unique perspective makes you a valuable asset.",
        "Success is not final, failure is not fatal: it is the courage to continue that counts.",
        "You are building resilience with every application.",
        "Your ideal job exists, and you will find it.",
        "You have the power to create the career you want.",
        "Every interview is a learning opportunity.",
        "You are growing stronger through this process.",
        "Your breakthrough moment is coming.",
        "You deserve a job that appreciates your worth.",
        "Trust the process - good things take time.",
        "You are exactly where you need to be right now.",
        "Your determination sets you apart from others.",
        "The right employer will recognize your value.",
        "You are writing your own success story.",
        "Every day brings new opportunities.",
        "You have everything you need to succeed.",
        "Your journey is unique and valuable.",
        "You are resilient, capable, and strong.",
        "The best is yet to come in your career.",
        "You are making progress, even when it doesn't feel like it.",
        "Your hard work will be rewarded.",
        "You are destined for professional success."
    ];

    useEffect(() => {
        intervalRef.current = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % affirmations.length);
        }, 5000);
        return () => clearInterval(intervalRef.current);
    }, [affirmations.length]);

    return (
        <div className="affirmationsBanner">
            <div className="affirmationsBanner-content">
                <span className="affirmationsBanner-quote">&#10077;</span>
                <span className="affirmationsBanner-text">{affirmations[currentIndex]}</span>
                <span className="affirmationsBanner-quote">&#10078;</span>
            </div>
        </div>
    );
}
