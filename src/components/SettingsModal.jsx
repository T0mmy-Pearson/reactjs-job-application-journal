import React, { useState, useEffect } from "react";
import { auth } from "../firebase";
import {
  EmailAuthProvider,
  reauthenticateWithCredential,
  updatePassword,
  verifyBeforeUpdateEmail,
} from "firebase/auth";

function friendlyError(err) {
  switch (err?.code) {
    case "auth/wrong-password":
    case "auth/invalid-credential":
      return "Current password is incorrect.";
    case "auth/weak-password":
      return "New password is too weak (use at least 6 characters).";
    case "auth/invalid-email":
      return "That email address is not valid.";
    case "auth/email-already-in-use":
      return "That email is already in use by another account.";
    case "auth/requires-recent-login":
      return "Please log out and back in, then try again.";
    case "auth/too-many-requests":
      return "Too many attempts. Try again later.";
    default:
      return err?.message || "Something went wrong.";
  }
}

export default function SettingsModal({ user, onClose, onFeedback }) {
  const [newEmail, setNewEmail] = useState("");
  const [emailPassword, setEmailPassword] = useState("");
  const [emailMsg, setEmailMsg] = useState(null);

  const [newPassword, setNewPassword] = useState("");
  const [passwordCurrent, setPasswordCurrent] = useState("");
  const [pwMsg, setPwMsg] = useState(null);

  const [busy, setBusy] = useState(false);

  useEffect(() => {
    function handleEsc(e) {
      if (e.key === "Escape" && onClose) onClose();
    }
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  async function reauthenticate(currentPassword) {
    const cred = EmailAuthProvider.credential(auth.currentUser.email, currentPassword);
    await reauthenticateWithCredential(auth.currentUser, cred);
  }

  async function handleChangeEmail(e) {
    e.preventDefault();
    setEmailMsg(null);
    if (!newEmail.trim() || !emailPassword) return;
    setBusy(true);
    try {
      await reauthenticate(emailPassword);
      await verifyBeforeUpdateEmail(auth.currentUser, newEmail.trim());
      setEmailMsg({ type: "ok", text: `Verification sent to ${newEmail.trim()}. Click the link in that email to finish the change.` });
      setNewEmail("");
      setEmailPassword("");
    } catch (err) {
      setEmailMsg({ type: "err", text: friendlyError(err) });
    } finally {
      setBusy(false);
    }
  }

  async function handleChangePassword(e) {
    e.preventDefault();
    setPwMsg(null);
    if (!newPassword || !passwordCurrent) return;
    setBusy(true);
    try {
      await reauthenticate(passwordCurrent);
      await updatePassword(auth.currentUser, newPassword);
      setPwMsg({ type: "ok", text: "Password updated." });
      setNewPassword("");
      setPasswordCurrent("");
    } catch (err) {
      setPwMsg({ type: "err", text: friendlyError(err) });
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="authModalOverlay">
      <div className="authModal settingsModalBox">
        <button className="authModalClose" onClick={onClose} title="Close">✕</button>
        <h2>Settings</h2>

        <p className="settingsCurrent">
          Signed in as <strong>{user?.email}</strong>
        </p>

        {/* Change email */}
        <form className="settingsSection" onSubmit={handleChangeEmail}>
          <span className="settingsSectionTitle">Change email</span>
          <input
            className="settingsInput"
            type="email"
            value={newEmail}
            onChange={(e) => setNewEmail(e.target.value)}
            placeholder="New email address"
            autoComplete="email"
          />
          <input
            className="settingsInput"
            type="password"
            value={emailPassword}
            onChange={(e) => setEmailPassword(e.target.value)}
            placeholder="Current password"
            autoComplete="current-password"
          />
          <button type="submit" className="settingsSaveBtn" disabled={busy}>Update email</button>
          {emailMsg && <p className={`settingsMsg ${emailMsg.type}`}>{emailMsg.text}</p>}
        </form>

        {/* Change password */}
        <form className="settingsSection" onSubmit={handleChangePassword}>
          <span className="settingsSectionTitle">Change password</span>
          <input
            className="settingsInput"
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="New password"
            autoComplete="new-password"
          />
          <input
            className="settingsInput"
            type="password"
            value={passwordCurrent}
            onChange={(e) => setPasswordCurrent(e.target.value)}
            placeholder="Current password"
            autoComplete="current-password"
          />
          <button type="submit" className="settingsSaveBtn" disabled={busy}>Update password</button>
          {pwMsg && <p className={`settingsMsg ${pwMsg.type}`}>{pwMsg.text}</p>}
        </form>

        <button type="button" className="settingsFeedbackBtn" onClick={onFeedback}>
          Send Feedback
        </button>
      </div>
    </div>
  );
}
