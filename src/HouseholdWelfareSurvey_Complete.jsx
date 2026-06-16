import { useState, useEffect } from "react";

// ═══ theme.js ═══
// ═══════════════════════════════════════════════
//  THEME — Warm Amber × Deep Slate
//  Bold, governmental-but-humane aesthetic
// ═══════════════════════════════════════════════

const C = {
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

const inputStyle = {
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

const labelStyle = {
  fontSize: 10,
  fontWeight: 700,
  letterSpacing: "0.1em",
  color: C.textLabel,
  textTransform: "uppercase",
  marginBottom: 6,
  display: "block",
};

const req = { color: C.red, marginLeft: 2 };
const opt = { color: C.textMuted, fontSize: 9, fontWeight: 400, letterSpacing: 0, textTransform: "none", marginLeft: 4 };


// ═══ UI.jsx ═══

// ── Input ────────────────────────────────────────────
function TextInput({ value, onChange, placeholder, type = "text", min, style }) {
  return (
    <input
      type={type} value={value} min={min}
      onChange={e => onChange(e.target.value)}
      placeholder={placeholder || ""}
      style={{ ...inputStyle, ...style }}
      onFocus={e => { e.target.style.borderColor = C.accent; e.target.style.boxShadow = `0 0 0 3px ${C.accentGlow}`; }}
      onBlur={e => { e.target.style.borderColor = `rgba(251,191,36,0.15)`; e.target.style.boxShadow = "none"; }}
    />
  );
}

function SelectInput({ value, onChange, options, style }) {
  return (
    <select
      value={value} onChange={e => onChange(e.target.value)}
      style={{ ...inputStyle, appearance: "none", backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='6'%3E%3Cpath d='M0 0l5 6 5-6z' fill='%2364748b'/%3E%3C/svg%3E")`, backgroundRepeat: "no-repeat", backgroundPosition: "right 12px center", paddingRight: 32, cursor: "pointer", ...style }}
    >
      {options.map(([v, l]) => <option key={v} value={v} style={{ background: C.bgCard }}>{l}</option>)}
    </select>
  );
}

// ── Radio pill ────────────────────────────────────────
function Radio({ active, onClick, children }) {
  return (
    <button onClick={onClick} style={{
      display: "flex", alignItems: "center", gap: 7,
      padding: "7px 15px", borderRadius: 24,
      border: `1px solid ${active ? C.accent : "rgba(255,255,255,0.1)"}`,
      background: active ? C.accentDim : "transparent",
      color: active ? C.accent : C.textMuted,
      cursor: "pointer", fontSize: 12, fontWeight: active ? 700 : 400,
      transition: "all 0.15s", userSelect: "none", fontFamily: "inherit",
    }}>
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
function Check({ active, onClick, children }) {
  return (
    <button onClick={onClick} style={{
      display: "flex", alignItems: "center", gap: 7,
      padding: "7px 15px", borderRadius: 8,
      border: `1px solid ${active ? C.green : "rgba(255,255,255,0.1)"}`,
      background: active ? C.greenDim : "transparent",
      color: active ? C.green : C.textMuted,
      cursor: "pointer", fontSize: 12, fontWeight: active ? 700 : 400,
      transition: "all 0.15s", userSelect: "none", fontFamily: "inherit",
    }}>
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
function Field({ label, required, optional: isOpt, children, style, span }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 0, ...style, ...(span ? { gridColumn: `span ${span}` } : {}) }}>
      {label && (
        <label style={labelStyle}>
          {label}
          {required && <span style={req}>*</span>}
          {isOpt && <span style={opt}>(optional)</span>}
        </label>
      )}
      {children}
    </div>
  );
}

// ── Radio group ───────────────────────────────────────
function RadioGroup({ field, value, options, onChange }) {
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
      {options.map(([v, l]) => (
        <Radio key={v} active={value === v} onClick={() => onChange(field, v)}>{l}</Radio>
      ))}
    </div>
  );
}

// ── Checkbox group ────────────────────────────────────
function CheckGroup({ field, value = [], options, onChange }) {
  function toggle(v) {
    const next = value.includes(v) ? value.filter(x => x !== v) : [...value, v];
    onChange(field, next);
  }
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
      {options.map(([v, l]) => (
        <Check key={v} active={value.includes(v)} onClick={() => toggle(v)}>{l}</Check>
      ))}
    </div>
  );
}

// ── Table header ──────────────────────────────────────
function TableHead({ cols }) {
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

function TableRow({ cols, children, onRemove, style }) {
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

function AddRowBtn({ onClick, label = "+ Add member" }) {
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
function SectionCard({ icon, title, children }) {
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
function Grid({ cols = 2, gap = 20, children, style }) {
  return (
    <div style={{
      display: "grid",
      gridTemplateColumns: `repeat(${cols}, 1fr)`,
      gap,
      ...style,
    }}>{children}</div>
  );
}

function Divider() {
  return <div style={{ height: 1, background: C.border, margin: "4px 0" }} />;
}

function SectionLabel({ children }) {
  return (
    <div style={{
      fontSize: 11, fontWeight: 700, letterSpacing: "0.12em",
      color: C.textLabel, textTransform: "uppercase",
      paddingBottom: 8, borderBottom: `1px solid ${C.border}`,
    }}>{children}</div>
  );
}


// ═══ SectionA.jsx ═══
  SectionCard, Field, Grid, TextInput, RadioGroup,
  SectionLabel, Radio,
} from "../components/UI";

// ── Translations ────────────────────────────────────────
const TX = {
  en: {
    respTitle: "Respondent Identification",
    addrTitle: "Address & Residency",
    firstName: "First Name", middleName: "Middle Name", lastName: "Last Name",
    mobile: "Primary Mobile", altMobile: "Alternate Mobile", dob: "Date of Birth",
    age: "Age (Years)", consent: "Aadhaar Consent", provided: "Provided",
    notProvided: "Not Provided", aadhaar: "Aadhaar Number",
    gender: "Gender", male: "Male", female: "Female", trans: "Transgender", other: "Other",
    marital: "Marital Status", single: "Single", married: "Married", widowed: "Widowed",
    divorced: "Divorced", separated: "Separated",
    religion: "Religion", hindu: "Hindu", muslim: "Muslim", christian: "Christian",
    sikh: "Sikh", buddhist: "Buddhist", jain: "Jain",
    category: "Social Category / Caste", subCaste: "Sub-Caste / Community",
    // Address
    residentialStatus: "Residential Status",
    ownHouse: "Own House", rented: "Rented", govtHousing: "Government Housing",
    tempShelter: "Temporary Shelter", homeless: "Homeless",
    houseNo: "House No.", street: "Street", village: "Village / Town",
    mandal: "Mandal", district: "District", state: "State", pincode: "Pin Code",
    duration: "Duration at Address", less1: "Less than 1 Year",
    one5: "1–5 Years", more5: "More than 5 Years",
  },
  te: {
    respTitle: "అభ్యర్థి గుర్తింపు",
    addrTitle: "చిరునామా & నివాసం",
    firstName: "మొదటి పేరు", middleName: "మధ్య పేరు", lastName: "చివరి పేరు",
    mobile: "ప్రాథమిక మొబైల్", altMobile: "ప్రత్యామ్నాయ మొబైల్", dob: "పుట్టిన తేదీ",
    age: "వయస్సు (సం.)", consent: "ఆధార్ సమ్మతి", provided: "అందించారు",
    notProvided: "అందించలేదు", aadhaar: "ఆధార్ నంబర్",
    gender: "లింగం", male: "పురుషుడు", female: "స్త్రీ", trans: "తృతీయ లింగం", other: "ఇతర",
    marital: "వైవాహిక స్థితి", single: "ఒంటరి", married: "వివాహితుడు", widowed: "విధవ",
    divorced: "విడాకులు", separated: "వేరుగా",
    religion: "మతం", hindu: "హిందూ", muslim: "ముస్లిం", christian: "క్రైస్తవ",
    sikh: "సిక్కు", buddhist: "బౌద్ధ", jain: "జైన",
    category: "సామాజిక వర్గం / కులం", subCaste: "ఉప-కులం / సమాజం",
    residentialStatus: "నివాస స్థితి",
    ownHouse: "స్వంత ఇల్లు", rented: "అద్దె", govtHousing: "ప్రభుత్వ గృహం",
    tempShelter: "తాత్కాలిక ఆశ్రయం", homeless: "నివాసం లేదు",
    houseNo: "ఇంటి నం.", street: "వీధి", village: "గ్రామం / పట్టణం",
    mandal: "మండలం", district: "జిల్లా", state: "రాష్ట్రం", pincode: "పిన్‌కోడ్",
    duration: "చిరునామాలో నివాసం", less1: "1 సంవత్సరం కంటే తక్కువ",
    one5: "1–5 సంవత్సరాలు", more5: "5 సంవత్సరాల కంటే ఎక్కువ",
  },
};

function SectionA({ data, onChange, lang }) {
  const t = TX[lang];
  const up = (f, v) => onChange(f, v);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      {/* ── Respondent Identification ────────────────── */}
      <SectionCard icon="👤" title={t.respTitle}>
        <Grid cols={3}>
          <Field label={t.firstName} required>
            <TextInput value={data.firstName} onChange={v => up("firstName", v)} placeholder="First name" />
          </Field>
          <Field label={t.middleName} optional>
            <TextInput value={data.middleName} onChange={v => up("middleName", v)} />
          </Field>
          <Field label={t.lastName} required>
            <TextInput value={data.lastName} onChange={v => up("lastName", v)} />
          </Field>
        </Grid>

        <Grid cols={3}>
          <Field label={t.mobile} required>
            <TextInput value={data.primaryMobile} onChange={v => up("primaryMobile", v)} placeholder="10-digit number" />
          </Field>
          <Field label={t.altMobile} optional>
            <TextInput value={data.alternateMobile} onChange={v => up("alternateMobile", v)} />
          </Field>
          <Field label={t.dob} required>
            <TextInput value={data.dob} onChange={v => up("dob", v)} type="date" />
          </Field>
        </Grid>

        <Grid cols={3}>
          <Field label={t.age}>
            <TextInput value={data.age} onChange={v => up("age", v)} type="number" min="0" />
          </Field>
          <Field label={t.consent}>
            <RadioGroup field="aadhaarConsent" value={data.aadhaarConsent}
              options={[["PROVIDED", t.provided], ["NOT_PROVIDED", t.notProvided]]}
              onChange={up} />
          </Field>
          <Field label={t.aadhaar} optional>
            <TextInput value={data.aadhaarNumber} onChange={v => up("aadhaarNumber", v)} />
          </Field>
        </Grid>

        <Field label={t.gender} required>
          <RadioGroup field="gender" value={data.gender}
            options={[["MALE", t.male], ["FEMALE", t.female], ["TRANSGENDER", t.trans], ["OTHER", t.other]]}
            onChange={up} />
        </Field>

        <Grid cols={2} gap={24}>
          <Field label={t.marital}>
            <RadioGroup field="maritalStatus" value={data.maritalStatus}
              options={[["SINGLE", t.single], ["MARRIED", t.married], ["WIDOWED", t.widowed], ["DIVORCED", t.divorced], ["SEPARATED", t.separated]]}
              onChange={up} />
          </Field>
          <Field label={t.religion}>
            <RadioGroup field="religion" value={data.religion}
              options={[["HINDU", t.hindu], ["MUSLIM", t.muslim], ["CHRISTIAN", t.christian], ["SIKH", t.sikh], ["BUDDHIST", t.buddhist], ["JAIN", t.jain], ["OTHER", t.other]]}
              onChange={up} />
          </Field>
        </Grid>

        <Field label={t.category} required>
          <RadioGroup field="socialCategory" value={data.socialCategory}
            options={[["SC","SC"],["ST","ST"],["BC","BC"],["EWS","EWS"],["OC_GENERAL","OC / General"],["MINORITY","Minority"],["OTHER",t.other]]}
            onChange={up} />
        </Field>

        <Field label={t.subCaste} optional>
          <TextInput value={data.subCaste} onChange={v => up("subCaste", v)} style={{ maxWidth: 360 }} />
        </Field>
      </SectionCard>

      {/* ── Address & Residency ─────────────────────── */}
      <SectionCard icon="📍" title={t.addrTitle}>
        <Field label={t.residentialStatus} required>
          <RadioGroup field="residentialStatus" value={data.residentialStatus}
            options={[
              ["OWN_HOUSE", t.ownHouse], ["RENTED", t.rented],
              ["GOVT_HOUSING", t.govtHousing], ["TEMP_SHELTER", t.tempShelter],
              ["HOMELESS", t.homeless], ["OTHER", t.other],
            ]}
            onChange={up} />
        </Field>

        <Grid cols={3}>
          <Field label={t.houseNo}>
            <TextInput value={data.houseNo} onChange={v => up("houseNo", v)} />
          </Field>
          <Field label={t.street} style={{ gridColumn: "span 2" }}>
            <TextInput value={data.street} onChange={v => up("street", v)} />
          </Field>
        </Grid>

        <Grid cols={3}>
          <Field label={t.village} required>
            <TextInput value={data.village} onChange={v => up("village", v)} />
          </Field>
          <Field label={t.mandal}>
            <TextInput value={data.mandal} onChange={v => up("mandal", v)} />
          </Field>
          <Field label={t.district} required>
            <TextInput value={data.district} onChange={v => up("district", v)} />
          </Field>
        </Grid>

        <Grid cols={3}>
          <Field label={t.state} required>
            <TextInput value={data.state} onChange={v => up("state", v)} />
          </Field>
          <Field label={t.pincode}>
            <TextInput value={data.pincode} onChange={v => up("pincode", v)} />
          </Field>
        </Grid>

        <Field label={t.duration}>
          <RadioGroup field="durationAtAddress" value={data.durationAtAddress}
            options={[["LESS_1", t.less1], ["ONE_5", t.one5], ["MORE_5", t.more5]]}
            onChange={up} />
        </Field>
      </SectionCard>
    </div>
  );
}


// ═══ SectionB.jsx ═══
  SectionCard, Field, Grid, TextInput, RadioGroup,
  CheckGroup, Check, TableHead, AddRowBtn, SectionLabel,
} from "../components/UI";

const TX = {
  en: {
    title: "Household Information",
    adults: "Adults", children: "Children (Under 18)", seniors: "Senior Citizens (60+)",
    familyStructure: "Family Structure",
    nuclear: "Nuclear", joint: "Joint", singleParent: "Single Parent",
    elderlyOnly: "Elderly Only", other: "Other",
    memberDetails: "Family Member Details",
    name: "Name", relation: "Relation", age: "Age", gender: "Gender",
    education: "Education", employment: "Employment", income: "Income ₹",
    disability: "Disability", illness: "Illness",
    addMember: "+ Add member",
    genderOpts: [["M","M"],["F","F"],["O","O"]],
    disabilityOpts: [["No","No"],["Yes","Yes"]],
  },
  te: {
    title: "గృహ సమాచారం",
    adults: "పెద్దలు", children: "పిల్లలు (18 కంటే తక్కువ)", seniors: "వృద్ధులు (60+)",
    familyStructure: "కుటుంబ నిర్మాణం",
    nuclear: "అణు కుటుంబం", joint: "సంయుక్త", singleParent: "ఒంటరి తల్లి/తండ్రి",
    elderlyOnly: "వృద్ధులు మాత్రమే", other: "ఇతర",
    memberDetails: "కుటుంబ సభ్యుల వివరాలు",
    name: "పేరు", relation: "సంబంధం", age: "వయస్సు", gender: "లింగం",
    education: "విద్య", employment: "ఉపాధి", income: "ఆదాయం ₹",
    disability: "వికలాంగత", illness: "అనారోగ్యం",
    addMember: "+ సభ్యుని జోడించు",
    genderOpts: [["M","M"],["F","F"],["O","O"]],
    disabilityOpts: [["No","లేదు"],["Yes","అవును"]],
  },
};

const emptyMember = () => ({ name:"", relation:"", age:"0", gender:"--", education:"", employment:"", income:"0", disability:"No", illness:"" });

const COLS = [
  { label: "Name", w: "1.4fr" },
  { label: "Relation", w: "1fr" },
  { label: "Age", w: "0.55fr" },
  { label: "Gender", w: "0.7fr" },
  { label: "Education", w: "1.1fr" },
  { label: "Employment", w: "1.1fr" },
  { label: "Income ₹", w: "0.8fr" },
  { label: "Disability", w: "0.85fr" },
  { label: "Illness", w: "1fr" },
  { label: "", w: "32px" },
];

const colTemplate = COLS.map(c => c.w).join(" ");

function SectionB({ data, onChange, lang }) {
  const t = TX[lang];
  const up = (f, v) => onChange(f, v);

  const members = data.familyMembers || [emptyMember()];

  function updateMember(idx, field, val) {
    const next = members.map((m, i) => i === idx ? { ...m, [field]: val } : m);
    up("familyMembers", next);
  }

  function addMember() { up("familyMembers", [...members, emptyMember()]); }
  function removeMember(idx) { up("familyMembers", members.filter((_, i) => i !== idx)); }

  return (
    <SectionCard icon="🏡" title={t.title}>
      {/* Counts */}
      <Grid cols={3}>
        <Field label={t.adults}>
          <TextInput value={data.adults || "0"} onChange={v => up("adults", v)} type="number" min="0" placeholder="0" />
        </Field>
        <Field label={t.children}>
          <TextInput value={data.childrenCount || "0"} onChange={v => up("childrenCount", v)} type="number" min="0" placeholder="0" />
        </Field>
        <Field label={t.seniors}>
          <TextInput value={data.seniors || "0"} onChange={v => up("seniors", v)} type="number" min="0" placeholder="0" />
        </Field>
      </Grid>

      {/* Family Structure */}
      <Field label={t.familyStructure}>
        <RadioGroup field="familyStructure" value={data.familyStructure}
          options={[
            ["NUCLEAR", t.nuclear], ["JOINT", t.joint],
            ["SINGLE_PARENT", t.singleParent], ["ELDERLY_ONLY", t.elderlyOnly], ["OTHER", t.other],
          ]}
          onChange={up} />
      </Field>

      {/* Family Member Table */}
      <div>
        <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", color: C.textLabel, textTransform: "uppercase", marginBottom: 10 }}>
          {t.memberDetails}
        </div>
        <div style={{ border: `1px solid ${C.border}`, borderRadius: 10, overflow: "hidden" }}>
          {/* Header */}
          <div style={{
            display: "grid", gridTemplateColumns: colTemplate,
            background: "linear-gradient(90deg, rgba(251,191,36,0.18), rgba(251,191,36,0.06))",
            padding: "10px 12px", gap: 6,
          }}>
            {COLS.map(c => (
              <span key={c.label} style={{ fontSize: 9, fontWeight: 800, letterSpacing: "0.1em", color: C.accent, textTransform: "uppercase" }}>{c.label}</span>
            ))}
          </div>

          {/* Rows */}
          {members.map((m, idx) => (
            <div key={idx} style={{
              display: "grid", gridTemplateColumns: colTemplate,
              padding: "8px 12px", gap: 6, alignItems: "center",
              borderTop: `1px solid rgba(255,255,255,0.04)`,
              background: idx % 2 === 0 ? "rgba(255,255,255,0.01)" : "transparent",
            }}>
              <input value={m.name} onChange={e => updateMember(idx, "name", e.target.value)} placeholder="Name"
                style={{ background:"rgba(255,255,255,0.05)", border:"1px solid rgba(255,255,255,0.08)", borderRadius:6, padding:"5px 8px", color:C.text, fontSize:12, outline:"none", width:"100%", boxSizing:"border-box", fontFamily:"inherit" }} />
              <input value={m.relation} onChange={e => updateMember(idx, "relation", e.target.value)} placeholder="Relation"
                style={{ background:"rgba(255,255,255,0.05)", border:"1px solid rgba(255,255,255,0.08)", borderRadius:6, padding:"5px 8px", color:C.text, fontSize:12, outline:"none", width:"100%", boxSizing:"border-box", fontFamily:"inherit" }} />
              <input value={m.age} onChange={e => updateMember(idx, "age", e.target.value)} type="number" min="0"
                style={{ background:"rgba(255,255,255,0.05)", border:"1px solid rgba(255,255,255,0.08)", borderRadius:6, padding:"5px 8px", color:C.text, fontSize:12, outline:"none", width:"100%", boxSizing:"border-box", fontFamily:"inherit" }} />
              <select value={m.gender} onChange={e => updateMember(idx, "gender", e.target.value)}
                style={{ background:C.bgInput, border:"1px solid rgba(255,255,255,0.08)", borderRadius:6, padding:"5px 6px", color:C.text, fontSize:12, outline:"none", width:"100%", fontFamily:"inherit" }}>
                {[["--","--"],["M","M"],["F","F"],["O","O"]].map(([v,l]) => <option key={v} value={v} style={{background:C.bgCard}}>{l}</option>)}
              </select>
              <input value={m.education} onChange={e => updateMember(idx, "education", e.target.value)} placeholder="Qualification"
                style={{ background:"rgba(255,255,255,0.05)", border:"1px solid rgba(255,255,255,0.08)", borderRadius:6, padding:"5px 8px", color:C.text, fontSize:12, outline:"none", width:"100%", boxSizing:"border-box", fontFamily:"inherit" }} />
              <input value={m.employment} onChange={e => updateMember(idx, "employment", e.target.value)} placeholder="Occupation"
                style={{ background:"rgba(255,255,255,0.05)", border:"1px solid rgba(255,255,255,0.08)", borderRadius:6, padding:"5px 8px", color:C.text, fontSize:12, outline:"none", width:"100%", boxSizing:"border-box", fontFamily:"inherit" }} />
              <input value={m.income} onChange={e => updateMember(idx, "income", e.target.value)} type="number" min="0"
                style={{ background:"rgba(255,255,255,0.05)", border:"1px solid rgba(255,255,255,0.08)", borderRadius:6, padding:"5px 8px", color:C.text, fontSize:12, outline:"none", width:"100%", boxSizing:"border-box", fontFamily:"inherit" }} />
              <select value={m.disability} onChange={e => updateMember(idx, "disability", e.target.value)}
                style={{ background:C.bgInput, border:"1px solid rgba(255,255,255,0.08)", borderRadius:6, padding:"5px 6px", color:C.text, fontSize:12, outline:"none", width:"100%", fontFamily:"inherit" }}>
                {[["No","No"],["Yes","Yes"]].map(([v,l]) => <option key={v} value={v} style={{background:C.bgCard}}>{l}</option>)}
              </select>
              <input value={m.illness} onChange={e => updateMember(idx, "illness", e.target.value)} placeholder="Condition"
                style={{ background:"rgba(255,255,255,0.05)", border:"1px solid rgba(255,255,255,0.08)", borderRadius:6, padding:"5px 8px", color:C.text, fontSize:12, outline:"none", width:"100%", boxSizing:"border-box", fontFamily:"inherit" }} />
              <button onClick={() => removeMember(idx)} style={{ background:"none", border:"none", color: C.red, cursor:"pointer", fontSize:15, padding:0, lineHeight:1 }}>✕</button>
            </div>
          ))}
        </div>
        <AddRowBtn onClick={addMember} label={t.addMember} />
      </div>
    </SectionCard>
  );
}


// ═══ SectionC.jsx ═══

const TX = {
  en: {
    title: "Employment & Livelihood",
    mainOcc: "Main Occupation",
    occOpts: [
      ["AGRICULTURE","Agriculture"],["AGRI_LABOR","Agri Labor"],["DAILY_WAGE","Daily Wage"],
      ["GOVT_EMP","Govt Employee"],["PRIVATE_EMP","Private Employee"],["SELF_EMP","Self-Employed"],
      ["SMALL_BIZ","Small Business"],["DOMESTIC","Domestic Worker"],["DRIVER","Driver"],
      ["CONSTRUCTION","Construction"],["STREET_VENDOR","Street Vendor"],["UNEMPLOYED","Unemployed"],
      ["HOMEMAKER","Homemaker"],["RETIRED","Retired"],["OTHER","Other"],
    ],
    empNature: "Employment Nature",
    natureOpts: [["PERMANENT","Permanent"],["TEMPORARY","Temporary"],["SEASONAL","Seasonal"],["CONTRACT","Contract"],["INFORMAL","Informal"]],
    secondary: "Secondary Income Sources",
    secOpts: [
      ["FARMING","Farming"],["LIVESTOCK","Livestock"],["TAILORING","Tailoring"],["SHOP","Shop"],
      ["AUTO_TAXI","Auto/Taxi"],["GIG","Gig Work"],["MGNREGA","MGNREGA"],
      ["PENSION","Pension"],["RENTAL","Rental"],["OTHER","Other"],
    ],
    challenges: "Employment Challenges",
    chalOpts: [
      ["NO_JOBS","No Jobs"],["LOW_WAGES","Low Wages"],["HEALTH","Health Issues"],
      ["SKILLS","Lack of Skills"],["MIGRATION","Migration"],["DEBT","Debt Burden"],
      ["DISABILITY","Disability"],["OTHER","Other"],
    ],
  },
  te: {
    title: "ఉపాధి & జీవనోపాధి",
    mainOcc: "ప్రధాన వృత్తి",
    occOpts: [
      ["AGRICULTURE","వ్యవసాయం"],["AGRI_LABOR","వ్యవసాయ కూలీ"],["DAILY_WAGE","రోజువారీ కూలీ"],
      ["GOVT_EMP","ప్రభుత్వ ఉద్యోగి"],["PRIVATE_EMP","ప్రైవేట్ ఉద్యోగి"],["SELF_EMP","స్వయం ఉపాధి"],
      ["SMALL_BIZ","చిన్న వ్యాపారం"],["DOMESTIC","గృహ కార్మికుడు"],["DRIVER","డ్రైవర్"],
      ["CONSTRUCTION","నిర్మాణం"],["STREET_VENDOR","వీధి వ్యాపారి"],["UNEMPLOYED","నిరుద్యోగి"],
      ["HOMEMAKER","గృహిణి"],["RETIRED","పదవీ విరమణ"],["OTHER","ఇతర"],
    ],
    empNature: "ఉపాధి స్వభావం",
    natureOpts: [["PERMANENT","శాశ్వత"],["TEMPORARY","తాత్కాలిక"],["SEASONAL","సీజనల్"],["CONTRACT","కాంట్రాక్ట్"],["INFORMAL","అనధికారిక"]],
    secondary: "ద్వితీయ ఆదాయ వనరులు",
    secOpts: [
      ["FARMING","వ్యవసాయం"],["LIVESTOCK","పశువులు"],["TAILORING","కుట్టు పని"],["SHOP","దుకాణం"],
      ["AUTO_TAXI","ఆటో/టాక్సీ"],["GIG","గిగ్ వర్క్"],["MGNREGA","MGNREGA"],
      ["PENSION","పెన్షన్"],["RENTAL","అద్దె"],["OTHER","ఇతర"],
    ],
    challenges: "ఉపాధి సవాళ్ళు",
    chalOpts: [
      ["NO_JOBS","ఉద్యోగాలు లేవు"],["LOW_WAGES","తక్కువ వేతనాలు"],["HEALTH","ఆరోగ్య సమస్యలు"],
      ["SKILLS","నైపుణ్యాల లేమి"],["MIGRATION","వలస"],["DEBT","అప్పు భారం"],
      ["DISABILITY","వికలాంగత"],["OTHER","ఇతర"],
    ],
  },
};

function SectionC({ data, onChange, lang }) {
  const t = TX[lang];
  const up = (f, v) => onChange(f, v);
  return (
    <SectionCard icon="💼" title={t.title}>
      <Field label={t.mainOcc} required>
        <RadioGroup field="mainOccupation" value={data.mainOccupation} options={t.occOpts} onChange={up} />
      </Field>
      <Field label={t.empNature}>
        <RadioGroup field="employmentNature" value={data.employmentNature} options={t.natureOpts} onChange={up} />
      </Field>
      <Field label={t.secondary}>
        <CheckGroup field="secondaryIncome" value={data.secondaryIncome} options={t.secOpts} onChange={up} />
      </Field>
      <Field label={t.challenges}>
        <CheckGroup field="empChallenges" value={data.empChallenges} options={t.chalOpts} onChange={up} />
      </Field>
    </SectionCard>
  );
}


// ═══ SectionD.jsx ═══

const TX = {
  en: {
    title: "Income & Financial Status",
    monthlyIncome: "Total Monthly Household Income",
    incOpts: [
      ["BELOW_5K","Below ₹5,000"],["5K_10K","₹5,000–₹10,000"],
      ["10K_20K","₹10,001–₹20,000"],["20K_50K","₹20,001–₹50,000"],["ABOVE_50K","Above ₹50,000"],
    ],
    annualIncome: "Annual Income (₹)", bankAccount: "Bank Account",
    yes: "YES", no: "NO",
    liquidSavings: "Liquid Savings",
    savingsOpts: [
      ["NO_SAVINGS","No Savings"],["BELOW_5K","Below ₹5,000"],
      ["5K_25K","₹5,000–₹25,000"],["25K_1L","₹25,000–₹1 Lakh"],["ABOVE_1L","Above ₹1 Lakh"],
    ],
    insurance: "Insurance Coverage",
    insOpts: [["HEALTH","Health"],["LIFE","Life"],["CROP","Crop"],["ACCIDENT","Accident"],["NONE","No insurance"]],
    debt: "Household Debt",
    lender: "LENDER", amount: "AMOUNT ₹", interest: "INTEREST %", purpose: "PURPOSE", emi: "EMI ₹",
    lenders: ["Bank","Microfinance","Money Lender","Friends/Relatives"],
    debtReason: "Main Reason for Debt",
    debtOpts: [
      ["MEDICAL","Medical"],["AGRICULTURE","Agriculture"],["EDUCATION","Education"],
      ["MARRIAGE","Marriage"],["DAILY_EXP","Daily Expenses"],["HOUSE","House Construction"],
      ["BUSINESS","Business"],["OTHER","Other"],
    ],
  },
  te: {
    title: "ఆదాయం & ఆర్థిక స్థితి",
    monthlyIncome: "మొత్తం నెలవారీ గృహ ఆదాయం",
    incOpts: [
      ["BELOW_5K","₹5,000 కంటే తక్కువ"],["5K_10K","₹5,000–₹10,000"],
      ["10K_20K","₹10,001–₹20,000"],["20K_50K","₹20,001–₹50,000"],["ABOVE_50K","₹50,000 పైన"],
    ],
    annualIncome: "వార్షిక ఆదాయం (₹)", bankAccount: "బ్యాంకు ఖాతా",
    yes: "అవును", no: "కాదు",
    liquidSavings: "నగదు పొదుపు",
    savingsOpts: [
      ["NO_SAVINGS","పొదుపు లేదు"],["BELOW_5K","₹5,000 కంటే తక్కువ"],
      ["5K_25K","₹5,000–₹25,000"],["25K_1L","₹25,000–₹1 లక్ష"],["ABOVE_1L","₹1 లక్ష పైన"],
    ],
    insurance: "బీమా కవరేజ్",
    insOpts: [["HEALTH","ఆరోగ్యం"],["LIFE","జీవితం"],["CROP","పంట"],["ACCIDENT","ప్రమాదం"],["NONE","బీమా లేదు"]],
    debt: "గృహ అప్పులు",
    lender: "రుణదాత", amount: "మొత్తం ₹", interest: "వడ్డీ %", purpose: "ప్రయోజనం", emi: "EMI ₹",
    lenders: ["బ్యాంకు","మైక్రోఫైనాన్స్","వడ్డీ వ్యాపారి","స్నేహితులు/బంధువులు"],
    debtReason: "అప్పు ప్రధాన కారణం",
    debtOpts: [
      ["MEDICAL","వైద్యం"],["AGRICULTURE","వ్యవసాయం"],["EDUCATION","విద్య"],
      ["MARRIAGE","వివాహం"],["DAILY_EXP","రోజువారీ ఖర్చులు"],["HOUSE","ఇల్లు నిర్మాణం"],
      ["BUSINESS","వ్యాపారం"],["OTHER","ఇతర"],
    ],
  },
};

const debtKeys = ["bank","microfinance","moneyLender","friendsRelatives"];

const colW = "140px 120px 110px 1fr 110px";

function SectionD({ data, onChange, lang }) {
  const t = TX[lang];
  const up = (f, v) => onChange(f, v);

  const debt = data.householdDebt || { bank:{amount:"0",interest:"",purpose:"",emi:"0"}, microfinance:{amount:"0",interest:"",purpose:"",emi:"0"}, moneyLender:{amount:"0",interest:"",purpose:"",emi:"0"}, friendsRelatives:{amount:"0",interest:"",purpose:"",emi:"0"} };

  function updateDebt(lender, field, val) {
    up("householdDebt", { ...debt, [lender]: { ...debt[lender], [field]: val } });
  }

  const cellStyle = {
    background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)",
    borderRadius: 6, padding: "6px 10px", color: C.text, fontSize: 12,
    outline: "none", width: "100%", boxSizing: "border-box", fontFamily: "inherit",
  };

  return (
    <SectionCard icon="₹" title={t.title}>
      {/* Monthly income range */}
      <Field label={t.monthlyIncome} required>
        <RadioGroup field="monthlyIncomeRange" value={data.monthlyIncomeRange} options={t.incOpts} onChange={up} />
      </Field>

      {/* Annual income + bank + savings */}
      <Grid cols={3} gap={24} style={{ alignItems: "start" }}>
        <Field label={t.annualIncome}>
          <TextInput value={data.annualIncome || "0"} onChange={v => up("annualIncome", v)} type="number" min="0" placeholder="0" />
        </Field>
        <Field label={t.bankAccount}>
          <RadioGroup field="bankAccount" value={data.bankAccount}
            options={[["YES", t.yes], ["NO", t.no]]} onChange={up} />
        </Field>
        <Field label={t.liquidSavings}>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {t.savingsOpts.map(([v, l]) => {
              const active = data.liquidSavings === v;
              return (
                <button key={v} onClick={() => up("liquidSavings", v)} style={{
                  display: "flex", alignItems: "center", gap: 8,
                  padding: "8px 14px", borderRadius: 8,
                  border: `1px solid ${active ? C.accent : "rgba(255,255,255,0.08)"}`,
                  background: active ? C.accentDim : "rgba(255,255,255,0.02)",
                  color: active ? C.accent : C.textMuted,
                  cursor: "pointer", fontSize: 12, fontWeight: active ? 700 : 400,
                  textAlign: "left", fontFamily: "inherit",
                }}>
                  <span style={{ width: 9, height: 9, borderRadius: "50%", border: `2px solid ${active ? C.accent : "#475569"}`, background: active ? C.accent : "transparent", flexShrink: 0 }} />
                  {l}
                </button>
              );
            })}
          </div>
        </Field>
      </Grid>

      {/* Insurance */}
      <Field label={t.insurance}>
        <CheckGroup field="insuranceCoverage" value={data.insuranceCoverage} options={t.insOpts} onChange={up} />
      </Field>

      {/* Debt table */}
      <div>
        <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", color: C.textLabel, textTransform: "uppercase", marginBottom: 10 }}>{t.debt}</div>
        <div style={{ border: `1px solid ${C.border}`, borderRadius: 10, overflow: "hidden" }}>
          {/* header */}
          <div style={{ display: "grid", gridTemplateColumns: colW, gap: 8, padding: "10px 12px", background: "linear-gradient(90deg,rgba(251,191,36,0.18),rgba(251,191,36,0.05))" }}>
            {[t.lender, t.amount, t.interest, t.purpose, t.emi].map(h => (
              <span key={h} style={{ fontSize: 9, fontWeight: 800, letterSpacing: "0.1em", color: C.accent, textTransform: "uppercase" }}>{h}</span>
            ))}
          </div>
          {debtKeys.map((key, idx) => (
            <div key={key} style={{ display: "grid", gridTemplateColumns: colW, gap: 8, padding: "8px 12px", borderTop: "1px solid rgba(255,255,255,0.04)", background: idx % 2 ? "transparent" : "rgba(255,255,255,0.01)", alignItems: "center" }}>
              <span style={{ fontSize: 12, color: C.textLabel, fontWeight: 500 }}>{t.lenders[idx]}</span>
              <input value={debt[key]?.amount || "0"} onChange={e => updateDebt(key, "amount", e.target.value)} type="number" min="0" style={cellStyle} />
              <input value={debt[key]?.interest || ""} onChange={e => updateDebt(key, "interest", e.target.value)} placeholder="%" style={cellStyle} />
              <input value={debt[key]?.purpose || ""} onChange={e => updateDebt(key, "purpose", e.target.value)} style={cellStyle} />
              <input value={debt[key]?.emi || "0"} onChange={e => updateDebt(key, "emi", e.target.value)} type="number" min="0" style={cellStyle} />
            </div>
          ))}
        </div>
      </div>

      {/* Debt reason */}
      <Field label={t.debtReason}>
        <CheckGroup field="debtReasons" value={data.debtReasons} options={t.debtOpts} onChange={up} />
      </Field>
    </SectionCard>
  );
}


// ═══ SectionE.jsx ═══

const TX = {
  en: {
    title: "Assets & Living Conditions",
    housingType: "Housing Type", ownership: "Ownership",
    kutcha: "Kutcha", semiPucca: "Semi-Pucca", pucca: "Pucca",
    own: "Own", rented: "Rented", encroached: "Encroached", govtAllotted: "Govt Allotted",
    amenities: "Basic Amenities",
    electricity: "Electricity", water: "Drinking Water", toilet: "Toilet",
    lpg: "LPG Gas", internet: "Internet",
    yes: "Yes", no: "No",
    assets: "Household Assets",
    agriLand: "Agri Land (Acres)", livestock: "Livestock",
    twoWheelers: "Two-Wheelers", fourWheelers: "Four-Wheelers", smartphones: "Smartphones",
  },
  te: {
    title: "ఆస్తులు & జీవన పరిస్థితులు",
    housingType: "గృహ రకం", ownership: "యాజమాన్యం",
    kutcha: "కచ్చా", semiPucca: "సెమీ-పక్కా", pucca: "పక్కా",
    own: "స్వంతం", rented: "అద్దె", encroached: "ఆక్రమణ", govtAllotted: "ప్రభుత్వ కేటాయింపు",
    amenities: "ప్రాథమిక సౌకర్యాలు",
    electricity: "విద్యుత్", water: "తాగునీరు", toilet: "మరుగుదొడ్డి",
    lpg: "LPG గ్యాస్", internet: "ఇంటర్నెట్",
    yes: "అవును", no: "కాదు",
    assets: "గృహ ఆస్తులు",
    agriLand: "వ్యవసాయ భూమి (ఎకరాలు)", livestock: "పశువులు",
    twoWheelers: "రెండు చక్రాల వాహనాలు", fourWheelers: "నాలుగు చక్రాల వాహనాలు", smartphones: "స్మార్ట్‌ఫోన్‌లు",
  },
};

const AMENITY_KEYS = ["electricity","drinkingWater","toilet","lpgGas","internet"];

function AmenityBox({ label, fieldKey, value, onChange, yes, no }) {
  return (
    <div style={{
      border: `1px solid ${C.border}`,
      borderRadius: 10,
      padding: "14px 16px",
      background: "rgba(255,255,255,0.02)",
      display: "flex", flexDirection: "column", gap: 10,
    }}>
      <span style={{ fontSize: 12, fontWeight: 700, color: C.textLabel }}>{label}</span>
      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        {[["YES", yes], ["NO", no]].map(([v, l]) => {
          const active = value === v;
          return (
            <button key={v} onClick={() => onChange(fieldKey, v)} style={{
              display: "flex", alignItems: "center", gap: 7,
              padding: "5px 10px", borderRadius: 20,
              border: `1px solid ${active ? C.accent : "rgba(255,255,255,0.1)"}`,
              background: active ? C.accentDim : "transparent",
              color: active ? C.accent : C.textMuted,
              cursor: "pointer", fontSize: 12, fontWeight: active ? 700 : 400,
              fontFamily: "inherit",
            }}>
              <span style={{ width: 8, height: 8, borderRadius: "50%", border: `2px solid ${active ? C.accent : "#475569"}`, background: active ? C.accent : "transparent", flexShrink: 0 }} />
              {l}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function SectionE({ data, onChange, lang }) {
  const t = TX[lang];
  const up = (f, v) => onChange(f, v);

  const amenityLabels = [t.electricity, t.water, t.toilet, t.lpg, t.internet];

  return (
    <SectionCard icon="🏠" title={t.title}>
      {/* Housing type + ownership */}
      <Grid cols={2} gap={40}>
        <Field label={t.housingType} required>
          <RadioGroup field="housingType" value={data.housingType}
            options={[["KUTCHA",t.kutcha],["SEMI_PUCCA",t.semiPucca],["PUCCA",t.pucca]]}
            onChange={up} />
        </Field>
        <Field label={t.ownership} required>
          <RadioGroup field="housingOwnership" value={data.housingOwnership}
            options={[["OWN",t.own],["RENTED",t.rented],["ENCROACHED",t.encroached],["GOVT_ALLOTTED",t.govtAllotted]]}
            onChange={up} />
        </Field>
      </Grid>

      {/* Amenities */}
      <div>
        <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", color: C.textLabel, textTransform: "uppercase", marginBottom: 12 }}>{t.amenities}</div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 10 }}>
          {AMENITY_KEYS.map((key, i) => (
            <AmenityBox
              key={key}
              label={amenityLabels[i]}
              fieldKey={`amenity_${key}`}
              value={data[`amenity_${key}`]}
              onChange={up}
              yes={t.yes} no={t.no}
            />
          ))}
        </div>
      </div>

      {/* Household assets */}
      <div>
        <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", color: C.textLabel, textTransform: "uppercase", marginBottom: 12 }}>{t.assets}</div>
        <Grid cols={3} gap={20}>
          <Field label={t.agriLand}>
            <input
              value={data.agriLand || ""}
              onChange={e => up("agriLand", e.target.value)}
              placeholder="e.g. 2 acres / No"
              style={{ background:"rgba(255,255,255,0.05)", border:`1px solid ${C.border}`, borderRadius:8, padding:"10px 14px", color:C.text, fontSize:13, outline:"none", width:"100%", boxSizing:"border-box", fontFamily:"inherit" }}
            />
          </Field>
          <Field label={t.livestock}>
            <input
              value={data.livestock || ""}
              onChange={e => up("livestock", e.target.value)}
              placeholder="e.g. 2 cows"
              style={{ background:"rgba(255,255,255,0.05)", border:`1px solid ${C.border}`, borderRadius:8, padding:"10px 14px", color:C.text, fontSize:13, outline:"none", width:"100%", boxSizing:"border-box", fontFamily:"inherit" }}
            />
          </Field>
          <Field label={t.twoWheelers}>
            <input value={data.twoWheelers || "0"} type="number" min="0" onChange={e => up("twoWheelers", e.target.value)}
              style={{ background:"rgba(255,255,255,0.05)", border:`1px solid ${C.border}`, borderRadius:8, padding:"10px 14px", color:C.text, fontSize:13, outline:"none", width:"100%", boxSizing:"border-box", fontFamily:"inherit" }} />
          </Field>
          <Field label={t.fourWheelers}>
            <input value={data.fourWheelers || "0"} type="number" min="0" onChange={e => up("fourWheelers", e.target.value)}
              style={{ background:"rgba(255,255,255,0.05)", border:`1px solid ${C.border}`, borderRadius:8, padding:"10px 14px", color:C.text, fontSize:13, outline:"none", width:"100%", boxSizing:"border-box", fontFamily:"inherit" }} />
          </Field>
          <Field label={t.smartphones}>
            <input value={data.smartphones || "0"} type="number" min="0" onChange={e => up("smartphones", e.target.value)}
              style={{ background:"rgba(255,255,255,0.05)", border:`1px solid ${C.border}`, borderRadius:8, padding:"10px 14px", color:C.text, fontSize:13, outline:"none", width:"100%", boxSizing:"border-box", fontFamily:"inherit" }} />
          </Field>
        </Grid>
      </div>
    </SectionCard>
  );
}


// ═══ SectionF.jsx ═══

const TX = {
  en: {
    title: "Education",
    memberEdu: "Family Member Education",
    name: "NAME", status: "STATUS", qualification: "QUALIFICATION",
    schoolType: "SCHOOL TYPE", scholarship: "SCHOLARSHIP",
    statusOpts: [["Studying","Studying"],["Passed","Passed"],["Dropout","Dropout"],["Never Enrolled","Never Enrolled"]],
    schoolOpts: [["Government","Government"],["Private","Private"],["Madrasa","Madrasa"],["Other","Other"]],
    schOpts: [["No","No"],["Yes","Yes"]],
    addMember: "+ Add member",
    dropout: "Reasons for Dropout",
    dropOpts: [
      ["FINANCIAL","Financial"],["FAMILY_RESP","Family Responsibilities"],
      ["CHILD_MARRIAGE","Child Marriage"],["NO_SCHOOL","No Nearby School"],
      ["DISABILITY","Disability"],["EMPLOYMENT","Employment"],
      ["MIGRATION","Migration"],["OTHER","Other"],
    ],
  },
  te: {
    title: "విద్య",
    memberEdu: "కుటుంబ సభ్యుల విద్య",
    name: "పేరు", status: "స్థితి", qualification: "అర్హత",
    schoolType: "పాఠశాల రకం", scholarship: "స్కాలర్‌షిప్",
    statusOpts: [["Studying","చదువుతున్నారు"],["Passed","ఉత్తీర్ణులు"],["Dropout","మధ్యలో వదిలారు"],["Never Enrolled","ఎన్నడూ చేరలేదు"]],
    schoolOpts: [["Government","ప్రభుత్వం"],["Private","ప్రైవేట్"],["Madrasa","మదర్సా"],["Other","ఇతర"]],
    schOpts: [["No","కాదు"],["Yes","అవును"]],
    addMember: "+ సభ్యుని జోడించు",
    dropout: "మధ్యలో వదిలిన కారణాలు",
    dropOpts: [
      ["FINANCIAL","ఆర్థికం"],["FAMILY_RESP","కుటుంబ బాధ్యతలు"],
      ["CHILD_MARRIAGE","బాల్య వివాహం"],["NO_SCHOOL","దగ్గర పాఠశాల లేదు"],
      ["DISABILITY","వికలాంగత"],["EMPLOYMENT","ఉపాధి"],
      ["MIGRATION","వలస"],["OTHER","ఇతర"],
    ],
  },
};

const emptyRow = () => ({ name: "", status: "Studying", qualification: "", schoolType: "Government", scholarship: "No" });

const selectStyle = (C) => ({
  background: "rgba(255,255,255,0.06)",
  border: "1px solid rgba(255,255,255,0.08)",
  borderRadius: 6, padding: "5px 8px",
  color: C.text, fontSize: 12, outline: "none",
  width: "100%", fontFamily: "inherit",
});

const colW = "1.4fr 1.1fr 1.2fr 1.1fr 0.9fr 32px";

function SectionF({ data, onChange, lang }) {
  const t = TX[lang];
  const up = (f, v) => onChange(f, v);
  const rows = data.eduMembers || [emptyRow()];

  function updateRow(idx, field, val) {
    up("eduMembers", rows.map((r, i) => i === idx ? { ...r, [field]: val } : r));
  }
  function addRow() { up("eduMembers", [...rows, emptyRow()]); }
  function removeRow(idx) { up("eduMembers", rows.filter((_, i) => i !== idx)); }

  const colHeaders = [t.name, t.status, t.qualification, t.schoolType, t.scholarship, ""];

  return (
    <SectionCard icon="🎓" title={t.title}>
      {/* Table */}
      <div>
        <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", color: C.textLabel, textTransform: "uppercase", marginBottom: 10 }}>{t.memberEdu}</div>
        <div style={{ border: `1px solid ${C.border}`, borderRadius: 10, overflow: "hidden" }}>
          {/* Header */}
          <div style={{ display: "grid", gridTemplateColumns: colW, gap: 8, padding: "10px 12px", background: "linear-gradient(90deg,rgba(251,191,36,0.18),rgba(251,191,36,0.05))" }}>
            {colHeaders.map((h, i) => (
              <span key={i} style={{ fontSize: 9, fontWeight: 800, letterSpacing: "0.1em", color: C.accent, textTransform: "uppercase" }}>{h}</span>
            ))}
          </div>

          {/* Rows */}
          {rows.map((row, idx) => (
            <div key={idx} style={{ display: "grid", gridTemplateColumns: colW, gap: 8, padding: "8px 12px", borderTop: "1px solid rgba(255,255,255,0.04)", background: idx % 2 ? "transparent" : "rgba(255,255,255,0.01)", alignItems: "center" }}>
              <input value={row.name} onChange={e => updateRow(idx, "name", e.target.value)} placeholder="Name"
                style={{ background:"rgba(255,255,255,0.05)", border:"1px solid rgba(255,255,255,0.08)", borderRadius:6, padding:"5px 8px", color:C.text, fontSize:12, outline:"none", width:"100%", boxSizing:"border-box", fontFamily:"inherit" }} />
              <select value={row.status} onChange={e => updateRow(idx, "status", e.target.value)} style={selectStyle(C)}>
                {t.statusOpts.map(([v,l]) => <option key={v} value={v} style={{background:C.bgCard}}>{l}</option>)}
              </select>
              <input value={row.qualification} onChange={e => updateRow(idx, "qualification", e.target.value)} placeholder="Qualification"
                style={{ background:"rgba(255,255,255,0.05)", border:"1px solid rgba(255,255,255,0.08)", borderRadius:6, padding:"5px 8px", color:C.text, fontSize:12, outline:"none", width:"100%", boxSizing:"border-box", fontFamily:"inherit" }} />
              <select value={row.schoolType} onChange={e => updateRow(idx, "schoolType", e.target.value)} style={selectStyle(C)}>
                {t.schoolOpts.map(([v,l]) => <option key={v} value={v} style={{background:C.bgCard}}>{l}</option>)}
              </select>
              <select value={row.scholarship} onChange={e => updateRow(idx, "scholarship", e.target.value)} style={selectStyle(C)}>
                {t.schOpts.map(([v,l]) => <option key={v} value={v} style={{background:C.bgCard}}>{l}</option>)}
              </select>
              <button onClick={() => removeRow(idx)} style={{ background:"none", border:"none", color:C.red, cursor:"pointer", fontSize:15, padding:0, lineHeight:1 }}>✕</button>
            </div>
          ))}
        </div>
        <AddRowBtn onClick={addRow} label={t.addMember} />
      </div>

      {/* Dropout reasons */}
      <Field label={t.dropout}>
        <CheckGroup field="dropoutReasons" value={data.dropoutReasons} options={t.dropOpts} onChange={up} />
      </Field>
    </SectionCard>
  );
}


// ═══ SectionG.jsx ═══

const TX = {
  en: {
    title: "Health & Disability",
    chronic: "Chronic Medical Conditions",
    cName:"NAME", cCondition:"CONDITION", cDuration:"DURATION", cTreatment:"TREATMENT", cMonthly:"MONTHLY ₹",
    treatOpts:[["Ongoing","Ongoing"],["Completed","Completed"],["None","None"]],
    addCondition:"+ Add condition",
    disabilities:"Disabilities",
    dName:"NAME", dType:"TYPE", dPercent:"%", dCert:"CERTIFICATE",
    certOpts:[["Yes","Yes"],["No","No"]],
    addDisability:"+ Add disability",
    healthAccess:"Healthcare Access",
    accessOpts:[["GOVT_HOSP","Govt Hospital"],["PRIVATE","Private Clinic"],["PHC","PHC"],["NO_ACCESS","No Access"]],
    challenges:"Health Challenges",
    chalOpts:[["COST","Cost"],["DISTANCE","Distance"],["MEDICINES","Medicines"],["NO_INSURANCE","No Insurance"],["OTHER","Other"]],
  },
  te: {
    title: "ఆరోగ్యం & వికలాంగత",
    chronic: "దీర్ఘకాలిక వైద్య పరిస్థితులు",
    cName:"పేరు", cCondition:"పరిస్థితి", cDuration:"వ్యవధి", cTreatment:"చికిత్స", cMonthly:"నెలవారీ ₹",
    treatOpts:[["Ongoing","కొనసాగుతోంది"],["Completed","పూర్తయింది"],["None","లేదు"]],
    addCondition:"+ పరిస్థితి జోడించు",
    disabilities:"వికలాంగతలు",
    dName:"పేరు", dType:"రకం", dPercent:"%", dCert:"సర్టిఫికేట్",
    certOpts:[["Yes","అవును"],["No","కాదు"]],
    addDisability:"+ వికలాంగత జోడించు",
    healthAccess:"ఆరోగ్య సేవ యాక్సెస్",
    accessOpts:[["GOVT_HOSP","ప్రభుత్వ ఆసుపత్రి"],["PRIVATE","ప్రైవేట్ క్లినిక్"],["PHC","PHC"],["NO_ACCESS","యాక్సెస్ లేదు"]],
    challenges:"ఆరోగ్య సవాళ్ళు",
    chalOpts:[["COST","ఖర్చు"],["DISTANCE","దూరం"],["MEDICINES","మందులు"],["NO_INSURANCE","బీమా లేదు"],["OTHER","ఇతర"]],
  },
};

const emptyCondition = () => ({ name:"", condition:"", duration:"", treatment:"Ongoing", monthly:"0" });
const emptyDisability = () => ({ name:"", type:"", percent:"0", certificate:"Yes" });

const inputSt = { background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.07)", borderRadius:6, padding:"6px 9px", color:C.text, fontSize:12, outline:"none", width:"100%", boxSizing:"border-box", fontFamily:"inherit" };
const selSt = { background:"rgba(30,40,55,0.9)", border:"1px solid rgba(255,255,255,0.08)", borderRadius:6, padding:"6px 8px", color:C.text, fontSize:12, outline:"none", width:"100%", fontFamily:"inherit" };

function buildHeader(cols, C) {
  return (
    <div style={{ display:"grid", gridTemplateColumns:cols.map(c=>c.w).join(" "), gap:8, padding:"10px 12px", background:"linear-gradient(90deg,rgba(251,191,36,0.18),rgba(251,191,36,0.05))" }}>
      {cols.map(c => <span key={c.label} style={{ fontSize:9, fontWeight:800, letterSpacing:"0.1em", color:C.accent, textTransform:"uppercase" }}>{c.label}</span>)}
    </div>
  );
}

function SectionG({ data, onChange, lang }) {
  const t = TX[lang];
  const up = (f, v) => onChange(f, v);

  const conditions = data.chronicConditions || [emptyCondition()];
  const disabilities = data.disabilities || [emptyDisability()];

  function updateCond(idx, f, v) { up("chronicConditions", conditions.map((r,i) => i===idx?{...r,[f]:v}:r)); }
  function addCond() { up("chronicConditions", [...conditions, emptyCondition()]); }
  function removeCond(idx) { up("chronicConditions", conditions.filter((_,i)=>i!==idx)); }

  function updateDis(idx, f, v) { up("disabilities", disabilities.map((r,i) => i===idx?{...r,[f]:v}:r)); }
  function addDis() { up("disabilities", [...disabilities, emptyDisability()]); }
  function removeDis(idx) { up("disabilities", disabilities.filter((_,i)=>i!==idx)); }

  const condCols = [
    { label:t.cName, w:"1.2fr" }, { label:t.cCondition, w:"1.2fr" },
    { label:t.cDuration, w:"1fr" }, { label:t.cTreatment, w:"1.1fr" },
    { label:t.cMonthly, w:"0.9fr" }, { label:"", w:"32px" },
  ];
  const disCols = [
    { label:t.dName, w:"1.4fr" }, { label:t.dType, w:"1.4fr" },
    { label:t.dPercent, w:"0.7fr" }, { label:t.dCert, w:"1fr" }, { label:"", w:"32px" },
  ];

  return (
    <SectionCard icon="❤️" title={t.title}>
      {/* Chronic conditions table */}
      <div>
        <div style={{ fontSize:11, fontWeight:700, letterSpacing:"0.1em", color:C.textLabel, textTransform:"uppercase", marginBottom:10 }}>{t.chronic}</div>
        <div style={{ border:`1px solid ${C.border}`, borderRadius:10, overflow:"hidden" }}>
          {buildHeader(condCols, C)}
          {conditions.map((row, idx) => (
            <div key={idx} style={{ display:"grid", gridTemplateColumns:condCols.map(c=>c.w).join(" "), gap:8, padding:"8px 12px", borderTop:"1px solid rgba(255,255,255,0.04)", background:idx%2?"transparent":"rgba(255,255,255,0.01)", alignItems:"center" }}>
              <input value={row.name} onChange={e=>updateCond(idx,"name",e.target.value)} placeholder="Name" style={inputSt}/>
              <input value={row.condition} onChange={e=>updateCond(idx,"condition",e.target.value)} placeholder="e.g. Diabetes" style={inputSt}/>
              <input value={row.duration} onChange={e=>updateCond(idx,"duration",e.target.value)} placeholder="e.g. 2 years" style={inputSt}/>
              <select value={row.treatment} onChange={e=>updateCond(idx,"treatment",e.target.value)} style={selSt}>
                {t.treatOpts.map(([v,l])=><option key={v} value={v} style={{background:C.bgCard}}>{l}</option>)}
              </select>
              <input value={row.monthly} onChange={e=>updateCond(idx,"monthly",e.target.value)} type="number" min="0" style={inputSt}/>
              <button onClick={()=>removeCond(idx)} style={{background:"none",border:"none",color:C.red,cursor:"pointer",fontSize:15,padding:0}}>✕</button>
            </div>
          ))}
        </div>
        <AddRowBtn onClick={addCond} label={t.addCondition}/>
      </div>

      {/* Disabilities table */}
      <div>
        <div style={{ fontSize:11, fontWeight:700, letterSpacing:"0.1em", color:C.textLabel, textTransform:"uppercase", marginBottom:10 }}>{t.disabilities}</div>
        <div style={{ border:`1px solid ${C.border}`, borderRadius:10, overflow:"hidden" }}>
          {buildHeader(disCols, C)}
          {disabilities.map((row, idx) => (
            <div key={idx} style={{ display:"grid", gridTemplateColumns:disCols.map(c=>c.w).join(" "), gap:8, padding:"8px 12px", borderTop:"1px solid rgba(255,255,255,0.04)", background:idx%2?"transparent":"rgba(255,255,255,0.01)", alignItems:"center" }}>
              <input value={row.name} onChange={e=>updateDis(idx,"name",e.target.value)} placeholder="Name" style={inputSt}/>
              <input value={row.type} onChange={e=>updateDis(idx,"type",e.target.value)} placeholder="e.g. Visual" style={inputSt}/>
              <input value={row.percent} onChange={e=>updateDis(idx,"percent",e.target.value)} type="number" min="0" max="100" style={inputSt}/>
              <select value={row.certificate} onChange={e=>updateDis(idx,"certificate",e.target.value)} style={selSt}>
                {t.certOpts.map(([v,l])=><option key={v} value={v} style={{background:C.bgCard}}>{l}</option>)}
              </select>
              <button onClick={()=>removeDis(idx)} style={{background:"none",border:"none",color:C.red,cursor:"pointer",fontSize:15,padding:0}}>✕</button>
            </div>
          ))}
        </div>
        <AddRowBtn onClick={addDis} label={t.addDisability}/>
      </div>

      {/* Access + challenges */}
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:32 }}>
        <Field label={t.healthAccess}>
          <CheckGroup field="healthcareAccess" value={data.healthcareAccess} options={t.accessOpts} onChange={up}/>
        </Field>
        <Field label={t.challenges}>
          <CheckGroup field="healthChallenges" value={data.healthChallenges} options={t.chalOpts} onChange={up}/>
        </Field>
      </div>
    </SectionCard>
  );
}


// ═══ SectionH.jsx ═══

const TX = {
  en: {
    title: "Government Schemes & Welfare",
    scheReceiving: "Schemes Currently Receiving",
    sName:"SCHEME NAME", sBene:"BENEFICIARY", sType:"BENEFIT TYPE", sAmount:"AMOUNT/FREQ",
    addScheme:"+ Add scheme",
    applicable: "Applicable Schemes Checklist",
    appOpts:[
      ["RATION_CARD","Ration Card"],["AYUSHMAN","Ayushman Bharat"],["AAROGYASRI","Aarogyasri"],
      ["AASARA","Aasara Pension"],["PMAY","PMAY Housing"],["UJJWALA","Ujjwala Yojana"],
      ["MGNREGA","MGNREGA"],["SCHOLARSHIPS","Scholarships"],["DISABILITY_PEN","Disability Pension"],
      ["WIDOW_PEN","Widow Pension"],["OLD_AGE_PEN","Old Age Pension"],["FEE_REIMB","Fee Reimbursement"],
      ["SHG","SHG Benefits"],
    ],
    notReceived: "Reasons Benefits Not Received",
    notOpts:[
      ["AWARENESS","Lack of Awareness"],["REJECTED","App. Rejected"],["MISSING_DOCS","Missing Docs"],
      ["CORRUPTION","Corruption"],["AADHAAR","Aadhaar Issues"],["TECHNICAL","Technical"],
      ["MIGRATION","Migration"],["OTHER","Other"],
    ],
    mostNeeded: "Benefits Most Needed",
    neededOpts:[
      ["EMPLOYMENT","Employment"],["PENSION","Pension"],["HEALTH","Health"],["EDUCATION","Education"],
      ["HOUSING","Housing"],["FOOD","Food"],["LOAN","Loan"],["SKILL","Skill Training"],
      ["DISABILITY","Disability"],["WOMEN","Women"],
    ],
  },
  te: {
    title: "ప్రభుత్వ పథకాలు & సంక్షేమం",
    scheReceiving: "ప్రస్తుతం పొందుతున్న పథకాలు",
    sName:"పథకం పేరు", sBene:"లబ్ధిదారుడు", sType:"ప్రయోజన రకం", sAmount:"మొత్తం/తరవు",
    addScheme:"+ పథకం జోడించు",
    applicable: "వర్తించే పథకాల చెక్‌లిస్ట్",
    appOpts:[
      ["RATION_CARD","రేషన్ కార్డు"],["AYUSHMAN","ఆయుష్మాన్ భారత్"],["AAROGYASRI","ఆరోగ్యశ్రీ"],
      ["AASARA","ఆసరా పెన్షన్"],["PMAY","PMAY గృహం"],["UJJWALA","ఉజ్జ్వల యోజన"],
      ["MGNREGA","MGNREGA"],["SCHOLARSHIPS","స్కాలర్‌షిప్‌లు"],["DISABILITY_PEN","వికలాంగ పెన్షన్"],
      ["WIDOW_PEN","వితంతు పెన్షన్"],["OLD_AGE_PEN","వృద్ధాప్య పెన్షన్"],["FEE_REIMB","రుసుము వాపసు"],
      ["SHG","SHG ప్రయోజనాలు"],
    ],
    notReceived: "ప్రయోజనాలు అందని కారణాలు",
    notOpts:[
      ["AWARENESS","అవగాహన లేమి"],["REJECTED","దరఖాస్తు తిరస్కరించారు"],["MISSING_DOCS","పత్రాలు లేవు"],
      ["CORRUPTION","అవినీతి"],["AADHAAR","ఆధార్ సమస్యలు"],["TECHNICAL","సాంకేతిక"],
      ["MIGRATION","వలస"],["OTHER","ఇతర"],
    ],
    mostNeeded: "అత్యంత అవసరమైన ప్రయోజనాలు",
    neededOpts:[
      ["EMPLOYMENT","ఉపాధి"],["PENSION","పెన్షన్"],["HEALTH","ఆరోగ్యం"],["EDUCATION","విద్య"],
      ["HOUSING","గృహం"],["FOOD","ఆహారం"],["LOAN","రుణం"],["SKILL","నైపుణ్య శిక్షణ"],
      ["DISABILITY","వికలాంగత"],["WOMEN","మహిళలు"],
    ],
  },
};

const emptyScheme = () => ({ name:"", beneficiary:"", type:"", amount:"" });
const colW = "1.4fr 1.2fr 1.2fr 1.2fr 32px";
const inputSt = { background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.07)", borderRadius:6, padding:"6px 9px", color:C.text, fontSize:12, outline:"none", width:"100%", boxSizing:"border-box", fontFamily:"inherit" };

function SectionH({ data, onChange, lang }) {
  const t = TX[lang];
  const up = (f, v) => onChange(f, v);
  const schemes = data.currentSchemes || [emptyScheme()];

  function updateScheme(idx, f, v) { up("currentSchemes", schemes.map((r,i)=>i===idx?{...r,[f]:v}:r)); }
  function addScheme() { up("currentSchemes", [...schemes, emptyScheme()]); }
  function removeScheme(idx) { up("currentSchemes", schemes.filter((_,i)=>i!==idx)); }

  const cols = [
    {label:t.sName,w:"1.4fr"},{label:t.sBene,w:"1.2fr"},
    {label:t.sType,w:"1.2fr"},{label:t.sAmount,w:"1.2fr"},{label:"",w:"32px"},
  ];

  return (
    <SectionCard icon="🏛️" title={t.title}>
      {/* Schemes table */}
      <div>
        <div style={{fontSize:11,fontWeight:700,letterSpacing:"0.1em",color:C.textLabel,textTransform:"uppercase",marginBottom:10}}>{t.scheReceiving}</div>
        <div style={{border:`1px solid ${C.border}`,borderRadius:10,overflow:"hidden"}}>
          <div style={{display:"grid",gridTemplateColumns:cols.map(c=>c.w).join(" "),gap:8,padding:"10px 12px",background:"linear-gradient(90deg,rgba(251,191,36,0.18),rgba(251,191,36,0.05))"}}>
            {cols.map(c=><span key={c.label} style={{fontSize:9,fontWeight:800,letterSpacing:"0.1em",color:C.accent,textTransform:"uppercase"}}>{c.label}</span>)}
          </div>
          {schemes.map((row,idx)=>(
            <div key={idx} style={{display:"grid",gridTemplateColumns:cols.map(c=>c.w).join(" "),gap:8,padding:"8px 12px",borderTop:"1px solid rgba(255,255,255,0.04)",background:idx%2?"transparent":"rgba(255,255,255,0.01)",alignItems:"center"}}>
              <input value={row.name} onChange={e=>updateScheme(idx,"name",e.target.value)} placeholder="Scheme name" style={inputSt}/>
              <input value={row.beneficiary} onChange={e=>updateScheme(idx,"beneficiary",e.target.value)} placeholder="Beneficiary" style={inputSt}/>
              <input value={row.type} onChange={e=>updateScheme(idx,"type",e.target.value)} placeholder="Type" style={inputSt}/>
              <input value={row.amount} onChange={e=>updateScheme(idx,"amount",e.target.value)} placeholder="e.g. ₹500/month" style={inputSt}/>
              <button onClick={()=>removeScheme(idx)} style={{background:"none",border:"none",color:C.red,cursor:"pointer",fontSize:15,padding:0}}>✕</button>
            </div>
          ))}
        </div>
        <AddRowBtn onClick={addScheme} label={t.addScheme}/>
      </div>

      <Field label={t.applicable}>
        <CheckGroup field="applicableSchemes" value={data.applicableSchemes} options={t.appOpts} onChange={up}/>
      </Field>

      <Field label={t.notReceived}>
        <CheckGroup field="benefitsNotReceived" value={data.benefitsNotReceived} options={t.notOpts} onChange={up}/>
      </Field>

      <Field label={t.mostNeeded}>
        <CheckGroup field="benefitsMostNeeded" value={data.benefitsMostNeeded} options={t.neededOpts} onChange={up}/>
      </Field>
    </SectionCard>
  );
}


// ═══ SectionI.jsx ═══

const TX = {
  en: {
    title: "Documents & Digital Access",
    docAvail: "Document Availability",
    document: "DOCUMENT", available: "AVAILABLE?", valid: "VALID?",
    yes: "Yes", no: "No",
    docs: [
      ["aadhaar","Aadhaar"],["pan","PAN"],["rationCard","Ration Card"],
      ["incomeCert","Income Certificate"],["casteCert","Caste Certificate"],
      ["disabilityCert","Disability Certificate"],["voterId","Voter ID"],["bankPassbook","Bank Passbook"],
    ],
    smartphone: "Smartphone?",
    digitalAbility: "Digital Ability",
    abilityOpts:[["COMFORTABLE","Comfortable"],["NEED_ASST","Need Assistance"],["CANNOT","Cannot Use"]],
  },
  te: {
    title: "పత్రాలు & డిజిటల్ యాక్సెస్",
    docAvail: "పత్రాల లభ్యత",
    document: "పత్రం", available: "అందుబాటులో?", valid: "చెల్లుబాటు?",
    yes: "అవును", no: "కాదు",
    docs: [
      ["aadhaar","ఆధార్"],["pan","PAN"],["rationCard","రేషన్ కార్డు"],
      ["incomeCert","ఆదాయ ధృవపత్రం"],["casteCert","కుల ధృవపత్రం"],
      ["disabilityCert","వికలాంగత ధృవపత్రం"],["voterId","ఓటరు ID"],["bankPassbook","బ్యాంకు పాస్‌బుక్"],
    ],
    smartphone: "స్మార్ట్‌ఫోన్?",
    digitalAbility: "డిజిటల్ సామర్థ్యం",
    abilityOpts:[["COMFORTABLE","సౌకర్యంగా"],["NEED_ASST","సహాయం అవసరం"],["CANNOT","వాడలేరు"]],
  },
};

function YesNo({ value, onChange, yes, no }) {
  return (
    <div style={{ display:"flex", gap:10 }}>
      {[["YES",yes],["NO",no]].map(([v,l])=>{
        const active = value === v;
        return (
          <button key={v} onClick={()=>onChange(v)} style={{
            display:"flex",alignItems:"center",gap:6,
            padding:"5px 13px",borderRadius:20,
            border:`1px solid ${active?C.accent:"rgba(255,255,255,0.1)"}`,
            background:active?C.accentDim:"transparent",
            color:active?C.accent:C.textMuted,
            cursor:"pointer",fontSize:12,fontWeight:active?700:400,fontFamily:"inherit",
          }}>
            <span style={{width:8,height:8,borderRadius:"50%",border:`2px solid ${active?C.accent:"#475569"}`,background:active?C.accent:"transparent",flexShrink:0}}/>
            {l}
          </button>
        );
      })}
    </div>
  );
}

function SectionI({ data, onChange, lang }) {
  const t = TX[lang];
  const up = (f, v) => onChange(f, v);

  return (
    <SectionCard icon="📄" title={t.title}>
      {/* Document table */}
      <div>
        <div style={{fontSize:11,fontWeight:700,letterSpacing:"0.1em",color:C.textLabel,textTransform:"uppercase",marginBottom:10}}>{t.docAvail}</div>
        <div style={{border:`1px solid ${C.border}`,borderRadius:10,overflow:"hidden"}}>
          {/* Header */}
          <div style={{display:"grid",gridTemplateColumns:"2fr 1.4fr 1.4fr",gap:8,padding:"10px 16px",background:"linear-gradient(90deg,rgba(251,191,36,0.18),rgba(251,191,36,0.05))"}}>
            {[t.document,t.available,t.valid].map(h=>(
              <span key={h} style={{fontSize:9,fontWeight:800,letterSpacing:"0.1em",color:C.accent,textTransform:"uppercase"}}>{h}</span>
            ))}
          </div>

          {/* Rows */}
          {t.docs.map(([key,label],idx)=>(
            <div key={key} style={{display:"grid",gridTemplateColumns:"2fr 1.4fr 1.4fr",gap:8,padding:"10px 16px",borderTop:"1px solid rgba(255,255,255,0.04)",background:idx%2?"transparent":"rgba(255,255,255,0.015)",alignItems:"center"}}>
              <span style={{fontSize:13,color:C.text,fontWeight:400}}>{label}</span>
              <YesNo
                value={data[`doc_${key}_available`]}
                onChange={v=>up(`doc_${key}_available`,v)}
                yes={t.yes} no={t.no}
              />
              <YesNo
                value={data[`doc_${key}_valid`]}
                onChange={v=>up(`doc_${key}_valid`,v)}
                yes={t.yes} no={t.no}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Smartphone + digital ability */}
      <div style={{display:"grid",gridTemplateColumns:"1fr 1.5fr",gap:40}}>
        <Field label={t.smartphone}>
          <RadioGroup field="hasSmartphone" value={data.hasSmartphone}
            options={[["YES",t.yes],["NO",t.no]]} onChange={up}/>
        </Field>
        <Field label={t.digitalAbility}>
          <RadioGroup field="digitalAbility" value={data.digitalAbility}
            options={t.abilityOpts} onChange={up}/>
        </Field>
      </div>
    </SectionCard>
  );
}


// ═══ SectionJ.jsx ═══

const TX = {
  en: {
    title: "Social & Community Information",
    altContact: "Alt. Contact Name", relationship: "Relationship",
    altMobile: "Alt. Mobile", altOccupation: "Alt. Occupation",
    communityRole: "Community Role",
    roleOpts:[
      ["SHG_LEADER","SHG Leader"],["VILLAGE_VOL","Village Volunteer"],["WARD_MEMBER","Ward Member"],
      ["RELIGIOUS","Religious Leader"],["NGO_VOL","NGO Volunteer"],["NONE","None"],["OTHER","Other"],
    ],
    willingInfo: "Willing to Receive Info?",
    yes:"Yes", no:"No",
    prefComm: "Preferred Communication",
    commOpts:[["PHONE","Phone Call"],["WHATSAPP","WhatsApp"],["SMS","SMS"],["VILLAGE","Village Volunteer"],["EMAIL","Email"]],
  },
  te: {
    title: "సామాజిక & సమాజ సమాచారం",
    altContact: "ప్రత్యా. సంప్రదింపు పేరు", relationship: "సంబంధం",
    altMobile: "ప్రత్యా. మొబైల్", altOccupation: "ప్రత్యా. వృత్తి",
    communityRole: "సమాజ పాత్ర",
    roleOpts:[
      ["SHG_LEADER","SHG నాయకుడు"],["VILLAGE_VOL","గ్రామ వాలంటీర్"],["WARD_MEMBER","వార్డ్ సభ్యుడు"],
      ["RELIGIOUS","మత నాయకుడు"],["NGO_VOL","NGO వాలంటీర్"],["NONE","లేదు"],["OTHER","ఇతర"],
    ],
    willingInfo: "సమాచారం స్వీకరించడానికి సిద్ధంగా ఉన్నారా?",
    yes:"అవును", no:"కాదు",
    prefComm: "ఇష్టపడే కమ్యూనికేషన్",
    commOpts:[["PHONE","ఫోన్ కాల్"],["WHATSAPP","WhatsApp"],["SMS","SMS"],["VILLAGE","గ్రామ వాలంటీర్"],["EMAIL","ఇమెయిల్"]],
  },
};

function SectionJ({ data, onChange, lang }) {
  const t = TX[lang];
  const up = (f, v) => onChange(f, v);
  return (
    <SectionCard icon="🤝" title={t.title}>
      <Grid cols={3}>
        <Field label={t.altContact}>
          <TextInput value={data.altContactName||""} onChange={v=>up("altContactName",v)}/>
        </Field>
        <Field label={t.relationship}>
          <TextInput value={data.altRelationship||""} onChange={v=>up("altRelationship",v)}/>
        </Field>
        <Field label={t.altMobile}>
          <TextInput value={data.altMobile||""} onChange={v=>up("altMobile",v)}/>
        </Field>
      </Grid>
      <Field label={t.altOccupation} style={{maxWidth:360}}>
        <TextInput value={data.altOccupation||""} onChange={v=>up("altOccupation",v)}/>
      </Field>
      <Field label={t.communityRole}>
        <CheckGroup field="communityRole" value={data.communityRole} options={t.roleOpts} onChange={up}/>
      </Field>
      <Field label={t.willingInfo}>
        <RadioGroup field="willingToReceiveInfo" value={data.willingToReceiveInfo}
          options={[["YES",t.yes],["NO",t.no]]} onChange={up}/>
      </Field>
      <Field label={t.prefComm}>
        <CheckGroup field="preferredComm" value={data.preferredComm} options={t.commOpts} onChange={up}/>
      </Field>
    </SectionCard>
  );
}


// ═══ SectionK.jsx ═══

const TX = {
  en: {
    title: "Consent Declaration",
    consentEn: "I voluntarily provide the above information for welfare assessment, eligibility mapping, social support facilitation and awareness purposes.",
    consentTe: "నేను సంక్షేమ మదింపు, అర్హత మ్యాపింగ్ మరియు సామాజిక మద్దతు సహాయం కోసం పై సమాచారాన్ని స్వచ్ఛందంగా అందిస్తున్నాను.",
    iAgree: "I Agree – Consent Given",
    declined: "Declined",
    signature: "Signature / Full Name",
    date: "Date",
    surveyorName: "Surveyor Name",
    surveyorId: "Surveyor ID",
    surveyLocation: "Survey Location (Village/Town)",
    remarks: "Additional Remarks",
    submit: "✓ Submit Survey",
    submitting: "Submitting...",
    submitted: "Survey Submitted!",
    submittedMsg: "Thank you. Your response has been recorded successfully.",
    demoNote: "Demo mode – JSON payload that would be sent to PostgreSQL:",
  },
  te: {
    title: "అంగీకార ప్రకటన",
    consentEn: "I voluntarily provide the above information for welfare assessment, eligibility mapping, social support facilitation and awareness purposes.",
    consentTe: "నేను సంక్షేమ మదింపు, అర్హత మ్యాపింగ్ మరియు సామాజిక మద్దతు సహాయం కోసం పై సమాచారాన్ని స్వచ్ఛందంగా అందిస్తున్నాను.",
    iAgree: "నేను అంగీకరిస్తున్నాను",
    declined: "తిరస్కరించారు",
    signature: "సంతకం / పూర్తి పేరు",
    date: "తేదీ",
    surveyorName: "సర్వేయర్ పేరు",
    surveyorId: "సర్వేయర్ ID",
    surveyLocation: "సర్వే స్థలం (గ్రామం/పట్టణం)",
    remarks: "అదనపు వ్యాఖ్యలు",
    submit: "✓ సర్వే సమర్పించండి",
    submitting: "సమర్పిస్తోంది...",
    submitted: "సర్వే సమర్పించారు!",
    submittedMsg: "ధన్యవాదాలు. మీ ప్రతిస్పందన విజయవంతంగా నమోదైంది.",
    demoNote: "డెమో మోడ్ – PostgreSQL కి పంపబడే JSON:",
  },
};

function SectionK({ data, onChange, lang, allData, submitting, submitted, submitError, onSubmit }) {
  const t = TX[lang];
  const up = (f, v) => onChange(f, v);

  if (submitted) {
    return (
      <SectionCard icon="✅" title={t.title}>
        <div style={{ textAlign:"center", padding:"48px 0" }}>
          <div style={{ fontSize:56, marginBottom:16 }}>🎉</div>
          <h3 style={{ color:C.green, fontSize:22, fontWeight:800, margin:"0 0 10px" }}>{t.submitted}</h3>
          <p style={{ color:C.textMuted, fontSize:14, margin:0 }}>{t.submittedMsg}</p>
        </div>
      </SectionCard>
    );
  }

  return (
    <SectionCard icon="✅" title={t.title}>
      {/* Bilingual consent box */}
      <div style={{
        padding:"20px 22px",
        background:"rgba(251,191,36,0.05)",
        border:`1px solid rgba(251,191,36,0.2)`,
        borderRadius:10,
        lineHeight:1.7,
      }}>
        <p style={{ margin:"0 0 12px", fontSize:13, color:C.text }}>
          <strong style={{ color:C.accent }}>English: </strong>{t.consentEn}
        </p>
        <p style={{ margin:0, fontSize:13, color:C.text }}>
          <strong style={{ color:C.accent }}>తెలుగు: </strong>{t.consentTe}
        </p>
      </div>

      {/* Agree / Declined */}
      <RadioGroup
        field="consentStatus"
        value={data.consentStatus}
        options={[["AGREED", t.iAgree], ["DECLINED", t.declined]]}
        onChange={up}
      />

      {/* Surveyor fields */}
      <Grid cols={3}>
        <Field label={t.signature} required>
          <TextInput value={data.signatureName||""} onChange={v=>up("signatureName",v)}/>
        </Field>
        <Field label={t.date} required>
          <TextInput value={data.consentDate||""} onChange={v=>up("consentDate",v)} type="date"/>
        </Field>
        <Field label={t.surveyorName} required>
          <TextInput value={data.surveyorName||""} onChange={v=>up("surveyorName",v)}/>
        </Field>
      </Grid>

      <Grid cols={2}>
        <Field label={t.surveyorId} required>
          <TextInput value={data.surveyorId||""} onChange={v=>up("surveyorId",v)}/>
        </Field>
        <Field label={t.surveyLocation} required>
          <TextInput value={data.surveyLocation||""} onChange={v=>up("surveyLocation",v)}/>
        </Field>
      </Grid>

      <Field label={t.remarks} optional>
        <textarea
          value={data.additionalRemarks||""}
          onChange={e=>up("additionalRemarks",e.target.value)}
          rows={4}
          style={{
            background:"rgba(255,255,255,0.05)", border:`1px solid ${C.border}`,
            borderRadius:8, padding:"10px 14px", color:C.text, fontSize:13,
            outline:"none", width:"100%", boxSizing:"border-box",
            fontFamily:"inherit", resize:"vertical",
          }}
        />
      </Field>

      {/* Submit button */}
      <div style={{ display:"flex", justifyContent:"flex-end" }}>
        <button
          onClick={onSubmit}
          disabled={submitting || data.consentStatus !== "AGREED"}
          style={{
            padding:"14px 40px", borderRadius:10, border:"none",
            background: submitting || data.consentStatus !== "AGREED"
              ? "rgba(251,191,36,0.2)"
              : "linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)",
            color: submitting || data.consentStatus !== "AGREED" ? C.textMuted : "#0e1117",
            cursor: submitting || data.consentStatus !== "AGREED" ? "not-allowed" : "pointer",
            fontWeight:800, fontSize:15, fontFamily:"inherit",
            transition:"all 0.2s",
            boxShadow: data.consentStatus === "AGREED" && !submitting ? "0 4px 20px rgba(251,191,36,0.35)" : "none",
          }}
        >
          {submitting ? t.submitting : t.submit}
        </button>
      </div>

      {/* Demo JSON output */}
      {submitError && (
        <div>
          <p style={{ color:C.accent, fontSize:11, margin:"0 0 6px" }}>{t.demoNote}</p>
          <pre style={{
            background:"rgba(0,0,0,0.4)", border:`1px solid rgba(251,191,36,0.15)`,
            borderRadius:8, padding:14, fontSize:11, color:"#86efac",
            overflowX:"auto", maxHeight:280, margin:0,
          }}>{submitError}</pre>
        </div>
      )}
    </SectionCard>
  );
}


// ═══ App.jsx ═══

// ── Section metadata ──────────────────────────────────
const SECTIONS = [
  { key:"A", en:"A. Identity",    te:"A. గుర్తింపు",   subtitle_en:"Section A – Identity & Address",                subtitle_te:"సెక్షన్ A – గుర్తింపు & చిరునామా" },
  { key:"B", en:"B. Household",   te:"B. గృహం",        subtitle_en:"Section B – Household Information",             subtitle_te:"సెక్షన్ B – గృహ సమాచారం" },
  { key:"C", en:"C. Employment",  te:"C. ఉపాధి",       subtitle_en:"Section C – Employment & Livelihood",           subtitle_te:"సెక్షన్ C – ఉపాధి & జీవనోపాధి" },
  { key:"D", en:"D. Income",      te:"D. ఆదాయం",       subtitle_en:"Section D – Income & Financial Status",         subtitle_te:"సెక్షన్ D – ఆదాయం & ఆర్థిక స్థితి" },
  { key:"E", en:"E. Assets",      te:"E. ఆస్తులు",     subtitle_en:"Section E – Assets & Living Conditions",        subtitle_te:"సెక్షన్ E – ఆస్తులు & జీవన పరిస్థితులు" },
  { key:"F", en:"F. Education",   te:"F. విద్య",       subtitle_en:"Section F – Education",                         subtitle_te:"సెక్షన్ F – విద్య" },
  { key:"G", en:"G. Health",      te:"G. ఆరోగ్యం",     subtitle_en:"Section G – Health & Disability",               subtitle_te:"సెక్షన్ G – ఆరోగ్యం & వికలాంగత" },
  { key:"H", en:"H. Welfare",     te:"H. సంక్షేమం",    subtitle_en:"Section H – Government Schemes & Welfare",      subtitle_te:"సెక్షన్ H – ప్రభుత్వ పథకాలు & సంక్షేమం" },
  { key:"I", en:"I. Documents",   te:"I. పత్రాలు",     subtitle_en:"Section I – Documents & Digital Access",        subtitle_te:"సెక్షన్ I – పత్రాలు & డిజిటల్ యాక్సెస్" },
  { key:"J", en:"J. Community",   te:"J. సమాజం",       subtitle_en:"Section J – Social & Community Information",    subtitle_te:"సెక్షన్ J – సామాజిక & సమాజ సమాచారం" },
  { key:"K", en:"K. Consent",     te:"K. అంగీకారం",    subtitle_en:"Section K – Consent Declaration",              subtitle_te:"సెక్షన్ K – అంగీకార ప్రకటన" },
];

const SECTION_COMPS = { A:SectionA, B:SectionB, C:SectionC, D:SectionD, E:SectionE, F:SectionF, G:SectionG, H:SectionH, I:SectionI, J:SectionJ, K:SectionK };

// ── Initial state ─────────────────────────────────────
const INIT = {
  // A
  firstName:"", middleName:"", lastName:"",
  primaryMobile:"", alternateMobile:"", dob:"", age:"",
  aadhaarConsent:"PROVIDED", aadhaarNumber:"",
  gender:"", maritalStatus:"", religion:"", socialCategory:"", subCaste:"",
  residentialStatus:"", houseNo:"", street:"", village:"", mandal:"", district:"", state:"", pincode:"", durationAtAddress:"",
  // B
  adults:"0", childrenCount:"0", seniors:"0", familyStructure:"", familyMembers:[],
  // C
  mainOccupation:"", employmentNature:"", secondaryIncome:[], empChallenges:[],
  // D
  monthlyIncomeRange:"", annualIncome:"", bankAccount:"", liquidSavings:"", insuranceCoverage:[], householdDebt:{}, debtReasons:[],
  // E
  housingType:"", housingOwnership:"", agriLand:"", livestock:"", twoWheelers:"0", fourWheelers:"0", smartphones:"0",
  // F
  eduMembers:[], dropoutReasons:[],
  // G
  chronicConditions:[], disabilities:[], healthcareAccess:[], healthChallenges:[],
  // H
  currentSchemes:[], applicableSchemes:[], benefitsNotReceived:[], benefitsMostNeeded:[],
  // I
  hasSmartphone:"", digitalAbility:"",
  // J
  altContactName:"", altRelationship:"", altMobile:"", altOccupation:"", communityRole:[], willingToReceiveInfo:"", preferredComm:[],
  // K
  consentStatus:"", signatureName:"", consentDate:"", surveyorName:"", surveyorId:"", surveyLocation:"", additionalRemarks:"",
};

function App() {
  const [lang, setLang] = useState("en");
  const [current, setCurrent] = useState("A");
  const [visited, setVisited] = useState(new Set(["A"]));
  const [formData, setFormData] = useState(INIT);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState("");

  // Auto-calc age from DOB
  useEffect(() => {
    if (formData.dob) {
      const b = new Date(formData.dob);
      const now = new Date();
      let age = now.getFullYear() - b.getFullYear();
      if (now.getMonth() < b.getMonth() || (now.getMonth() === b.getMonth() && now.getDate() < b.getDate())) age--;
      if (age > 0) setFormData(f => ({ ...f, age: String(age) }));
    }
  }, [formData.dob]);

  const idx = SECTIONS.findIndex(s => s.key === current);
  const progress = Math.round((idx / (SECTIONS.length - 1)) * 100);
  const sectionMeta = SECTIONS[idx];

  function onChange(field, value) {
    setFormData(f => ({ ...f, [field]: value }));
  }

  function goTo(key) {
    setVisited(v => new Set([...v, key]));
    setCurrent(key);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function next() { if (idx < SECTIONS.length - 1) goTo(SECTIONS[idx + 1].key); }
  function prev() { if (idx > 0) goTo(SECTIONS[idx - 1].key); }

  async function handleSubmit() {
    setSubmitting(true);
    setSubmitError("");
    const payload = {
      ...formData,
      survey_language: lang,
      submitted_at: new Date().toISOString(),
      sections_visited: [...visited],
    };
    try {
      const res = await fetch("http://localhost:4000/api/surveys", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error(`Server ${res.status}`);
      setSubmitted(true);
    } catch {
      setSubmitError(JSON.stringify(payload, null, 2));
    } finally {
      setSubmitting(false);
    }
  }

  const SectionComp = SECTION_COMPS[current];

  return (
    <div style={{ minHeight:"100vh", background:C.bg, fontFamily:"'IBM Plex Sans', 'Noto Sans Telugu', sans-serif", color:C.text }}>

      {/* ══ STICKY HEADER ══════════════════════════════ */}
      <header style={{
        position:"sticky", top:0, zIndex:200,
        background:"rgba(14,17,23,0.97)",
        borderBottom:`1px solid ${C.border}`,
        backdropFilter:"blur(16px)",
        padding:"0 28px",
      }}>
        {/* Top row */}
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"16px 0 12px", gap:16, flexWrap:"wrap" }}>
          <div style={{ flex:1 }}>
            <h1 style={{ margin:0, fontSize:20, fontWeight:800, color:C.accent, letterSpacing:"0.01em" }}>
              📋 {lang==="en" ? "Household Welfare & Benefits Survey" : "గృహ సంక్షేమ & ప్రయోజనాల సర్వే"}
            </h1>
            <p style={{ margin:"3px 0 0", fontSize:11, color:C.textMuted, letterSpacing:"0.04em" }}>
              {lang==="en" ? "Welfare Access · Eligibility Mapping · Social Support Assessment" : "సంక్షేమ యాక్సెస్ · అర్హత మ్యాపింగ్ · సామాజిక మద్దతు అంచనా"}
            </p>
          </div>

          {/* Language toggle */}
          <div style={{ display:"flex", alignItems:"center", gap:8, fontSize:12, color:C.textMuted }}>
            <span>{lang==="en"?"Language:":"భాష:"}</span>
            {[["en","English"],["te","తెలుగు"]].map(([l,label])=>(
              <button key={l} onClick={()=>setLang(l)} style={{
                padding:"6px 16px", borderRadius:20,
                border:`1px solid ${lang===l ? C.accent : "rgba(255,255,255,0.15)"}`,
                background: lang===l ? C.accent : "transparent",
                color: lang===l ? C.bg : C.textMuted,
                cursor:"pointer", fontWeight: lang===l ? 800 : 400,
                fontSize:12, fontFamily:"inherit", transition:"all 0.2s",
              }}>{label}</button>
            ))}
          </div>
        </div>

        {/* Progress bar */}
        <div style={{ height:3, background:"rgba(255,255,255,0.07)", marginBottom:4 }}>
          <div style={{ height:"100%", width:`${progress}%`, background:`linear-gradient(90deg,${C.accent},#f59e0b)`, transition:"width 0.4s ease", borderRadius:2 }}/>
        </div>
        <div style={{ display:"flex", justifyContent:"space-between", fontSize:11, color:C.textMuted, paddingBottom:10 }}>
          <span>{lang==="en" ? sectionMeta.subtitle_en : sectionMeta.subtitle_te}</span>
          <span style={{ color:C.accent, fontWeight:700 }}>{idx+1} / {SECTIONS.length}</span>
        </div>

        {/* Section tabs */}
        <div style={{ display:"flex", gap:6, overflowX:"auto", paddingBottom:12, flexWrap:"wrap", scrollbarWidth:"none" }}>
          {SECTIONS.map(s => {
            const isActive = s.key === current;
            const isDone = visited.has(s.key) && !isActive;
            return (
              <button key={s.key} onClick={()=>goTo(s.key)} style={{
                padding:"5px 13px", borderRadius:20, whiteSpace:"nowrap",
                border:`1px solid ${isActive ? C.accent : isDone ? "rgba(251,191,36,0.35)" : "rgba(255,255,255,0.1)"}`,
                background: isActive ? C.accent : isDone ? "rgba(251,191,36,0.08)" : "transparent",
                color: isActive ? C.bg : isDone ? C.accent : C.textMuted,
                cursor:"pointer", fontSize:11, fontWeight: isActive ? 800 : isDone ? 600 : 400,
                fontFamily:"inherit", transition:"all 0.15s",
              }}>
                {isDone && !isActive ? "✓ " : ""}{lang==="en" ? s.en : s.te}
              </button>
            );
          })}
        </div>
      </header>

      {/* ══ BODY ═══════════════════════════════════════ */}
      <main style={{ maxWidth:960, margin:"0 auto", padding:"28px 24px 80px" }}>
        {current === "K" ? (
          <SectionComp
            data={formData} onChange={onChange} lang={lang}
            allData={formData}
            submitting={submitting} submitted={submitted}
            submitError={submitError} onSubmit={handleSubmit}
          />
        ) : (
          <SectionComp data={formData} onChange={onChange} lang={lang} />
        )}

        {/* ── NAV BUTTONS ───────────────────────────── */}
        <div style={{ display:"flex", justifyContent:"space-between", marginTop:28 }}>
          {/* Back — hidden on section A */}
          {current !== "A" ? (
            <button onClick={prev} style={{
              padding:"10px 26px", borderRadius:9,
              border:`1px solid rgba(255,255,255,0.15)`,
              background:"transparent", color:C.textMuted,
              cursor:"pointer", fontSize:13, fontWeight:500, fontFamily:"inherit",
              transition:"all 0.2s",
            }}
            onMouseEnter={e=>{e.currentTarget.style.borderColor=C.accent;e.currentTarget.style.color=C.accent;}}
            onMouseLeave={e=>{e.currentTarget.style.borderColor="rgba(255,255,255,0.15)";e.currentTarget.style.color=C.textMuted;}}
            >← {lang==="en"?"Back":"వెనక్కి"}</button>
          ) : <span/>}

          {/* Next — hidden on section K */}
          {current !== "K" && (
            <button onClick={next} style={{
              padding:"10px 28px", borderRadius:9,
              border:"none",
              background:`linear-gradient(135deg,${C.accent},#f59e0b)`,
              color:C.bg, cursor:"pointer", fontSize:13,
              fontWeight:800, fontFamily:"inherit",
              boxShadow:"0 4px 18px rgba(251,191,36,0.3)",
              transition:"all 0.2s",
            }}
            onMouseEnter={e=>e.currentTarget.style.transform="translateY(-1px)"}
            onMouseLeave={e=>e.currentTarget.style.transform="translateY(0)"}
            >{lang==="en"?"Next →":"తదుపరి →"}</button>
          )}
        </div>
      </main>
    </div>
  );
}



export default App;
