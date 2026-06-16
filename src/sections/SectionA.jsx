import { useRef } from "react";
import { C } from "../theme";
import {
  SectionCard, Field, Grid, TextInput, RadioGroup,
} from "../components/UI";

// Name validation: only letters and spaces, auto-capitalizing first letter of each word
function sanitizeName(val) {
  const cleaned = (val || "").replace(/[^a-zA-Z\s]/g, "");
  return cleaned.replace(/\b\w/g, c => c.toUpperCase());
}

// ── Translations ────────────────────────────────────────
const TX = {
  en: {
    respTitle: "Respondent Identification",
    addrTitle: "Address & Residency",
    firstName: "First Name", middleName: "Middle Name", lastName: "Last Name",
    mobile: "Primary Mobile", altMobile: "Alternate Mobile", dob: "Date of Birth",
    age: "Age (Years)", consent: "Aadhaar Consent", provided: "Provided",
    notProvided: "Not Provided", aadhaar: "Aadhaar Number",
    gender: "Gender", male: "Male", female: "Female", trans: "Transgender", other: "Other",
    marital: "Marital Status", single: "Single", married: "Married", widowed: "Widowed",
    divorced: "Divorced", separated: "Separated",
    religion: "Religion", hindu: "Hindu", muslim: "Muslim", christian: "Christian",
    sikh: "Sikh", buddhist: "Buddhist", jain: "Jain",
    category: "Social Category / Caste", subCaste: "Sub-Caste / Community",
    // Address
    residentialStatus: "Residential Status",
    ownHouse: "Own House", rented: "Rented", govtHousing: "Government Housing",
    tempShelter: "Temporary Shelter", homeless: "Homeless",
    houseNo: "House No.", street: "Street", village: "Village / Town",
    mandal: "Mandal", district: "District", state: "State", pincode: "Pin Code",
    duration: "Duration at Address", less1: "Less than 1 Year",
    one5: "1–5 Years", more5: "More than 5 Years",
  },
  te: {
    respTitle: "అభ్యర్థి గుర్తింపు",
    addrTitle: "చిరునామా & నివాసం",
    firstName: "మొదటి పేరు", middleName: "మధ్య పేరు", lastName: "చివరి పేరు",
    mobile: "ప్రాథమిక మొబైల్", altMobile: "ప్రత్యామ్నాయ మొబైల్", dob: "పుట్టిన తేదీ",
    age: "వయస్సు (సం.)", consent: "ఆధార్ సమ్మతి", provided: "అందించారు",
    notProvided: "అందించలేదు", aadhaar: "ఆధార్ నంబర్",
    gender: "లింగం", male: "పురుషుడు", female: "స్త్రీ", trans: "తృతీయ లింగం", other: "ఇతర",
    marital: "వైవాహిక స్థితి", single: "ఒంటరి", married: "వివాహితుడు", widowed: "విధవ",
    divorced: "విడాకులు", separated: "వేరుగా",
    religion: "మతం", hindu: "హిందూ", muslim: "ముస్లిం", christian: "క్రైస్తవ",
    sikh: "సిక్కు", buddhist: "బౌద్ధ", jain: "జైన",
    category: "సామాజిక వర్గం / కులం", subCaste: "ఉప-కులం / సమాజం",
    residentialStatus: "నివాస స్థితి",
    ownHouse: "స్వంత ఇల్లు", rented: "అద్దె", govtHousing: "ప్రభుత్వ గృహం",
    tempShelter: "తాత్కాలిక ఆశ్రయం", homeless: "నివాసం లేదు",
    houseNo: "ఇంటి నం.", street: "వీధి", village: "గ్రామం / పట్టణం",
    mandal: "మండలం", district: "జిల్లా", state: "రాష్ట్రం", pincode: "పిన్‌కోడ్",
    duration: "చిరునామాలో నివాసం", less1: "1 సంవత్సరం కంటే తక్కువ",
    one5: "1–5 సంవత్సరాలు", more5: "5 సంవత్సరాల కంటే ఎక్కువ",
  },
};

export default function SectionA({ data, onChange, lang, errors = {}, showErrors, touched = {}, markTouched }) {
  const t = TX[lang];
  const up = (f, v) => onChange(f, v);
  const dobRef = useRef(null);

  const isAadhaarRequired = data.aadhaarConsent === "PROVIDED";

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      {/* ── Respondent Identification ────────────────── */}
      <SectionCard icon="👤" title={t.respTitle}>
        <Grid cols={3}>
          <Field label={t.firstName} required error={showErrors ? errors.firstName : undefined}>
            <TextInput value={data.firstName} onChange={v => up("firstName", sanitizeName(v))} placeholder="First name" error={!!errors.firstName && showErrors} />
          </Field>
          <Field label={t.middleName} optional error={showErrors ? errors.middleName : undefined}>
            <TextInput value={data.middleName} onChange={v => up("middleName", sanitizeName(v))} error={!!errors.middleName && showErrors} />
          </Field>
          <Field label={t.lastName} required error={showErrors ? errors.lastName : undefined}>
            <TextInput value={data.lastName} onChange={v => up("lastName", sanitizeName(v))} error={!!errors.lastName && showErrors} />
          </Field>
        </Grid>

        <Grid cols={3}>
          <Field label={t.mobile} required error={(showErrors || touched.primaryMobile) ? errors.primaryMobile : undefined}>
            <TextInput
              value={data.primaryMobile}
              onChange={v => { up("primaryMobile", v); if (markTouched) markTouched("primaryMobile"); }}
              onBlur={() => { if (markTouched) markTouched("primaryMobile"); }}
              placeholder="10-digit number"
              error={!!errors.primaryMobile && (showErrors || touched.primaryMobile)}
            />
          </Field>
          <Field label={t.altMobile} optional error={(showErrors || touched.alternateMobile) ? errors.alternateMobile : undefined}>
            <TextInput
              value={data.alternateMobile}
              onChange={v => { up("alternateMobile", v); if (markTouched) markTouched("alternateMobile"); }}
              onBlur={() => { if (markTouched) markTouched("alternateMobile"); }}
              placeholder="10-digit number"
              error={!!errors.alternateMobile && (showErrors || touched.alternateMobile)}
            />
          </Field>
          <Field label={t.dob} required error={showErrors ? errors.dob : undefined}>
            <div style={{ display: "flex", gap: 8, alignItems: "center", width: "100%" }}>
              <TextInput inputRef={dobRef} value={data.dob} onChange={v => up("dob", v)} type="date" error={!!errors.dob && showErrors} style={{ flex: 1 }} />
              <button
                type="button"
                onClick={() => dobRef.current && dobRef.current.showPicker && dobRef.current.showPicker()}
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
        </Grid>

        <Grid cols={3}>
          <Field label={t.age}>
            <TextInput value={data.age} onChange={v => up("age", v)} type="number" min="0" />
          </Field>
          <Field label={t.consent}>
            <RadioGroup field="aadhaarConsent" value={data.aadhaarConsent}
              options={[["PROVIDED", t.provided], ["NOT_PROVIDED", t.notProvided]]}
              onChange={up} />
          </Field>
          <Field label={t.aadhaar} required={isAadhaarRequired} optional={!isAadhaarRequired} error={(showErrors || touched.aadhaarNumber) ? errors.aadhaarNumber : undefined}>
            <TextInput
              value={data.aadhaarNumber}
              onChange={v => { up("aadhaarNumber", v); if (markTouched) markTouched("aadhaarNumber"); }}
              onBlur={() => { if (markTouched) markTouched("aadhaarNumber"); }}
              disabled={!isAadhaarRequired}
              placeholder={isAadhaarRequired ? "12-digit number" : "Disabled"}
              error={!!errors.aadhaarNumber && (showErrors || touched.aadhaarNumber)}
            />
          </Field>
        </Grid>

        <Field label={t.gender} required error={showErrors ? errors.gender : undefined}>
          <RadioGroup field="gender" value={data.gender}
            options={[["MALE", t.male], ["FEMALE", t.female], ["TRANSGENDER", t.trans], ["OTHER", t.other]]}
            onChange={up} />
        </Field>

        <Grid cols={2} gap={24}>
          <Field label={t.marital} required error={showErrors ? errors.maritalStatus : undefined}>
            <RadioGroup field="maritalStatus" value={data.maritalStatus}
              options={[["SINGLE", t.single], ["MARRIED", t.married], ["WIDOWED", t.widowed], ["DIVORCED", t.divorced], ["SEPARATED", t.separated]]}
              onChange={up} />
          </Field>
          <Field label={t.religion} required error={showErrors ? errors.religion : undefined}>
            <RadioGroup field="religion" value={data.religion}
              options={[["HINDU", t.hindu], ["MUSLIM", t.muslim], ["CHRISTIAN", t.christian], ["SIKH", t.sikh], ["BUDDHIST", t.buddhist], ["JAIN", t.jain], ["OTHER", t.other]]}
              onChange={up} />
          </Field>
        </Grid>

        <Field label={t.category} required error={showErrors ? errors.socialCategory : undefined}>
          <RadioGroup field="socialCategory" value={data.socialCategory}
            options={[["SC","SC"],["ST","ST"],["BC","BC"],["EWS","EWS"],["OC_GENERAL","OC / General"],["MINORITY","Minority"],["OTHER",t.other]]}
            onChange={up} />
        </Field>

        <Field label={t.subCaste} optional>
          <TextInput value={data.subCaste} onChange={v => up("subCaste", v)} style={{ maxWidth: 360 }} />
        </Field>
      </SectionCard>

      {/* ── Address & Residency ─────────────────────── */}
      <SectionCard icon="📍" title={t.addrTitle}>
        <Field label={t.residentialStatus} required error={showErrors ? errors.residentialStatus : undefined}>
          <RadioGroup field="residentialStatus" value={data.residentialStatus}
            options={[
              ["OWN_HOUSE", t.ownHouse], ["RENTED", t.rented],
              ["GOVT_HOUSING", t.govtHousing], ["TEMP_SHELTER", t.tempShelter],
              ["HOMELESS", t.homeless], ["OTHER", t.other],
            ]}
            onChange={up} />
        </Field>

        <Grid cols={3}>
          <Field label={t.houseNo}>
            <TextInput value={data.houseNo} onChange={v => up("houseNo", v)} />
          </Field>
          <Field label={t.street} style={{ gridColumn: "span 2" }}>
            <TextInput value={data.street} onChange={v => up("street", v)} />
          </Field>
        </Grid>

        <Grid cols={3}>
          <Field label={t.village} required error={showErrors ? errors.village : undefined}>
            <TextInput value={data.village} onChange={v => up("village", v)} error={!!errors.village && showErrors} />
          </Field>
          <Field label={t.mandal}>
            <TextInput value={data.mandal} onChange={v => up("mandal", v)} />
          </Field>
          <Field label={t.district} required error={showErrors ? errors.district : undefined}>
            <TextInput value={data.district} onChange={v => up("district", v)} error={!!errors.district && showErrors} />
          </Field>
        </Grid>

        <Grid cols={3}>
          <Field label={t.state} required error={showErrors ? errors.state : undefined}>
            <TextInput value={data.state} onChange={v => up("state", v)} error={!!errors.state && showErrors} />
          </Field>
          <Field label={t.pincode} optional error={showErrors ? errors.pincode : undefined}>
            <TextInput value={data.pincode} onChange={v => up("pincode", v)} placeholder="6-digit pincode" error={!!errors.pincode && showErrors} />
          </Field>
        </Grid>

        <Field label={t.duration}>
          <RadioGroup field="durationAtAddress" value={data.durationAtAddress}
            options={[["LESS_1", t.less1], ["ONE_5", t.one5], ["MORE_5", t.more5]]}
            onChange={up} />
        </Field>
      </SectionCard>
    </div>
  );
}
