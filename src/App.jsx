// JobApplicationInput is now handled inside Header
import JobApplicationList from "./components/JobApplicationList";
import RejectionPile from "./components/RejectionPile";
import AffirmationsPanel from "./components/AffirmationsPanel";
import Calendar from "./components/Calendar";
import Header from "./components/Header";
import { useState, useEffect } from "react";
import { auth, db } from "./firebase";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { useAuthState } from "react-firebase-hooks/auth";
import AuthForm from "./components/AuthForm";
import { FaUser } from "react-icons/fa";
import { signOut } from "firebase/auth";
import SettingsModal from "./components/SettingsModal";
import FeedbackForm from "./components/FeedbackForm";
import { defaultApplications } from "./components/SearchBar";

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
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem("theme") || "combo-1";
  });
  const [showFeedback, setShowFeedback] = useState(false);

  useEffect(() => {
    document.body.className = theme;
    localStorage.setItem("theme", theme);
  }, [theme]);

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
    const newApplicationsList = applications.map(app => 
      app.id === id ? updatedApplication : app
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

  if (loading) return <div>Loading...</div>;

  // If not logged in, show only the login/register modal
  if (!user && !showAuthModal) {
    return <AuthForm onAuth={() => setShowAuthModal(false)} onClose={() => setShowAuthModal(false)} />;
  }

  return (
    <>
      {/* Person icon button for opening user menu */}
      {user && (
        <div style={{position: 'fixed', top: 24, right: 32, zIndex: 1200}}>
          <button className="personIconBtn" onClick={() => setShowUserMenu(m => !m)} title="Account">
            <FaUser />
          </button>
          {showUserMenu && (
            <div style={{position: 'absolute', top: 40, right: 0, background: 'var(--color-1)', color: 'var(--color-2)', borderRadius: 8, minWidth: 160, zIndex: 1300, padding: 0, border: '1px solid var(--color-2)'}}>
              <button className="moreMenuItem" style={{width: '100%', padding: '10px 16px', background: 'none', border: 'none', textAlign: 'left', cursor: 'pointer'}} onClick={() => { setShowSettings(true); setShowUserMenu(false); }}>Settings</button>
              <button className="moreMenuItem" style={{width: '100%', padding: '10px 16px', background: 'none', border: 'none', textAlign: 'left', cursor: 'pointer'}} onClick={handleLogout}>Log out</button>
            </div>
          )}
        </div>
      )}
      {/* Settings modal */}
      {showSettings && (
        <SettingsModal 
          currentTheme={theme} 
          onChangeTheme={setTheme} 
          onClose={() => setShowSettings(false)}
          onFeedback={() => { setShowFeedback(true); setShowSettings(false); }}
        />
      )}
      {showFeedback && (
        <FeedbackForm onClose={() => setShowFeedback(false)} />
      )}
      {/* Auth modal overlay (for account actions) */}
      {showAuthModal && (
        <AuthForm onAuth={() => setShowAuthModal(false)} onClose={() => setShowAuthModal(false)} />
      )}
      <div className="headerBar">
        <Header 
          applications={applications}
          onSearchResults={handleSearchResults}
          handleAddApplication={handleAddApplication}
        />
      </div>
      <div className={`mainContainer ${isDragOverRejectPile ? 'dragOverReject' : ''}`}>
        <div>
          <AffirmationsPanel />
          <Calendar />
        </div>
        <JobApplicationList 
          applications={displayApplications}
          handleUpdateApplication={handleUpdateApplication}
          handleDeleteApplication={handleDeleteApplication}
          handleAddApplication={handleAddApplication}
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