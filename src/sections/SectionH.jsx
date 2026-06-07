import { C } from "../theme";
import { SectionCard, Field, CheckGroup, AddRowBtn } from "../components/UI";

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

export default function SectionH({ data, onChange, lang }) {
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
