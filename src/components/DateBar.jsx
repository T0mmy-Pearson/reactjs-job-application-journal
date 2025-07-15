import React from "react";
import SearchBar from "./SearchBar";

export default function DateBar({ applications, onSearchResults }) {
    const getCurrentDate = () => {
        const today = new Date();
        return today.toLocaleDateString('en-US', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        });
    };

    return (
        <div className="dateBar">
            <div className="dateBarContent">
                <span>{getCurrentDate()}</span>
            </div>
            <SearchBar 
                applications={applications}
                onSearchResults={onSearchResults}
            />
        </div>
    );
}
