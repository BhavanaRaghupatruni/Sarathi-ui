import { C } from "../theme";
import { SectionCard, Field, Grid, TextInput, RadioGroup } from "../components/UI";

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

export default function SectionE({ data, onChange, lang }) {
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
