import React, { useState, useEffect } from "react";

export default function AffirmationsPanel() {
    const [isActive, setIsActive] = useState(false);
    const [currentAffirmation, setCurrentAffirmation] = useState("");
    const [intervalId, setIntervalId] = useState(null);

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

    const getRandomAffirmation = () => {
        const randomIndex = Math.floor(Math.random() * affirmations.length);
        return affirmations[randomIndex];
    };

    const startAffirmations = () => {
        setIsActive(true);
        setCurrentAffirmation(getRandomAffirmation());
        
        const id = setInterval(() => {
            setCurrentAffirmation(getRandomAffirmation());
        }, 5000); // Change every 5 seconds
        
        setIntervalId(id);
    };

    const stopAffirmations = () => {
        setIsActive(false);
        setCurrentAffirmation("");
        if (intervalId) {
            clearInterval(intervalId);
            setIntervalId(null);
        }
    };

    const nextAffirmation = () => {
        setCurrentAffirmation(getRandomAffirmation());
    };

    useEffect(() => {
        return () => {
            if (intervalId) {
                clearInterval(intervalId);
            }
        };
    }, [intervalId]);

    return (
        <div className="affirmationsPanel">
            <div className="affirmationsHeader">
                <h2>
                    <i className="fa-solid fa-heart"></i> Daily Affirmations
                </h2>
                {!isActive ? (
                    <button 
                        className="activateButton"
                        onClick={startAffirmations}
                    >
                        <i className="fa-solid fa-play"></i> Activate Affirmations
                    </button>
                ) : (
                    <div className="affirmationControls">
                        <button 
                            className="nextButton"
                            onClick={nextAffirmation}
                            title="Next affirmation"
                        >
                            <i className="fa-solid fa-forward"></i>
                        </button>
                        <button 
                            className="stopButton"
                            onClick={stopAffirmations}
                            title="Stop affirmations"
                        >
                            <i className="fa-solid fa-stop"></i>
                        </button>
                    </div>
                )}
            </div>
            
            {isActive && (
                <div className="affirmationDisplay">
                    <div className="affirmationText">
                        <i className="fa-solid fa-quote-left quote-icon"></i>
                        <p>{currentAffirmation}</p>
                        <i className="fa-solid fa-quote-right quote-icon"></i>
                    </div>
                    <div className="affirmationFooter">
                        <small>New affirmation every 5 seconds</small>
                    </div>
                </div>
            )}
            
            {!isActive && (
                <div className="affirmationInactive">
                    <p>Click "Activate Affirmations" to start receiving positive reminders during your job search journey.</p>
                </div>
            )}
        </div>
    );
}
