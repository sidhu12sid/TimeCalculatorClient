import React from "react";

const Loader = () => {
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "rgba(13,14,20,.8)",
        backdropFilter: "blur(4px)",
        zIndex: 200,
      }}
    >
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
        {/* Animated ring */}
        <div style={{ position: "relative", width: 48, height: 48 }}>
          <svg width="48" height="48" style={{ transform: "rotate(-90deg)" }}>
            <circle cx="24" cy="24" r="19" fill="none" stroke="#1a1b24" strokeWidth="4" />
            <circle
              cx="24" cy="24" r="19"
              fill="none"
              stroke="#e8a020"
              strokeWidth="4"
              strokeDasharray="119.4"
              strokeDashoffset="90"
              strokeLinecap="round"
              style={{ animation: "loader-spin .9s linear infinite" }}
            />
          </svg>
          <style>{`
            @keyframes loader-spin {
              0%   { stroke-dashoffset: 90; transform: rotate(0deg); }
              50%  { stroke-dashoffset: 20; }
              100% { stroke-dashoffset: 90; transform: rotate(360deg); }
            }
          `}</style>
        </div>

        <span style={{
          fontFamily: "'Syne Mono', monospace",
          fontSize: 12,
          color: "#5a5c70",
          letterSpacing: ".06em",
        }}>
          CALCULATING...
        </span>
      </div>
    </div>
  );
};

export default Loader;
