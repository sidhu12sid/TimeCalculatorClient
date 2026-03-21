import React, { useEffect, useRef } from "react";

/* ── Helpers ───────────────────────────────────────────────────────────── */

function parseWorkedMs(str) {
  if (!str) return 0;
  const h = parseInt(str.match(/(\d+)h/)?.[1] ?? 0);
  const m = parseInt(str.match(/(\d+)m/)?.[1] ?? 0);
  const s = parseInt(str.match(/(\d+)s/)?.[1] ?? 0);
  return (h * 3600 + m * 60 + s) * 1000;
}

function parseTargetMs(str) {
  if (!str) return 8 * 3600000;
  const h = parseInt(str.match(/(\d+)h/)?.[1] ?? 8);
  return h * 3600000;
}

// V3 API: uses completionMessage field
function detectStatus(msg, isCurrentlyPunchedIn) {
  if (!msg) return "working";
  const t = msg.toLowerCase();
  if (t.includes("overtime") || t.includes("still counting")) return "overtime";
  if (t.includes("short"))    return "short";
  if (t.includes("completed")) return isCurrentlyPunchedIn ? "overtime" : "done";
  return "working";
}

/* ── Progress Ring ─────────────────────────────────────────────────────── */
function ProgressRing({ pct, status }) {
  const R    = 54;
  const CIRC = 2 * Math.PI * R;
  const offset = CIRC - (Math.min(pct, 100) / 100) * CIRC;
  const color =
    status === "short"    ? "var(--red)"   :
    status === "overtime" ? "var(--amber)" :
    "var(--teal)";

  // Track ring color adapts to theme
  const trackColor =
    document.documentElement.getAttribute("data-theme") === "light"
      ? "#e8e6e2"
      : "#1a1b24";

  return (
    <div style={{ position: "relative", width: 136, height: 136, flexShrink: 0 }}>
      <svg width="136" height="136" style={{ transform: "rotate(-90deg)" }}>
        <circle cx="68" cy="68" r={R} fill="none" stroke={trackColor} strokeWidth="9" />
        <circle
          cx="68" cy="68" r={R}
          fill="none"
          stroke={color}
          strokeWidth="9"
          strokeDasharray={CIRC}
          strokeDashoffset={offset}
          strokeLinecap="round"
          style={{ transition: "stroke-dashoffset .8s cubic-bezier(.4,0,.2,1)" }}
        />
      </svg>
      <div style={{
        position: "absolute", inset: 0,
        display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center",
        gap: 2,
      }}>
        <span style={{
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: 22, fontWeight: 600,
          color, lineHeight: 1,
        }}>
          {Math.min(pct, 100)}%
        </span>
        <span style={{ fontSize: 11, color: "var(--text-muted)" }}>
          complete
        </span>
      </div>
    </div>
  );
}

/* ── Stat Box ──────────────────────────────────────────────────────────── */
function StatBox({ label, value, accent, fullWidth = false }) {
  return (
    <div style={{
      background: "var(--bg-deep)",
      borderRadius: 10,
      padding: "11px 14px",
      border: "1px solid var(--border)",
      gridColumn: fullWidth ? "1 / -1" : "auto",
    }}>
      <div style={{
        fontSize: 10, fontWeight: 700,
        letterSpacing: ".08em", textTransform: "uppercase",
        color: "var(--text-dim)", marginBottom: 5,
      }}>
        {label}
      </div>
      <div style={{
        fontFamily: "'JetBrains Mono', monospace",
        fontSize: 15, fontWeight: 600,
        color: accent ?? "var(--text-primary)",
      }}>
        {value ?? "—"}
      </div>
    </div>
  );
}

/* ── Skeleton ──────────────────────────────────────────────────────────── */
function Skeleton({ w = "100%", h = 16, radius = 6, style = {} }) {
  return (
    <div style={{
      width: w, height: h,
      borderRadius: radius,
      background: "var(--bg-hover)",
      animation: "skel-pulse 1.4s ease-in-out infinite",
      ...style,
    }} />
  );
}

/* ── Missed punch warnings list ────────────────────────────────────────── */
function MissedPunchList({ warnings }) {
  if (!warnings?.length) return null;
  return (
    <div style={{
      marginBottom: 14,
      background: "var(--amber-dim)",
      border: "1px solid var(--amber-border)",
      borderRadius: 10,
      padding: "12px 14px",
    }}>
      <div style={{
        fontSize: 11, fontWeight: 700,
        letterSpacing: ".08em", textTransform: "uppercase",
        color: "var(--amber)", marginBottom: 8,
      }}>
        ⚠ Missed Punch Warnings
      </div>
      {warnings.map((w, i) => (
        <div key={i} style={{
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: 11.5,
          color: "var(--text-secondary)",
          lineHeight: 1.6,
          paddingLeft: 8,
          borderLeft: "2px solid var(--amber-border)",
          marginBottom: i < warnings.length - 1 ? 6 : 0,
        }}>
          {w}
        </div>
      ))}
    </div>
  );
}

/* ── Modal ─────────────────────────────────────────────────────────────── */
const Modal = ({ title, content, onClose, status: isPending }) => {
  const overlayRef = useRef(null);

  const handleOverlayClick = (e) => {
    if (!isPending && e.target === overlayRef.current) onClose();
  };

  useEffect(() => {
    const handler = (e) => { if (e.key === "Escape" && !isPending) onClose(); };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [isPending, onClose]);

  // V3 API field names (camelCase from ASP.NET Core serialization)
  const completionMessage    = content?.completionMessage;
  const totalWorked          = content?.totalWorked;
  const targetWorkTime       = content?.targetWorkTime;
  const isCurrentlyPunchedIn = content?.isCurrentlyPunchedIn ?? false;
  const hasMissedPunches     = content?.hasMissedPunches ?? false;
  const missedPunchWarnings  = content?.missedPunchWarnings ?? [];
  const indianTime           = content?.indianTime;
  const serverTime           = content?.serverTime;

  const workedMs = parseWorkedMs(totalWorked);
  const targetMs = parseTargetMs(targetWorkTime);
  const pct      = targetMs > 0 ? Math.round((workedMs / targetMs) * 100) : 0;
  const status   = detectStatus(completionMessage, isCurrentlyPunchedIn);

  const statusMeta = {
    working:  { label: "In Progress",  color: "var(--teal)",  bg: "var(--teal-dim)",  border: "var(--teal-border)"  },
    done:     { label: "Completed",    color: "var(--teal)",  bg: "var(--teal-dim)",  border: "var(--teal-border)"  },
    overtime: { label: "Overtime",     color: "var(--amber)", bg: "var(--amber-dim)", border: "var(--amber-border)" },
    short:    { label: "Incomplete",   color: "var(--red)",   bg: "var(--red-dim)",   border: "var(--red-border)"   },
  };
  const meta = statusMeta[status] ?? statusMeta.working;

  const lines = completionMessage
    ? completionMessage.split(/\r?\n/).filter(Boolean)
    : [];

  // Extract just the time part from "dd-MM-yyyy hh:mm:ss tt"
  const timeOnly = (str) => str?.split(" ").slice(1).join(" ") ?? "—";

  return (
    <>
      <style>{`
        @keyframes skel-pulse {
          0%, 100% { opacity: .5; }
          50%       { opacity: 1; }
        }
        @keyframes modal-in {
          from { opacity: 0; transform: scale(.96) translateY(12px); }
          to   { opacity: 1; transform: scale(1)   translateY(0); }
        }
        @keyframes overlay-in {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
      `}</style>

      {/* Overlay */}
      <div
        ref={overlayRef}
        onClick={handleOverlayClick}
        style={{
          position: "fixed", inset: 0, zIndex: 100,
          display: "flex", alignItems: "center", justifyContent: "center",
          padding: "24px 16px",
          background: "rgba(5,6,10,.8)",
          backdropFilter: "blur(6px)",
          animation: "overlay-in .22s ease both",
        }}
      >
        {/* Dialog */}
        <div style={{
          background: "var(--bg-card)",
          border: "1px solid var(--border)",
          borderRadius: 18,
          width: "100%",
          maxWidth: 500,
          animation: "modal-in .28s cubic-bezier(.34,1.56,.64,1) both",
          overflow: "hidden",
          boxShadow: "0 24px 60px rgba(0,0,0,.4)",
        }}>

          {/* ── Header ── */}
          <div style={{
            display: "flex", alignItems: "flex-start",
            justifyContent: "space-between",
            padding: "20px 22px 0",
            gap: 12,
          }}>
            <div>
              <div style={{
                fontSize: 10, fontWeight: 700, letterSpacing: ".1em",
                color: "var(--text-dim)", marginBottom: 4, textTransform: "uppercase",
              }}>
              </div>
              <div style={{
                fontSize: 18, fontWeight: 800,
                letterSpacing: "-.015em",
                color: "var(--text-primary)",
              }}>
                {title}
              </div>
            </div>

            <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 6, flexShrink: 0 }}>
              {!isPending && (
                <span style={{
                  fontSize: 10, fontWeight: 700, letterSpacing: ".07em",
                  padding: "4px 10px", borderRadius: 6, textTransform: "uppercase",
                  background: meta.bg, color: meta.color,
                  border: `1px solid ${meta.border}`,
                }}>
                  {meta.label}
                </span>
              )}
              {!isPending && isCurrentlyPunchedIn && (
                <span style={{
                  display: "flex", alignItems: "center", gap: 5,
                  fontSize: 10, fontWeight: 600,
                  color: "var(--teal)",
                  fontFamily: "'JetBrains Mono', monospace",
                }}>
                  <span style={{
                    width: 6, height: 6, borderRadius: "50%",
                    background: "var(--teal)",
                    animation: "skel-pulse 1.5s ease-in-out infinite",
                    display: "inline-block",
                  }} />
                  Live
                </span>
              )}
            </div>
          </div>

          {/* ── Body ── */}
          <div style={{ padding: "18px 22px 0" }}>

            {/* Progress ring + message */}
            {isPending ? (
              <div style={{ display: "flex", gap: 18, alignItems: "center", marginBottom: 18 }}>
                <Skeleton w={136} h={136} radius={136} style={{ flexShrink: 0 }} />
                <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 10 }}>
                  <Skeleton w="85%" h={13} />
                  <Skeleton w="65%" h={13} />
                  <Skeleton w="75%" h={13} />
                </div>
              </div>
            ) : (
              <div style={{ display: "flex", gap: 20, alignItems: "center", marginBottom: 18 }}>
                <ProgressRing pct={pct} status={status} />
                <div style={{ flex: 1 }}>
                  {lines.map((line, i) => (
                    <p key={i} style={{
                      fontFamily: "'JetBrains Mono', monospace",
                      fontSize: 12.5,
                      color: i === 0 ? "var(--text-primary)" : "var(--text-secondary)",
                      lineHeight: 1.7,
                      marginBottom: i < lines.length - 1 ? 8 : 0,
                    }}>
                      {line}
                    </p>
                  ))}
                </div>
              </div>
            )}

            {/* Stats grid */}
            <div style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 8,
              marginBottom: 14,
            }}>
              {isPending ? (
                <>
                  <Skeleton h={62} radius={10} />
                  <Skeleton h={62} radius={10} />
                  <Skeleton h={62} radius={10} />
                  <Skeleton h={62} radius={10} />
                </>
              ) : (
                <>
                  <StatBox
                    label="Worked"
                    value={totalWorked}
                    accent={status === "overtime" ? "var(--amber)" : "var(--teal)"}
                  />
                  <StatBox label="Target" value={targetWorkTime} />
                  <StatBox label="IST Now"     value={timeOnly(indianTime)} />
                  <StatBox label="Server Time" value={timeOnly(serverTime)} />
                </>
              )}
            </div>

            {/* Missed punch warnings — only shown if present */}
            {!isPending && hasMissedPunches && (
              <MissedPunchList warnings={missedPunchWarnings} />
            )}
          </div>

          {/* ── Footer ── */}
          <div style={{ padding: "4px 22px 20px" }}>
            {isPending ? (
              <Skeleton h={44} radius={11} />
            ) : (
              <button
                onClick={onClose}
                style={{
                  width: "100%",
                  padding: "12px 24px",
                  background: "var(--amber)",
                  color: "#fff",
                  border: "none",
                  borderRadius: 11,
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                  fontWeight: 700,
                  fontSize: 14,
                  cursor: "pointer",
                  transition: "filter .15s, transform .15s",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.filter = "brightness(1.1)";
                  e.currentTarget.style.transform = "translateY(-1px)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.filter = "brightness(1)";
                  e.currentTarget.style.transform = "translateY(0)";
                }}
              >
                Close
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Modal;