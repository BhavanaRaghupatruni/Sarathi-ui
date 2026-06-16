import { C } from "../theme";
import { useRef } from "react";
import { SectionCard, Field, Grid, TextInput, RadioGroup } from "../components/UI";

// Name validation: only letters and spaces, auto-capitalizing first letter of each word
function sanitizeName(val) {
  const cleaned = (val || "").replace(/[^a-zA-Z\s]/g, "");
  return cleaned.replace(/\b\w/g, c => c.toUpperCase());
}

const TX = {
  en: {
    title: "Consent Declaration",
    consentEn: "I voluntarily provide the above information for welfare assessment, eligibility mapping, social support facilitation and awareness purposes.",
    consentTe: "నేను సంక్షేమ మదింపు, అర్హత మ్యాపింగ్ మరియు సామాజిక మద్దతు సహాయం కోసం పై సమాచారాన్ని స్వచ్ఛందంగా అందిస్తున్నాను.",
    iAgree: "I Agree – Consent Given",
    declined: "Declined",
    signature: "Signature / Full Name",
    date: "Date",
    surveyorName: "Surveyor Name",
    surveyorId: "Surveyor ID",
    surveyLocation: "Survey Location (Village/Town)",
    remarks: "Additional Remarks",
    submit: "✓ Submit Survey",
    submitting: "Submitting...",
    submitted: "Survey submitted successfully.",
    submittedMsg: "Thank you. Your response has been recorded successfully.",
    demoNote: "Demo mode – JSON payload that would be sent to PostgreSQL:",
  },
  te: {
    title: "అంగీకార ప్రకటన",
    consentEn: "I voluntarily provide the above information for welfare assessment, eligibility mapping, social support facilitation and awareness purposes.",
    consentTe: "నేను సంక్షేమ మదింపు, అర్హత మ్యాపింగ్ మరియు సామాజిక మద్దతు సహాయం కోసం పై సమాచారాన్ని స్వచ్ఛందంగా అందిస్తున్నాను.",
    iAgree: "నేను అంగీకరిస్తున్నాను",
    declined: "తిరస్కరించారు",
    signature: "సంతకం / పూర్తి పేరు",
    date: "తేదీ",
    surveyorName: "సర్వేయర్ పేరు",
    surveyorId: "సర్వేయర్ ID",
    surveyLocation: "సర్వే స్థలం (గ్రామం/పట్టణం)",
    remarks: "అదనపు వ్యాఖ్యలు",
    submit: "✓ సర్వే సమర్పించండి",
    submitting: "సమర్పిస్తోంది...",
    submitted: "సర్వే విజయవంతంగా సమర్పించబడింది.",
    submittedMsg: "ధన్యవాదాలు. మీ ప్రతిస్పందన విజయవంతంగా నమోదైంది.",
    demoNote: "డెమో మోడ్ – PostgreSQL కి పంపబడే JSON:",
  },
};

export default function SectionK({ data, onChange, lang, allData, submitting, submitted, submitError, onSubmit, errors = {}, showErrors, allSectionsValid, onPreview }) {
  const t = TX[lang];
  const up = (f, v) => onChange(f, v);
  const consentRef = useRef(null);

  if (submitted) {
    return (
      <SectionCard icon="✅" title={t.title}>
        <div style={{ textAlign:"center", padding:"48px 0" }}>
          <div style={{ fontSize:56, marginBottom:16 }}>🎉</div>
          <h3 style={{ color:C.green, fontSize:22, fontWeight:800, margin:"0 0 10px" }}>{t.submitted}</h3>
          <p style={{ color:C.textMuted, fontSize:14, margin:0 }}>{t.submittedMsg}</p>
        </div>
      </SectionCard>
    );
  }

  return (
    <SectionCard icon="✅" title={t.title}>
      {/* Bilingual consent box */}
      <div style={{
        padding:"20px 22px",
        background:"rgba(251,191,36,0.05)",
        border:`1px solid rgba(251,191,36,0.2)`,
        borderRadius:10,
        lineHeight:1.7,
      }}>
        <p style={{ margin:"0 0 12px", fontSize:13, color:C.text }}>
          <strong style={{ color:C.accent }}>English: </strong>{t.consentEn}
        </p>
        <p style={{ margin:0, fontSize:13, color:C.text }}>
          <strong style={{ color:C.accent }}>తెలుగు: </strong>{t.consentTe}
        </p>
      </div>

      {/* Agree / Declined */}
      <Field label="" required error={showErrors ? errors.consentStatus : undefined}>
        <RadioGroup
          field="consentStatus"
          value={data.consentStatus}
          options={[["AGREED", t.iAgree], ["DECLINED", t.declined]]}
          onChange={up}
        />
      </Field>

      {/* Surveyor fields */}
      <Grid cols={3}>
        <Field label={t.signature} required error={showErrors ? errors.signatureName : undefined}>
          <TextInput value={data.signatureName||""} onChange={v=>up("signatureName",sanitizeName(v))} error={!!errors.signatureName && showErrors}/>
        </Field>
        <Field label={t.date} required error={showErrors ? errors.consentDate : undefined}>
          <div style={{ display: "flex", gap: 8, alignItems: "center", width: "100%" }}>
            <TextInput inputRef={consentRef} value={data.consentDate||""} onChange={v=>up("consentDate",v)} type="date" error={!!errors.consentDate && showErrors} style={{ flex: 1 }} />
            <button
              type="button"
              onClick={() => consentRef.current && consentRef.current.showPicker && consentRef.current.showPicker()}
              style={{
                background: "rgba(255, 255, 255, 0.05)",
                border: `1px solid ${C.border}`,
                borderRadius: 8,
                padding: "10px",
                cursor: "pointer",
                fontSize: 16,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                height: "42px",
                width: "42px",
                boxSizing: "border-box",
                transition: "all 0.2s",
              }}
              onMouseEnter={e => e.currentTarget.style.borderColor = C.accent}
              onMouseLeave={e => e.currentTarget.style.borderColor = C.border}
            >
              📅
            </button>
          </div>
        </Field>
        <Field label={t.surveyorName} required error={showErrors ? errors.surveyorName : undefined}>
          <TextInput value={data.surveyorName||""} onChange={v=>up("surveyorName",sanitizeName(v))} error={!!errors.surveyorName && showErrors}/>
        </Field>
      </Grid>

      <Grid cols={2}>
        <Field label={t.surveyorId} required error={showErrors ? errors.surveyorId : undefined}>
          <TextInput value={data.surveyorId||""} onChange={v=>up("surveyorId",v)} error={!!errors.surveyorId && showErrors}/>
        </Field>
        <Field label={t.surveyLocation} required error={showErrors ? errors.surveyLocation : undefined}>
          <TextInput value={data.surveyLocation||""} onChange={v=>up("surveyLocation",v)} error={!!errors.surveyLocation && showErrors}/>
        </Field>
      </Grid>

      <Field label={t.remarks} optional>
        <textarea
          value={data.additionalRemarks||""}
          onChange={e=>up("additionalRemarks",e.target.value)}
          rows={4}
          style={{
            background:"rgba(255,255,255,0.05)", border:`1px solid ${C.border}`,
            borderRadius:8, padding:"10px 14px", color:C.text, fontSize:13,
            outline:"none", width:"100%", boxSizing:"border-box",
            fontFamily:"inherit", resize:"vertical",
          }}
        />
      </Field>

      {/* Action buttons (Preview & Submit) */}
      <div style={{ display:"flex", justifyContent:"flex-end", gap:12, flexWrap:"wrap" }}>
        <button
          type="button"
          onClick={onPreview}
          style={{
            padding:"14px 28px", borderRadius:10,
            border:`1px solid ${C.accent}`,
            background:"transparent", color:C.accent,
            cursor:"pointer", fontWeight:800, fontSize:15, fontFamily:"inherit",
            transition:"all 0.2s",
          }}
          onMouseEnter={e=>e.currentTarget.style.background=C.accentDim}
          onMouseLeave={e=>e.currentTarget.style.background="transparent"}
        >
          {lang === "en" ? "👁 Preview Details" : "👁 వివరాల ప్రివ్యూ"}
        </button>
        <button
          onClick={onSubmit}
          disabled={submitting || data.consentStatus !== "AGREED" || !allSectionsValid}
          style={{
            padding:"14px 40px", borderRadius:10, border:"none",
            background: submitting || data.consentStatus !== "AGREED" || !allSectionsValid
              ? "rgba(251,191,36,0.2)"
              : "linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)",
            color: submitting || data.consentStatus !== "AGREED" || !allSectionsValid ? C.textMuted : "#0e1117",
            cursor: submitting || data.consentStatus !== "AGREED" || !allSectionsValid ? "not-allowed" : "pointer",
            fontWeight:800, fontSize:15, fontFamily:"inherit",
            transition:"all 0.2s",
            boxShadow: data.consentStatus === "AGREED" && !submitting && allSectionsValid ? "0 4px 20px rgba(251,191,36,0.35)" : "none",
          }}
        >
          {submitting ? t.submitting : t.submit}
        </button>
      </div>

      {/* Demo JSON output */}
      {submitError && (
        <div>
          <p style={{ color:C.accent, fontSize:11, margin:"0 0 6px" }}>{t.demoNote}</p>
          <pre style={{
            background:"rgba(0,0,0,0.4)", border:`1px solid rgba(251,191,36,0.15)`,
            borderRadius:8, padding:14, fontSize:11, color:"#86efac",
            overflowX:"auto", maxHeight:280, margin:0,
          }}>{submitError}</pre>
        </div>
      )}
    </SectionCard>
  );
}
