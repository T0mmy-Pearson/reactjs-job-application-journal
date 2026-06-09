import React, { useState, useEffect, useMemo } from "react";

const pad = (n) => String(n).padStart(2, "0");
const toKey = (year, month, day) => `${year}-${pad(month + 1)}-${pad(day)}`;

// Simple calendar for current month, theme-driven, with application activity.
export default function Calendar({ applications = [], selectedDate = null, onSelectDate = () => {} }) {
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

  // Group applications by the day they were applied (handles both field names).
  const appsByDate = useMemo(() => {
    const map = {};
    (applications || []).forEach((app) => {
      const key = app.dateApplied || app.date;
      if (!key) return;
      if (!map[key]) map[key] = [];
      map[key].push(app);
    });
    return map;
  }, [applications]);

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

  const formatSelected = (key) => {
    const [y, m, d] = key.split("-").map(Number);
    return new Date(y, m - 1, d).toLocaleDateString("en-US", {
      weekday: "long", month: "long", day: "numeric"
    });
  };

  const selectedApps = selectedDate ? (appsByDate[selectedDate] || []) : [];

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
        marginTop: 0,
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
            <div key={day} style={{ fontWeight: "bold", color: "var(--color-2)", fontSize: "0.85rem" }}>{day}</div>
          ))}
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 2, textAlign: "center" }}>
          {days.map((d, i) => {
            if (!d) return <div key={i} className="calCell calCell--empty" />;
            const dateKey = toKey(currentYear, currentMonth, d);
            const dayApps = appsByDate[dateKey] || [];
            const isToday = d === today.getDate() && currentMonth === today.getMonth() && currentYear === today.getFullYear();
            const isSelected = dateKey === selectedDate;
            return (
              <button
                key={i}
                type="button"
                className={`calCell${isToday ? " calCell--today" : ""}${isSelected ? " calCell--selected" : ""}`}
                onClick={() => onSelectDate(isSelected ? null : dateKey)}
                title={dayApps.length ? `${dayApps.length} application${dayApps.length > 1 ? "s" : ""}` : undefined}
              >
                <span className="calDayNum">{d}</span>
                {dayApps.length > 0 && (
                  <span className="calDots">
                    {dayApps.slice(0, 3).map(app => (
                      <span
                        key={app.id}
                        className="calDot"
                        style={{ background: `var(--status-${app.status})` }}
                      />
                    ))}
                    {dayApps.length > 3 && <span className="calDotMore">+{dayApps.length - 3}</span>}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {selectedDate && (
        <div className="calDetail">
          <div className="calDetailHeader">
            <span>{formatSelected(selectedDate)}</span>
            <button type="button" onClick={() => onSelectDate(null)} aria-label="Close" title="Close">✕</button>
          </div>
          {selectedApps.length === 0 ? (
            <p className="calDetailEmpty">No applications on this date.</p>
          ) : (
            <ul className="calDetailList">
              {selectedApps.map(app => (
                <li key={app.id} className="calDetailItem">
                  <span className="calDetailDot" style={{ background: `var(--status-${app.status})` }} />
                  <span className="calDetailText">
                    <strong>{app.company}</strong>
                    <span>{app.position}</span>
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      <div style={{
        marginTop: 16,
        background: "var(--color-1)",
        border: "1px solid var(--color-2)",
        borderRadius: 8,
        padding: 16,
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
