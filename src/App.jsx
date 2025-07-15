import JobApplicationInput from "./components/JobApplicationInput";
import JobApplicationList from "./components/JobApplicationList";
import RejectionPile from "./components/RejectionPile";
import AffirmationsPanel from "./components/AffirmationsPanel";
import DateBar from "./components/DateBar";
import { useState, useEffect } from "react";

function App() {
  const [applications, setApplications] = useState([]);
  const [applicationData, setApplicationData] = useState({
    company: "",
    position: "",
    status: "applying",
    source: "",
    notes: "",
    labels: []
  });
  const [isDragOverRejectPile, setIsDragOverRejectPile] = useState(false);
  const [searchResults, setSearchResults] = useState(null);

  function persistData(newList) {
    localStorage.setItem("jobApplications", JSON.stringify({ applications: newList }));
  }

  function handleAddApplication(newApplication) {
    const newApplicationsList = [...applications, newApplication];
    persistData(newApplicationsList);
    setApplications(newApplicationsList);
  }

  function handleUpdateApplication(id, updatedApplication) {
    const newApplicationsList = applications.map(app => 
      app.id === id ? updatedApplication : app
    );
    persistData(newApplicationsList);
    setApplications(newApplicationsList);
  }

  function handleDeleteApplication(id) {
    const newApplicationsList = applications.filter(app => app.id !== id);
    persistData(newApplicationsList);
    setApplications(newApplicationsList);
  }

  function handleRejectApplication(applicationId) {
    const application = applications.find(app => app.id === parseInt(applicationId));
    if (application) {
      handleUpdateApplication(application.id, { ...application, status: 'rejected' });
    }
  }

  function handleDragOverRejectPile(isOver) {
    setIsDragOverRejectPile(isOver);
  }

  function handleSearchResults(results) {
    setSearchResults(results);
  }

  useEffect(() => {
    if (!localStorage) {
      return;
    }
    let localApplications = localStorage.getItem("jobApplications");
    if (!localApplications) {
      return;
    }

    localApplications = JSON.parse(localApplications).applications;
    setApplications(localApplications);
  }, []);

  const rejectedApplications = applications.filter(app => app.status === 'rejected');
  const displayApplications = searchResults !== null ? searchResults : applications;

  return (
    <>
      <DateBar 
        applications={applications}
        onSearchResults={handleSearchResults}
      />
      <JobApplicationInput 
        applicationData={applicationData} 
        setApplicationData={setApplicationData} 
        handleAddApplication={handleAddApplication}
        applications={applications}
        onSearchResults={handleSearchResults}
      />
      <div className={`mainContainer ${isDragOverRejectPile ? 'dragOverReject' : ''}`}>
        <AffirmationsPanel />
        <JobApplicationList 
          applications={displayApplications}
          handleUpdateApplication={handleUpdateApplication}
          handleDeleteApplication={handleDeleteApplication}
        />
        <RejectionPile 
          rejectedApplications={rejectedApplications}
          handleUpdateApplication={handleUpdateApplication}
          handleDeleteApplication={handleDeleteApplication}
          onDrop={handleRejectApplication}
          onDragOver={handleDragOverRejectPile}
        />
      </div>
    </>
  );
}

export default App;