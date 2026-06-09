import JobApplicationList from "./components/JobApplicationList";
import JobApplicationInput from "./components/JobApplicationInput";
import RejectionPile from "./components/RejectionPile";
import AffirmationsPanel from "./components/AffirmationsPanel";
import LinksPanel from "./components/LinksPanel";
import Calendar from "./components/Calendar";
import { useState, useEffect } from "react";
import { auth, db } from "./firebase";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { useAuthState } from "react-firebase-hooks/auth";
import AuthForm from "./components/AuthForm";
import { FaUser } from "react-icons/fa";
import { signOut } from "firebase/auth";
import SettingsModal from "./components/SettingsModal";
import StatsModal from "./components/StatsModal";
import FeedbackForm from "./components/FeedbackForm";
import SearchBar, { defaultApplications } from "./components/SearchBar";

function App() {
  const [user, loading] = useAuthState(auth);
  const [applications, setApplications] = useState(defaultApplications);
  // Set app title to JJonpm
  useEffect(() => {
    document.title = "YourJobJournal";
  }, []);
  // Application input state is now managed in Header
  const [isDragOverRejectPile, setIsDragOverRejectPile] = useState(false);
  const [searchResults, setSearchResults] = useState(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [showStats, setShowStats] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);

  // Save applications to Firestore for this user
  async function persistData(newList) {
    if (!user) return;
    await setDoc(doc(db, "applications", user.uid), { applications: newList });
  }

  // Add
  async function handleAddApplication(newApplication) {
    const newApplicationsList = [...applications, newApplication];
    await persistData(newApplicationsList);
    setApplications(newApplicationsList);
  }

  // Update
  async function handleUpdateApplication(id, updatedApplication) {
    // A rejection always means you've heard back from the employer.
    const normalized = updatedApplication.status === 'rejected'
      ? { ...updatedApplication, heardBack: true }
      : updatedApplication;
    const newApplicationsList = applications.map(app =>
      app.id === id ? normalized : app
    );
    await persistData(newApplicationsList);
    setApplications(newApplicationsList);
  }

  // Delete
  async function handleDeleteApplication(id) {
    const newApplicationsList = applications.filter(app => app.id !== id);
    await persistData(newApplicationsList);
    setApplications(newApplicationsList);
  }

  function handleRejectApplication(applicationId) {
    const application = applications.find(app => String(app.id) === String(applicationId));
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

  function handleLogout() {
    signOut(auth);
    setShowUserMenu(false);
    setShowAuthModal(false);
  }

  // Load applications from Firestore on login
  useEffect(() => {
    async function loadUserData() {
      if (!user) return;
      const docSnap = await getDoc(doc(db, "applications", user.uid));
      if (docSnap.exists()) {
        setApplications(docSnap.data().applications);
      } else {
        setApplications(defaultApplications);
        persistData(defaultApplications);
      }
    }
    loadUserData();
  }, [user]);



  const rejectedApplications = applications.filter(app => app.status === 'rejected');
  const displayApplications = searchResults !== null ? searchResults : applications;

if (loading) return (
  <div style={{
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'var(--color-1)',
    color: 'var(--color-2)',
    fontFamily: 'inherit',
    zIndex: 2000
  }}>
    <div style={{
      width: 70,
      height: 70,
      marginBottom: 32,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      <div style={{
        width: 60,
        height: 60,
        border: '7px solid var(--color-2)',
        borderTop: '7px solid var(--color-1)',
        borderRadius: '50%',
        animation: 'spin 1s linear infinite'
      }} />
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
    <div style={{ fontSize: '2.5rem', fontWeight: 800, letterSpacing: '0.04em' }}>Loading...</div>
  </div>
);

  // If not logged in, show only the login/register modal
  if (!user && !showAuthModal) {
    return <AuthForm onAuth={() => setShowAuthModal(false)} onClose={() => setShowAuthModal(false)} />;
  }

  return (
    <>
      {/* Settings modal */}
      {showSettings && (
        <SettingsModal
          user={user}
          onClose={() => setShowSettings(false)}
          onFeedback={() => { setShowFeedback(true); setShowSettings(false); }}
        />
      )}
      {showFeedback && (
        <FeedbackForm onClose={() => setShowFeedback(false)} />
      )}
      <StatsModal
        open={showStats}
        onClose={() => setShowStats(false)}
        applications={applications}
      />
      {/* Auth modal overlay (for account actions) */}
      {showAuthModal && (
        <AuthForm onAuth={() => setShowAuthModal(false)} onClose={() => setShowAuthModal(false)} />
      )}
      {user && (
        <header className="appHeader">
          <div className="accountMenuWrap">
            <button className="personIconBtn" onClick={() => setShowUserMenu(m => !m)} title="Account">
              <FaUser />
            </button>
            {showUserMenu && (
              <div className="accountMenu">
                <button className="moreMenuItem" onClick={() => { setShowStats(true); setShowUserMenu(false); }}>Stats</button>
                <button className="moreMenuItem" onClick={() => { setShowSettings(true); setShowUserMenu(false); }}>Settings</button>
                <button className="moreMenuItem" onClick={handleLogout}>Log out</button>
              </div>
            )}
          </div>
          <h1 className="appTitle"><span>Your Job Journal</span></h1>
        </header>
      )}
      <div className={`mainContainer ${isDragOverRejectPile ? 'dragOverReject' : ''}`}>
        <div className="sideColumn">
          <AffirmationsPanel />
          <div className="searchAddRow">
            <JobApplicationInput handleAddApplication={handleAddApplication} />
            <SearchBar
              applications={applications}
              onSearchResults={handleSearchResults}
            />
          </div>
          <Calendar
            applications={applications}
            selectedDate={selectedDate}
            onSelectDate={setSelectedDate}
          />
          <LinksPanel user={user} />
          <RejectionPile
            rejectedApplications={rejectedApplications}
            handleUpdateApplication={handleUpdateApplication}
            handleDeleteApplication={handleDeleteApplication}
            onDrop={handleRejectApplication}
            onDragOver={handleDragOverRejectPile}
          />
        </div>
        <div className="applicationsSection">
          <JobApplicationList
            applications={displayApplications}
            handleUpdateApplication={handleUpdateApplication}
            handleDeleteApplication={handleDeleteApplication}
            focusedDate={selectedDate}
          />
        </div>
      </div>
    </>
  );
}

export default App;