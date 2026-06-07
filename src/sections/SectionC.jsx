import { SectionCard, Field, RadioGroup, CheckGroup } from "../components/UI";

const TX = {
  en: {
    title: "Employment & Livelihood",
    mainOcc: "Main Occupation",
    occOpts: [
      ["AGRICULTURE","Agriculture"],["AGRI_LABOR","Agri Labor"],["DAILY_WAGE","Daily Wage"],
      ["GOVT_EMP","Govt Employee"],["PRIVATE_EMP","Private Employee"],["SELF_EMP","Self-Employed"],
      ["SMALL_BIZ","Small Business"],["DOMESTIC","Domestic Worker"],["DRIVER","Driver"],
      ["CONSTRUCTION","Construction"],["STREET_VENDOR","Street Vendor"],["UNEMPLOYED","Unemployed"],
      ["HOMEMAKER","Homemaker"],["RETIRED","Retired"],["OTHER","Other"],
    ],
    empNature: "Employment Nature",
    natureOpts: [["PERMANENT","Permanent"],["TEMPORARY","Temporary"],["SEASONAL","Seasonal"],["CONTRACT","Contract"],["INFORMAL","Informal"]],
    secondary: "Secondary Income Sources",
    secOpts: [
      ["FARMING","Farming"],["LIVESTOCK","Livestock"],["TAILORING","Tailoring"],["SHOP","Shop"],
      ["AUTO_TAXI","Auto/Taxi"],["GIG","Gig Work"],["MGNREGA","MGNREGA"],
      ["PENSION","Pension"],["RENTAL","Rental"],["OTHER","Other"],
    ],
    challenges: "Employment Challenges",
    chalOpts: [
      ["NO_JOBS","No Jobs"],["LOW_WAGES","Low Wages"],["HEALTH","Health Issues"],
      ["SKILLS","Lack of Skills"],["MIGRATION","Migration"],["DEBT","Debt Burden"],
      ["DISABILITY","Disability"],["OTHER","Other"],
    ],
  },
  te: {
    title: "ఉపాధి & జీవనోపాధి",
    mainOcc: "ప్రధాన వృత్తి",
    occOpts: [
      ["AGRICULTURE","వ్యవసాయం"],["AGRI_LABOR","వ్యవసాయ కూలీ"],["DAILY_WAGE","రోజువారీ కూలీ"],
      ["GOVT_EMP","ప్రభుత్వ ఉద్యోగి"],["PRIVATE_EMP","ప్రైవేట్ ఉద్యోగి"],["SELF_EMP","స్వయం ఉపాధి"],
      ["SMALL_BIZ","చిన్న వ్యాపారం"],["DOMESTIC","గృహ కార్మికుడు"],["DRIVER","డ్రైవర్"],
      ["CONSTRUCTION","నిర్మాణం"],["STREET_VENDOR","వీధి వ్యాపారి"],["UNEMPLOYED","నిరుద్యోగి"],
      ["HOMEMAKER","గృహిణి"],["RETIRED","పదవీ విరమణ"],["OTHER","ఇతర"],
    ],
    empNature: "ఉపాధి స్వభావం",
    natureOpts: [["PERMANENT","శాశ్వత"],["TEMPORARY","తాత్కాలిక"],["SEASONAL","సీజనల్"],["CONTRACT","కాంట్రాక్ట్"],["INFORMAL","అనధికారిక"]],
    secondary: "ద్వితీయ ఆదాయ వనరులు",
    secOpts: [
      ["FARMING","వ్యవసాయం"],["LIVESTOCK","పశువులు"],["TAILORING","కుట్టు పని"],["SHOP","దుకాణం"],
      ["AUTO_TAXI","ఆటో/టాక్సీ"],["GIG","గిగ్ వర్క్"],["MGNREGA","MGNREGA"],
      ["PENSION","పెన్షన్"],["RENTAL","అద్దె"],["OTHER","ఇతర"],
    ],
    challenges: "ఉపాధి సవాళ్ళు",
    chalOpts: [
      ["NO_JOBS","ఉద్యోగాలు లేవు"],["LOW_WAGES","తక్కువ వేతనాలు"],["HEALTH","ఆరోగ్య సమస్యలు"],
      ["SKILLS","నైపుణ్యాల లేమి"],["MIGRATION","వలస"],["DEBT","అప్పు భారం"],
      ["DISABILITY","వికలాంగత"],["OTHER","ఇతర"],
    ],
  },
};

export default function SectionC({ data, onChange, lang }) {
  const t = TX[lang];
  const up = (f, v) => onChange(f, v);
  return (
    <SectionCard icon="💼" title={t.title}>
      <Field label={t.mainOcc} required>
        <RadioGroup field="mainOccupation" value={data.mainOccupation} options={t.occOpts} onChange={up} />
      </Field>
      <Field label={t.empNature}>
        <RadioGroup field="employmentNature" value={data.employmentNature} options={t.natureOpts} onChange={up} />
      </Field>
      <Field label={t.secondary}>
        <CheckGroup field="secondaryIncome" value={data.secondaryIncome} options={t.secOpts} onChange={up} />
      </Field>
      <Field label={t.challenges}>
        <CheckGroup field="empChallenges" value={data.empChallenges} options={t.chalOpts} onChange={up} />
      </Field>
    </SectionCard>
  );
}
