import { C } from "../theme";
import { SectionCard, Field, CheckGroup, AddRowBtn } from "../components/UI";

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

export default function SectionF({ data, onChange, lang }) {
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
