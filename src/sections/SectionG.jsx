import { C } from "../theme";
import { SectionCard, Field, CheckGroup, AddRowBtn, sanitizeNumeric } from "../components/UI";

// Name validation: only letters and spaces
function sanitizeName(val) {
  return (val || "").replace(/[^a-zA-Z\s]/g, "");
}

const TX = {
  en: {
    title: "Health & Disability",
    chronic: "Chronic Medical Conditions",
    cName:"NAME", cCondition:"CONDITION", cDuration:"DURATION", cTreatment:"TREATMENT", cMonthly:"MONTHLY ₹",
    treatOpts:[["Ongoing","Ongoing"],["Completed","Completed"],["None","Not started yet"]],
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
    treatOpts:[["Ongoing","కొనసాగుతోంది"],["Completed","పూర్తయింది"],["None","ఇంకా ప్రారంభించలేదు"]],
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

export default function SectionG({ data, onChange, lang, errors = {}, showErrors }) {
  const t = TX[lang];
  const up = (f, v) => onChange(f, v);

  const respondent = [data.firstName, data.middleName, data.lastName].filter(Boolean).join(" ").trim();
  const members = (data.familyMembers || []).map(m => m.name?.trim()).filter(Boolean);
  const memberNames = Array.from(new Set([respondent, ...members].filter(Boolean)));

  const conditions = data.chronicConditions || [emptyCondition()];
  const disabilities = data.disabilities || [emptyDisability()];

  function updateCond(idx, f, v) {
    up("chronicConditions", conditions.map((r, i) => {
      if (i === idx) {
        const updated = { ...r, [f]: v };
        if (updated.treatment === "None") {
          updated.monthly = "0";
        }
        return updated;
      }
      return r;
    }));
  }
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
          {conditions.map((row, idx) => {
            const nameErr = errors[`chronic_${idx}_name`];
            const condErr = errors[`chronic_${idx}_condition`];
            const durErr = errors[`chronic_${idx}_duration`];
            const treatErr = errors[`chronic_${idx}_treatment`];
            const monErr = errors[`chronic_${idx}_monthly`];

            return (
              <div key={idx} style={{ display:"grid", gridTemplateColumns:condCols.map(c=>c.w).join(" "), gap:8, padding:"8px 12px", borderTop:"1px solid rgba(255,255,255,0.04)", background:idx%2?"transparent":"rgba(255,255,255,0.01)", alignItems:"center" }}>
                <select value={row.name} onChange={e=>updateCond(idx,"name",e.target.value)}
                  title={nameErr && showErrors ? nameErr : ""}
                  data-invalid={nameErr && showErrors ? "true" : undefined}
                  style={{ ...selSt, border: `1px solid ${nameErr && showErrors ? C.red : "rgba(255,255,255,0.07)"}` }}>
                  <option value="" style={{background:C.bgCard}}>-- Select --</option>
                  {memberNames.map(name => (
                    <option key={name} value={name} style={{background:C.bgCard}}>{name}</option>
                  ))}
                </select>
                <input value={row.condition} onChange={e=>updateCond(idx,"condition",sanitizeName(e.target.value))} placeholder="e.g. Diabetes"
                  title={condErr && showErrors ? condErr : ""}
                  data-invalid={condErr && showErrors ? "true" : undefined}
                  style={{ ...inputSt, border: `1px solid ${condErr && showErrors ? C.red : "rgba(255,255,255,0.07)"}` }} />
                <input value={row.duration} onChange={e=>updateCond(idx,"duration",e.target.value)} placeholder="e.g. 2 years"
                  title={durErr && showErrors ? durErr : ""}
                  data-invalid={durErr && showErrors ? "true" : undefined}
                  style={{ ...inputSt, border: `1px solid ${durErr && showErrors ? C.red : "rgba(255,255,255,0.07)"}` }} />
                <select value={row.treatment} onChange={e=>updateCond(idx,"treatment",e.target.value)}
                  title={treatErr && showErrors ? treatErr : ""}
                  data-invalid={treatErr && showErrors ? "true" : undefined}
                  style={{ ...selSt, border: `1px solid ${treatErr && showErrors ? C.red : "rgba(255,255,255,0.08)"}` }}>
                  {t.treatOpts.map(([v,l])=><option key={v} value={v} style={{background:C.bgCard}}>{l}</option>)}
                </select>
                <input value={row.monthly} onChange={e=>updateCond(idx,"monthly",sanitizeNumeric(e.target.value))} type="text" inputMode="numeric" pattern="[0-9]*"
                  disabled={row.treatment === "None"}
                  title={monErr && showErrors ? monErr : ""}
                  data-invalid={monErr && showErrors ? "true" : undefined}
                  style={{
                    ...inputSt,
                    border: `1px solid ${monErr && showErrors ? C.red : "rgba(255,255,255,0.07)"}`,
                    opacity: row.treatment === "None" ? 0.4 : 1,
                    cursor: row.treatment === "None" ? "not-allowed" : "text"
                  }} />
                <button onClick={()=>removeCond(idx)} style={{background:"none",border:"none",color:C.red,cursor:"pointer",fontSize:15,padding:0}}>✕</button>
              </div>
            );
          })}
        </div>
        <AddRowBtn onClick={addCond} label={t.addCondition}/>
      </div>

      {/* Disabilities table */}
      <div>
        <div style={{ fontSize:11, fontWeight:700, letterSpacing:"0.1em", color:C.textLabel, textTransform:"uppercase", marginBottom:10 }}>{t.disabilities}</div>
        <div style={{ border:`1px solid ${C.border}`, borderRadius:10, overflow:"hidden" }}>
          {buildHeader(disCols, C)}
          {disabilities.map((row, idx) => {
            const nameErr = errors[`disability_${idx}_name`];
            const typeErr = errors[`disability_${idx}_type`];
            const perErr = errors[`disability_${idx}_percent`];
            const certErr = errors[`disability_${idx}_cert`];

            return (
              <div key={idx} style={{ display:"grid", gridTemplateColumns:disCols.map(c=>c.w).join(" "), gap:8, padding:"8px 12px", borderTop:"1px solid rgba(255,255,255,0.04)", background:idx%2?"transparent":"rgba(255,255,255,0.01)", alignItems:"center" }}>
                <select value={row.name} onChange={e=>updateDis(idx,"name",e.target.value)}
                  title={nameErr && showErrors ? nameErr : ""}
                  data-invalid={nameErr && showErrors ? "true" : undefined}
                  style={{ ...selSt, border: `1px solid ${nameErr && showErrors ? C.red : "rgba(255,255,255,0.07)"}` }}>
                  <option value="" style={{background:C.bgCard}}>-- Select --</option>
                  {memberNames.map(name => (
                    <option key={name} value={name} style={{background:C.bgCard}}>{name}</option>
                  ))}
                </select>
                <input value={row.type} onChange={e=>updateDis(idx,"type",sanitizeName(e.target.value))} placeholder="e.g. Visual"
                  title={typeErr && showErrors ? typeErr : ""}
                  data-invalid={typeErr && showErrors ? "true" : undefined}
                  style={{ ...inputSt, border: `1px solid ${typeErr && showErrors ? C.red : "rgba(255,255,255,0.07)"}` }} />
                <input value={row.percent} onChange={e=>updateDis(idx,"percent",sanitizeNumeric(e.target.value))} type="text" inputMode="numeric" pattern="[0-9]*"
                  title={perErr && showErrors ? perErr : ""}
                  data-invalid={perErr && showErrors ? "true" : undefined}
                  style={{ ...inputSt, border: `1px solid ${perErr && showErrors ? C.red : "rgba(255,255,255,0.07)"}` }} />
                <select value={row.certificate} onChange={e=>updateDis(idx,"certificate",e.target.value)}
                  title={certErr && showErrors ? certErr : ""}
                  data-invalid={certErr && showErrors ? "true" : undefined}
                  style={{ ...selSt, border: `1px solid ${certErr && showErrors ? C.red : "rgba(255,255,255,0.08)"}` }}>
                  {t.certOpts.map(([v,l])=><option key={v} value={v} style={{background:C.bgCard}}>{l}</option>)}
                </select>
                <button onClick={()=>removeDis(idx)} style={{background:"none",border:"none",color:C.red,cursor:"pointer",fontSize:15,padding:0}}>✕</button>
              </div>
            );
          })}
        </div>
        <AddRowBtn onClick={addDis} label={t.addDisability}/>
      </div>

      {/* Access + challenges */}
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:32 }}>
        <Field label={t.healthAccess} required error={showErrors ? errors.healthcareAccess : undefined}>
          <CheckGroup field="healthcareAccess" value={data.healthcareAccess} options={t.accessOpts} onChange={up}/>
        </Field>
        <Field label={t.challenges} required error={showErrors ? errors.healthChallenges : undefined}>
          <CheckGroup field="healthChallenges" value={data.healthChallenges} options={t.chalOpts} onChange={up}/>
        </Field>
      </div>
    </SectionCard>
  );
}
