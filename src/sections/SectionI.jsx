import { C } from "../theme";
import { SectionCard, Field, RadioGroup } from "../components/UI";

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

export default function SectionI({ data, onChange, lang }) {
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
