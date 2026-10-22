export type GenderOption = "male" | "female" | "all" | null;
export type OccupationOption =
  | "farmer"
  | "student"
  | "business_owner"
  | "unemployed"
  | "homemaker"
  | "other";
export type TenureTypeOption = "owner" | "tenant" | "allied" | null;
export type IrrigationTypeOption = "rainfed" | "borewell_drip" | "canal" | null;

export interface DemographicsSchema {
  age: number | null;
  gender: GenderOption;
  annual_income: number | null;
  state: string | "all";
  occupation: OccupationOption;
}

export interface AgriSpecificSchema {
  is_farmer: boolean;
  owns_land: boolean | null;
  land_hectares: number | null;
  tenure_type: TenureTypeOption;
  irrigation_type: IrrigationTypeOption;
}

/**
 * Exact Universal & Agricultural Schema Definition for YojanaSathi
 */
export interface CitizenExtractedSchema {
  demographics: DemographicsSchema;
  agri_specific: AgriSpecificSchema;
  missing_fields: string[];
  extracted_summary: string;
}

export type ExplainLanguage = "english" | "hinglish" | "marathi" | "hindi";

export type SectorTag =
  | "Agriculture"
  | "Education"
  | "Women & MSME"
  | "Healthcare"
  | "Senior Welfare";

export interface SchemeRuleDefinition {
  min_age?: number;
  max_age?: number;
  allowed_genders?: ("male" | "female" | "all")[];
  max_annual_income?: number;
  allowed_states?: string[]; // ["all"] or specific states like ["Maharashtra"]
  allowed_occupations?: OccupationOption[];
  requires_farmer?: boolean;
  requires_land_ownership?: boolean;
  min_land_hectares?: number;
  max_land_hectares?: number;
  allowed_tenure_types?: ("owner" | "tenant" | "allied")[];
  allowed_irrigation_types?: ("rainfed" | "borewell_drip" | "canal")[];
}

export interface LocalizedSchemeCopy {
  name: string;
  sectorLabel: string;
  benefitHighlight: string;
  summary: string;
  documents: string[];
}

export interface WelfareScheme {
  id: string;
  code: string;
  name: string;
  sector: SectorTag;
  ministry: string;
  jurisdiction: string;
  category:
    | "Direct Income Support"
    | "Irrigation & Solar"
    | "Crop Insurance & Credit"
    | "Social Welfare & Women"
    | "Skill & Livelihood"
    | "Healthcare & Senior Care";
  annual_benefit_inr: string;
  benefit_summary: string;
  required_documents: string[];
  application_channel: string;
  official_portal: string;
  rules: SchemeRuleDefinition;
  translations?: {
    hindi: LocalizedSchemeCopy;
    marathi: LocalizedSchemeCopy;
  };
}

export interface RuleCheckTrace {
  field: string;
  label: string;
  required_condition: string;
  citizen_value: string;
  status: "passed" | "failed" | "missing_data";
}

export interface SchemeEvaluationResult {
  scheme: WelfareScheme;
  eligibility_status: "ELIGIBLE" | "CONDITIONALLY_ELIGIBLE" | "INELIGIBLE";
  passed_checks: number;
  total_checks: number;
  missing_blocking_fields: string[];
  rule_trace: RuleCheckTrace[];
  qualify_reasons: {
    english: string[];
    hindi: string[];
    marathi: string[];
  };
}

export interface CitizenExplanationItem {
  scheme_id: string;
  scheme_name: string;
  headline_benefit: string;
  why_you_qualify: string;
  how_to_apply_steps: string[];
  documents_checklist: string[];
}

export interface EmpatheticExplanationResponse {
  language: ExplainLanguage;
  greeting_and_overview: string;
  scheme_explanations: CitizenExplanationItem[];
  missing_info_guidance: string;
  closing_encouragement: string;
}
