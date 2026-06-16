// ═══════════════════════════════════════════════
//  THEME — Warm Amber × Deep Slate
//  Bold, governmental-but-humane aesthetic
// ═══════════════════════════════════════════════

export const C = {
  bg:        "#0e1117",
  bgCard:    "#141a24",
  bgInput:   "#1a2233",
  bgTable:   "#111827",
  border:    "rgba(251,191,36,0.15)",
  borderHov: "rgba(251,191,36,0.45)",
  accent:    "#fbbf24",       // amber-400
  accentDim: "rgba(251,191,36,0.12)",
  accentGlow:"rgba(251,191,36,0.25)",
  green:     "#34d399",
  greenDim:  "rgba(52,211,153,0.12)",
  red:       "#f87171",
  text:      "#e2e8f0",
  textMuted: "#64748b",
  textLabel: "#94a3b8",
  white:     "#ffffff",
};

export const inputStyle = {
  background: C.bgInput,
  border: `1px solid ${C.border}`,
  borderRadius: 8,
  padding: "10px 14px",
  color: C.text,
  fontSize: 13,
  outline: "none",
  width: "100%",
  boxSizing: "border-box",
  fontFamily: "inherit",
  transition: "border-color 0.2s, box-shadow 0.2s",
};

export const labelStyle = {
  fontSize: 10,
  fontWeight: 700,
  letterSpacing: "0.1em",
  color: C.textLabel,
  textTransform: "uppercase",
  marginBottom: 6,
  display: "block",
};

export const req = { color: C.red, marginLeft: 2 };
export const opt = { color: C.textMuted, fontSize: 9, fontWeight: 400, letterSpacing: 0, textTransform: "none", marginLeft: 4 };
