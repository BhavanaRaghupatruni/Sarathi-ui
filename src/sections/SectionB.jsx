import { useEffect } from "react";
import { C } from "../theme";
import {
  SectionCard, Field, Grid, TextInput, RadioGroup, AddRowBtn, sanitizeNumeric,
} from "../components/UI";

// Name validation: only letters and spaces, auto-capitalizing first letter of each word
function sanitizeName(val) {
  const cleaned = (val || "").replace(/[^a-zA-Z\s]/g, "");
  return cleaned.replace(/\b\w/g, c => c.toUpperCase());
}

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

const RELATION_OPTIONS = {
  NUCLEAR: [
    ["Self", "Self"],
    ["Spouse", "Spouse"],
    ["Son", "Son"],
    ["Daughter", "Daughter"],
    ["Other", "Other"]
  ],
  JOINT: [
    ["Self", "Self"],
    ["Spouse", "Spouse"],
    ["Son", "Son"],
    ["Daughter", "Daughter"],
    ["Father", "Father"],
    ["Mother", "Mother"],
    ["Brother", "Brother"],
    ["Sister", "Sister"],
    ["Grandfather", "Grandfather"],
    ["Grandmother", "Grandmother"],
    ["Uncle", "Uncle"],
    ["Aunt", "Aunt"],
    ["Cousin", "Cousin"],
    ["Father-in-law", "Father-in-law"],
    ["Mother-in-law", "Mother-in-law"],
    ["Son-in-law", "Son-in-law"],
    ["Daughter-in-law", "Daughter-in-law"],
    ["Other", "Other"]
  ],
  SINGLE_PARENT: [
    ["Self", "Self"],
    ["Son", "Son"],
    ["Daughter", "Daughter"],
    ["Father", "Father"],
    ["Mother", "Mother"],
    ["Other", "Other"]
  ],
  ELDERLY_ONLY: [
    ["Self", "Self"],
    ["Spouse", "Spouse"],
    ["Brother", "Brother"],
    ["Sister", "Sister"],
    ["Other", "Other"]
  ],
  DEFAULT: [
    ["Self", "Self"],
    ["Spouse", "Spouse"],
    ["Son", "Son"],
    ["Daughter", "Daughter"],
    ["Father", "Father"],
    ["Mother", "Mother"],
    ["Brother", "Brother"],
    ["Sister", "Sister"],
    ["Grandfather", "Grandfather"],
    ["Grandmother", "Grandmother"],
    ["Grandson", "Grandson"],
    ["Granddaughter", "Granddaughter"],
    ["Uncle", "Uncle"],
    ["Aunt", "Aunt"],
    ["Nephew", "Nephew"],
    ["Niece", "Niece"],
    ["Cousin", "Cousin"],
    ["Father-in-law", "Father-in-law"],
    ["Mother-in-law", "Mother-in-law"],
    ["Son-in-law", "Son-in-law"],
    ["Daughter-in-law", "Daughter-in-law"],
    ["Other", "Other"]
  ]
};

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

export default function SectionB({ data, onChange, lang, errors = {}, showErrors }) {
  const t = TX[lang];
  const up = (f, v) => onChange(f, v);

  const expectedMembers = Number(data.adults || 0) + Number(data.childrenCount || 0) + Number(data.seniors || 0);
  const members = data.familyMembers || [];
  const displayMembers = members.slice(0, expectedMembers);

  useEffect(() => {
    if (members.length > expectedMembers) {
      up("familyMembers", members.slice(0, expectedMembers));
    }
  }, [expectedMembers, members.length, up]);

  function updateMember(idx, field, val) {
    const next = members.map((m, i) => i === idx ? { ...m, [field]: val } : m);
    up("familyMembers", next);
  }

  function addMember() {
    if (members.length < expectedMembers) {
      up("familyMembers", [...members, emptyMember()]);
    }
  }
  function removeMember(idx) { up("familyMembers", members.filter((_, i) => i !== idx)); }

  return (
    <SectionCard icon="🏡" title={t.title}>
      {/* Counts */}
      <Grid cols={3}>
        <Field label={t.adults} error={errors.adults}>
          <TextInput value={data.adults || "0"} onChange={v => up("adults", v)} type="number" min="0" placeholder="0" error={!!errors.adults} />
        </Field>
        <Field label={t.children} error={errors.childrenCount}>
          <TextInput value={data.childrenCount || "0"} onChange={v => up("childrenCount", v)} type="number" min="0" placeholder="0" error={!!errors.childrenCount} />
        </Field>
        <Field label={t.seniors} error={errors.seniors}>
          <TextInput value={data.seniors || "0"} onChange={v => up("seniors", v)} type="number" min="0" placeholder="0" error={!!errors.seniors} />
        </Field>
      </Grid>

      {/* Family Structure */}
      <Field label={t.familyStructure} required error={showErrors ? errors.familyStructure : undefined}>
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
        {errors.familyMembers && (
          <div style={{ color: C.red, fontSize: 12, marginBottom: 8, padding: "10px", background: "rgba(248, 113, 113, 0.1)", borderRadius: 6, border: `1px solid ${C.red}` }}>{errors.familyMembers}</div>
        )}
        <div
          data-invalid={errors.familyMembers ? "true" : undefined}
          style={{ border: `1px solid ${C.border}`, borderRadius: 10, overflow: "hidden" }}>
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
          {displayMembers.map((m, idx) => {
            const nameErr = errors[`member_${idx}_name`];
            const relationErr = errors[`member_${idx}_relation`];
            const ageErr = errors[`member_${idx}_age`];
            const genderErr = errors[`member_${idx}_gender`];
            const eduErr = errors[`member_${idx}_education`];
            const empErr = errors[`member_${idx}_employment`];
            const incErr = errors[`member_${idx}_income`];

            return (
              <div key={idx} style={{
                borderTop: `1px solid rgba(255,255,255,0.04)`,
                background: idx % 2 === 0 ? "rgba(255,255,255,0.01)" : "transparent",
              }}>
                <div style={{
                  display: "grid", gridTemplateColumns: colTemplate,
                  padding: "8px 12px", gap: 6, alignItems: "center",
                }}>
                  <input value={m.name} onChange={e => updateMember(idx, "name", sanitizeName(e.target.value))} placeholder="Name"
                    title={nameErr && showErrors ? nameErr : ""}
                    data-invalid={nameErr && showErrors ? "true" : undefined}
                    style={{
                      background: "rgba(255,255,255,0.05)",
                      border: `1px solid ${nameErr && showErrors ? C.red : "rgba(255,255,255,0.08)"}`,
                      borderRadius: 6, padding: "5px 8px", color: C.text, fontSize: 12, outline: "none", width: "100%", boxSizing: "border-box", fontFamily: "inherit"
                    }} />
                  <select value={m.relation} onChange={e => updateMember(idx, "relation", e.target.value)}
                    title={relationErr && showErrors ? relationErr : ""}
                    data-invalid={relationErr && showErrors ? "true" : undefined}
                    style={{
                      background: C.bgInput,
                      border: `1px solid ${relationErr && showErrors ? C.red : "rgba(255,255,255,0.08)"}`,
                      borderRadius: 6, padding: "5px 6px", color: C.text, fontSize: 12, outline: "none", width: "100%", fontFamily: "inherit"
                    }}>
                    <option value="" style={{ background: C.bgCard }}>-- Select --</option>
                    {(RELATION_OPTIONS[data.familyStructure] || RELATION_OPTIONS.DEFAULT).map(([v, l]) => (
                      <option key={v} value={v} style={{ background: C.bgCard }}>{l}</option>
                    ))}
                  </select>
                  <input value={m.age} onChange={e => updateMember(idx, "age", sanitizeNumeric(e.target.value))} type="text" inputMode="numeric" pattern="[0-9]*"
                    title={ageErr && showErrors ? ageErr : ""}
                    data-invalid={ageErr && showErrors ? "true" : undefined}
                    style={{
                      background: "rgba(255,255,255,0.05)",
                      border: `1px solid ${ageErr && showErrors ? C.red : "rgba(255,255,255,0.08)"}`,
                      borderRadius: 6, padding: "5px 8px", color: C.text, fontSize: 12, outline: "none", width: "100%", boxSizing: "border-box", fontFamily: "inherit"
                    }} />
                  <select value={m.gender} onChange={e => updateMember(idx, "gender", e.target.value)}
                    title={genderErr && showErrors ? genderErr : ""}
                    data-invalid={genderErr && showErrors ? "true" : undefined}
                    style={{
                      background: C.bgInput,
                      border: `1px solid ${genderErr && showErrors ? C.red : "rgba(255,255,255,0.08)"}`,
                      borderRadius: 6, padding: "5px 6px", color: C.text, fontSize: 12, outline: "none", width: "100%", fontFamily: "inherit"
                    }}>
                    {[["--", "--"], ["M", "M"], ["F", "F"], ["O", "O"]].map(([v, l]) => <option key={v} value={v} style={{ background: C.bgCard }}>{l}</option>)}
                  </select>
                  
                  {/* Dropdown for Education Qualification */}
                  <select value={m.education} onChange={e => updateMember(idx, "education", e.target.value)}
                    title={eduErr && showErrors ? eduErr : ""}
                    data-invalid={eduErr && showErrors ? "true" : undefined}
                    style={{
                      background: C.bgInput,
                      border: `1px solid ${eduErr && showErrors ? C.red : "rgba(255,255,255,0.08)"}`,
                      borderRadius: 6, padding: "5px 6px", color: C.text, fontSize: 12, outline: "none", width: "100%", fontFamily: "inherit"
                    }}>
                    {[
                      ["", "--"],
                      ["Matriculation", "Matriculation"],
                      ["Intermediate", "Intermediate"],
                      ["UG", "UG"],
                      ["PG", "PG"],
                      ["PhD", "PhD"],
                      ["Illiterate", "Illiterate"]
                    ].map(([v, l]) => <option key={v} value={v} style={{ background: C.bgCard }}>{l}</option>)}
                  </select>

                  <input value={m.employment} onChange={e => updateMember(idx, "employment", e.target.value)} placeholder="Occupation"
                    title={empErr && showErrors ? empErr : ""}
                    data-invalid={empErr && showErrors ? "true" : undefined}
                    style={{
                      background: "rgba(255,255,255,0.05)",
                      border: `1px solid ${empErr && showErrors ? C.red : "rgba(255,255,255,0.08)"}`,
                      borderRadius: 6, padding: "5px 8px", color: C.text, fontSize: 12, outline: "none", width: "100%", boxSizing: "border-box", fontFamily: "inherit"
                    }} />
                  <input value={m.income} onChange={e => updateMember(idx, "income", sanitizeNumeric(e.target.value))} type="text" inputMode="numeric" pattern="[0-9]*"
                    title={incErr && showErrors ? incErr : ""}
                    data-invalid={incErr && showErrors ? "true" : undefined}
                    style={{
                      background: "rgba(255,255,255,0.05)",
                      border: `1px solid ${incErr && showErrors ? C.red : "rgba(255,255,255,0.08)"}`,
                      borderRadius: 6, padding: "5px 8px", color: C.text, fontSize: 12, outline: "none", width: "100%", boxSizing: "border-box", fontFamily: "inherit"
                    }} />
                  <select value={m.disability} onChange={e => updateMember(idx, "disability", e.target.value)}
                    style={{ background: C.bgInput, border: "1px solid rgba(255,255,255,0.08)", borderRadius: 6, padding: "5px 6px", color: C.text, fontSize: 12, outline: "none", width: "100%", fontFamily: "inherit" }}>
                    {[["No", "No"], ["Yes", "Yes"]].map(([v, l]) => <option key={v} value={v} style={{ background: C.bgCard }}>{l}</option>)}
                  </select>
                  <input value={m.illness} onChange={e => updateMember(idx, "illness", e.target.value)} placeholder="Condition"
                    style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 6, padding: "5px 8px", color: C.text, fontSize: 12, outline: "none", width: "100%", boxSizing: "border-box", fontFamily: "inherit" }} />
                  <button onClick={() => removeMember(idx)} style={{ background: "none", border: "none", color: C.red, cursor: "pointer", fontSize: 15, padding: 0, lineHeight: 1 }}>✕</button>
                </div>
                {showErrors && (nameErr || relationErr || ageErr || genderErr || eduErr || empErr || incErr) && (
                  <div style={{
                    padding: "0px 12px 8px 12px",
                    display: "flex",
                    flexDirection: "column",
                    gap: 4,
                  }}>
                    {nameErr && <div style={{ color: C.red, fontSize: 11, fontWeight: 500 }}>• {nameErr}</div>}
                    {relationErr && <div style={{ color: C.red, fontSize: 11, fontWeight: 500 }}>• {relationErr}</div>}
                    {ageErr && <div style={{ color: C.red, fontSize: 11, fontWeight: 500 }}>• {ageErr}</div>}
                    {genderErr && <div style={{ color: C.red, fontSize: 11, fontWeight: 500 }}>• {genderErr}</div>}
                    {eduErr && <div style={{ color: C.red, fontSize: 11, fontWeight: 500 }}>• {eduErr}</div>}
                    {empErr && <div style={{ color: C.red, fontSize: 11, fontWeight: 500 }}>• {empErr}</div>}
                    {incErr && <div style={{ color: C.red, fontSize: 11, fontWeight: 500 }}>• {incErr}</div>}
                  </div>
                )}
              </div>
            );
          })}
        </div>
        {members.length < expectedMembers ? (
          <AddRowBtn onClick={addMember} label={t.addMember} />
        ) : (
          <div style={{ marginTop: 10, fontSize: 12, color: C.textLabel }}>
            {expectedMembers > 0 ? `Maximum ${expectedMembers} family member detail rows reached.` : "Set family member counts to add details."}
          </div>
        )}
      </div>
    </SectionCard>
  );
}
