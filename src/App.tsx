import React, { useState, useMemo } from "react";
import {
  Sprout,
  GraduationCap,
  Briefcase,
  HeartPulse,
  CheckCircle2,
  ExternalLink,
  FileCheck2,
  Mic,
  MicOff,
  ArrowRight,
  Minus,
  Plus,
  MapPin,
  Droplets,
  Landmark,
  ShieldCheck,
  Loader2,
  UserCheck,
  Award
} from "lucide-react";
import {
  CitizenExtractedSchema,
  IrrigationTypeOption,
  OccupationOption,
  SchemeEvaluationResult,
  TenureTypeOption
} from "./types/yojana";
import { VERIFIED_WELFARE_SCHEMES } from "./engine/schemesData";
import {
  acresToHectares,
  computeMissingFields,
  evaluateCitizenEligibility,
  formatInrCompact,
  hectaresToAcres
} from "./engine/ruleEngine";

type PortalLanguage = "english" | "hindi" | "marathi";

interface PersonaPreset {
  id: string;
  label: {
    english: string;
    hindi: string;
    marathi: string;
  };
  subtitle: {
    english: string;
    hindi: string;
    marathi: string;
  };
  icon: "farmer" | "student" | "entrepreneur" | "senior";
  naturalQuery: {
    english: string;
    hindi: string;
    marathi: string;
  };
  age: number;
  gender: "male" | "female" | "all";
  annualIncome: number;
  state: string;
  occupation: OccupationOption;
  isFarmer: boolean;
  tenureType: "owner" | "tenant";
  landAcres: number;
  irrigationType: "rainfed" | "borewell_drip" | "canal";
}

const PERSONA_PRESETS: PersonaPreset[] = [
  {
    id: "marginal-farmer",
    label: {
      english: "Marginal Farmer (Nashik, 3 Acres)",
      hindi: "सीमांत किसान (नासिक, 3 एकड़)",
      marathi: "अल्पभूधारक शेतकरी (नाशिक, ३ एकर)"
    },
    subtitle: {
      english: "Drip Irrigation & DBT Income Support",
      hindi: "ड्रिप सिंचाई और पीएम-किसान सहायता",
      marathi: "ठिबक सिंचन व सन्मान निधी"
    },
    icon: "farmer",
    naturalQuery: {
      english:
        "I farm 3 acres of owned land in Nashik, Maharashtra with drip irrigation and my annual family income is ₹1.8 Lakhs.",
      hindi:
        "मैं नासिक, महाराष्ट्र में 3 एकड़ जमीन पर ड्रिप सिंचाई से खेती करता हूँ और मेरी वार्षिक पारिवारिक आय ₹1.8 लाख है।",
      marathi:
        "मी नाशिक, महाराष्ट्रात ३ एकर स्वतःच्या जमिनीत ठिबक सिंचनाने शेती करतो आणि माझे वार्षिक उत्पन्न ₹१.८ लाख आहे."
    },
    age: 38,
    gender: "male",
    annualIncome: 180000,
    state: "Maharashtra",
    occupation: "farmer",
    isFarmer: true,
    tenureType: "owner",
    landAcres: 3.0,
    irrigationType: "borewell_drip"
  },
  {
    id: "college-student",
    label: {
      english: "College Student (Pune, Household < ₹2L)",
      hindi: "कॉलेज छात्रा (पुणे, आय < ₹2 लाख)",
      marathi: "कॉलेज विद्यार्थिनी (पुणे, उत्पन्न < ₹२ लाख)"
    },
    subtitle: {
      english: "100% Tuition Freeship & Stipend",
      hindi: "100% ट्यूशन फीस माफी और छात्रवृत्ति",
      marathi: "१००% शिक्षण शुल्क माफी व शिष्यवृत्ती"
    },
    icon: "student",
    naturalQuery: {
      english:
        "I am a 20-year-old college student in Pune, Maharashtra and my family's annual income is ₹1.6 Lakhs.",
      hindi:
        "मैं पुणे, महाराष्ट्र में 20 वर्षीय कॉलेज छात्रा हूँ और मेरे परिवार की वार्षिक आय ₹1.6 लाख है।",
      marathi:
        "मी पुणे, महाराष्ट्र येथे २० वर्षांची महाविद्यालयीन विद्यार्थिनी असून माझ्या कुटुंबाचे वार्षिक उत्पन्न ₹१.६ लाख आहे."
    },
    age: 20,
    gender: "female",
    annualIncome: 160000,
    state: "Maharashtra",
    occupation: "student",
    isFarmer: false,
    tenureType: "owner",
    landAcres: 0,
    irrigationType: "rainfed"
  },
  {
    id: "woman-entrepreneur",
    label: {
      english: "Woman Entrepreneur (Nagpur, Tailoring MSME)",
      hindi: "महिला उद्यमी (नागपुर, सिलाई MSME)",
      marathi: "महिला उद्योजिका (नागपूर, शिलाई व्यवसाय)"
    },
    subtitle: {
      english: "Ladki Bahin + Vishwakarma Toolkit & Credit",
      hindi: "लाडकी बहीण + विश्वकर्मा टूलकिट और ऋण",
      marathi: "लाडकी बहीण + विश्वकर्मा अनुदान व कर्ज"
    },
    icon: "entrepreneur",
    naturalQuery: {
      english:
        "I am a 34-year-old woman running a tailoring business in Nagpur, Maharashtra with an annual household income of ₹1.9 Lakhs.",
      hindi:
        "मैं नागपुर, महाराष्ट्र में 34 वर्षीय महिला हूँ, सिलाई का व्यवसाय करती हूँ और पारिवारिक आय ₹1.9 लाख है।",
      marathi:
        "मी नागपूर, महाराष्ट्रातील ३४ वर्षांची महिला असून शिलाई व्यवसाय करते आणि कौटुंबिक उत्पन्न ₹१.९ लाख आहे."
    },
    age: 34,
    gender: "female",
    annualIncome: 190000,
    state: "Maharashtra",
    occupation: "business_owner",
    isFarmer: false,
    tenureType: "owner",
    landAcres: 0,
    irrigationType: "rainfed"
  },
  {
    id: "senior-citizen",
    label: {
      english: "Senior Citizen (70+, Healthcare)",
      hindi: "वरिष्ठ नागरिक (70+ आयु, स्वास्थ्य सेवा)",
      marathi: "ज्येष्ठ नागरिक (७०+ वय, आरोग्य व पेन्शन)"
    },
    subtitle: {
      english: "₹5L Free Senior Hospitalization & Pension",
      hindi: "₹5 लाख मुफ्त अस्पताल उपचार और पेंशन",
      marathi: "₹५ लाख मोफत उपचार व ज्येष्ठ नागरिक पेन्शन"
    },
    icon: "senior",
    naturalQuery: {
      english:
        "I am a 72-year-old senior citizen living in Maharashtra with an annual household income of ₹1.2 Lakhs seeking healthcare and pension support.",
      hindi:
        "मैं महाराष्ट्र में रहने वाला 72 वर्षीय वरिष्ठ नागरिक हूँ, मेरी वार्षिक आय ₹1.2 लाख है और मुझे स्वास्थ्य एवं पेंशन सहायता चाहिए।",
      marathi:
        "मी महाराष्ट्रात राहणारा ७२ वर्षांचा ज्येष्ठ नागरिक असून माझे वार्षिक उत्पन्न ₹१.२ लाख आहे; मला आरोग्य व पेन्शन योजना हवी आहे."
    },
    age: 72,
    gender: "male",
    annualIncome: 120000,
    state: "Maharashtra",
    occupation: "unemployed",
    isFarmer: false,
    tenureType: "owner",
    landAcres: 0,
    irrigationType: "rainfed"
  }
];

const UI_COPY: Record<
  PortalLanguage,
  {
    govKicker: string;
    tagline: string;
    quickSelectTitle: string;
    inputCardTitle: string;
    inputCardSubtitle: string;
    queryLabel: string;
    queryPlaceholder: string;
    analyzeButton: string;
    analyzingButton: string;
    ageLabel: string;
    yearsUnit: string;
    genderLabel: string;
    male: string;
    female: string;
    other: string;
    incomeLabel: string;
    perYear: string;
    stateLabel: string;
    agriToggleTitle: string;
    agriToggleDesc: string;
    landOwnershipLabel: string;
    ownerOption: string;
    tenantOption: string;
    landSizeLabel: string;
    acresUnit: string;
    hectaresUnit: string;
    irrigationLabel: string;
    rainfedOption: string;
    dripOption: string;
    canalOption: string;
    foundSchemesBanner: (count: number) => string;
    foundSchemesSub: string;
    eligibleStatusBadge: string;
    whyYouQualifyLabel: string;
    documentsLabel: string;
    applyPortalBtn: string;
    benefitBoxLabel: string;
    noSchemesTitle: string;
    noSchemesSub: string;
  }
> = {
  english: {
    govKicker: "GOVERNMENT OF MAHARASHTRA • PUBLIC PILOT",
    tagline: "Direct Citizen Entitlement Engine",
    quickSelectTitle: "Select Citizen Persona — Instant Pre-Fill & Entitlement Calculation",
    inputCardTitle: "Citizen Eligibility Parameters",
    inputCardSubtitle: "Describe your situation in plain words or calibrate the parameters below",
    queryLabel: "Describe your situation (Voice or Text)",
    queryPlaceholder:
      "Describe your situation (e.g., 'I farm 3 acres in Nashik earning 1.8L...')",
    analyzeButton: "Auto-Fill Parameters",
    analyzingButton: "Reading Profile...",
    ageLabel: "Applicant Age",
    yearsUnit: "Years",
    genderLabel: "Gender",
    male: "Male",
    female: "Female",
    other: "Other",
    incomeLabel: "Annual Family Income",
    perYear: "/ year",
    stateLabel: "State of Domicile",
    agriToggleTitle: "Are you involved in Agriculture / Farming?",
    agriToggleDesc: "Unlocks crop subsidies, drip irrigation grants, solar pumps & PM-KISAN",
    landOwnershipLabel: "Land Ownership Status",
    ownerOption: "Owner (7/12 Title)",
    tenantOption: "Tenant / Cultivator",
    landSizeLabel: "Cultivable Landholding Size",
    acresUnit: "Acres",
    hectaresUnit: "Hectares",
    irrigationLabel: "Primary Irrigation Source",
    rainfedOption: "Rainfed",
    dripOption: "Drip / Borewell",
    canalOption: "Canal",
    foundSchemesBanner: (count: number) => `Found ${count} Schemes You Qualify For`,
    foundSchemesSub: "Verified instantaneously against Central & State statutory thresholds",
    eligibleStatusBadge: "100% Eligible",
    whyYouQualifyLabel: "Why You Qualify",
    documentsLabel: "Required Documents Checklist",
    applyPortalBtn: "Apply on Official Portal",
    benefitBoxLabel: "Verified Statutory Benefit",
    noSchemesTitle: "No direct matches for the current threshold combination",
    noSchemesSub:
      "Try lowering the annual income slider below ₹2.5 Lakhs or selecting one of the citizen personas above."
  },
  hindi: {
    govKicker: "महाराष्ट्र शासन • राष्ट्रीय डिजिटल पायलट सेवा",
    tagline: "प्रत्यक्ष नागरिक पात्रता इंजन",
    quickSelectTitle: "नागरिक प्रोफाइल चुनें — एक क्लिक में फॉर्म भरें और पात्रता देखें",
    inputCardTitle: "नागरिक पात्रता विवरण",
    inputCardSubtitle: "अपनी स्थिति साधारण शब्दों में लिखें या नीचे दिए गए विकल्पों को समायोजित करें",
    queryLabel: "अपनी स्थिति बताएं (बोलकर या लिखकर)",
    queryPlaceholder:
      "अपनी स्थिति बताएं (उदा: 'मैं नासिक में 3 एकड़ जमीन पर खेती करता हूँ, वार्षिक आय 1.8 लाख है...')",
    analyzeButton: "विवरण स्वतः भरें",
    analyzingButton: "प्रोफाइल पढ़ी जा रही है...",
    ageLabel: "आवेदक की आयु",
    yearsUnit: "वर्ष",
    genderLabel: "लिंग",
    male: "पुरुष",
    female: "महिला",
    other: "अन्य",
    incomeLabel: "वार्षिक पारिवारिक आय",
    perYear: "/ वर्ष",
    stateLabel: "निवास राज्य (डोमिसाइल)",
    agriToggleTitle: "क्या आप कृषि / खेती से जुड़े हैं?",
    agriToggleDesc: "ड्रिप सिंचाई सब्सिडी, सोलर पंप और पीएम-किसान योजनाओं के लिए इसे ऑन करें",
    landOwnershipLabel: "भूमि स्वामित्व की स्थिति",
    ownerOption: "भूमि स्वामी (7/12 धारक)",
    tenantOption: "बटाईदार / किरायेदार किसान",
    landSizeLabel: "खेती योग्य भूमि का आकार",
    acresUnit: "एकड़",
    hectaresUnit: "हेक्टेयर",
    irrigationLabel: "सिंचाई का प्रमुख साधन",
    rainfedOption: "वर्षा आधारित (कोरडवाहू)",
    dripOption: "ड्रिप / बोरवेल",
    canalOption: "नहर (कैनाल)",
    foundSchemesBanner: (count: number) => `Found ${count} Schemes You Qualify For • ${count} पात्र योजनाएं`,
    foundSchemesSub: "केंद्र और राज्य सरकार के आधिकारिक पात्रता नियमों के अनुसार सत्यापित",
    eligibleStatusBadge: "100% पात्र (Eligible)",
    whyYouQualifyLabel: "आप क्यों पात्र हैं",
    documentsLabel: "आवश्यक दस्तावेज (चेकलिस्ट)",
    applyPortalBtn: "आधिकारिक पोर्टल पर आवेदन करें",
    benefitBoxLabel: "सत्यापित सरकारी लाभ",
    noSchemesTitle: "वर्तमान विवरण के लिए कोई सीधी योजना नहीं मिली",
    noSchemesSub:
      "कृपया वार्षिक आय स्लाइडर को ₹2.5 लाख से कम करें या ऊपर दिए गए किसी एक प्रोफाइल चिप पर क्लिक करें।"
  },
  marathi: {
    govKicker: "महाराष्ट्र शासन • सार्वजनिक डिजिटल पायलट सेवा",
    tagline: "थेट नागरिक पात्रता इंजिन",
    quickSelectTitle: "नागरिक प्रोफाइल निवडा — एका क्लिकवर माहिती भरा आणि पात्र योजना पहा",
    inputCardTitle: "नागरिक पात्रता तपशील",
    inputCardSubtitle: "तुमची माहिती साध्या शब्दांत लिहा किंवा खालील पर्याय निवडा",
    queryLabel: "तुमची परिस्थिती सांगा (बोलून किंवा टाईप करून)",
    queryPlaceholder:
      "उदा. 'मी नाशिकमध्ये ३ एकर शेती करतो, वार्षिक उत्पन्न १.८ लाख आहे आणि ठिबक अनुदान हवे आहे...'",
    analyzeButton: "माहिती आपोआप भरा",
    analyzingButton: "माहिती तपासत आहे...",
    ageLabel: "अर्जदाराचे वय",
    yearsUnit: "वर्षे",
    genderLabel: "लिंग",
    male: "पुरुष",
    female: "महिला",
    other: "इतर",
    incomeLabel: "वार्षिक कौटुंबिक उत्पन्न",
    perYear: "/ वर्ष",
    stateLabel: "अधिवास राज्य (Domicile)",
    agriToggleTitle: "तुम्ही शेती / कृषी व्यवसायाशी संबंधित आहात का?",
    agriToggleDesc: "ठिबक सिंचन अनुदान, सौर कृषी पंप आणि पीएम-किसान योजनांसाठी हे चालू करा",
    landOwnershipLabel: "जमीन मालकी हक्क",
    ownerOption: "स्वतःची जमीन (७/१२ धारक)",
    tenantOption: "कुळ / भाडेकरू शेतकरी",
    landSizeLabel: "एकूण शेतजमीन क्षेत्र",
    acresUnit: "एकर",
    hectaresUnit: "हेक्टर",
    irrigationLabel: "सिंचनाचा मुख्य स्रोत",
    rainfedOption: "कोरडवाहू (पावसावर आधारित)",
    dripOption: "ठिबक / विहीर / बोअरवेल",
    canalOption: "कालवा (कॅनॉल)",
    foundSchemesBanner: (count: number) => `Found ${count} Schemes You Qualify For • ${count} पात्र योजना`,
    foundSchemesSub: "केंद्र व महाराष्ट्र शासनाच्या अधिकृत नियमांनुसार तात्काळ पडताळणी",
    eligibleStatusBadge: "१००% पात्र (Eligible)",
    whyYouQualifyLabel: "तुम्ही पात्र का आहात",
    documentsLabel: "लागणारी आवश्यक कागदपत्रे",
    applyPortalBtn: "अधिकृत पोर्टलवर अर्ज करा",
    benefitBoxLabel: "प्रमाणित शासकीय लाभ",
    noSchemesTitle: "सध्याच्या निकषांनुसार कोणतीही थेट योजना आढळली नाही",
    noSchemesSub:
      "कृपया वार्षिक उत्पन्न ₹२.५ लाखांपेक्षा कमी करून पहा किंवा वरीलपैकी एका प्रोफाइलवर क्लिक करा."
  }
};

const INDIAN_STATES = [
  "Maharashtra",
  "Uttar Pradesh",
  "Madhya Pradesh",
  "Karnataka",
  "Gujarat",
  "Rajasthan",
  "Telangana",
  "Bihar",
  "Punjab",
  "Tamil Nadu"
];

export default function App() {
  const [language, setLanguage] = useState<PortalLanguage>("english");
  const [selectedPresetId, setSelectedPresetId] = useState<string>(PERSONA_PRESETS[0].id);

  // Conversational input bar
  const [naturalText, setNaturalText] = useState<string>(
    PERSONA_PRESETS[0].naturalQuery.english
  );
  const [isAnalyzingText, setIsAnalyzingText] = useState<boolean>(false);
  const [isListeningVoice, setIsListeningVoice] = useState<boolean>(false);
  const [statusFeedback, setStatusFeedback] = useState<string | null>(null);

  // Structured Citizen Form State (initialized with Marginal Farmer Nashik 3 Acres)
  const [age, setAge] = useState<number>(PERSONA_PRESETS[0].age);
  const [gender, setGender] = useState<"male" | "female" | "all">(PERSONA_PRESETS[0].gender);
  const [annualIncome, setAnnualIncome] = useState<number>(PERSONA_PRESETS[0].annualIncome);
  const [stateName, setStateName] = useState<string>(PERSONA_PRESETS[0].state);
  const [occupation, setOccupation] = useState<OccupationOption>(PERSONA_PRESETS[0].occupation);

  // Specialized Agriculture Deep-Dive Drawer State
  const [isFarmer, setIsFarmer] = useState<boolean>(PERSONA_PRESETS[0].isFarmer);
  const [tenureType, setTenureType] = useState<"owner" | "tenant">(
    PERSONA_PRESETS[0].tenureType
  );
  const [landAcres, setLandAcres] = useState<number>(PERSONA_PRESETS[0].landAcres);
  const [irrigationType, setIrrigationType] = useState<"rainfed" | "borewell_drip" | "canal">(
    PERSONA_PRESETS[0].irrigationType
  );

  const copy = UI_COPY[language];
  const landHectares = useMemo(() => acresToHectares(landAcres), [landAcres]);

  // Build canonical profile for deterministic rule evaluation
  const currentProfile: CitizenExtractedSchema = useMemo(() => {
    const resolvedOccupation: OccupationOption = isFarmer ? "farmer" : occupation;
    const schema: CitizenExtractedSchema = {
      demographics: {
        age,
        gender,
        annual_income: annualIncome,
        state: stateName,
        occupation: resolvedOccupation
      },
      agri_specific: {
        is_farmer: isFarmer,
        owns_land: isFarmer ? tenureType === "owner" : false,
        land_hectares: isFarmer ? landHectares : null,
        tenure_type: isFarmer ? (tenureType as TenureTypeOption) : null,
        irrigation_type: isFarmer ? (irrigationType as IrrigationTypeOption) : null
      },
      missing_fields: [],
      extracted_summary: ""
    };
    schema.missing_fields = computeMissingFields(schema);
    return schema;
  }, [age, gender, annualIncome, stateName, occupation, isFarmer, tenureType, landHectares, irrigationType]);

  // Deterministic Rule Evaluation
  const evaluations: SchemeEvaluationResult[] = useMemo(() => {
    return evaluateCitizenEligibility(currentProfile, VERIFIED_WELFARE_SCHEMES);
  }, [currentProfile]);

  const qualifiedSchemes = useMemo(() => {
    return evaluations.filter((e) => e.eligibility_status === "ELIGIBLE");
  }, [evaluations]);

  // Handle Language Switch
  const handleSwitchLanguage = (newLang: PortalLanguage) => {
    setLanguage(newLang);
    const activePreset = PERSONA_PRESETS.find((p) => p.id === selectedPresetId);
    if (activePreset) {
      setNaturalText(activePreset.naturalQuery[newLang]);
    }
  };

  // Handle One-Click Persona Chip Click
  const handleSelectPersona = (preset: PersonaPreset) => {
    setSelectedPresetId(preset.id);
    setNaturalText(preset.naturalQuery[language]);
    setAge(preset.age);
    setGender(preset.gender);
    setAnnualIncome(preset.annualIncome);
    setStateName(preset.state);
    setOccupation(preset.occupation);
    setIsFarmer(preset.isFarmer);
    setTenureType(preset.tenureType);
    setLandAcres(preset.landAcres);
    setIrrigationType(preset.irrigationType);
    setStatusFeedback(null);
  };

  // Parse conversational text via backend Gemini API & auto-fill form controls
  const handleAnalyzeNaturalText = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!naturalText.trim()) return;

    setIsAnalyzingText(true);
    setStatusFeedback(null);

    try {
      const response = await fetch("/api/extract", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: naturalText })
      });

      const extracted = (await response.json()) as CitizenExtractedSchema & { error?: string };
      if (!response.ok) {
        throw new Error(extracted.error || "Could not parse input text.");
      }

      setSelectedPresetId("");
      if (typeof extracted.demographics.age === "number") {
        setAge(Math.min(95, Math.max(15, extracted.demographics.age)));
      }
      if (extracted.demographics.gender) {
        setGender(extracted.demographics.gender);
      }
      if (typeof extracted.demographics.annual_income === "number") {
        setAnnualIncome(Math.min(1000000, Math.max(0, extracted.demographics.annual_income)));
      }
      if (extracted.demographics.state && extracted.demographics.state !== "all") {
        setStateName(extracted.demographics.state);
      }
      if (extracted.demographics.occupation) {
        setOccupation(extracted.demographics.occupation);
      }

      const detectedFarmer = Boolean(
        extracted.agri_specific.is_farmer || extracted.demographics.occupation === "farmer"
      );
      setIsFarmer(detectedFarmer);

      if (detectedFarmer) {
        if (extracted.agri_specific.tenure_type === "tenant" || extracted.agri_specific.owns_land === false) {
          setTenureType("tenant");
        } else {
          setTenureType("owner");
        }
        if (typeof extracted.agri_specific.land_hectares === "number") {
          const ac = hectaresToAcres(extracted.agri_specific.land_hectares);
          setLandAcres(Math.min(25, Math.max(0.25, Number(ac.toFixed(1)))));
        }
        if (extracted.agri_specific.irrigation_type) {
          setIrrigationType(extracted.agri_specific.irrigation_type);
        }
      }

      setStatusFeedback(
        language === "marathi"
          ? "तुमच्या वर्णनावरून फॉर्ममधील सर्व माहिती आपोआप अपडेट केली आहे."
          : language === "hindi"
          ? "आपके विवरण के आधार पर नीचे फॉर्म स्वचालित रूप से भर दिया गया है।"
          : "Form controls automatically updated from your description."
      );
    } catch {
      setStatusFeedback(
        language === "marathi"
          ? "खालील स्लायडर वापरून तुम्ही थेट माहिती बदलू शकता."
          : language === "hindi"
          ? "आप नीचे दिए गए स्लाइडर्स से सीधे बदलाव कर सकते हैं।"
          : "You can adjust any parameter directly using the controls below."
      );
    } finally {
      setIsAnalyzingText(false);
    }
  };

  // Voice Recognition input (Web Speech API)
  const handleVoiceInput = () => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setStatusFeedback(
        language === "marathi"
          ? "तुमच्या ब्राउझरमध्ये व्हॉइस टायपिंग उपलब्ध नाही; कृपया मजकूर टाईप करा."
          : language === "hindi"
          ? "आपके ब्राउज़र में वॉइस इनपुट समर्थित नहीं है; कृपया टाइप करें।"
          : "Voice input is not supported in this browser; please type your description."
      );
      return;
    }

    if (isListeningVoice) {
      setIsListeningVoice(false);
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang =
      language === "marathi" ? "mr-IN" : language === "hindi" ? "hi-IN" : "en-IN";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    setIsListeningVoice(true);
    setStatusFeedback(null);

    recognition.onresult = (event: any) => {
      const transcript = event.results?.[0]?.[0]?.transcript;
      if (transcript) {
        setNaturalText(transcript);
      }
      setIsListeningVoice(false);
    };

    recognition.onerror = () => {
      setIsListeningVoice(false);
    };

    recognition.onend = () => {
      setIsListeningVoice(false);
    };

    recognition.start();
  };

  const renderPersonaIcon = (type: PersonaPreset["icon"]) => {
    const cls = "w-4 h-4 shrink-0";
    switch (type) {
      case "farmer":
        return <Sprout className={cls} />;
      case "student":
        return <GraduationCap className={cls} />;
      case "entrepreneur":
        return <Briefcase className={cls} />;
      case "senior":
        return <HeartPulse className={cls} />;
    }
  };

  const getSectorBadgeStyle = (sector: string) => {
    switch (sector) {
      case "Agriculture":
        return "border-amber-300 bg-amber-50/90 text-amber-900";
      case "Education":
        return "border-blue-200 bg-blue-50/90 text-blue-950";
      case "Women & MSME":
        return "border-amber-300 bg-amber-50/90 text-amber-900";
      default:
        return "border-slate-300 bg-slate-100 text-slate-800";
    }
  };

  const getCardLeftAccent = (sector: string) => {
    return sector === "Agriculture"
      ? "border-l-[3px] border-l-emerald-700"
      : "border-l-[3px] border-l-blue-900";
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC] text-slate-900">
      {/* 1. Exclusive Premium GovTech Header (Deep National Navy #0F172A / bg-slate-950) */}
      <header className="sticky top-0 z-30 bg-slate-950 text-white border-b border-slate-800 shadow-sm">
        {/* Subtle 2px tricolor / warm gold accent line right at the very top */}
        <div className="h-[2.5px] w-full bg-gradient-to-r from-amber-500 via-amber-400 to-emerald-600" />

        <div className="max-w-[1380px] mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          {/* Emblem-style Logo Layout */}
          <div className="flex items-center gap-3.5 min-w-0">
            <div className="w-10 h-10 rounded-lg bg-blue-900/90 border border-amber-400/50 flex items-center justify-center text-amber-400 shadow-xs shrink-0">
              <Landmark className="w-5 h-5" />
            </div>

            <div className="min-w-0">
              <div className="flex items-center gap-2.5">
                <span className="font-display text-xl font-bold tracking-tight text-white whitespace-nowrap">
                  YojanaSathi
                </span>
                <span className="hidden md:inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] border border-amber-300 bg-amber-50/95 text-amber-900 font-semibold whitespace-nowrap">
                  <ShieldCheck className="w-3.5 h-3.5 text-amber-700" />
                  {copy.tagline}
                </span>
              </div>
              <div className="text-[10px] font-mono uppercase tracking-widest text-slate-400 truncate mt-0.5">
                {copy.govKicker}
              </div>
            </div>
          </div>

          {/* Quick Language Toggle: English | हिंदी | मराठी */}
          <div
            role="group"
            aria-label="Language Selection"
            className="flex items-center bg-slate-900 p-1 rounded-lg border border-slate-800 shrink-0"
          >
            {(
              [
                { id: "english", label: "English" },
                { id: "hindi", label: "हिंदी" },
                { id: "marathi", label: "मराठी" }
              ] as const
            ).map((langItem) => (
              <button
                key={langItem.id}
                type="button"
                onClick={() => handleSwitchLanguage(langItem.id)}
                className={`px-3.5 py-1.5 rounded-md text-xs font-semibold transition-all whitespace-nowrap cursor-pointer ${
                  language === langItem.id
                    ? "bg-blue-900 text-amber-300 border border-amber-400/40 shadow-xs"
                    : "text-slate-300 hover:text-white"
                }`}
              >
                {langItem.label}
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* Main Content Container */}
      <main className="flex-1 max-w-[1380px] w-full mx-auto px-4 sm:px-6 py-7 space-y-7">
        {/* 2. Top Persona Quick-Select (One-Click Pre-fills) */}
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-600 flex items-center gap-1.5">
              <UserCheck className="w-3.5 h-3.5 text-blue-900" />
              {copy.quickSelectTitle}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
            {PERSONA_PRESETS.map((preset) => {
              const isSelected = selectedPresetId === preset.id;
              return (
                <button
                  key={preset.id}
                  type="button"
                  onClick={() => handleSelectPersona(preset)}
                  className={`text-left p-4 rounded-xl border transition-all cursor-pointer flex items-start gap-3.5 ${
                    isSelected
                      ? "bg-white border-blue-900 shadow-md ring-1 ring-blue-900/15 border-l-[3px] border-l-amber-500"
                      : "bg-white border-slate-200 shadow-xs hover:border-slate-300 hover:shadow-sm"
                  }`}
                >
                  <div
                    className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 mt-0.5 ${
                      isSelected
                        ? "bg-blue-900 text-amber-300 border border-amber-400/40"
                        : "bg-slate-100 text-slate-700 border border-slate-200/80"
                    }`}
                  >
                    {renderPersonaIcon(preset.icon)}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div
                      className={`text-xs font-bold leading-snug ${
                        isSelected ? "text-slate-950" : "text-slate-800"
                      }`}
                    >
                      {preset.label[language]}
                    </div>
                    <div className="text-[11px] text-slate-500 mt-1 truncate">
                      {preset.subtitle[language]}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </section>

        {/* 3. Main 2-Column Dashboard Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-7 items-start">
          {/* LEFT COLUMN: Citizen Input Card - Clean & Polished */}
          <div className="lg:col-span-5 bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-6">
            <div className="border-b border-slate-200/80 pb-4 flex items-center justify-between gap-2">
              <div>
                <h2 className="font-display text-lg font-bold text-slate-950">
                  {copy.inputCardTitle}
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">{copy.inputCardSubtitle}</p>
              </div>
              <span className="px-2.5 py-0.5 rounded-full text-[11px] border border-amber-300 bg-amber-50/80 text-amber-900 font-semibold shrink-0">
                India Stack Verified
              </span>
            </div>

            {/* Conversational Text / Voice Input Bar at Top */}
            <form onSubmit={handleAnalyzeNaturalText} className="space-y-2.5">
              <label
                htmlFor="natural-query-box"
                className="block text-xs font-semibold text-slate-800"
              >
                {copy.queryLabel}
              </label>
              <div className="relative">
                <textarea
                  id="natural-query-box"
                  rows={2}
                  value={naturalText}
                  onChange={(e) => setNaturalText(e.target.value)}
                  placeholder={copy.queryPlaceholder}
                  className="w-full rounded-lg border border-slate-300 bg-slate-50/60 focus:bg-white px-3.5 py-2.5 pr-11 text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-900 focus:ring-2 focus:ring-blue-900/10 focus:outline-none leading-relaxed transition-all"
                />
                <button
                  type="button"
                  onClick={handleVoiceInput}
                  title="Voice Input"
                  className={`absolute right-2.5 top-2.5 p-2 rounded-md transition-colors cursor-pointer ${
                    isListeningVoice
                      ? "bg-red-100 text-red-700"
                      : "text-slate-500 hover:text-slate-900 hover:bg-slate-200/60"
                  }`}
                >
                  {isListeningVoice ? (
                    <MicOff className="w-4 h-4" />
                  ) : (
                    <Mic className="w-4 h-4" />
                  )}
                </button>
              </div>

              <div className="flex items-center justify-between gap-2 pt-0.5">
                {statusFeedback ? (
                  <span className="text-xs text-emerald-700 font-medium">
                    {statusFeedback}
                  </span>
                ) : (
                  <span className="text-[11px] text-slate-500">
                    Natural Language Entitlement Parser
                  </span>
                )}
                <button
                  type="submit"
                  disabled={isAnalyzingText || !naturalText.trim()}
                  className="px-4 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-white text-xs font-semibold inline-flex items-center gap-1.5 transition-colors cursor-pointer shrink-0 shadow-xs"
                >
                  {isAnalyzingText ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      {copy.analyzingButton}
                    </>
                  ) : (
                    <>
                      {copy.analyzeButton}
                      <ArrowRight className="w-3.5 h-3.5" />
                    </>
                  )}
                </button>
              </div>
            </form>

            {/* Structured Form Controls */}
            <div className="space-y-5 pt-3 border-t border-slate-200/80">
              {/* Age Stepper + Slider */}
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-slate-800">
                    {copy.ageLabel}
                  </label>
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedPresetId("");
                        setAge((prev) => Math.max(15, prev - 1));
                      }}
                      className="w-7 h-7 rounded-md border border-slate-300 bg-white hover:bg-slate-50 flex items-center justify-center text-slate-800 cursor-pointer transition-colors"
                      aria-label="Decrease Age"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="font-mono text-xs font-bold text-slate-900 tabular-nums min-w-[4.75rem] text-center bg-slate-100 border border-slate-200 px-2.5 py-1 rounded-md">
                      {age} {copy.yearsUnit}
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedPresetId("");
                        setAge((prev) => Math.min(95, prev + 1));
                      }}
                      className="w-7 h-7 rounded-md border border-slate-300 bg-white hover:bg-slate-50 flex items-center justify-center text-slate-800 cursor-pointer transition-colors"
                      aria-label="Increase Age"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
                <input
                  type="range"
                  min={15}
                  max={90}
                  value={age}
                  onChange={(e) => {
                    setSelectedPresetId("");
                    setAge(Number(e.target.value));
                  }}
                  className="gov-slider"
                />
              </div>

              {/* Gender Pill Buttons: Male | Female | Other */}
              <div className="space-y-2">
                <label className="block text-xs font-semibold text-slate-800">
                  {copy.genderLabel}
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(
                    [
                      { id: "male", label: copy.male },
                      { id: "female", label: copy.female },
                      { id: "all", label: copy.other }
                    ] as const
                  ).map((gOpt) => (
                    <button
                      key={gOpt.id}
                      type="button"
                      onClick={() => {
                        setSelectedPresetId("");
                        setGender(gOpt.id);
                      }}
                      className={`py-2 px-3 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
                        gender === gOpt.id
                          ? "bg-blue-900 text-white border-blue-900 shadow-xs"
                          : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                      }`}
                    >
                      {gOpt.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Annual Family Income Interactive Slider up to ₹10 Lakhs */}
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-slate-800">
                    {copy.incomeLabel}
                  </label>
                  <span className="font-mono text-xs font-bold text-amber-900 bg-amber-50/90 border border-amber-300 px-2.5 py-1 rounded-md tabular-nums">
                    ₹{annualIncome.toLocaleString("en-IN")} ({formatInrCompact(annualIncome)}){" "}
                    {copy.perYear}
                  </span>
                </div>
                <input
                  type="range"
                  min={20000}
                  max={1000000}
                  step={10000}
                  value={annualIncome}
                  onChange={(e) => {
                    setSelectedPresetId("");
                    setAnnualIncome(Number(e.target.value));
                  }}
                  className="gov-slider"
                />
                <div className="flex justify-between text-[11px] font-mono text-slate-500 tabular-nums">
                  <span>₹20,000</span>
                  <span className="text-blue-900 font-semibold">₹2.5L Standard Threshold</span>
                  <span>₹10,00,000</span>
                </div>
              </div>

              {/* State Selector (Default: Maharashtra) */}
              <div className="space-y-1.5">
                <label
                  htmlFor="state-select"
                  className="block text-xs font-semibold text-slate-800"
                >
                  {copy.stateLabel}
                </label>
                <div className="relative">
                  <MapPin className="w-4 h-4 text-blue-900 absolute left-3.5 top-2.5 pointer-events-none" />
                  <select
                    id="state-select"
                    value={stateName}
                    onChange={(e) => {
                      setSelectedPresetId("");
                      setStateName(e.target.value);
                    }}
                    className="w-full rounded-lg border border-slate-300 bg-slate-50/70 pl-9 pr-4 py-2 text-xs font-semibold text-slate-900 focus:border-blue-900 focus:bg-white focus:outline-none"
                  >
                    {INDIAN_STATES.map((st) => (
                      <option key={st} value={st}>
                        {st}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Specialized Deep-Dive Drawer for Agriculture (Refined Sage / Parchment Container) */}
            <div
              className={`rounded-xl border transition-all overflow-hidden ${
                isFarmer
                  ? "bg-emerald-50/40 border-emerald-200"
                  : "bg-slate-50/70 border-slate-200"
              }`}
            >
              {/* Toggle Header */}
              <div className="p-4 flex items-center justify-between gap-4">
                <div className="flex items-start gap-3">
                  <div
                    className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 mt-0.5 ${
                      isFarmer
                        ? "bg-slate-900 text-amber-400 border border-slate-800"
                        : "bg-slate-200 text-slate-600"
                    }`}
                  >
                    <Sprout className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-900">
                      {copy.agriToggleTitle}
                    </div>
                    <div className="text-[11px] text-slate-600 mt-0.5 leading-snug">
                      {copy.agriToggleDesc}
                    </div>
                  </div>
                </div>

                {/* Switch Button */}
                <button
                  type="button"
                  role="switch"
                  aria-checked={isFarmer}
                  onClick={() => {
                    setSelectedPresetId("");
                    const nextVal = !isFarmer;
                    setIsFarmer(nextVal);
                    if (nextVal) {
                      setOccupation("farmer");
                      if (landAcres === 0) setLandAcres(3.0);
                    } else if (occupation === "farmer") {
                      setOccupation("other");
                    }
                  }}
                  className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out ${
                    isFarmer ? "bg-blue-900" : "bg-slate-300"
                  }`}
                >
                  <span
                    className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-xs transition duration-200 ease-in-out ${
                      isFarmer ? "translate-x-5" : "translate-x-0"
                    }`}
                  />
                </button>
              </div>

              {/* Expanded Agriculture Parameters when Toggled ON */}
              {isFarmer && (
                <div className="px-4 pb-4 pt-3 border-t border-emerald-200/80 space-y-4">
                  {/* Land Ownership: Owner vs Tenant */}
                  <div className="space-y-1.5">
                    <label className="block text-xs font-semibold text-slate-800">
                      {copy.landOwnershipLabel}
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      {(
                        [
                          { id: "owner", label: copy.ownerOption },
                          { id: "tenant", label: copy.tenantOption }
                        ] as const
                      ).map((tenOpt) => (
                        <button
                          key={tenOpt.id}
                          type="button"
                          onClick={() => {
                            setSelectedPresetId("");
                            setTenureType(tenOpt.id);
                          }}
                          className={`py-2 px-3 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
                            tenureType === tenOpt.id
                              ? "bg-slate-900 text-white border-slate-900 shadow-xs"
                              : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
                          }`}
                        >
                          {tenOpt.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Landholding Size Slider with Dual Display: Acres and Hectares */}
                  <div className="space-y-2.5">
                    <div className="flex items-center justify-between gap-2">
                      <label className="text-xs font-semibold text-slate-800">
                        {copy.landSizeLabel}
                      </label>
                      <div className="flex items-center gap-1.5 font-mono text-xs font-bold tabular-nums">
                        <span className="bg-white border border-slate-300 text-slate-900 px-2.5 py-0.5 rounded-md">
                          {landAcres.toFixed(1)} {copy.acresUnit}
                        </span>
                        <span className="text-slate-400">=</span>
                        <span className="bg-amber-50/90 border border-amber-300 text-amber-900 px-2.5 py-0.5 rounded-md">
                          {landHectares.toFixed(2)} {copy.hectaresUnit}
                        </span>
                      </div>
                    </div>
                    <input
                      type="range"
                      min={0.5}
                      max={15}
                      step={0.5}
                      value={landAcres}
                      onChange={(e) => {
                        setSelectedPresetId("");
                        setLandAcres(Number(e.target.value));
                      }}
                      className="gov-slider"
                    />
                    <div className="flex justify-between text-[11px] font-mono text-slate-500 tabular-nums">
                      <span>0.5 Acre (0.20 Ha)</span>
                      <span className="text-slate-800 font-semibold">
                        5.0 Ha (12.3 Acres) Ceiling
                      </span>
                      <span>15 Acres</span>
                    </div>
                  </div>

                  {/* Irrigation Type: Rainfed / Drip / Canal */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-800 flex items-center gap-1.5">
                      <Droplets className="w-3.5 h-3.5 text-blue-900" />
                      {copy.irrigationLabel}
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {(
                        [
                          { id: "rainfed", label: copy.rainfedOption },
                          { id: "borewell_drip", label: copy.dripOption },
                          { id: "canal", label: copy.canalOption }
                        ] as const
                      ).map((irrOpt) => (
                        <button
                          key={irrOpt.id}
                          type="button"
                          onClick={() => {
                            setSelectedPresetId("");
                            setIrrigationType(irrOpt.id);
                          }}
                          className={`py-2 px-2.5 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
                            irrigationType === irrOpt.id
                              ? "bg-slate-900 text-white border-slate-900 shadow-xs"
                              : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
                          }`}
                        >
                          {irrOpt.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* RIGHT COLUMN: Eligible Welfare Schemes */}
          <div className="lg:col-span-7 space-y-5">
            {/* Top Banner: Deep National Navy + Royal Blue & Forest Green Verification */}
            <div className="bg-slate-950 text-white rounded-2xl p-5 shadow-sm border border-slate-800 border-l-4 border-l-emerald-500 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-start sm:items-center gap-3.5">
                <div className="w-11 h-11 rounded-xl bg-emerald-700/25 border border-emerald-500/40 flex items-center justify-center shrink-0">
                  <CheckCircle2 className="w-6 h-6 text-emerald-400" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="font-display text-xl font-bold tracking-tight text-white">
                      {copy.foundSchemesBanner(qualifiedSchemes.length)}
                    </h2>
                  </div>
                  <p className="text-xs text-slate-300 mt-0.5">
                    {copy.foundSchemesSub}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 self-start sm:self-center bg-slate-900 border border-amber-400/40 text-amber-300 px-3.5 py-1.5 rounded-lg text-xs font-mono tabular-nums shrink-0">
                <span>
                  {stateName} · {age} yrs · {formatInrCompact(annualIncome)}
                  {isFarmer ? ` · ${landHectares} Ha` : ""}
                </span>
              </div>
            </div>

            {/* Eligible Scheme Cards List */}
            {qualifiedSchemes.length > 0 ? (
              <div className="space-y-4">
                {qualifiedSchemes.map((evalItem) => {
                  const { scheme, qualify_reasons } = evalItem;
                  const localized =
                    language === "hindi"
                      ? scheme.translations?.hindi
                      : language === "marathi"
                      ? scheme.translations?.marathi
                      : undefined;

                  const displayName = localized?.name || scheme.name;
                  const displaySector = localized?.sectorLabel || scheme.sector;
                  const displayBenefit =
                    localized?.benefitHighlight || scheme.annual_benefit_inr;
                  const displaySummary = localized?.summary || scheme.benefit_summary;
                  const displayDocs = localized?.documents || scheme.required_documents;
                  const displayReasons =
                    language === "hindi"
                      ? qualify_reasons.hindi
                      : language === "marathi"
                      ? qualify_reasons.marathi
                      : qualify_reasons.english;

                  return (
                    <article
                      key={scheme.id}
                      className={`bg-white border border-slate-200 ${getCardLeftAccent(
                        scheme.sector
                      )} rounded-xl p-6 shadow-sm hover:shadow-md transition-all space-y-4`}
                    >
                      {/* Header Row: Sector Badge + 100% Eligible Forest Green Badge */}
                      <div className="space-y-2">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <div className="flex items-center gap-2">
                            <span
                              className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-semibold border ${getSectorBadgeStyle(
                                scheme.sector
                              )}`}
                            >
                              {displaySector}
                            </span>
                            <span className="text-xs font-medium text-slate-500">
                              {scheme.ministry}
                            </span>
                          </div>

                          {/* Rich Emerald / Forest Green strictly reserved for 100% Eligible */}
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
                            {copy.eligibleStatusBadge}
                          </span>
                        </div>

                        <h3 className="font-display text-lg font-bold text-slate-950 leading-snug">
                          {displayName}
                        </h3>
                      </div>

                      {/* Highlighted Benefit Box */}
                      <div className="bg-slate-50 border border-slate-200/90 rounded-lg p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div className="flex items-start gap-2.5">
                          <Award className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                          <div>
                            <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                              {copy.benefitBoxLabel}
                            </div>
                            <div className="font-display text-base font-bold text-slate-950 mt-0.5 tabular-nums">
                              {displayBenefit}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Plain-Language Scheme Description */}
                      <p className="text-sm text-slate-600 leading-relaxed">
                        {displaySummary}
                      </p>

                      {/* "Why You Qualify" Pills (Forest Green Checkmarks + Muted Slate/Gold Pills) */}
                      <div className="space-y-2">
                        <div className="text-xs font-semibold text-slate-800">
                          {copy.whyYouQualifyLabel}
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {displayReasons.map((reasonText, rIdx) => (
                            <span
                              key={rIdx}
                              className="inline-flex items-center gap-1 px-3 py-1 rounded-md text-xs font-semibold bg-emerald-50/70 text-emerald-800 border border-emerald-200 font-mono tabular-nums"
                            >
                              {reasonText}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Document Checklist + Solid Deep Navy Apply Button */}
                      <div className="pt-4 border-t border-slate-200/80 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                        <div className="space-y-2 flex-1">
                          <div className="text-xs font-semibold text-slate-800 flex items-center gap-1.5">
                            <FileCheck2 className="w-3.5 h-3.5 text-blue-900" />
                            {copy.documentsLabel}
                          </div>
                          <div className="flex flex-wrap gap-1.5">
                            {displayDocs.map((doc, dIdx) => (
                              <span
                                key={dIdx}
                                className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-amber-50/70 text-amber-950 border border-amber-300/80"
                              >
                                {doc}
                              </span>
                            ))}
                          </div>
                        </div>

                        <a
                          href={scheme.official_portal}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-5 py-2.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold inline-flex items-center justify-center gap-2 shadow-xs transition-colors whitespace-nowrap shrink-0"
                        >
                          {copy.applyPortalBtn}
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      </div>
                    </article>
                  );
                })}
              </div>
            ) : (
              <div className="bg-white border border-slate-200 rounded-xl p-8 text-center space-y-3 shadow-sm">
                <div className="w-12 h-12 rounded-xl bg-slate-100 text-blue-900 flex items-center justify-center mx-auto">
                  <Landmark className="w-6 h-6" />
                </div>
                <h3 className="font-display text-base font-bold text-slate-950">
                  {copy.noSchemesTitle}
                </h3>
                <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed">
                  {copy.noSchemesSub}
                </p>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Clean Premium GovTech Footer */}
      <footer className="bg-slate-950 text-slate-400 border-t border-slate-800 mt-12 py-5 px-4 sm:px-6">
        <div className="max-w-[1380px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2.5 font-semibold text-white">
            <Landmark className="w-4 h-4 text-amber-400" />
            <span>YojanaSathi — Direct Citizen Entitlement Engine</span>
          </div>
          <div className="text-slate-400">
            National Digital Welfare &amp; Agricultural Entitlement Architecture
          </div>
        </div>
      </footer>
    </div>
  );
}
