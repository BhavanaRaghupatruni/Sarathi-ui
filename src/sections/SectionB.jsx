import { C } from "../theme";
import {
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

export default function SectionB({ data, onChange, lang }) {
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
