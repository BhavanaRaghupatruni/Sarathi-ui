import { C, inputStyle, labelStyle, req, opt } from "../theme";

export function sanitizeNumeric(val) {
  let cleaned = String(val || "").replace(/\D/g, "");
  if (cleaned.startsWith("0")) {
    cleaned = cleaned.replace(/^0+/, "");
    if (cleaned === "") cleaned = "0";
  }
  return cleaned;
}

// ── Input ────────────────────────────────────────────
export function TextInput({ value, onChange, placeholder, type = "text", min, max, style, error, disabled, inputRef }) {
  const borderCol = error ? C.red : (disabled ? "rgba(255,255,255,0.05)" : C.border);

  const handleChange = (val) => {
    if (type === "number") {
      onChange(sanitizeNumeric(val));
    } else {
      onChange(val);
    }
  };

  return (
    <input
      ref={inputRef}
      data-invalid={error ? "true" : undefined}
      type={type === "number" ? "text" : type}
      inputMode={type === "number" ? "numeric" : undefined}
      pattern={type === "number" ? "[0-9]*" : undefined}
      value={value} min={min} max={max}
      onChange={e => handleChange(e.target.value)}
      placeholder={placeholder || ""}
      disabled={disabled}
      style={{
        ...inputStyle,
        borderColor: borderCol,
        opacity: disabled ? 0.4 : 1,
        cursor: disabled ? "not-allowed" : "text",
        ...style
      }}
      onFocus={e => {
        if (disabled) return;
        e.target.style.borderColor = error ? C.red : C.accent;
        e.target.style.boxShadow = `0 0 0 3px ${error ? "rgba(248,113,113,0.25)" : C.accentGlow}`;
      }}
      onBlur={e => {
        if (disabled) return;
        e.target.style.borderColor = borderCol;
        e.target.style.boxShadow = "none";
      }}
    />
  );
}

export function SelectInput({ value, onChange, options, style, error, disabled }) {
  const borderCol = error ? C.red : (disabled ? "rgba(255,255,255,0.05)" : C.border);
  return (
    <select
      value={value} onChange={e => onChange(e.target.value)}
      disabled={disabled}
      style={{
        ...inputStyle,
        appearance: "none",
        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='6'%3E%3Cpath d='M0 0l5 6 5-6z' fill='%2364748b'/%3E%3C/svg%3E")`,
        backgroundRepeat: "no-repeat",
        backgroundPosition: "right 12px center",
        paddingRight: 32,
        cursor: disabled ? "not-allowed" : "pointer",
        borderColor: borderCol,
        opacity: disabled ? 0.4 : 1,
        ...style
      }}
      onFocus={e => {
        if (disabled) return;
        e.target.style.borderColor = error ? C.red : C.accent;
        e.target.style.boxShadow = `0 0 0 3px ${error ? "rgba(248,113,113,0.25)" : C.accentGlow}`;
      }}
      onBlur={e => {
        if (disabled) return;
        e.target.style.borderColor = borderCol;
        e.target.style.boxShadow = "none";
      }}
    >
      {options.map(([v, l]) => <option key={v} value={v} style={{ background: C.bgCard }}>{l}</option>)}
    </select>
  );
}

// ── Radio pill ────────────────────────────────────────
export function Radio({ active, onClick, children, disabled }) {
  return (
    <button
      onClick={disabled ? undefined : onClick}
      disabled={disabled}
      style={{
        display: "flex", alignItems: "center", gap: 7,
        padding: "7px 15px", borderRadius: 24,
        border: `1px solid ${active ? C.accent : "rgba(255,255,255,0.1)"}`,
        background: active ? C.accentDim : "transparent",
        color: active ? C.accent : C.textMuted,
        cursor: disabled ? "not-allowed" : "pointer",
        fontSize: 12, fontWeight: active ? 700 : 400,
        transition: "all 0.15s", userSelect: "none", fontFamily: "inherit",
        opacity: disabled ? 0.4 : 1,
      }}
    >
      <span style={{
        width: 9, height: 9, borderRadius: "50%", flexShrink: 0,
        border: `2px solid ${active ? C.accent : "#475569"}`,
        background: active ? C.accent : "transparent",
        transition: "all 0.15s",
      }} />
      {children}
    </button>
  );
}

// ── Checkbox pill ─────────────────────────────────────
export function Check({ active, onClick, children, disabled }) {
  return (
    <button
      onClick={disabled ? undefined : onClick}
      disabled={disabled}
      style={{
        display: "flex", alignItems: "center", gap: 7,
        padding: "7px 15px", borderRadius: 8,
        border: `1px solid ${active ? C.green : "rgba(255,255,255,0.1)"}`,
        background: active ? C.greenDim : "transparent",
        color: active ? C.green : C.textMuted,
        cursor: disabled ? "not-allowed" : "pointer",
        fontSize: 12, fontWeight: active ? 700 : 400,
        transition: "all 0.15s", userSelect: "none", fontFamily: "inherit",
        opacity: disabled ? 0.4 : 1,
      }}
    >
      <span style={{
        width: 9, height: 9, borderRadius: 3, flexShrink: 0,
        border: `2px solid ${active ? C.green : "#475569"}`,
        background: active ? C.green : "transparent",
        transition: "all 0.15s",
      }} />
      {children}
    </button>
  );
}

// ── Field wrapper ─────────────────────────────────────
export function Field({ label, required, optional: isOpt, children, style, span, error }) {
  return (
    <div
      data-invalid={error ? "true" : undefined}
      style={{ display: "flex", flexDirection: "column", gap: 0, ...style, ...(span ? { gridColumn: `span ${span}` } : {}) }}
    >
      {label && (
        <label style={labelStyle}>
          {label}
          {required && <span style={req}>*</span>}
          {isOpt && <span style={opt}>(optional)</span>}
        </label>
      )}
      {children}
      {error && <span style={{ color: C.red, fontSize: 11, marginTop: 4, display: "block", fontWeight: 500 }}>{error}</span>}
    </div>
  );
}

// ── Radio group ───────────────────────────────────────
export function RadioGroup({ field, value, options, onChange, disabled }) {
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
      {options.map(([v, l]) => (
        <Radio key={v} active={value === v} onClick={() => onChange(field, v)} disabled={disabled}>{l}</Radio>
      ))}
    </div>
  );
}

// ── Checkbox group ────────────────────────────────────
export function CheckGroup({ field, value = [], options, onChange, disabled }) {
  function toggle(v) {
    if (disabled) return;
    const next = value.includes(v) ? value.filter(x => x !== v) : [...value, v];
    onChange(field, next);
  }
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
      {options.map(([v, l]) => (
        <Check key={v} active={value.includes(v)} onClick={() => toggle(v)} disabled={disabled}>{l}</Check>
      ))}
    </div>
  );
}

// ── Table header ──────────────────────────────────────
export function TableHead({ cols }) {
  return (
    <div style={{
      display: "grid",
      gridTemplateColumns: cols.map(c => c.w || "1fr").join(" "),
      background: "linear-gradient(90deg, rgba(251,191,36,0.18), rgba(251,191,36,0.08))",
      borderRadius: "8px 8px 0 0",
      padding: "10px 12px",
      gap: 8,
    }}>
      {cols.map(c => (
        <span key={c.label} style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", color: C.accent, textTransform: "uppercase" }}>
          {c.label}
        </span>
      ))}
    </div>
  );
}

export function TableRow({ cols, children, onRemove, style }) {
  return (
    <div style={{
      display: "grid",
      gridTemplateColumns: cols.map(c => c.w || "1fr").join(" "),
      padding: "8px 12px", gap: 8,
      borderBottom: `1px solid rgba(255,255,255,0.04)`,
      alignItems: "center",
      background: "rgba(255,255,255,0.02)",
      ...style,
    }}>
      {children}
      {onRemove && (
        <button onClick={onRemove} style={{
          background: "none", border: "none", color: C.red,
          cursor: "pointer", fontSize: 16, padding: 0, lineHeight: 1,
        }}>✕</button>
      )}
    </div>
  );
}

export function AddRowBtn({ onClick, label = "+ Add member" }) {
  return (
    <button onClick={onClick} style={{
      marginTop: 10,
      padding: "7px 16px", borderRadius: 8,
      border: `1px dashed ${C.accent}`,
      background: "transparent", color: C.accent,
      cursor: "pointer", fontSize: 12, fontWeight: 600,
      fontFamily: "inherit", transition: "background 0.15s",
    }}
    onMouseEnter={e => e.currentTarget.style.background = C.accentDim}
    onMouseLeave={e => e.currentTarget.style.background = "transparent"}
    >{label}</button>
  );
}

// ── Section card shell ────────────────────────────────
export function SectionCard({ icon, title, children }) {
  return (
    <div style={{
      background: C.bgCard,
      border: `1px solid ${C.border}`,
      borderRadius: 14,
      padding: "28px 28px 32px",
      boxShadow: "0 4px 24px rgba(0,0,0,0.3)",
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 28, paddingBottom: 18, borderBottom: `1px solid ${C.border}` }}>
        <span style={{
          width: 34, height: 34, borderRadius: 10,
          background: C.accentDim,
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 17,
        }}>{icon}</span>
        <h2 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: C.accent, letterSpacing: "0.02em" }}>{title}</h2>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>
        {children}
      </div>
    </div>
  );
}

// ── Grid helpers ──────────────────────────────────────
export function Grid({ cols = 2, gap = 20, children, style }) {
  return (
    <div style={{
      display: "grid",
      gridTemplateColumns: `repeat(${cols}, 1fr)`,
      gap,
      ...style,
    }}>{children}</div>
  );
}

export function Divider() {
  return <div style={{ height: 1, background: C.border, margin: "4px 0" }} />;
}

export function SectionLabel({ children }) {
  return (
    <div style={{
      fontSize: 11, fontWeight: 700, letterSpacing: "0.12em",
      color: C.textLabel, textTransform: "uppercase",
      paddingBottom: 8, borderBottom: `1px solid ${C.border}`,
    }}>{children}</div>
  );
}
