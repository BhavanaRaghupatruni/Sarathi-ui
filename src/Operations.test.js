import { crmService } from "./services/crmService";
import { operationsService } from "./services/operationsService";

// Helper to set up clean mock data in localStorage before each test
const setupMockStorage = () => {
  localStorage.clear();
  
  const mockCitizens = [
    {
      id: "cit-test-1",
      name: "Test Citizen One",
      phone: "9998887777",
      address: { district: "Anantapur", village: "Gooty" },
      household: { income: 40000, povertyClassification: "BPL" },
      familyMembers: [],
      timeline: []
    }
  ];

  const mockVolunteers = [
    { id: "vol-test-1", name: "Volunteer Anantapur Available", district: "Anantapur", availability: "AVAILABLE", activeCases: 1 },
    { id: "vol-test-2", name: "Volunteer Anantapur Busy", district: "Anantapur", availability: "BUSY", activeCases: 0 },
    { id: "vol-test-3", name: "Volunteer Kurnool Available", district: "Kurnool", availability: "AVAILABLE", activeCases: 0 },
    { id: "vol-test-4", name: "Volunteer Anantapur Lowest Load", district: "Anantapur", availability: "AVAILABLE", activeCases: 0 }
  ];

  const mockCases = [
    { id: "case-test-1", name: "Test Citizen One", phone: "9998887777", district: "Anantapur", status: "PENDING", scheme: "Amma Vodi" },
    { id: "case-test-2", name: "Test Citizen Two", phone: "8887776666", district: "Kurnool", status: "PENDING", scheme: "Aasara Pension" },
    { id: "case-test-3", name: "Test Citizen Three", phone: "7776665555", district: "Nellore", status: "PENDING", scheme: "General Discovery" }
  ];

  localStorage.setItem("sarathi_citizen_registry_db", JSON.stringify(mockCitizens));
  localStorage.setItem("sarathi_volunteers_db", JSON.stringify(mockVolunteers));
  localStorage.setItem("sarathi_cases_db", JSON.stringify(mockCases));
  localStorage.setItem("sarathi_visits_db", JSON.stringify([]));
  localStorage.setItem("sarathi_tasks_db", JSON.stringify([]));
};

describe("Saarthi CRM & Assignment Engine Tests", () => {
  beforeEach(() => {
    setupMockStorage();
  });

  test("crmService syncSurveyToCRM maps survey data to citizen record and timeline", () => {
    const surveyPayload = {
      firstName: "Gopal",
      lastName: "Raju",
      primaryMobile: "9988776655",
      gender: "MALE",
      age: "45",
      district: "Anantapur",
      village: "Gooty",
      annualIncome: "35000",
      familyMembers: [
        { name: "Suresh Raju", relation: "Son", age: "15", education: "SSC", employment: "Student", income: "0" }
      ]
    };

    const record = crmService.syncSurveyToCRM(surveyPayload, "Test Volunteer");

    // Verify citizen details mapped
    expect(record.name).toBe("Gopal Raju");
    expect(record.phone).toBe("9988776655");
    expect(record.age).toBe(45);
    expect(record.household.povertyClassification).toBe("BPL");
    
    // Verify family member mapped
    expect(record.familyMembers.length).toBe(1);
    expect(record.familyMembers[0].name).toBe("Suresh Raju");
    expect(record.familyMembers[0].relationship).toBe("Son");

    // Verify initial timeline events added
    expect(record.timeline.length).toBe(3);
    expect(record.timeline.some(e => e.type === "CREATION")).toBe(true);
    expect(record.timeline.some(e => e.type === "ELIGIBILITY")).toBe(true);
    expect(record.timeline.some(e => e.type === "CASE_CREATED")).toBe(true);
  });

  test("operationsService runAssignmentEngine matches geography, availability, and picks lowest workload", () => {
    // case-test-1 covers Anantapur district.
    // Matching Anantapur volunteers:
    // - vol-test-1: AVAILABLE, workload 1
    // - vol-test-2: BUSY, workload 0 (should be excluded)
    // - vol-test-3: Kurnool (should be excluded)
    // - vol-test-4: AVAILABLE, workload 0
    // Engine should select vol-test-4 because workload (0) < workload (1).

    const result = operationsService.runAssignmentEngine("case-test-1");

    expect(result.success).toBe(true);
    expect(result.volunteer.id).toBe("vol-test-4");
    expect(result.volunteer.name).toBe("Volunteer Anantapur Lowest Load");

    // Verify workload counter updated
    const volunteers = JSON.parse(localStorage.getItem("sarathi_volunteers_db"));
    const assignedVol = volunteers.find(v => v.id === "vol-test-4");
    expect(assignedVol.activeCases).toBe(1);

    // Verify case record updated
    const cases = JSON.parse(localStorage.getItem("sarathi_cases_db"));
    const assignedCase = cases.find(c => c.id === "case-test-1");
    expect(assignedCase.volunteerId).toBe("vol-test-4");
    expect(assignedCase.volunteer).toBe("Volunteer Anantapur Lowest Load");
  });

  test("operationsService runAssignmentEngine fails gracefully if no matching available volunteers found", () => {
    // case-test-3 covers Nellore. We have no volunteers in Nellore.
    const result = operationsService.runAssignmentEngine("case-test-3");

    expect(result.success).toBe(false);
    expect(result.error).toContain("No available volunteers found in district: Nellore");
  });
});
