import React, { useState, useEffect } from "react";
import axios from "axios";
import { ToastContainer, toast, Bounce } from "react-toastify";
import Modal from "./components/modal-component/modal";
import { useMutation } from "@tanstack/react-query";
import { createPortal } from "react-dom";
import "./App.css";

const API_URL =
  "https://timecalculator-deebf4apfbhvenca.canadacentral-01.azurewebsites.net/api/Punch/caluclateV3";

function getISTTime() {
  return new Date().toLocaleTimeString("en-IN", {
    timeZone: "Asia/Kolkata",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });
}

const SAMPLE = `21-Mar-2025\t9:00:00 AM\t21-Mar-2025\t1:00:00 PM\n21-Mar-2025\t1:45:00 PM\t21-Mar-2025\t5:30:00 PM\n21-Mar-2025\t5:45:00 PM`;

/* ── Sun icon ── */
const SunIcon = () => (
  <svg viewBox="0 0 24 24">
    <circle cx="12" cy="12" r="5" />
    <line x1="12" y1="1"  x2="12" y2="3" />
    <line x1="12" y1="21" x2="12" y2="23" />
    <line x1="4.22" y1="4.22"  x2="5.64" y2="5.64" />
    <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
    <line x1="1"  y1="12" x2="3"  y2="12" />
    <line x1="21" y1="12" x2="23" y2="12" />
    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
    <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
  </svg>
);

/* ── Moon icon ── */
const MoonIcon = () => (
  <svg viewBox="0 0 24 24">
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
  </svg>
);

const App = () => {
  const [punchData, setPunchData]   = useState("");
  const [showModal, setShowModal]   = useState(false);
  const [dayType, setDayType]       = useState("0");
  const [istTime, setIstTime]       = useState(getISTTime());

  /* ── Theme: read from localStorage, default dark ── */
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem("pc-theme") || "dark";
  });

  /* Apply theme to <html> so CSS variables activate globally */
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("pc-theme", theme);
  }, [theme]);

  const toggleTheme = () =>
    setTheme((t) => (t === "dark" ? "light" : "dark"));

  /* Live IST clock */
  useEffect(() => {
    const t = setInterval(() => setIstTime(getISTTime()), 1000);
    return () => clearInterval(t);
  }, []);

  /* ── API call ── */
  const calculateTime = async () => {
    const result = await axios.post(
      API_URL,
      {},
      {
        params: { punchData, dayType },
        headers: {
          accept: "*/*",
          "Content-Type": "application/json-patch+json",
        },
      }
    );
    return result.data.data;
  };

  const { mutate, isPending, data } = useMutation({
    mutationFn: calculateTime,
    onError: (error) => {
      setShowModal(false);
      toast.error(error.message);
    },
    onSuccess: () => {
      toast.success("Calculation successful!");
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!punchData.trim()) {
      toast.error("Please enter your timesheet data.");
      return;
    }
    setShowModal(true);
    mutate();
  };

  return (
    <>
      <div className="app-shell">

        {/* ── Header ── */}
        <div className="header">
          <div className="header-left">
            <div>
              <span className="header-title">PUNCH CLOCK</span>
              <span className="header-dot" />
            </div>
            <div className="header-sub">
              Office time tracker &amp; completion estimator
            </div>
          </div>

          <div className="header-right">
            <div className="ist-badge">
              IST&nbsp;&nbsp;<span>{istTime}</span>
            </div>

            {/* Dark / Light toggle */}
            <button
              className="theme-toggle"
              onClick={toggleTheme}
              title={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
              aria-label="Toggle theme"
            >
              {theme === "dark" ? <SunIcon /> : <MoonIcon />}
            </button>
          </div>
        </div>

        {/* ── Form ── */}
        <form
          onSubmit={handleSubmit}
          style={{ display: "flex", flexDirection: "column", gap: 16 }}
        >
          {/* Day Type */}
          <div className="card fade-in" style={{ animationDelay: ".05s" }}>
            <div className="card-label">Day Type</div>
            <div className="day-toggle">
              <button
                type="button"
                className={`day-btn ${dayType === "0" ? "active" : ""}`}
                onClick={() => setDayType("0")}
              >
                Full Day — 8h
              </button>
              <button
                type="button"
                className={`day-btn ${dayType === "1" ? "active" : ""}`}
                onClick={() => setDayType("1")}
              >
                Half Day — 4h
              </button>
            </div>
          </div>

          {/* Punch Data */}
          <div className="card fade-in" style={{ animationDelay: ".1s" }}>
            <div className="card-label">Punch Data</div>
            <textarea
              className="punch-textarea"
              rows={8}
              value={punchData}
              onChange={(e) => setPunchData(e.target.value)}
              placeholder={
                "Paste your tab-separated timesheet data here...\n\n" +
                "21-Mar-2025\t9:00:00 AM\t21-Mar-2025\t5:00:00 PM\n" +
                "21-Mar-2025\t5:15:00 PM"
              }
            />
            <p className="input-hint">
              Format per row: DD-Mon-YYYY [TAB] h:mm:ss AM/PM [TAB] DD-Mon-YYYY [TAB] h:mm:ss AM/PM
              <br />
              The last row may have only a punch-in time if you are still in the office.
            </p>

            <button type="submit" className="calc-btn" disabled={isPending}>
              {isPending && <span className="btn-spinner" />}
              {isPending ? "Calculating..." : "Calculate Work Time"}
            </button>

          </div>
        </form>
      </div>

      {/* ── Modal via portal ── */}
      {showModal &&
        createPortal(
          <Modal
            title="Calculation Result"
            content={data}
            onClose={() => setShowModal(false)}
            status={isPending}
          />,
          document.body
        )}

      <ToastContainer
        position="top-center"
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        draggable
        pauseOnHover
        theme={theme}
        transition={Bounce}
      />
    </>
  );
};

export default App;