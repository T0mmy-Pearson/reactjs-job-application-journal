import React from "react";
import SearchBar from "./SearchBar";

export default function Header({ applications, onSearchResults }) {
    return (
        <div className="headerBar">
            <SearchBar 
                applications={applications}
                onSearchResults={onSearchResults}
            />
        </div>
    );
}
