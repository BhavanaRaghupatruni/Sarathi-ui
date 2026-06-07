import { C } from "../theme";
import { SectionCard, Field, CheckGroup, AddRowBtn } from "../components/UI";

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

export default function SectionG({ data, onChange, lang }) {
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
