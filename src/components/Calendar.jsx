import React, { useState, useEffect } from "react";

// Simple calendar for current month, theme-driven
export default function Calendar() {
  const today = new Date();
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [currentYear, setCurrentYear] = useState(today.getFullYear());

  const getDaysInMonth = (month, year) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfWeek = (month, year) => {
    return new Date(year, month, 1).getDay();
  };

  const daysInMonth = getDaysInMonth(currentMonth, currentYear);
  const firstDay = getFirstDayOfWeek(currentMonth, currentYear);
  const days = [];

  for (let i = 0; i < firstDay; i++) {
    days.push(null);
  }
  for (let d = 1; d <= daysInMonth; d++) {
    days.push(d);
  }

  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];
  const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  // Notes state and persistence
  const [notes, setNotes] = useState("");

  useEffect(() => {
    const saved = localStorage.getItem("calendarNotes");
    if (saved) setNotes(saved);
  }, []);

  const handleNotesChange = (e) => {
    setNotes(e.target.value);
    localStorage.setItem("calendarNotes", e.target.value);
  };

  return (
    <div>
      <div className="calendar" style={{
        background: "var(--color-1)",
        color: "var(--color-2)",
        borderRadius: 8,
        padding: 16,
        marginTop: 16,
        boxShadow: "none",
        border: "1px solid var(--color-2)",
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
          <button onClick={handlePrevMonth} style={{ background: "none", border: "none", color: "var(--color-2)", fontSize: 18, cursor: "pointer" }}>&lt;</button>
          <span style={{ fontWeight: "bold" }}>{monthNames[currentMonth]} {currentYear}</span>
          <button onClick={handleNextMonth} style={{ background: "none", border: "none", color: "var(--color-2)", fontSize: 18, cursor: "pointer" }}>&gt;</button>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 2, textAlign: "center", marginBottom: 4 }}>
          {weekDays.map(day => (
            <div key={day} style={{ fontWeight: "bold", color: "var(--color-2)" }}>{day}</div>
          ))}
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 2, textAlign: "center" }}>
          {days.map((d, i) => (
            <div key={i} style={{
              padding: d ? "6px 0" : undefined,
              opacity: d ? 1 : 0,
              background: d && d === today.getDate() && currentMonth === today.getMonth() && currentYear === today.getFullYear() ? "var(--color-2)" : "none",
              color: d && d === today.getDate() && currentMonth === today.getMonth() && currentYear === today.getFullYear() ? "var(--color-1)" : "var(--color-2)",
              borderRadius: 4,
              fontWeight: d && d === today.getDate() && currentMonth === today.getMonth() && currentYear === today.getFullYear() ? "bold" : undefined
            }}>{d || ""}</div>
          ))}
        </div>
      </div>
      <div style={{
        marginTop: 12,
        background: "var(--color-1)",
        border: "1px solid var(--color-2)",
        borderRadius: 8,
        padding: 12,
        boxShadow: "none"
      }}>
        <label htmlFor="calendarNotes" style={{ fontWeight: 500, color: "var(--color-2)", marginBottom: 4, display: "block" }}>Notes</label>
        <textarea
          id="calendarNotes"
          value={notes}
          onChange={handleNotesChange}
          placeholder="Write your notes here..."
          style={{
            width: "100%",
            minHeight: 60,
            border: "none",
            outline: "none",
            background: "var(--color-1)",
            color: "var(--color-2)",
            fontSize: 15,
            borderRadius: 6,
            resize: "vertical",
            fontFamily: "inherit",
            boxSizing: "border-box"
          }}
        />
      </div>
    </div>
  );
}
