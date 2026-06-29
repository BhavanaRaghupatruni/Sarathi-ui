const DEFAULT_CITIZENS = [
  {
    id: "cit-101",
    name: "Nirmala Yerragondu",
    phone: "9848022338",
    aadhaarRef: "XXXX-XXXX-8910",
    gender: "FEMALE",
    age: 36,
    address: {
      houseNo: "4-12",
      street: "Bazaar Street",
      village: "Yerragondapalem",
      mandal: "Yerragondapalem",
      district: "Prakasam",
      state: "Andhra Pradesh",
      pincode: "523327"
    },
    household: {
      income: 45000,
      housingStatus: "Kutcha",
      landOwnership: "Landless",
      occupation: "Agriculture Labour",
      povertyClassification: "BPL"
    },
    familyMembers: [
      { name: "Chennamma Yerrago", age: 58, education: "Illiterate", occupation: "Agriculture", disability: "None", relationship: "Mother" },
      { name: "Eekshitha", age: 12, education: "7th Class", occupation: "Student", disability: "None", relationship: "Daughter" }
    ],
    timeline: [
      { id: "e-1", type: "CREATION", title: "Citizen Profile Created", date: "2026-06-01", description: "Profile compiled and imported into registry database.", operator: "Srinivas Raju (Volunteer)" },
      { id: "e-2", type: "ELIGIBILITY", title: "Eligibility Run Complete", date: "2026-06-02", description: "RAG engine matched eligibility rules (92% Score). Matches: Aasara Pension.", operator: "System Gateway" },
      { id: "e-3", type: "CASE_CREATED", title: "Welfare Case Opened", date: "2026-06-05", description: "Case file ref CASE-101 assigned to Prakasam Local Hub.", operator: "Srinivas Raju (Volunteer)" },
      { id: "e-4", type: "VOLUNTEER_VISIT", title: "Volunteer Field Visit", date: "2026-06-10", description: "Collected signed Aadhaar physical consent form during address audit.", operator: "Srinivas Raju (Volunteer)" },
      { id: "e-5", type: "RESOLUTION", title: "Case Resolution Verified", date: "2026-06-15", description: "Welfare benefit status set to APPROVED; first payout processed.", operator: "Vijayawada Central Hub" }
    ]
  },
  {
    id: "cit-102",
    name: "Kondaiah Swamy",
    phone: "8897011223",
    aadhaarRef: "XXXX-XXXX-4567",
    gender: "MALE",
    age: 65,
    address: {
      houseNo: "12/A",
      street: "Weavers Colony",
      village: "Gooty",
      mandal: "Gooty",
      district: "Anantapur",
      state: "Andhra Pradesh",
      pincode: "515401"
    },
    household: {
      income: 28000,
      housingStatus: "Kutcha",
      landOwnership: "Marginal (< 1 acre)",
      occupation: "Weaver",
      povertyClassification: "Antyodaya"
    },
    familyMembers: [
      { name: "Lakshmi Swamy", age: 60, education: "Illiterate", occupation: "Weaver", disability: "None", relationship: "Spouse" }
    ],
    timeline: [
      { id: "e-6", type: "CREATION", title: "Citizen Profile Created", date: "2026-06-10", description: "Profile compiled and imported into registry database.", operator: "Srinivas Raju (Volunteer)" },
      { id: "e-7", type: "ELIGIBILITY", title: "Eligibility Run Complete", date: "2026-06-12", description: "RAG engine matched eligibility rules (95% Score). Matches: Old Age Pension.", operator: "System Gateway" },
      { id: "e-8", type: "CASE_CREATED", title: "Welfare Case Opened", date: "2026-06-20", description: "Case file ref CASE-102 assigned to Anantapur Local Hub.", operator: "Srinivas Raju (Volunteer)" }
    ]
  },
  {
    id: "cit-103",
    name: "M. Rajasekhar",
    phone: "9440155667",
    aadhaarRef: "XXXX-XXXX-2345",
    gender: "MALE",
    age: 42,
    address: {
      houseNo: "3-92",
      street: "Fort Road",
      village: "Adoni",
      mandal: "Adoni",
      district: "Kurnool",
      state: "Andhra Pradesh",
      pincode: "518301"
    },
    household: {
      income: 95000,
      housingStatus: "Semi-Pucca",
      landOwnership: "Small (1-2 acres)",
      occupation: "Carpenter",
      povertyClassification: "APL"
    },
    familyMembers: [
      { name: "Mahesh M.", age: 18, education: "Intermediate", occupation: "Student", disability: "None", relationship: "Son" },
      { name: "Sravani M.", age: 16, education: "SSC", occupation: "Student", disability: "None", relationship: "Daughter" }
    ],
    timeline: [
      { id: "e-9", type: "CREATION", title: "Citizen Profile Created", date: "2026-06-18", description: "Profile compiled and imported into registry database.", operator: "Ramesh Kumar (Admin)" },
      { id: "e-10", type: "ELIGIBILITY", title: "Eligibility Run Complete", date: "2026-06-19", description: "RAG engine matched eligibility rules (52% Score). Limited matches due to income parameters.", operator: "System Gateway" },
      { id: "e-11", type: "CASE_CREATED", title: "Welfare Case Opened", date: "2026-06-25", description: "Case file ref CASE-103 created. Status: Rejected due to APL income threshold.", operator: "Ramesh Kumar (Admin)" }
    ]
  }
];

// Initialize DB if not present
const getDB = () => {
  const data = localStorage.getItem("sarathi_citizen_registry_db");
  if (!data) {
    localStorage.setItem("sarathi_citizen_registry_db", JSON.stringify(DEFAULT_CITIZENS));
    return DEFAULT_CITIZENS;
  }
  return JSON.parse(data);
};

const saveDB = (citizens) => {
  localStorage.setItem("sarathi_citizen_registry_db", JSON.stringify(citizens));
};

export const crmService = {
  getCitizens: () => {
    return getDB();
  },

  getCitizenById: (id) => {
    const db = getDB();
    return db.find(c => c.id === id) || null;
  },

  saveCitizen: (updatedCitizen) => {
    const db = getDB();
    const updated = db.map(c => {
      if (c.id === updatedCitizen.id) {
        return updatedCitizen;
      }
      return c;
    });
    saveDB(updated);
    return updatedCitizen;
  },

  addTimelineEvent: (citizenId, event) => {
    const db = getDB();
    let updatedObj = null;
    const updated = db.map(c => {
      if (c.id === citizenId) {
        const newEvent = {
          id: "e-" + Date.now() + Math.random().toString(36).substr(2, 4),
          date: new Date().toISOString().split("T")[0],
          ...event
        };
        updatedObj = {
          ...c,
          timeline: [newEvent, ...c.timeline] // Put newest first
        };
        return updatedObj;
      }
      return c;
    });
    if (updatedObj) saveDB(updated);
    return updatedObj;
  },

  syncSurveyToCRM: (surveyData, surveyorName = "Srinivas Raju (Volunteer)") => {
    const db = getDB();
    
    // Check if citizen already exists by phone
    const existingIndex = db.findIndex(c => c.phone === surveyData.primaryMobile);
    
    // Map family members
    const mappedFamily = (surveyData.familyMembers || []).map(m => ({
      name: m.name,
      age: Number(m.age),
      education: m.education || "None",
      occupation: m.employment || "None",
      disability: m.disability || "None",
      relationship: m.relation || "Other"
    }));

    // Construct address
    const mappedAddress = {
      houseNo: surveyData.houseNo || "",
      street: surveyData.street || "",
      village: surveyData.village || "",
      mandal: surveyData.mandal || "",
      district: surveyData.district || "",
      state: surveyData.state || "",
      pincode: surveyData.pincode || ""
    };

    // Construct household
    const mappedHousehold = {
      income: Number(surveyData.annualIncome || 0),
      housingStatus: surveyData.housingType || "Kutcha",
      landOwnership: surveyData.agriLand || "Landless",
      occupation: surveyData.mainOccupation || "Agriculture Labour",
      povertyClassification: Number(surveyData.annualIncome || 0) < 50000 ? "BPL" : "APL"
    };

    const newCitizenId = "cit-" + (Date.now().toString().slice(-4));
    const today = new Date().toISOString().split("T")[0];

    let citizenRecord = null;

    if (existingIndex > -1) {
      // Merge timeline events and update
      const existing = db[existingIndex];
      const newTimelineEvents = [
        { id: "e-up-" + Date.now(), type: "ELIGIBILITY", title: "Survey Re-submitted", date: today, description: "Updated household welfare details captured.", operator: surveyorName }
      ];
      citizenRecord = {
        ...existing,
        name: `${surveyData.firstName} ${surveyData.lastName}`,
        age: Number(surveyData.age || 30),
        gender: surveyData.gender || "FEMALE",
        address: mappedAddress,
        household: mappedHousehold,
        familyMembers: mappedFamily,
        timeline: [...newTimelineEvents, ...existing.timeline]
      };
      db[existingIndex] = citizenRecord;
    } else {
      // Create new citizen profile
      citizenRecord = {
        id: newCitizenId,
        name: `${surveyData.firstName} ${surveyData.lastName}`,
        phone: surveyData.primaryMobile,
        aadhaarRef: surveyData.aadhaarConsent === "PROVIDED" ? `XXXX-XXXX-${surveyData.aadhaarNumber.slice(-4)}` : "Not Provided",
        gender: surveyData.gender || "FEMALE",
        age: Number(surveyData.age || 30),
        address: mappedAddress,
        household: mappedHousehold,
        familyMembers: mappedFamily,
        timeline: [
          { id: "e-new-1", type: "CREATION", title: "Citizen Profile Created", date: today, description: "Initial profile compiled from welfare wizard.", operator: surveyorName },
          { id: "e-new-2", type: "ELIGIBILITY", title: "Eligibility Evaluation Run", date: today, description: "Automated scan mapping eligible schemes complete.", operator: "System Gateway" },
          { id: "e-new-3", type: "CASE_CREATED", title: "Welfare Case Opened", date: today, description: `Case record initialized inside cases roster.`, operator: surveyorName }
        ]
      };
      db.push(citizenRecord);
    }

    saveDB(db);
    return citizenRecord;
  }
};
