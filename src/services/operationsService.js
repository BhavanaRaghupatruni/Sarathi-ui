const DEFAULT_VOLUNTEERS = [
  { id: "vol-1", name: "Srinivas Raju", contact: "9900112233", hub: "Anantapur Local Hub", district: "Anantapur", availability: "AVAILABLE", activeCases: 1 },
  { id: "vol-2", name: "Bhavana Reddy", contact: "9876543210", hub: "Kurnool Local Hub", district: "Kurnool", availability: "AVAILABLE", activeCases: 1 },
  { id: "vol-3", name: "Kishore Kumar", contact: "9123456789", hub: "Anantapur Local Hub", district: "Anantapur", availability: "BUSY", activeCases: 2 },
  { id: "vol-4", name: "Anitha Rao", contact: "9988776655", hub: "Vijayawada Central Hub", district: "Krishna", availability: "AVAILABLE", activeCases: 0 }
];

const DEFAULT_HUBS = [
  { id: "hub-1", name: "Vijayawada Central Hub", type: "CENTRAL", district: "Krishna", operator: "Vijayawada Hub Manager", volunteersCount: 1, status: "ACTIVE" },
  { id: "hub-2", name: "Anantapur Local Hub", type: "LOCAL", district: "Anantapur", operator: "Anantapur Operator", volunteersCount: 2, status: "ACTIVE" },
  { id: "hub-3", name: "Kurnool Local Hub", type: "LOCAL", district: "Kurnool", operator: "Kurnool Operator", volunteersCount: 1, status: "ACTIVE" }
];

const DEFAULT_VISITS = [
  { id: "vis-1", volunteerId: "vol-1", citizenName: "Anusha G.", date: "2026-06-30", purpose: "Verify housing structure documents", status: "SCHEDULED" },
  { id: "vis-2", volunteerId: "vol-1", citizenName: "Venkata Rao", date: "2026-06-28", purpose: "Verify age bounds for pension", status: "COMPLETED" },
  { id: "vis-3", volunteerId: "vol-2", citizenName: "Ramakrishnayya", date: "2026-07-02", purpose: "Collect gas utility bills", status: "SCHEDULED" }
];

const DEFAULT_TASKS = [
  { id: "tsk-1", volunteerId: "vol-1", description: "Collect Aadhaar signature form for Anusha G.", status: "PENDING" },
  { id: "tsk-2", volunteerId: "vol-1", description: "Verify water supply source for Venkata Rao", status: "COMPLETED" },
  { id: "tsk-3", volunteerId: "vol-2", description: "Collect income certificate copy for Ramakrishnayya", status: "PENDING" }
];

const DEFAULT_CASES = [
  {
    id: "case-101",
    name: "Venkata Rao",
    phone: "9848022338",
    status: "RESOLVED",
    date: "2026-06-15",
    district: "Krishna",
    scheme: "Aasara Pension",
    volunteer: "Anitha Rao",
    volunteerId: "vol-4",
    timeline: [
      { id: "evt-1", type: "STATUS_CHANGE", title: "Case Resolved", date: "2026-06-25", description: "Welfare eligibility verified. Beneficiary file closed and approved.", operator: "Anitha Rao (Volunteer)" },
      { id: "evt-2", type: "ATTACHMENT", title: "Document Attached", date: "2026-06-20", description: "Attached: Aadhaar Card Copy. Verification Level: Official Government.", operator: "Anitha Rao (Volunteer)" },
      { id: "evt-3", type: "NOTE", title: "Audit Note Logged", date: "2026-06-18", description: "Conducted physical audit; family bounds match documentation.", operator: "Anitha Rao (Volunteer)" },
      { id: "evt-4", type: "STATUS_CHANGE", title: "Case Assigned", date: "2026-06-16", description: "Case file dispatched to volunteer Anitha Rao.", operator: "Vijayawada Central Hub" },
      { id: "evt-5", type: "STATUS_CHANGE", title: "Case Created", date: "2026-06-15", description: "Initial discovery application submitted, status set to OPEN.", operator: "System Gateway" }
    ]
  },
  {
    id: "case-102",
    name: "Anusha G.",
    phone: "8897011223",
    status: "OPEN",
    date: "2026-06-20",
    district: "Anantapur",
    scheme: "Amma Vodi",
    timeline: [
      { id: "evt-6", type: "STATUS_CHANGE", title: "Case Created", date: "2026-06-20", description: "Initial discovery application submitted, status set to OPEN.", operator: "System Gateway" }
    ]
  },
  {
    id: "case-103",
    name: "Ramakrishnayya",
    phone: "9440155667",
    status: "RESOLVED",
    date: "2026-06-25",
    district: "Kurnool",
    scheme: "Ujjwala Yojana",
    volunteer: "Bhavana Reddy",
    volunteerId: "vol-2",
    timeline: [
      { id: "evt-7", type: "STATUS_CHANGE", title: "Case Closed", date: "2026-06-27", description: "Application marked as resolved/closed.", operator: "Kurnool Operator" },
      { id: "evt-8", type: "STATUS_CHANGE", title: "Case Assigned", date: "2026-06-26", description: "Case assigned to volunteer Bhavana Reddy.", operator: "Kurnool Operator" }
    ]
  }
];

const initDBs = () => {
  if (!localStorage.getItem("sarathi_volunteers_db")) {
    localStorage.setItem("sarathi_volunteers_db", JSON.stringify(DEFAULT_VOLUNTEERS));
  }
  if (!localStorage.getItem("sarathi_hubs_db")) {
    localStorage.setItem("sarathi_hubs_db", JSON.stringify(DEFAULT_HUBS));
  }
  if (!localStorage.getItem("sarathi_visits_db")) {
    localStorage.setItem("sarathi_visits_db", JSON.stringify(DEFAULT_VISITS));
  }
  if (!localStorage.getItem("sarathi_tasks_db")) {
    localStorage.setItem("sarathi_tasks_db", JSON.stringify(DEFAULT_TASKS));
  }
  if (!localStorage.getItem("sarathi_cases_db")) {
    localStorage.setItem("sarathi_cases_db", JSON.stringify(DEFAULT_CASES));
  }
};

initDBs();

const getVolunteersList = () => JSON.parse(localStorage.getItem("sarathi_volunteers_db") || "[]");
const saveVolunteersList = (list) => localStorage.setItem("sarathi_volunteers_db", JSON.stringify(list));

const getVisitsList = () => JSON.parse(localStorage.getItem("sarathi_visits_db") || "[]");
const saveVisitsList = (list) => localStorage.setItem("sarathi_visits_db", JSON.stringify(list));

const getTasksList = () => JSON.parse(localStorage.getItem("sarathi_tasks_db") || "[]");
const saveTasksList = (list) => localStorage.setItem("sarathi_tasks_db", JSON.stringify(list));

const getCasesList = () => JSON.parse(localStorage.getItem("sarathi_cases_db") || "[]");
const saveCasesList = (list) => localStorage.setItem("sarathi_cases_db", JSON.stringify(list));

export const operationsService = {
  getVolunteers: () => getVolunteersList(),
  getHubs: () => JSON.parse(localStorage.getItem("sarathi_hubs_db") || "[]"),
  saveVolunteers: (list) => saveVolunteersList(list),

  getVolunteerWork: (volunteerId) => {
    const visits = getVisitsList().filter(v => v.volunteerId === volunteerId);
    const tasks = getTasksList().filter(t => t.volunteerId === volunteerId);
    return { visits, tasks };
  },

  completeTask: (taskId) => {
    const list = getTasksList();
    const updated = list.map(t => {
      if (t.id === taskId) return { ...t, status: "COMPLETED" };
      return t;
    });
    saveTasksList(updated);
    return updated;
  },

  completeVisit: (visitId) => {
    const list = getVisitsList();
    const updated = list.map(v => {
      if (v.id === visitId) return { ...v, status: "COMPLETED" };
      return v;
    });
    saveVisitsList(updated);
    return updated;
  },

  createCase: (citizenName, phone = "9900112233", district = "Anantapur", scheme = "General Discovery") => {
    const cases = getCasesList();
    const caseId = "case-" + (Date.now().toString().slice(-4));
    const today = new Date().toISOString().split("T")[0];

    // Check if case already exists for citizen name + scheme
    const exists = cases.some(c => c.name.toLowerCase() === citizenName.toLowerCase() && c.scheme === scheme);
    if (exists) return { success: false, error: "Active case file already exists for this citizen." };

    const newCase = {
      id: caseId,
      name: citizenName,
      phone,
      status: "OPEN",
      date: today,
      district,
      scheme,
      timeline: [
        { id: "evt-init-" + Date.now(), type: "STATUS_CHANGE", title: "Case Created", date: today, description: `Application initialized under scheme discovery. Status set to OPEN.`, operator: "System Gateway" }
      ]
    };

    cases.push(newCase);
    saveCasesList(cases);

    return { success: true, case: newCase };
  },

  addCaseNote: (caseId, noteText, operator = "Hub operator") => {
    const cases = getCasesList();
    let updatedCase = null;
    
    const updated = cases.map(c => {
      if (c.id === caseId) {
        const newEvent = {
          id: "evt-note-" + Date.now(),
          type: "NOTE",
          title: "Audit Note Logged",
          date: new Date().toISOString().split("T")[0],
          description: noteText,
          operator
        };
        updatedCase = {
          ...c,
          timeline: [newEvent, ...(c.timeline || [])]
        };
        return updatedCase;
      }
      return c;
    });

    if (updatedCase) saveCasesList(updated);
    return updatedCase;
  },

  attachCaseDocument: (caseId, docName, verificationLevel = "Official Government", operator = "Hub operator") => {
    const cases = getCasesList();
    let updatedCase = null;

    const updated = cases.map(c => {
      if (c.id === caseId) {
        const newEvent = {
          id: "evt-file-" + Date.now(),
          type: "ATTACHMENT",
          title: "Document Attached",
          date: new Date().toISOString().split("T")[0],
          description: `Attached: ${docName}. Trust level verified: ${verificationLevel}.`,
          operator
        };
        updatedCase = {
          ...c,
          timeline: [newEvent, ...(c.timeline || [])]
        };
        return updatedCase;
      }
      return c;
    });

    if (updatedCase) saveCasesList(updated);
    return updatedCase;
  },

  updateCaseStatus: (caseId, newStatus, operator = "Hub operator") => {
    const cases = getCasesList();
    let updatedCase = null;

    const updated = cases.map(c => {
      if (c.id === caseId) {
        const newEvent = {
          id: "evt-status-" + Date.now(),
          type: "STATUS_CHANGE",
          title: `Status set to ${newStatus}`,
          date: new Date().toISOString().split("T")[0],
          description: `Case file status transitioned from ${c.status} to ${newStatus}.`,
          operator
        };
        updatedCase = {
          ...c,
          status: newStatus,
          timeline: [newEvent, ...(c.timeline || [])]
        };
        return updatedCase;
      }
      return c;
    });

    if (updatedCase) saveCasesList(updated);
    return updatedCase;
  },

  assignCase: (caseId, volunteerId) => {
    const cases = getCasesList();
    const volunteers = getVolunteersList();
    
    const vol = volunteers.find(v => v.id === volunteerId);
    if (!vol) return { success: false, error: "Volunteer not found" };

    let assignedCase = null;
    const updatedCases = cases.map(c => {
      if (c.id === caseId) {
        const today = new Date().toISOString().split("T")[0];
        const newEvent = {
          id: "evt-assign-" + Date.now(),
          type: "STATUS_CHANGE",
          title: "Case Assigned",
          date: today,
          description: `Case file assigned and transferred to volunteer ${vol.name}. Status transitioned to ASSIGNED.`,
          operator: "System Gateway"
        };
        assignedCase = {
          ...c,
          volunteer: vol.name,
          volunteerId: vol.id,
          status: "ASSIGNED",
          timeline: [newEvent, ...(c.timeline || [])]
        };
        return assignedCase;
      }
      return c;
    });

    if (!assignedCase) return { success: false, error: "Case not found" };

    saveCasesList(updatedCases);

    // Update volunteer workload count
    const updatedVols = volunteers.map(v => {
      if (v.id === volunteerId) {
        return { ...v, activeCases: v.activeCases + 1 };
      }
      return v;
    });
    saveVolunteersList(updatedVols);

    // Sync timeline event with the citizen record in CRM registry if it exists
    const registry = JSON.parse(localStorage.getItem("sarathi_citizen_registry_db") || "[]");
    const matchedCitizen = registry.find(c => c.name.toLowerCase() === assignedCase.name.toLowerCase());
    
    if (matchedCitizen) {
      const newEvent = {
        id: "e-assign-" + Date.now(),
        type: "VOLUNTEER_VISIT",
        title: "Field Volunteer Assigned",
        date: new Date().toISOString().split("T")[0],
        description: `Case files forwarded to ${vol.name} (${vol.hub}) for physical document audit.`,
        operator: "System Gateway"
      };
      
      const updatedRegistry = registry.map(c => {
        if (c.id === matchedCitizen.id) {
          return {
            ...c,
            timeline: [newEvent, ...c.timeline]
          };
        }
        return c;
      });
      localStorage.setItem("sarathi_citizen_registry_db", JSON.stringify(updatedRegistry));
    }

    // Schedule a mock follow-up task and field visit
    const tasks = getTasksList();
    tasks.push({
      id: "tsk-" + Date.now(),
      volunteerId: vol.id,
      description: `Complete welfare review and file report for ${assignedCase.name}`,
      status: "PENDING"
    });
    saveTasksList(tasks);

    const visits = getVisitsList();
    visits.push({
      id: "vis-" + Date.now(),
      volunteerId: vol.id,
      citizenName: assignedCase.name,
      date: new Date(Date.now() + 86400000 * 2).toISOString().split("T")[0], // 2 days from now
      purpose: "Conduct home inspection and document verification",
      status: "SCHEDULED"
    });
    saveVisitsList(visits);

    return { success: true, volunteer: vol };
  },

  runAssignmentEngine: (caseId) => {
    const cases = getCasesList();
    const currentCase = cases.find(c => c.id === caseId);
    
    if (!currentCase) return { success: false, error: "Case not found." };
    if (currentCase.volunteerId) return { success: false, error: `Case already assigned to ${currentCase.volunteer}` };

    const volunteers = getVolunteersList();
    const caseDistrict = currentCase.district || "Anantapur";

    // 1. Filter by geography (district match) & availability
    const matches = volunteers.filter(v => 
      v.district.toLowerCase() === caseDistrict.toLowerCase() && 
      v.availability === "AVAILABLE"
    );

    if (matches.length === 0) {
      return { 
        success: false, 
        error: `No available volunteers found in district: ${caseDistrict}. Update volunteer availability in Hub Operations.` 
      };
    }

    // 2. Select matching volunteer with lowest workload
    matches.sort((a, b) => a.activeCases - b.activeCases);
    const bestVolunteer = matches[0];

    // 3. Assign the case
    return operationsService.assignCase(caseId, bestVolunteer.id);
  }
};
