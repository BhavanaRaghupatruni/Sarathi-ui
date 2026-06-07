import { useState, useEffect } from "react";
import { C } from "./theme";
import SectionA from "./sections/SectionA";
import SectionB from "./sections/SectionB";
import SectionC from "./sections/SectionC";
import SectionD from "./sections/SectionD";
import SectionE from "./sections/SectionE";
import SectionF from "./sections/SectionF";
import SectionG from "./sections/SectionG";
import SectionH from "./sections/SectionH";
import SectionI from "./sections/SectionI";
import SectionJ from "./sections/SectionJ";
import SectionK from "./sections/SectionK";

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

export default function App() {
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
