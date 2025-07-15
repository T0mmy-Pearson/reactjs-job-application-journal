
import React, { useState } from "react";
import { auth } from "../firebase";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";

export default function AuthForm({ onAuth, onClose }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isRegister, setIsRegister] = useState(false);
  const [error, setError] = useState("");

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
        <form onSubmit={handleSubmit}>
          <h2>{isRegister ? "Register" : "Login"}</h2>
          <input value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" required />
          <input value={password} onChange={e => setPassword(e.target.value)} type="password" placeholder="Password" required />
          <button type="submit">{isRegister ? "Register" : "Login"}</button>
          <button type="button" onClick={() => setIsRegister(r => !r)}>
            {isRegister ? "Have an account? Login" : "No account? Register"}
          </button>
          {error && <div style={{color: "red"}}>{error}</div>}
        </form>
      </div>
    </div>
  );
}