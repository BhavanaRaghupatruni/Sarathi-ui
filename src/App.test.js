import { validateSection } from './App';

test('age group category validation and count mismatch detection', () => {
  const data = {
    age: "36",
    adults: "2",
    childrenCount: "1",
    seniors: "1",
    familyStructure: "SINGLE_PARENT",
    familyMembers: [
      { name: "Nirmala Yerragondu", relation: "Self", age: "12", gender: "F", education: "UG", employment: "Software Engineer", income: "30000" },
      { name: "Chennamma Yerrago", relation: "Other", age: "55", gender: "F", education: "Illiterate", employment: "Agriculture", income: "60000" },
      { name: "Eekshitha", relation: "Other", age: "15", gender: "F", education: "Intermediate", employment: "Student", income: "0" },
      { name: "Gangamma", relation: "Other", age: "85", gender: "F", education: "Illiterate", employment: "Home Maker", income: "5000" }
    ]
  };

  const errors = validateSection("B", data);

  // Nirmala (12, Child), Eekshitha (15, Child), Chennamma (55, Adult), Gangamma (85, Senior)
  // Actual: Adults: 1, Children: 2, Seniors: 1
  // Expected: Adults: 2, Children: 1, Seniors: 1
  expect(errors.adults).toContain('Number of adults in table (1) does not match summary count (2)');
  expect(errors.childrenCount).toContain('Number of children in table (2) does not match summary count (1)');
  expect(errors.seniors).toBeUndefined();
  
  // Nirmala is relation "Self" but age 12 doesn't match Section A age 36
  expect(errors.member_0_age).toContain('Age for "Self" (12) must match Section A age (36)');
});

test('valid age group distribution and matching Self age', () => {
  const data = {
    age: "36",
    adults: "2",
    childrenCount: "1",
    seniors: "1",
    familyStructure: "SINGLE_PARENT",
    familyMembers: [
      { name: "Nirmala Yerragondu", relation: "Self", age: "36", gender: "F", education: "UG", employment: "Software Engineer", income: "30000" },
      { name: "Chennamma Yerrago", relation: "Other", age: "55", gender: "F", education: "Illiterate", employment: "Agriculture", income: "60000" },
      { name: "Eekshitha", relation: "Other", age: "15", gender: "F", education: "Intermediate", employment: "Student", income: "0" },
      { name: "Gangamma", relation: "Other", age: "85", gender: "F", education: "Illiterate", employment: "Home Maker", income: "5000" }
    ]
  };

  const errors = validateSection("B", data);

  // Nirmala (36, Adult), Eekshitha (15, Child), Chennamma (55, Adult), Gangamma (85, Senior)
  // Actual: Adults: 2, Children: 1, Seniors: 1
  // Expected: Adults: 2, Children: 1, Seniors: 1
  expect(errors.adults).toBeUndefined();
  expect(errors.childrenCount).toBeUndefined();
  expect(errors.seniors).toBeUndefined();
  expect(errors.member_0_age).toBeUndefined();
});

test('family count consistency checks', () => {
  const data = {
    age: "36",
    adults: "2",
    childrenCount: "1",
    seniors: "1",
    familyStructure: "SINGLE_PARENT",
    familyMembers: [
      { name: "Chennamma Yerrago", relation: "Other", age: "55", gender: "F", education: "Illiterate", employment: "Agriculture", income: "60000" }
    ]
  };

  const errors = validateSection("B", data);

  // Table has 1 member, expected is 4
  expect(errors.familyMembers).toContain('Family member details (1) must match total count from age groups (4: 2 adults + 1 children + 1 seniors)');
});

test('age boundary edge cases (exactly 60 is adult, 61 is senior)', () => {
  const data = {
    age: "36",
    adults: "1",
    childrenCount: "0",
    seniors: "1",
    familyStructure: "OTHER",
    familyMembers: [
      { name: "Adult Sixty", relation: "Other", age: "60", gender: "F", education: "UG", employment: "None", income: "0" },
      { name: "Senior SixtyOne", relation: "Other", age: "61", gender: "F", education: "UG", employment: "None", income: "0" }
    ]
  };

  const errors = validateSection("B", data);

  // Sixty (60) is Adult, SixtyOne (61) is Senior.
  // Expected: 1 Adult, 1 Senior, 0 Children
  expect(errors.adults).toBeUndefined();
  expect(errors.childrenCount).toBeUndefined();
  expect(errors.seniors).toBeUndefined();
});
