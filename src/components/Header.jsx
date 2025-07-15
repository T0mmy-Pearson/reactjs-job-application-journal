import React from "react";
import SearchBar from "./SearchBar";

export default function Header({ applications, onSearchResults }) {
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
        <div className="headerBar">
            <div className="headerBarContent">
                <span>{getCurrentDate()}</span>
            </div>
            <SearchBar 
                applications={applications}
                onSearchResults={onSearchResults}
            />
        </div>
    );
}
