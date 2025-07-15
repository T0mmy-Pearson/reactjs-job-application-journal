import React, { useState } from "react";

export default function SearchBar({ applications, onSearchResults }) {
    const [searchTerm, setSearchTerm] = useState("");

    const handleSearch = (term) => {
        setSearchTerm(term);
        
        if (term.trim() === "") {
            onSearchResults(null); 
            return;
        }

        const filteredApplications = applications.filter(app => 
            app.company.toLowerCase().includes(term.toLowerCase()) ||
            app.position.toLowerCase().includes(term.toLowerCase()) ||
            (app.source && app.source.toLowerCase().includes(term.toLowerCase())) ||
            (app.notes && app.notes.toLowerCase().includes(term.toLowerCase())) ||
            (app.labels && app.labels.some(label => label.toLowerCase().includes(term.toLowerCase()))) ||
            app.status.toLowerCase().includes(term.toLowerCase())
        );

        onSearchResults(filteredApplications);
    };

    const clearSearch = () => {
        setSearchTerm("");
        onSearchResults(null);
    };

    return (
        <div className="searchContainer">
            <div className="searchBar">
                <div className="searchInput">
                    <i className="fa-solid fa-search search-icon"></i>
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => handleSearch(e.target.value)}
                        placeholder="Search by company, position, source, notes, labels, or status..."
                        autoFocus={false}
                    />
                    {searchTerm && (
                        <button 
                            type="button" 
                            className="clearSearchButton"
                            onClick={clearSearch}
                            title="Clear search"
                        >
                            <i className="fa-solid fa-times"></i>
                        </button>
                    )}
                </div>
                {searchTerm && (
                    <div className="searchResults">
                        <small>
                            {applications.filter(app => 
                                app.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                app.position.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                (app.source && app.source.toLowerCase().includes(searchTerm.toLowerCase())) ||
                                (app.notes && app.notes.toLowerCase().includes(searchTerm.toLowerCase())) ||
                                (app.labels && app.labels.some(label => label.toLowerCase().includes(searchTerm.toLowerCase()))) ||
                                app.status.toLowerCase().includes(searchTerm.toLowerCase())
                            ).length} results found
                        </small>
                    </div>
                )}
            </div>
        </div>
    );
}
