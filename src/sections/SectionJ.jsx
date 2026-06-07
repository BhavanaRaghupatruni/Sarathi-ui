import { SectionCard, Field, Grid, TextInput, RadioGroup, CheckGroup } from "../components/UI";

const TX = {
  en: {
    title: "Social & Community Information",
    altContact: "Alt. Contact Name", relationship: "Relationship",
    altMobile: "Alt. Mobile", altOccupation: "Alt. Occupation",
    communityRole: "Community Role",
    roleOpts:[
      ["SHG_LEADER","SHG Leader"],["VILLAGE_VOL","Village Volunteer"],["WARD_MEMBER","Ward Member"],
      ["RELIGIOUS","Religious Leader"],["NGO_VOL","NGO Volunteer"],["NONE","None"],["OTHER","Other"],
    ],
    willingInfo: "Willing to Receive Info?",
    yes:"Yes", no:"No",
    prefComm: "Preferred Communication",
    commOpts:[["PHONE","Phone Call"],["WHATSAPP","WhatsApp"],["SMS","SMS"],["VILLAGE","Village Volunteer"],["EMAIL","Email"]],
  },
  te: {
    title: "సామాజిక & సమాజ సమాచారం",
    altContact: "ప్రత్యా. సంప్రదింపు పేరు", relationship: "సంబంధం",
    altMobile: "ప్రత్యా. మొబైల్", altOccupation: "ప్రత్యా. వృత్తి",
    communityRole: "సమాజ పాత్ర",
    roleOpts:[
      ["SHG_LEADER","SHG నాయకుడు"],["VILLAGE_VOL","గ్రామ వాలంటీర్"],["WARD_MEMBER","వార్డ్ సభ్యుడు"],
      ["RELIGIOUS","మత నాయకుడు"],["NGO_VOL","NGO వాలంటీర్"],["NONE","లేదు"],["OTHER","ఇతర"],
    ],
    willingInfo: "సమాచారం స్వీకరించడానికి సిద్ధంగా ఉన్నారా?",
    yes:"అవును", no:"కాదు",
    prefComm: "ఇష్టపడే కమ్యూనికేషన్",
    commOpts:[["PHONE","ఫోన్ కాల్"],["WHATSAPP","WhatsApp"],["SMS","SMS"],["VILLAGE","గ్రామ వాలంటీర్"],["EMAIL","ఇమెయిల్"]],
  },
};

export default function SectionJ({ data, onChange, lang }) {
  const t = TX[lang];
  const up = (f, v) => onChange(f, v);
  return (
    <SectionCard icon="🤝" title={t.title}>
      <Grid cols={3}>
        <Field label={t.altContact}>
          <TextInput value={data.altContactName||""} onChange={v=>up("altContactName",v)}/>
        </Field>
        <Field label={t.relationship}>
          <TextInput value={data.altRelationship||""} onChange={v=>up("altRelationship",v)}/>
        </Field>
        <Field label={t.altMobile}>
          <TextInput value={data.altMobile||""} onChange={v=>up("altMobile",v)}/>
        </Field>
      </Grid>
      <Field label={t.altOccupation} style={{maxWidth:360}}>
        <TextInput value={data.altOccupation||""} onChange={v=>up("altOccupation",v)}/>
      </Field>
      <Field label={t.communityRole}>
        <CheckGroup field="communityRole" value={data.communityRole} options={t.roleOpts} onChange={up}/>
      </Field>
      <Field label={t.willingInfo}>
        <RadioGroup field="willingToReceiveInfo" value={data.willingToReceiveInfo}
          options={[["YES",t.yes],["NO",t.no]]} onChange={up}/>
      </Field>
      <Field label={t.prefComm}>
        <CheckGroup field="preferredComm" value={data.preferredComm} options={t.commOpts} onChange={up}/>
      </Field>
    </SectionCard>
  );
}
