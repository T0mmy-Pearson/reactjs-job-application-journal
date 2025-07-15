import React, { useRef, useState } from "react";
import emailjs from "@emailjs/browser";

export default function FeedbackForm({ onClose }) {
  const form = useRef();
  const [sent, setSent] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError(null);
    emailjs.sendForm(
      "service_necz3nb",
      "template_522nn6q",
      form.current,
      "3-C4BaJMGBMJNwGGS"
    )
      .then(() => setSent(true))
      .catch(() => setError("Could not send feedback. Please try again later."));
  };

  if (sent) {
    return (
      <div className="authModalOverlay">
        <div className="authModal">
          <button className="authModalClose" onClick={onClose} title="Close">✕</button>
          <h2>Thank you!</h2>
          <p>Your feedback has been sent.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="authModalOverlay">
      <div className="authModal" style={{ minWidth: 320 }}>
        <button className="authModalClose" onClick={onClose} title="Close">✕</button>
        <h2>Send Feedback</h2>
        <form ref={form} onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <label>
            Your Email (optional):
            <input type="email" name="user_email" style={{ width: "100%", padding: 8, borderRadius: 6, border: "1px solid var(--color-2)" }} />
          </label>
          <label>
            Feedback:
            <textarea name="message" required style={{ width: "100%", minHeight: 80, padding: 8, borderRadius: 6, border: "1px solid var(--color-2)" }} />
          </label>
          {error && <div style={{ color: "var(--accent-red)", fontWeight: "bold" }}>{error}</div>}
          <button type="submit" style={{ padding: "10px 18px", borderRadius: 8, border: "none", background: "var(--color-2)", color: "var(--color-1)", fontWeight: "bold", cursor: "pointer" }}>Send</button>
        </form>
      </div>
    </div>
  );
}
