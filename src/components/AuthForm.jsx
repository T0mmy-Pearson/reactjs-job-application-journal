
import React, { useState, useEffect } from "react";
import { auth } from "../firebase";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";

export default function AuthForm({ onAuth, onClose }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isRegister, setIsRegister] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    function handleEsc(e) {
      if (e.key === "Escape" && onClose) onClose();
    }
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      if (isRegister) {
        await createUserWithEmailAndPassword(auth, email, password);
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
      onAuth();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="authModalOverlay">
      <div className="authModal">
        {onClose && (
          <button className="authModalClose" onClick={onClose} title="Close">
            <i className="fa-solid fa-times"></i>
          </button>
        )}
        <form className="authForm" onSubmit={handleSubmit}>
          <h2 style={{
            color: "var(--color-2)",
            marginBottom: "1.5rem",
            fontWeight: 700,
            letterSpacing: "0.02em"
          }}>{isRegister ? "Register" : "Login"}</h2>
          <input
            className="authInput"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="Email"
            required
            style={{
              background: "var(--color-1)",
              color: "var(--color-2)",
              border: "1px solid var(--color-2)",
              borderRadius: 6,
              marginBottom: 16,
              padding: "12px 16px",
              fontSize: "1.1rem",
              width: "100%"
            }}
          />
          <input
            className="authInput"
            value={password}
            onChange={e => setPassword(e.target.value)}
            type="password"
            placeholder="Password"
            required
            style={{
              background: "var(--color-1)",
              color: "var(--color-2)",
              border: "1px solid var(--color-2)",
              borderRadius: 6,
              marginBottom: 20,
              padding: "12px 16px",
              fontSize: "1.1rem",
              width: "100%"
            }}
          />
          <button
            type="submit"
            className="authButton"
            style={{
              background: "var(--color-2)",
              color: "var(--color-1)",
              border: "none",
              borderRadius: 6,
              padding: "12px 0",
              fontWeight: 700,
              fontSize: "1.1rem",
              marginBottom: 12,
              width: "100%",
              cursor: "pointer",
              transition: "background 0.2s, color 0.2s"
            }}
          >
            {isRegister ? "Register" : "Login"}
          </button>
          <button
            type="button"
            className="authSwitchButton"
            onClick={() => setIsRegister(r => !r)}
            style={{
              background: "var(--color-1)",
              color: "var(--color-2)",
              border: "1px solid var(--color-2)",
              borderRadius: 6,
              padding: "10px 0",
              fontWeight: 500,
              fontSize: "1rem",
              width: "100%",
              cursor: "pointer",
              marginBottom: 8,
              transition: "background 0.2s, color 0.2s"
            }}
          >
            {isRegister ? "Have an account? Login" : "No account? Register"}
          </button>
          {error && (
            <div style={{
              color: "var(--accent-red)",
              background: "rgba(var(--color-1-rgb),0.7)",
              borderRadius: 6,
              padding: "8px 12px",
              marginTop: 8,
              fontWeight: 600,
              textAlign: "center"
            }}>{error}</div>
          )}
        </form>
      </div>
    </div>
  );
}