import { C } from "../theme";
import { SectionCard, Field, Grid, TextInput, RadioGroup, CheckGroup, sanitizeNumeric } from "../components/UI";

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

export default function SectionD({ data, onChange, lang, errors = {}, showErrors }) {
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

  const isSavingsEnabled = data.bankAccount === "YES";
  
  let hasDebt = false;
  debtKeys.forEach(k => {
    if (Number(debt[k]?.amount || 0) > 0) hasDebt = true;
  });

  return (
    <SectionCard icon="₹" title={t.title}>
      {/* Monthly income range */}
      <Field label={t.monthlyIncome} required error={showErrors ? errors.monthlyIncomeRange : undefined}>
        <RadioGroup field="monthlyIncomeRange" value={data.monthlyIncomeRange} options={t.incOpts} onChange={up} />
      </Field>

      {/* Annual income + bank + savings */}
      <Grid cols={3} gap={24} style={{ alignItems: "start" }}>
        <Field label={t.annualIncome} required error={showErrors ? errors.annualIncome : undefined}>
          <TextInput value={data.annualIncome || "0"} onChange={v => up("annualIncome", v)} type="number" min="0" placeholder="0" error={!!errors.annualIncome && showErrors} />
        </Field>
        <Field label={t.bankAccount} required error={showErrors ? errors.bankAccount : undefined}>
          <RadioGroup field="bankAccount" value={data.bankAccount}
            options={[["YES", t.yes], ["NO", t.no]]} onChange={up} />
        </Field>
        <Field label={t.liquidSavings} required={isSavingsEnabled} optional={!isSavingsEnabled} error={showErrors && isSavingsEnabled ? errors.liquidSavings : undefined}>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {t.savingsOpts.map(([v, l]) => {
              const active = data.liquidSavings === v;
              return (
                <button
                  key={v}
                  disabled={!isSavingsEnabled}
                  onClick={() => isSavingsEnabled && up("liquidSavings", v)}
                  style={{
                    display: "flex", alignItems: "center", gap: 8,
                    padding: "8px 14px", borderRadius: 8,
                    border: `1px solid ${active ? C.accent : "rgba(255,255,255,0.08)"}`,
                    background: active ? C.accentDim : "rgba(255,255,255,0.02)",
                    color: active ? (isSavingsEnabled ? C.accent : C.textMuted) : C.textMuted,
                    cursor: isSavingsEnabled ? "pointer" : "not-allowed",
                    fontSize: 12, fontWeight: active ? 700 : 400,
                    textAlign: "left", fontFamily: "inherit",
                    opacity: isSavingsEnabled ? 1 : 0.4,
                  }}
                >
                  <span style={{
                    width: 9, height: 9, borderRadius: "50%",
                    border: `2px solid ${active ? C.accent : "#475569"}`,
                    background: active ? C.accent : "transparent", flexShrink: 0
                  }} />
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
              <input value={debt[key]?.amount || "0"} onChange={e => updateDebt(key, "amount", sanitizeNumeric(e.target.value))} type="text" inputMode="numeric" pattern="[0-9]*" style={cellStyle} />
              <input value={debt[key]?.interest || ""} onChange={e => updateDebt(key, "interest", e.target.value)} placeholder="%" style={cellStyle} />
              <input value={debt[key]?.purpose || ""} onChange={e => updateDebt(key, "purpose", e.target.value)} style={cellStyle} />
              <input value={debt[key]?.emi || "0"} onChange={e => updateDebt(key, "emi", sanitizeNumeric(e.target.value))} type="text" inputMode="numeric" pattern="[0-9]*" style={cellStyle} />
            </div>
          ))}
        </div>
      </div>

      {/* Debt reason */}
      <Field label={t.debtReason} required={hasDebt} optional={!hasDebt} error={showErrors && hasDebt ? errors.debtReasons : undefined}>
        <CheckGroup field="debtReasons" value={data.debtReasons} options={t.debtOpts} onChange={up} disabled={!hasDebt} />
      </Field>
    </SectionCard>
  );
}
