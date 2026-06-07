import { useState, useEffect } from "react";

// ─── TRANSLATIONS ──────────────────────────────────────────────────────────────
const T = {
  en: {
    appTitle: "Household Welfare & Benefits Survey",
    appSubtitle: "Welfare Access · Eligibility Mapping · Social Support Assessment",
    language: "Language:",
    sections: {
      A: "A. Identity",
      B: "B. Household",
      C: "C. Employment",
      D: "D. Income",
      E: "E. Assets",
      F: "F. Education",
      G: "G. Health",
      H: "H. Welfare",
      I: "I. Documents",
      J: "J. Community",
      K: "K. Consent",
    },
    sectionTitles: {
      A: "Respondent Identification",
      B: "Household Details",
      C: "Employment Information",
      D: "Income Details",
      E: "Assets & Property",
      F: "Education Details",
      G: "Health Information",
      H: "Welfare & Benefits",
      I: "Documents",
      J: "Community Information",
      K: "Consent & Declaration",
    },
    fields: {
      firstName: "First Name",
      middleName: "Middle Name",
      lastName: "Last Name",
      primaryMobile: "Primary Mobile",
      alternateMobile: "Alternate Mobile",
      dob: "Date of Birth",
      age: "Age (Years)",
      aadhaarConsent: "Aadhaar Consent",
      provided: "Provided",
      notProvided: "Not Provided",
      aadhaarNumber: "Aadhaar Number",
      gender: "Gender",
      male: "Male",
      female: "Female",
      transgender: "Transgender",
      other: "Other",
      maritalStatus: "Marital Status",
      single: "Single",
      married: "Married",
      widowed: "Widowed",
      divorced: "Divorced",
      separated: "Separated",
      religion: "Religion",
      hindu: "Hindu",
      muslim: "Muslim",
      christian: "Christian",
      sikh: "Sikh",
      buddhist: "Buddhist",
      jain: "Jain",
      socialCategory: "Social Category / Caste",
      subCaste: "Sub-Caste / Community",
      optional: "optional",
      required: "required",
      // Household
      householdSize: "Household Size",
      houseType: "House Type",
      ownedRented: "Owned",
      rented: "Rented",
      govtAllotted: "Govt. Allotted",
      homeless: "Homeless",
      rationCardType: "Ration Card Type",
      apl: "APL",
      bpl: "BPL",
      anthyodaya: "Anthyodaya",
      none: "None",
      address: "Residential Address",
      district: "District",
      mandal: "Mandal",
      village: "Village / Ward",
      pincode: "Pincode",
      // Employment
      employmentStatus: "Employment Status",
      employed: "Employed",
      selfEmployed: "Self-Employed",
      unemployed: "Unemployed",
      student: "Student",
      homemaker: "Homemaker",
      retired: "Retired",
      occupation: "Occupation",
      employer: "Employer / Organization",
      workLocation: "Work Location",
      // Income
      monthlyIncome: "Monthly Income (₹)",
      annualIncome: "Annual Income (₹)",
      incomeSource: "Primary Income Source",
      agriculture: "Agriculture",
      labour: "Daily Labour",
      salary: "Salary/Wages",
      business: "Business",
      pension: "Pension",
      // Assets
      landOwned: "Land Owned (Acres)",
      landType: "Land Type",
      agricultural: "Agricultural",
      residential: "Residential",
      commercial: "Commercial",
      vehicleOwned: "Vehicle Owned",
      twoWheeler: "Two-Wheeler",
      fourWheeler: "Four-Wheeler",
      noVehicle: "No Vehicle",
      // Education
      educationLevel: "Education Level",
      illiterate: "Illiterate",
      primary: "Primary (1-5)",
      secondary: "Secondary (6-10)",
      higherSecondary: "Higher Secondary (11-12)",
      graduate: "Graduate",
      postGraduate: "Post Graduate",
      // Health
      chronicIllness: "Chronic Illness",
      yes: "Yes",
      no: "No",
      illnessType: "Illness Type",
      disability: "Disability",
      disabilityType: "Disability Type",
      healthInsurance: "Health Insurance",
      insuranceProvider: "Insurance Provider",
      // Welfare
      existingSchemes: "Existing Welfare Schemes",
      pmay: "PMAY Housing",
      pmjay: "PM-JAY / Aarogyasri",
      kisan: "PM-KISAN",
      mgnregs: "MGNREGS",
      pension2: "Social Security Pension",
      midday: "Mid-Day Meal",
      // Documents
      voterIdAvailable: "Voter ID Available",
      panCard: "PAN Card Available",
      bankAccount: "Bank Account",
      bankName: "Bank Name",
      ifsc: "IFSC Code",
      accountNumber: "Account Number",
      // Community
      selfHelpGroup: "Self-Help Group Member",
      groupName: "Group Name",
      panchayat: "Gram Panchayat",
      mlaConstituency: "MLA Constituency",
      mpConstituency: "MP Constituency",
      // Consent
      consentText: "I hereby declare that the information provided is true and correct to the best of my knowledge. I consent to this data being used for welfare eligibility assessment.",
      consentAgree: "I Agree to the above declaration",
      surveyor: "Surveyor Name",
      surveyDate: "Survey Date",
      surveyorId: "Surveyor ID",
      submit: "Submit Survey",
      submitting: "Submitting...",
      placeholder10digit: "10-digit number",
      placeholderFirstName: "First name",
    },
  },
  te: {
    appTitle: "గృహ సంక్షేమ & ప్రయోజనాల సర్వే",
    appSubtitle: "సంక్షేమ యాక్సెస్ · అర్హత మ్యాపింగ్ · సామాజిక మద్దతు అంచనా",
    language: "భాష:",
    sections: {
      A: "A. గుర్తింపు",
      B: "B. గృహం",
      C: "C. ఉపాధి",
      D: "D. ఆదాయం",
      E: "E. ఆస్తులు",
      F: "F. విద్య",
      G: "G. ఆరోగ్యం",
      H: "H. సంక్షేమం",
      I: "I. పత్రాలు",
      J: "J. సమాజం",
      K: "K. అంగీకారం",
    },
    sectionTitles: {
      A: "అభ్యర్థి గుర్తింపు",
      B: "గృహ వివరాలు",
      C: "ఉపాధి సమాచారం",
      D: "ఆదాయ వివరాలు",
      E: "ఆస్తులు & ఆస్తి",
      F: "విద్యా వివరాలు",
      G: "ఆరోగ్య సమాచారం",
      H: "సంక్షేమం & ప్రయోజనాలు",
      I: "పత్రాలు",
      J: "సమాజ సమాచారం",
      K: "అంగీకారం & ప్రకటన",
    },
    fields: {
      firstName: "మొదటి పేరు",
      middleName: "మధ్య పేరు",
      lastName: "చివరి పేరు",
      primaryMobile: "ప్రాథమిక మొబైల్",
      alternateMobile: "ప్రత్యామ్నాయ మొబైల్",
      dob: "పుట్టిన తేదీ",
      age: "వయస్సు (సంవత్సరాలు)",
      aadhaarConsent: "ఆధార్ సమ్మతి",
      provided: "అందించారు",
      notProvided: "అందించలేదు",
      aadhaarNumber: "ఆధార్ నంబర్",
      gender: "లింగం",
      male: "పురుషుడు",
      female: "స్త్రీ",
      transgender: "తృతీయ లింగం",
      other: "ఇతర",
      maritalStatus: "వైవాహిక స్థితి",
      single: "indiv",
      married: "వివాహితుడు",
      widowed: "విధవ",
      divorced: "విడాకులు",
      separated: "వేరుగా",
      religion: "మతం",
      hindu: "హిందూ",
      muslim: "ముస్లిం",
      christian: "క్రైస్తవ",
      sikh: "సిక్కు",
      buddhist: "బౌద్ధ",
      jain: "జైన",
      socialCategory: "సామాజిక వర్గం / కులం",
      subCaste: "ఉప-కులం / సమాజం",
      optional: "ఐచ్ఛికం",
      required: "అవసరం",
      householdSize: "గృహ పరిమాణం",
      houseType: "ఇంటి రకం",
      ownedRented: "స్వంతం",
      rented: "అద్దె",
      govtAllotted: "ప్రభుత్వం కేటాయించింది",
      homeless: "నివాసం లేదు",
      rationCardType: "రేషన్ కార్డు రకం",
      apl: "APL",
      bpl: "BPL",
      anthyodaya: "అంత్యోదయ",
      none: "లేదు",
      address: "నివాస చిరునామా",
      district: "జిల్లా",
      mandal: "మండలం",
      village: "గ్రామం / వార్డ్",
      pincode: "పిన్‌కోడ్",
      employmentStatus: "ఉపాధి స్థితి",
      employed: "ఉద్యోగం",
      selfEmployed: "స్వయం ఉపాధి",
      unemployed: "నిరుద్యోగి",
      student: "విద్యార్థి",
      homemaker: "గృహిణి",
      retired: "పదవీ విరమణ",
      occupation: "వృత్తి",
      employer: "యజమాని / సంస్థ",
      workLocation: "పని స్థలం",
      monthlyIncome: "నెలవారీ ఆదాయం (₹)",
      annualIncome: "వార్షిక ఆదాయం (₹)",
      incomeSource: "ప్రాథమిక ఆదాయ వనరు",
      agriculture: "వ్యవసాయం",
      labour: "రోజువారీ కూలీ",
      salary: "జీతం/వేతనాలు",
      business: "వ్యాపారం",
      pension: "పెన్షన్",
      landOwned: "స్వంత భూమి (ఎకరాలు)",
      landType: "భూమి రకం",
      agricultural: "వ్యవసాయ",
      residential: "నివాస",
      commercial: "వాణిజ్య",
      vehicleOwned: "వాహనం",
      twoWheeler: "రెండు చక్రాల వాహనం",
      fourWheeler: "నాలుగు చక్రాల వాహనం",
      noVehicle: "వాహనం లేదు",
      educationLevel: "విద్యా స్థాయి",
      illiterate: "నిరక్షరాస్యుడు",
      primary: "ప్రాథమిక (1-5)",
      secondary: "మాధ్యమిక (6-10)",
      higherSecondary: "ఉన్నత మాధ్యమిక (11-12)",
      graduate: "పట్టభద్రుడు",
      postGraduate: "స్నాతకోత్తర",
      chronicIllness: "దీర్ఘకాలిక అనారోగ్యం",
      yes: "అవును",
      no: "కాదు",
      illnessType: "అనారోగ్య రకం",
      disability: "వికలాంగత",
      disabilityType: "వికలాంగత రకం",
      healthInsurance: "ఆరోగ్య బీమా",
      insuranceProvider: "బీమా ప్రదాత",
      existingSchemes: "ప్రస్తుత సంక్షేమ పథకాలు",
      pmay: "PMAY గృహం",
      pmjay: "PM-JAY / ఆరోగ్యశ్రీ",
      kisan: "PM-KISAN",
      mgnregs: "MGNREGS",
      pension2: "సామాజిక భద్రత పెన్షన్",
      midday: "మధ్యాహ్న భోజనం",
      voterIdAvailable: "ఓటరు ID అందుబాటులో ఉంది",
      panCard: "PAN కార్డు అందుబాటులో ఉంది",
      bankAccount: "బ్యాంకు ఖాతా",
      bankName: "బ్యాంకు పేరు",
      ifsc: "IFSC కోడ్",
      accountNumber: "ఖాతా నంబర్",
      selfHelpGroup: "స్వయం సహాయక బృందం సభ్యుడు",
      groupName: "బృందం పేరు",
      panchayat: "గ్రామ పంచాయతీ",
      mlaConstituency: "MLA నియోజకవర్గం",
      mpConstituency: "MP నియోజకవర్గం",
      consentText: "ఇందు ద్వారా నేను అందించిన సమాచారం నా అత్యుత్తమ జ్ఞానం మేరకు సత్యం మరియు సరైనది అని ప్రకటిస్తున్నాను. సంక్షేమ అర్హత అంచనా కోసం ఈ డేటాను ఉపయోగించడానికి నేను అంగీకరిస్తున్నాను.",
      consentAgree: "పై ప్రకటనకు నేను అంగీకరిస్తున్నాను",
      surveyor: "సర్వేయర్ పేరు",
      surveyDate: "సర్వే తేదీ",
      surveyorId: "సర్వేయర్ ID",
      submit: "సర్వే సమర్పించండి",
      submitting: "సమర్పిస్తోంది...",
      placeholder10digit: "10-అంకెల నంబర్",
      placeholderFirstName: "మొదటి పేరు",
    },
  },
};

const SECTION_KEYS = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K"];

// ─── INITIAL FORM STATE ────────────────────────────────────────────────────────
const initialFormData = {
  // A - Identity
  firstName: "", middleName: "", lastName: "",
  primaryMobile: "", alternateMobile: "",
  dob: "", age: "",
  aadhaarConsent: "PROVIDED", aadhaarNumber: "",
  gender: "", maritalStatus: "", religion: "",
  socialCategory: "", subCaste: "",
  // B - Household
  householdSize: "", houseType: "",
  rationCardType: "", address: "",
  district: "", mandal: "", village: "", pincode: "",
  // C - Employment
  employmentStatus: "", occupation: "", employer: "", workLocation: "",
  // D - Income
  monthlyIncome: "", annualIncome: "", incomeSource: "",
  // E - Assets
  landOwned: "", landType: "", vehicleOwned: "",
  // F - Education
  educationLevel: "",
  // G - Health
  chronicIllness: "", illnessType: "", disability: "", disabilityType: "", healthInsurance: "", insuranceProvider: "",
  // H - Welfare
  existingSchemes: [],
  // I - Documents
  voterIdAvailable: "", panCard: "", bankAccount: "", bankName: "", ifsc: "", accountNumber: "",
  // J - Community
  selfHelpGroup: "", groupName: "", panchayat: "", mlaConstituency: "", mpConstituency: "",
  // K - Consent
  consentAgree: false, surveyor: "", surveyDate: "", surveyorId: "",
};

// ─── MAIN COMPONENT ────────────────────────────────────────────────────────────
export default function HouseholdWelfareSurvey() {
  const [lang, setLang] = useState("en");
  const [currentSection, setCurrentSection] = useState("A");
  const [formData, setFormData] = useState(initialFormData);
  const [completedSections, setCompletedSections] = useState(new Set());
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const t = T[lang];
  const sectionIndex = SECTION_KEYS.indexOf(currentSection);
  const progress = ((sectionIndex) / (SECTION_KEYS.length - 1)) * 100;

  // Auto-calculate age from DOB
  useEffect(() => {
    if (formData.dob) {
      const birth = new Date(formData.dob);
      const today = new Date();
      let age = today.getFullYear() - birth.getFullYear();
      const m = today.getMonth() - birth.getMonth();
      if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
      setFormData(f => ({ ...f, age: age > 0 ? String(age) : "" }));
    }
  }, [formData.dob]);

  function update(field, value) {
    setFormData(f => ({ ...f, [field]: value }));
  }

  function toggleScheme(scheme) {
    setFormData(f => {
      const s = f.existingSchemes.includes(scheme)
        ? f.existingSchemes.filter(x => x !== scheme)
        : [...f.existingSchemes, scheme];
      return { ...f, existingSchemes: s };
    });
  }

  function goToSection(key) {
    setCompletedSections(s => new Set([...s, currentSection]));
    setCurrentSection(key);
  }

  function nextSection() {
    const idx = SECTION_KEYS.indexOf(currentSection);
    if (idx < SECTION_KEYS.length - 1) {
      goToSection(SECTION_KEYS[idx + 1]);
    }
  }

  function prevSection() {
    const idx = SECTION_KEYS.indexOf(currentSection);
    if (idx > 0) setCurrentSection(SECTION_KEYS[idx - 1]);
  }

  async function handleSubmit() {
    setSubmitting(true);
    setSubmitError("");
    const payload = {
      ...formData,
      survey_language: lang,
      submitted_at: new Date().toISOString(),
      section_completion: [...completedSections],
    };
    try {
      // Replace with your actual backend URL
      const res = await fetch("http://localhost:4000/api/surveys", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error(`Server error: ${res.status}`);
      setSubmitted(true);
    } catch (err) {
      // For demo: show the JSON that would be sent
      setSubmitError(JSON.stringify(payload, null, 2));
    } finally {
      setSubmitting(false);
    }
  }

  // ─── STYLES ──────────────────────────────────────────────────────────────────
  const styles = {
    root: {
      minHeight: "100vh",
      background: "linear-gradient(135deg, #0d1117 0%, #0f1923 50%, #0a1628 100%)",
      fontFamily: "'Noto Sans', 'Noto Sans Telugu', sans-serif",
      color: "#e2e8f0",
      padding: "0 0 60px",
    },
    header: {
      background: "rgba(15,25,40,0.95)",
      borderBottom: "1px solid rgba(0,255,120,0.15)",
      padding: "20px 24px 0",
      position: "sticky",
      top: 0,
      zIndex: 100,
      backdropFilter: "blur(12px)",
    },
    topRow: {
      display: "flex",
      alignItems: "flex-start",
      justifyContent: "space-between",
      flexWrap: "wrap",
      gap: 12,
      marginBottom: 12,
    },
    titleGroup: { flex: 1 },
    appTitle: {
      fontSize: 22,
      fontWeight: 700,
      color: "#00e676",
      margin: 0,
      display: "flex",
      alignItems: "center",
      gap: 8,
    },
    appSubtitle: {
      fontSize: 12,
      color: "#64748b",
      margin: "4px 0 0",
    },
    langToggle: {
      display: "flex",
      alignItems: "center",
      gap: 8,
      fontSize: 13,
      color: "#94a3b8",
    },
    langBtn: (active) => ({
      padding: "6px 16px",
      borderRadius: 20,
      border: active ? "none" : "1px solid rgba(0,230,118,0.4)",
      background: active ? "#00e676" : "transparent",
      color: active ? "#0d1117" : "#00e676",
      cursor: "pointer",
      fontWeight: active ? 700 : 500,
      fontSize: 13,
      transition: "all 0.2s",
    }),
    progressBar: {
      height: 3,
      background: "rgba(255,255,255,0.08)",
      marginTop: 8,
    },
    progressFill: {
      height: "100%",
      background: "linear-gradient(90deg, #00e676, #00bcd4)",
      transition: "width 0.4s ease",
      width: `${progress}%`,
    },
    progressLabel: {
      display: "flex",
      justifyContent: "space-between",
      fontSize: 11,
      color: "#475569",
      padding: "4px 0 8px",
    },
    sectionNav: {
      display: "flex",
      gap: 6,
      overflowX: "auto",
      padding: "10px 0 0",
      scrollbarWidth: "none",
      flexWrap: "wrap",
    },
    sectionBtn: (active, completed) => ({
      padding: "5px 12px",
      borderRadius: 20,
      border: `1px solid ${active ? "#00e676" : completed ? "rgba(0,230,118,0.4)" : "rgba(255,255,255,0.12)"}`,
      background: active ? "#00e676" : completed ? "rgba(0,230,118,0.1)" : "transparent",
      color: active ? "#0d1117" : completed ? "#00e676" : "#64748b",
      cursor: "pointer",
      fontSize: 12,
      fontWeight: active ? 700 : 400,
      whiteSpace: "nowrap",
      transition: "all 0.2s",
    }),
    body: {
      maxWidth: 900,
      margin: "0 auto",
      padding: "24px 20px",
    },
    card: {
      background: "rgba(15,25,40,0.7)",
      border: "1px solid rgba(0,230,118,0.1)",
      borderRadius: 12,
      padding: "28px 28px",
      backdropFilter: "blur(8px)",
    },
    sectionHeader: {
      display: "flex",
      alignItems: "center",
      gap: 10,
      marginBottom: 28,
      paddingBottom: 16,
      borderBottom: "1px solid rgba(0,230,118,0.1)",
    },
    sectionIcon: {
      width: 32,
      height: 32,
      borderRadius: 8,
      background: "rgba(0,230,118,0.15)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontSize: 16,
    },
    sectionTitle: {
      fontSize: 17,
      fontWeight: 600,
      color: "#00e676",
      margin: 0,
    },
    grid2: {
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      gap: "20px 24px",
    },
    grid3: {
      display: "grid",
      gridTemplateColumns: "1fr 1fr 1fr",
      gap: "20px 24px",
    },
    fieldGroup: {
      display: "flex",
      flexDirection: "column",
      gap: 6,
    },
    label: {
      fontSize: 11,
      fontWeight: 600,
      letterSpacing: "0.06em",
      color: "#94a3b8",
      textTransform: "uppercase",
    },
    req: { color: "#f87171", marginLeft: 2 },
    opt: { color: "#64748b", fontSize: 10, fontWeight: 400, letterSpacing: 0, textTransform: "none", marginLeft: 4 },
    input: {
      background: "rgba(255,255,255,0.05)",
      border: "1px solid rgba(255,255,255,0.1)",
      borderRadius: 8,
      padding: "10px 12px",
      color: "#e2e8f0",
      fontSize: 14,
      outline: "none",
      width: "100%",
      boxSizing: "border-box",
      transition: "border-color 0.2s",
    },
    radioGroup: {
      display: "flex",
      flexWrap: "wrap",
      gap: 8,
    },
    radioBtn: (active) => ({
      display: "flex",
      alignItems: "center",
      gap: 6,
      padding: "7px 14px",
      borderRadius: 20,
      border: `1px solid ${active ? "#00e676" : "rgba(255,255,255,0.12)"}`,
      background: active ? "rgba(0,230,118,0.12)" : "transparent",
      color: active ? "#00e676" : "#94a3b8",
      cursor: "pointer",
      fontSize: 12,
      fontWeight: active ? 600 : 400,
      transition: "all 0.15s",
      userSelect: "none",
    }),
    radioDot: (active) => ({
      width: 10,
      height: 10,
      borderRadius: "50%",
      border: `2px solid ${active ? "#00e676" : "#475569"}`,
      background: active ? "#00e676" : "transparent",
      flexShrink: 0,
      transition: "all 0.15s",
    }),
    checkBtn: (active) => ({
      display: "flex",
      alignItems: "center",
      gap: 6,
      padding: "7px 14px",
      borderRadius: 8,
      border: `1px solid ${active ? "#00e676" : "rgba(255,255,255,0.12)"}`,
      background: active ? "rgba(0,230,118,0.12)" : "transparent",
      color: active ? "#00e676" : "#94a3b8",
      cursor: "pointer",
      fontSize: 12,
      fontWeight: active ? 600 : 400,
      transition: "all 0.15s",
      userSelect: "none",
    }),
    spacer: { height: 20 },
    navRow: {
      display: "flex",
      justifyContent: "space-between",
      marginTop: 32,
      paddingTop: 20,
      borderTop: "1px solid rgba(255,255,255,0.06)",
    },
    navBtn: (variant) => ({
      padding: "10px 24px",
      borderRadius: 8,
      border: variant === "primary" ? "none" : "1px solid rgba(255,255,255,0.15)",
      background: variant === "primary" ? "#00e676" : "transparent",
      color: variant === "primary" ? "#0d1117" : "#94a3b8",
      cursor: "pointer",
      fontWeight: variant === "primary" ? 700 : 400,
      fontSize: 14,
      transition: "all 0.2s",
    }),
    submitBtn: {
      padding: "12px 36px",
      borderRadius: 8,
      border: "none",
      background: submitting ? "#1a3a2a" : "linear-gradient(90deg, #00e676, #00bcd4)",
      color: submitting ? "#64748b" : "#0d1117",
      cursor: submitting ? "not-allowed" : "pointer",
      fontWeight: 700,
      fontSize: 15,
      transition: "all 0.2s",
    },
    successCard: {
      textAlign: "center",
      padding: "60px 40px",
      background: "rgba(0,230,118,0.05)",
      border: "1px solid rgba(0,230,118,0.2)",
      borderRadius: 12,
    },
    errorBox: {
      marginTop: 20,
      padding: 16,
      background: "rgba(15,25,15,0.9)",
      border: "1px solid rgba(0,230,118,0.2)",
      borderRadius: 8,
      fontSize: 11,
      color: "#00e676",
      whiteSpace: "pre-wrap",
      maxHeight: 300,
      overflowY: "auto",
      fontFamily: "monospace",
    },
    consentBox: {
      padding: 16,
      background: "rgba(0,230,118,0.04)",
      border: "1px solid rgba(0,230,118,0.15)",
      borderRadius: 8,
      fontSize: 13,
      color: "#94a3b8",
      lineHeight: 1.6,
      marginBottom: 16,
    },
  };

  // ─── INPUT HELPERS ───────────────────────────────────────────────────────────
  function Field({ label, required, optional, children, fullWidth }) {
    return (
      <div style={fullWidth ? { ...styles.fieldGroup, gridColumn: "1 / -1" } : styles.fieldGroup}>
        <label style={styles.label}>
          {label}
          {required && <span style={styles.req}>*</span>}
          {optional && <span style={styles.opt}>({t.fields.optional})</span>}
        </label>
        {children}
      </div>
    );
  }

  function TextInput({ field, placeholder, type = "text", optional }) {
    return (
      <input
        type={type}
        value={formData[field]}
        onChange={e => update(field, e.target.value)}
        placeholder={placeholder || ""}
        style={styles.input}
        onFocus={e => { e.target.style.borderColor = "rgba(0,230,118,0.5)"; }}
        onBlur={e => { e.target.style.borderColor = "rgba(255,255,255,0.1)"; }}
      />
    );
  }

  function Radio({ field, value, label }) {
    const active = formData[field] === value;
    return (
      <div style={styles.radioBtn(active)} onClick={() => update(field, value)}>
        <div style={styles.radioDot(active)} />
        {label}
      </div>
    );
  }

  function Checkbox({ scheme, label }) {
    const active = formData.existingSchemes.includes(scheme);
    return (
      <div style={styles.checkBtn(active)} onClick={() => toggleScheme(scheme)}>
        <div style={{
          width: 10, height: 10, borderRadius: 2,
          border: `2px solid ${active ? "#00e676" : "#475569"}`,
          background: active ? "#00e676" : "transparent",
          flexShrink: 0,
        }} />
        {label}
      </div>
    );
  }

  const f = t.fields;

  // ─── SECTION RENDERERS ───────────────────────────────────────────────────────
  function renderA() {
    return (
      <>
        <div style={styles.grid3}>
          <Field label={f.firstName} required><TextInput field="firstName" placeholder={f.placeholderFirstName} /></Field>
          <Field label={f.middleName} optional><TextInput field="middleName" /></Field>
          <Field label={f.lastName} required><TextInput field="lastName" /></Field>
        </div>
        <div style={styles.spacer} />
        <div style={styles.grid3}>
          <Field label={f.primaryMobile} required><TextInput field="primaryMobile" placeholder={f.placeholder10digit} /></Field>
          <Field label={f.alternateMobile} optional><TextInput field="alternateMobile" /></Field>
          <Field label={f.dob} required><TextInput field="dob" type="date" /></Field>
        </div>
        <div style={styles.spacer} />
        <div style={styles.grid3}>
          <Field label={f.age}><TextInput field="age" type="number" /></Field>
          <Field label={f.aadhaarConsent}>
            <div style={styles.radioGroup}>
              <Radio field="aadhaarConsent" value="PROVIDED" label={f.provided} />
              <Radio field="aadhaarConsent" value="NOT_PROVIDED" label={f.notProvided} />
            </div>
          </Field>
          <Field label={f.aadhaarNumber} optional><TextInput field="aadhaarNumber" /></Field>
        </div>
        <div style={styles.spacer} />
        <Field label={f.gender} required>
          <div style={styles.radioGroup}>
            {[["MALE", f.male], ["FEMALE", f.female], ["TRANSGENDER", f.transgender], ["OTHER", f.other]].map(([v, l]) =>
              <Radio key={v} field="gender" value={v} label={l} />)}
          </div>
        </Field>
        <div style={styles.spacer} />
        <div style={styles.grid2}>
          <Field label={f.maritalStatus}>
            <div style={styles.radioGroup}>
              {[["SINGLE", f.single], ["MARRIED", f.married], ["WIDOWED", f.widowed], ["DIVORCED", f.divorced], ["SEPARATED", f.separated]].map(([v, l]) =>
                <Radio key={v} field="maritalStatus" value={v} label={l} />)}
            </div>
          </Field>
          <Field label={f.religion}>
            <div style={styles.radioGroup}>
              {[["HINDU", f.hindu], ["MUSLIM", f.muslim], ["CHRISTIAN", f.christian], ["SIKH", f.sikh], ["BUDDHIST", f.buddhist], ["JAIN", f.jain], ["OTHER", f.other]].map(([v, l]) =>
                <Radio key={v} field="religion" value={v} label={l} />)}
            </div>
          </Field>
        </div>
        <div style={styles.spacer} />
        <Field label={f.socialCategory} required>
          <div style={styles.radioGroup}>
            {[["SC", "SC"], ["ST", "ST"], ["BC", "BC"], ["EWS", "EWS"], ["OC_GENERAL", "OC / General"], ["MINORITY", "Minority"], ["OTHER", f.other]].map(([v, l]) =>
              <Radio key={v} field="socialCategory" value={v} label={l} />)}
          </div>
        </Field>
        <div style={styles.spacer} />
        <Field label={f.subCaste} optional><TextInput field="subCaste" /></Field>
      </>
    );
  }

  function renderB() {
    return (
      <>
        <div style={styles.grid3}>
          <Field label={f.householdSize} required><TextInput field="householdSize" type="number" /></Field>
          <Field label={f.rationCardType}>
            <div style={styles.radioGroup}>
              {[["APL", f.apl], ["BPL", f.bpl], ["ANTHYODAYA", f.anthyodaya], ["NONE", f.none]].map(([v, l]) =>
                <Radio key={v} field="rationCardType" value={v} label={l} />)}
            </div>
          </Field>
          <Field label={f.houseType}>
            <div style={styles.radioGroup}>
              {[["OWNED", f.ownedRented], ["RENTED", f.rented], ["GOVT", f.govtAllotted], ["HOMELESS", f.homeless]].map(([v, l]) =>
                <Radio key={v} field="houseType" value={v} label={l} />)}
            </div>
          </Field>
        </div>
        <div style={styles.spacer} />
        <Field label={f.address} required><TextInput field="address" /></Field>
        <div style={styles.spacer} />
        <div style={styles.grid3}>
          <Field label={f.district} required><TextInput field="district" /></Field>
          <Field label={f.mandal} required><TextInput field="mandal" /></Field>
          <Field label={f.village} required><TextInput field="village" /></Field>
        </div>
        <div style={styles.spacer} />
        <div style={{ maxWidth: 200 }}>
          <Field label={f.pincode}><TextInput field="pincode" /></Field>
        </div>
      </>
    );
  }

  function renderC() {
    return (
      <>
        <Field label={f.employmentStatus} required>
          <div style={styles.radioGroup}>
            {[["EMPLOYED", f.employed], ["SELF_EMPLOYED", f.selfEmployed], ["UNEMPLOYED", f.unemployed], ["STUDENT", f.student], ["HOMEMAKER", f.homemaker], ["RETIRED", f.retired]].map(([v, l]) =>
              <Radio key={v} field="employmentStatus" value={v} label={l} />)}
          </div>
        </Field>
        <div style={styles.spacer} />
        <div style={styles.grid3}>
          <Field label={f.occupation}><TextInput field="occupation" /></Field>
          <Field label={f.employer} optional><TextInput field="employer" /></Field>
          <Field label={f.workLocation} optional><TextInput field="workLocation" /></Field>
        </div>
      </>
    );
  }

  function renderD() {
    return (
      <>
        <div style={styles.grid3}>
          <Field label={f.monthlyIncome} required><TextInput field="monthlyIncome" type="number" /></Field>
          <Field label={f.annualIncome} optional><TextInput field="annualIncome" type="number" /></Field>
        </div>
        <div style={styles.spacer} />
        <Field label={f.incomeSource}>
          <div style={styles.radioGroup}>
            {[["AGRICULTURE", f.agriculture], ["LABOUR", f.labour], ["SALARY", f.salary], ["BUSINESS", f.business], ["PENSION", f.pension], ["OTHER", f.other]].map(([v, l]) =>
              <Radio key={v} field="incomeSource" value={v} label={l} />)}
          </div>
        </Field>
      </>
    );
  }

  function renderE() {
    return (
      <>
        <div style={styles.grid3}>
          <Field label={f.landOwned} optional><TextInput field="landOwned" type="number" /></Field>
          <Field label={f.landType}>
            <div style={styles.radioGroup}>
              {[["AGRICULTURAL", f.agricultural], ["RESIDENTIAL", f.residential], ["COMMERCIAL", f.commercial], ["NONE", f.none]].map(([v, l]) =>
                <Radio key={v} field="landType" value={v} label={l} />)}
            </div>
          </Field>
          <Field label={f.vehicleOwned}>
            <div style={styles.radioGroup}>
              {[["TWO_WHEELER", f.twoWheeler], ["FOUR_WHEELER", f.fourWheeler], ["NONE", f.noVehicle]].map(([v, l]) =>
                <Radio key={v} field="vehicleOwned" value={v} label={l} />)}
            </div>
          </Field>
        </div>
      </>
    );
  }

  function renderF() {
    return (
      <Field label={f.educationLevel} required>
        <div style={styles.radioGroup}>
          {[["ILLITERATE", f.illiterate], ["PRIMARY", f.primary], ["SECONDARY", f.secondary], ["HIGHER_SECONDARY", f.higherSecondary], ["GRADUATE", f.graduate], ["POST_GRADUATE", f.postGraduate]].map(([v, l]) =>
            <Radio key={v} field="educationLevel" value={v} label={l} />)}
        </div>
      </Field>
    );
  }

  function renderG() {
    return (
      <>
        <div style={styles.grid2}>
          <Field label={f.chronicIllness}>
            <div style={styles.radioGroup}>
              <Radio field="chronicIllness" value="YES" label={f.yes} />
              <Radio field="chronicIllness" value="NO" label={f.no} />
            </div>
          </Field>
          {formData.chronicIllness === "YES" && (
            <Field label={f.illnessType}><TextInput field="illnessType" /></Field>
          )}
        </div>
        <div style={styles.spacer} />
        <div style={styles.grid2}>
          <Field label={f.disability}>
            <div style={styles.radioGroup}>
              <Radio field="disability" value="YES" label={f.yes} />
              <Radio field="disability" value="NO" label={f.no} />
            </div>
          </Field>
          {formData.disability === "YES" && (
            <Field label={f.disabilityType}><TextInput field="disabilityType" /></Field>
          )}
        </div>
        <div style={styles.spacer} />
        <div style={styles.grid2}>
          <Field label={f.healthInsurance}>
            <div style={styles.radioGroup}>
              <Radio field="healthInsurance" value="YES" label={f.yes} />
              <Radio field="healthInsurance" value="NO" label={f.no} />
            </div>
          </Field>
          {formData.healthInsurance === "YES" && (
            <Field label={f.insuranceProvider}><TextInput field="insuranceProvider" /></Field>
          )}
        </div>
      </>
    );
  }

  function renderH() {
    return (
      <Field label={f.existingSchemes}>
        <div style={styles.radioGroup}>
          {[["PMAY", f.pmay], ["PMJAY", f.pmjay], ["PM_KISAN", f.kisan], ["MGNREGS", f.mgnregs], ["PENSION", f.pension2], ["MIDDAY", f.midday]].map(([v, l]) =>
            <Checkbox key={v} scheme={v} label={l} />)}
        </div>
      </Field>
    );
  }

  function renderI() {
    return (
      <>
        <div style={styles.grid3}>
          <Field label={f.voterIdAvailable}>
            <div style={styles.radioGroup}>
              <Radio field="voterIdAvailable" value="YES" label={f.yes} />
              <Radio field="voterIdAvailable" value="NO" label={f.no} />
            </div>
          </Field>
          <Field label={f.panCard}>
            <div style={styles.radioGroup}>
              <Radio field="panCard" value="YES" label={f.yes} />
              <Radio field="panCard" value="NO" label={f.no} />
            </div>
          </Field>
          <Field label={f.bankAccount}>
            <div style={styles.radioGroup}>
              <Radio field="bankAccount" value="YES" label={f.yes} />
              <Radio field="bankAccount" value="NO" label={f.no} />
            </div>
          </Field>
        </div>
        {formData.bankAccount === "YES" && (
          <>
            <div style={styles.spacer} />
            <div style={styles.grid3}>
              <Field label={f.bankName}><TextInput field="bankName" /></Field>
              <Field label={f.ifsc}><TextInput field="ifsc" /></Field>
              <Field label={f.accountNumber}><TextInput field="accountNumber" /></Field>
            </div>
          </>
        )}
      </>
    );
  }

  function renderJ() {
    return (
      <>
        <div style={styles.grid2}>
          <Field label={f.selfHelpGroup}>
            <div style={styles.radioGroup}>
              <Radio field="selfHelpGroup" value="YES" label={f.yes} />
              <Radio field="selfHelpGroup" value="NO" label={f.no} />
            </div>
          </Field>
          {formData.selfHelpGroup === "YES" && (
            <Field label={f.groupName}><TextInput field="groupName" /></Field>
          )}
        </div>
        <div style={styles.spacer} />
        <div style={styles.grid3}>
          <Field label={f.panchayat}><TextInput field="panchayat" /></Field>
          <Field label={f.mlaConstituency}><TextInput field="mlaConstituency" /></Field>
          <Field label={f.mpConstituency}><TextInput field="mpConstituency" /></Field>
        </div>
      </>
    );
  }

  function renderK() {
    if (submitted) {
      return (
        <div style={styles.successCard}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>✅</div>
          <h2 style={{ color: "#00e676", margin: "0 0 8px" }}>Survey Submitted!</h2>
          <p style={{ color: "#94a3b8", margin: 0 }}>Thank you. Your response has been recorded.</p>
        </div>
      );
    }
    return (
      <>
        <div style={styles.consentBox}>{f.consentText}</div>
        <div style={styles.radioGroup}>
          <div
            style={styles.checkBtn(formData.consentAgree)}
            onClick={() => update("consentAgree", !formData.consentAgree)}
          >
            <div style={{
              width: 10, height: 10, borderRadius: 2,
              border: `2px solid ${formData.consentAgree ? "#00e676" : "#475569"}`,
              background: formData.consentAgree ? "#00e676" : "transparent",
              flexShrink: 0,
            }} />
            {f.consentAgree}
          </div>
        </div>
        <div style={styles.spacer} />
        <div style={styles.grid3}>
          <Field label={f.surveyor} required><TextInput field="surveyor" /></Field>
          <Field label={f.surveyDate} required><TextInput field="surveyDate" type="date" /></Field>
          <Field label={f.surveyorId} required><TextInput field="surveyorId" /></Field>
        </div>
        <div style={styles.spacer} />
        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          <button style={styles.submitBtn} onClick={handleSubmit} disabled={submitting || !formData.consentAgree}>
            {submitting ? f.submitting : f.submit}
          </button>
        </div>
        {submitError && (
          <div>
            <p style={{ color: "#00e676", fontSize: 12, margin: "12px 0 4px" }}>
              ℹ️ Demo mode — JSON payload that would be sent to PostgreSQL backend:
            </p>
            <div style={styles.errorBox}>{submitError}</div>
          </div>
        )}
      </>
    );
  }

  const sectionRenderers = { A: renderA, B: renderB, C: renderC, D: renderD, E: renderE, F: renderF, G: renderG, H: renderH, I: renderI, J: renderJ, K: renderK };
  const sectionIcons = { A: "👤", B: "🏠", C: "💼", D: "💰", E: "🏗️", F: "🎓", G: "❤️", H: "🤝", I: "📄", J: "🌿", K: "✅" };

  return (
    <div style={styles.root}>
      {/* HEADER */}
      <div style={styles.header}>
        <div style={styles.topRow}>
          <div style={styles.titleGroup}>
            <h1 style={styles.appTitle}>📋 {t.appTitle}</h1>
            <p style={styles.appSubtitle}>{t.appSubtitle}</p>
          </div>
          <div style={styles.langToggle}>
            <span>{t.language}</span>
            <button style={styles.langBtn(lang === "en")} onClick={() => setLang("en")}>English</button>
            <button style={styles.langBtn(lang === "te")} onClick={() => setLang("te")}>తెలుగు</button>
          </div>
        </div>

        {/* Progress bar */}
        <div style={styles.progressBar}>
          <div style={styles.progressFill} />
        </div>
        <div style={styles.progressLabel}>
          <span>Section {t.sections[currentSection]}</span>
          <span>{sectionIndex + 1} / {SECTION_KEYS.length}</span>
        </div>

        {/* Section navigation */}
        <div style={styles.sectionNav}>
          {SECTION_KEYS.map(key => (
            <button
              key={key}
              style={styles.sectionBtn(currentSection === key, completedSections.has(key))}
              onClick={() => goToSection(key)}
            >
              {completedSections.has(key) && key !== currentSection ? "✓ " : ""}{t.sections[key]}
            </button>
          ))}
        </div>
      </div>

      {/* BODY */}
      <div style={styles.body}>
        <div style={styles.card}>
          <div style={styles.sectionHeader}>
            <div style={styles.sectionIcon}>{sectionIcons[currentSection]}</div>
            <h2 style={styles.sectionTitle}>
              Section {currentSection} – {t.sectionTitles[currentSection]}
            </h2>
          </div>

          {sectionRenderers[currentSection]?.()}

          {/* Nav buttons */}
          {currentSection !== "K" && (
            <div style={styles.navRow}>
              <button
                style={styles.navBtn("secondary")}
                onClick={prevSection}
                disabled={currentSection === "A"}
              >
                ← Previous
              </button>
              <button style={styles.navBtn("primary")} onClick={nextSection}>
                Next →
              </button>
            </div>
          )}
          {currentSection === "K" && !submitted && (
            <div style={styles.navRow}>
              <button style={styles.navBtn("secondary")} onClick={prevSection}>← Previous</button>
              <span />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
