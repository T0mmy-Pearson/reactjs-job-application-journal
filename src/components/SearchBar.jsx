import React, { useState } from "react";

// Example default applications for onboarding/demo purposes
export const defaultApplications = [
  {
    id: '1',
    company: 'Acme Corp',
    position: 'Frontend Developer',
    source: 'LinkedIn',
    notes: 'Great culture, remote-first. Applied via referral.',
    labels: ['remote', 'referral'],
    status: 'applied',
    date: '2025-07-10',
  },
  {
    id: '2',
    company: 'Globex Inc',
    position: 'UI/UX Designer',
    source: 'Company Website',
    notes: 'Design challenge expected. Portfolio sent.',
    labels: ['design', 'portfolio'],
    status: 'awaiting-interview',
    date: '2025-07-12',
  },
  {
    id: '3',
    company: 'Initech',
    position: 'Backend Engineer',
    source: 'Indeed',
    notes: 'Requires Python and Node.js experience.',
    labels: ['python', 'nodejs'],
    status: 'applying',
    date: '2025-07-14',
  },
  {
    id: '4',
    company: 'Umbrella Corp',
    position: 'QA Tester',
    source: 'Recruiter',
    notes: 'Contract role, 6 months.',
    labels: ['contract', 'qa'],
    status: 'rejected',
    date: '2025-06-30',
  },
  {
    id: '5',
    company: 'Wayne Enterprises',
    position: 'DevOps Engineer',
    source: 'Glassdoor',
    notes: 'Interview scheduled for next week.',
    labels: ['devops', 'interview'],
    status: 'interviewed',
    date: '2025-07-01',
  },
  {
    id: '6',
    company: 'Stark Industries',
    position: 'Full Stack Developer',
    source: 'AngelList',
    notes: 'Startup, equity offered.',
    labels: ['startup', 'equity'],
    status: 'offer',
    date: '2025-07-13',
  },
  {
    id: '7',
    company: 'Hooli',
    position: 'Product Manager',
    source: 'Referral',
    notes: 'Met hiring manager at conference.',
    labels: ['pm', 'networking'],
    status: 'awaiting-response',
    date: '2025-07-09',
  },
  {
    id: '8',
    company: 'Soylent Corp',
    position: 'Data Scientist',
    source: 'LinkedIn',
    notes: 'Remote, food tech.',
    labels: ['data', 'remote'],
    status: 'applied',
    date: '2025-07-11',
  },
];

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
                        placeholder="Search applications..."
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
