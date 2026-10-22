import {
  CitizenExtractedSchema,
  RuleCheckTrace,
  SchemeEvaluationResult,
  WelfareScheme
} from "../types/yojana";
import { VERIFIED_WELFARE_SCHEMES } from "./schemesData";

/**
 * Deterministic unit conversion helper
 * 1 Acre ≈ 0.404 Hectares (e.g. 3 acres = 1.21 hectares)
 * 1 Hectare ≈ 2.47 Acres
 */
export function acresToHectares(acres: number): number {
  return Number((acres * 0.404).toFixed(2));
}

export function hectaresToAcres(hectares: number): number {
  return Number((hectares * 2.47).toFixed(2));
}

/**
 * Formats an INR value in compact Lakh / Rupee notation (e.g., 180000 -> "₹1.8L", 95000 -> "₹0.95L")
 */
export function formatInrCompact(amount: number | null): string {
  if (amount === null || amount === undefined) return "—";
  if (amount >= 100000) {
    const lakhs = Number((amount / 100000).toFixed(2));
    return `₹${lakhs}L`;
  }
  return `₹${amount.toLocaleString("en-IN")}`;
}

export function computeMissingFields(schema: CitizenExtractedSchema): string[] {
  const missing = new Set<string>(schema.missing_fields || []);

  if (schema.demographics.age === null) {
    missing.add("demographics.age");
  }
  if (schema.demographics.gender === null) {
    missing.add("demographics.gender");
  }
  if (schema.demographics.annual_income === null) {
    missing.add("demographics.annual_income");
  }
  if (!schema.demographics.state || schema.demographics.state === "all") {
    missing.add("demographics.state");
  }

  if (schema.agri_specific.is_farmer || schema.demographics.occupation === "farmer") {
    if (schema.agri_specific.owns_land === null) {
      missing.add("agri_specific.owns_land");
    }
    if (schema.agri_specific.owns_land !== false && schema.agri_specific.land_hectares === null) {
      missing.add("agri_specific.land_hectares");
    }
    if (schema.agri_specific.tenure_type === null) {
      missing.add("agri_specific.tenure_type");
    }
    if (schema.agri_specific.irrigation_type === null) {
      missing.add("agri_specific.irrigation_type");
    }
  }

  if (schema.demographics.age !== null) missing.delete("demographics.age");
  if (schema.demographics.gender !== null) missing.delete("demographics.gender");
  if (schema.demographics.annual_income !== null) missing.delete("demographics.annual_income");
  if (schema.demographics.state && schema.demographics.state !== "all") {
    missing.delete("demographics.state");
  }
  if (schema.agri_specific.owns_land !== null) missing.delete("agri_specific.owns_land");
  if (schema.agri_specific.land_hectares !== null) missing.delete("agri_specific.land_hectares");
  if (schema.agri_specific.tenure_type !== null) missing.delete("agri_specific.tenure_type");
  if (schema.agri_specific.irrigation_type !== null) missing.delete("agri_specific.irrigation_type");

  return Array.from(missing);
}

/**
 * Strictly deterministic rule engine evaluating a citizen's profile
 * against every scheme in VERIFIED_WELFARE_SCHEMES and generating explicit
 * "Why You Qualify" verification pills in English, Hindi, and Marathi.
 */
export function evaluateCitizenEligibility(
  profile: CitizenExtractedSchema,
  schemes: WelfareScheme[] = VERIFIED_WELFARE_SCHEMES
): SchemeEvaluationResult[] {
  const { demographics, agri_specific } = profile;

  const results: SchemeEvaluationResult[] = schemes.map((scheme) => {
    const { rules } = scheme;
    const trace: RuleCheckTrace[] = [];
    const missingBlocking: string[] = [];

    const reasonsEn: string[] = [];
    const reasonsHi: string[] = [];
    const reasonsMr: string[] = [];

    // 1. Occupation & Farmer Status
    if (rules.requires_farmer !== undefined) {
      const isFarmer = agri_specific.is_farmer || demographics.occupation === "farmer";
      trace.push({
        field: "agri_specific.is_farmer",
        label: "Agricultural / Farmer Status",
        required_condition: rules.requires_farmer ? "Must be an active farmer" : "Any",
        citizen_value: isFarmer ? "Yes (Farmer)" : `No (${demographics.occupation})`,
        status: isFarmer === rules.requires_farmer ? "passed" : "failed"
      });
      if (isFarmer === rules.requires_farmer) {
        reasonsEn.push("✓ Active Agriculture Profile");
        reasonsHi.push("✓ सक्रिय कृषि प्रोफाइल");
        reasonsMr.push("✓ सक्रिय शेतकरी प्रोफाइल");
      }
    } else if (rules.allowed_occupations && rules.allowed_occupations.length > 0) {
      const occPassed = rules.allowed_occupations.includes(demographics.occupation);
      trace.push({
        field: "demographics.occupation",
        label: "Occupation Category",
        required_condition: `One of: ${rules.allowed_occupations.join(", ")}`,
        citizen_value: demographics.occupation,
        status: occPassed ? "passed" : "failed"
      });
      if (occPassed) {
        if (demographics.occupation === "student") {
          reasonsEn.push("✓ Enrolled Student Category");
          reasonsHi.push("✓ पंजीकृत विद्यार्थी श्रेणी");
          reasonsMr.push("✓ महाविद्यालयीन विद्यार्थी प्रवर्ग");
        } else if (demographics.occupation === "business_owner") {
          reasonsEn.push("✓ MSME / Self-Employed Trade");
          reasonsHi.push("✓ स्वरोजगार / MSME उद्यमी");
          reasonsMr.push("✓ स्वयंरोजगार / MSME व्यावसायिक");
        }
      }
    }

    // 2. Landholding Size in Hectares (Priority pill for Agriculture!)
    if (rules.min_land_hectares !== undefined || rules.max_land_hectares !== undefined) {
      const reqLand =
        rules.min_land_hectares !== undefined && rules.max_land_hectares !== undefined
          ? `${rules.min_land_hectares} Ha to ${rules.max_land_hectares.toFixed(1)} Ha`
          : rules.min_land_hectares !== undefined
          ? `>= ${rules.min_land_hectares} Ha`
          : `<= ${rules.max_land_hectares?.toFixed(1)} Ha`;

      if (agri_specific.land_hectares === null) {
        missingBlocking.push("agri_specific.land_hectares");
        trace.push({
          field: "agri_specific.land_hectares",
          label: "Normalized Landholding (Hectares)",
          required_condition: reqLand,
          citizen_value: "Not provided",
          status: "missing_data"
        });
      } else {
        const minLandOk =
          rules.min_land_hectares === undefined ||
          agri_specific.land_hectares >= rules.min_land_hectares;
        const maxLandOk =
          rules.max_land_hectares === undefined ||
          agri_specific.land_hectares <= rules.max_land_hectares;
        const landPassed = minLandOk && maxLandOk;
        trace.push({
          field: "agri_specific.land_hectares",
          label: "Normalized Landholding (Hectares)",
          required_condition: reqLand,
          citizen_value: `${agri_specific.land_hectares} Ha (~${hectaresToAcres(
            agri_specific.land_hectares
          )} acres)`,
          status: landPassed ? "passed" : "failed"
        });
        if (landPassed) {
          if (rules.max_land_hectares !== undefined) {
            reasonsEn.push(
              `✓ Land ${agri_specific.land_hectares} Ha <= ${rules.max_land_hectares.toFixed(
                1
              )} Ha limit`
            );
            reasonsHi.push(
              `✓ भूमि ${agri_specific.land_hectares} Ha <= ${rules.max_land_hectares.toFixed(
                1
              )} Ha सीमा`
            );
            reasonsMr.push(
              `✓ जमीन ${agri_specific.land_hectares} Ha <= ${rules.max_land_hectares.toFixed(
                1
              )} Ha मर्यादा`
            );
          } else {
            reasonsEn.push(`✓ Cultivable Land ${agri_specific.land_hectares} Ha verified`);
            reasonsHi.push(`✓ कृषि भूमि ${agri_specific.land_hectares} Ha सत्यापित`);
            reasonsMr.push(`✓ शेतजमीन ${agri_specific.land_hectares} Ha प्रमाणित`);
          }
        }
      }
    }

    // 3. Annual Income Criterion
    if (rules.max_annual_income !== undefined) {
      const capCompact = formatInrCompact(rules.max_annual_income);
      const reqIncome = `<= ₹${rules.max_annual_income.toLocaleString("en-IN")} (${capCompact})`;
      if (demographics.annual_income === null) {
        missingBlocking.push("demographics.annual_income");
        trace.push({
          field: "demographics.annual_income",
          label: "Annual Family Income",
          required_condition: reqIncome,
          citizen_value: "Not provided",
          status: "missing_data"
        });
      } else {
        const incomeOk = demographics.annual_income <= rules.max_annual_income;
        const citCompact = formatInrCompact(demographics.annual_income);
        trace.push({
          field: "demographics.annual_income",
          label: "Annual Family Income",
          required_condition: reqIncome,
          citizen_value: `₹${demographics.annual_income.toLocaleString("en-IN")} (${citCompact})`,
          status: incomeOk ? "passed" : "failed"
        });
        if (incomeOk) {
          reasonsEn.push(`✓ Income ${citCompact} <= ${capCompact} limit`);
          reasonsHi.push(`✓ वार्षिक आय ${citCompact} <= ${capCompact} सीमा`);
          reasonsMr.push(`✓ उत्पन्न ${citCompact} <= ${capCompact} मर्यादा`);
        }
      }
    }

    // 4. Age Criterion
    if (rules.min_age !== undefined || rules.max_age !== undefined) {
      const reqText =
        rules.min_age !== undefined && rules.max_age !== undefined
          ? `${rules.min_age} to ${rules.max_age} years`
          : rules.min_age !== undefined
          ? `>= ${rules.min_age} years`
          : `<= ${rules.max_age} years`;

      if (demographics.age === null) {
        missingBlocking.push("demographics.age");
        trace.push({
          field: "demographics.age",
          label: "Applicant Age",
          required_condition: reqText,
          citizen_value: "Not provided",
          status: "missing_data"
        });
      } else {
        const minOk = rules.min_age === undefined || demographics.age >= rules.min_age;
        const maxOk = rules.max_age === undefined || demographics.age <= rules.max_age;
        const agePassed = minOk && maxOk;
        trace.push({
          field: "demographics.age",
          label: "Applicant Age",
          required_condition: reqText,
          citizen_value: `${demographics.age} years`,
          status: agePassed ? "passed" : "failed"
        });
        if (agePassed) {
          if (rules.min_age && rules.min_age >= 65) {
            reasonsEn.push(`✓ Senior Age ${demographics.age} >= ${rules.min_age} yrs`);
            reasonsHi.push(`✓ वरिष्ठ आयु ${demographics.age} >= ${rules.min_age} वर्ष`);
            reasonsMr.push(`✓ ज्येष्ठ वय ${demographics.age} >= ${rules.min_age} वर्षे`);
          } else if (rules.max_age) {
            reasonsEn.push(
              `✓ Age ${demographics.age} within ${rules.min_age ?? 18}–${rules.max_age} yrs`
            );
            reasonsHi.push(
              `✓ आयु ${demographics.age} (${rules.min_age ?? 18}–${rules.max_age} वर्ष सीमा)`
            );
            reasonsMr.push(
              `✓ वय ${demographics.age} (${rules.min_age ?? 18}–${rules.max_age} वयोगट)`
            );
          } else {
            reasonsEn.push(`✓ Age ${demographics.age} >= ${rules.min_age} yrs`);
            reasonsHi.push(`✓ आयु ${demographics.age} >= ${rules.min_age} वर्ष`);
            reasonsMr.push(`✓ वय ${demographics.age} >= ${rules.min_age} वर्षे`);
          }
        }
      }
    }

    // 5. State Jurisdiction
    if (rules.allowed_states && !rules.allowed_states.includes("all")) {
      if (!demographics.state || demographics.state === "all") {
        missingBlocking.push("demographics.state");
        trace.push({
          field: "demographics.state",
          label: "State Domicile",
          required_condition: rules.allowed_states.join(" or "),
          citizen_value: "Not specified",
          status: "missing_data"
        });
      } else {
        const normalizedCitizenState = demographics.state.trim().toLowerCase();
        const stateMatch = rules.allowed_states.some(
          (s) => s.toLowerCase() === normalizedCitizenState
        );
        trace.push({
          field: "demographics.state",
          label: "State Domicile",
          required_condition: rules.allowed_states.join(" or "),
          citizen_value: demographics.state,
          status: stateMatch ? "passed" : "failed"
        });
        if (stateMatch) {
          reasonsEn.push(`✓ ${demographics.state} State Domicile`);
          reasonsHi.push(`✓ ${demographics.state} राज्य अधिवास`);
          reasonsMr.push(`✓ ${demographics.state} राज्य अधिवास`);
        }
      }
    }

    // 6. Gender Criterion
    if (rules.allowed_genders && !rules.allowed_genders.includes("all")) {
      if (demographics.gender === null || demographics.gender === "all") {
        missingBlocking.push("demographics.gender");
        trace.push({
          field: "demographics.gender",
          label: "Applicant Gender",
          required_condition: rules.allowed_genders.join(" / "),
          citizen_value: "Not specified",
          status: "missing_data"
        });
      } else {
        const genderMatch = rules.allowed_genders.includes(demographics.gender);
        trace.push({
          field: "demographics.gender",
          label: "Applicant Gender",
          required_condition: rules.allowed_genders.join(" / "),
          citizen_value: demographics.gender,
          status: genderMatch ? "passed" : "failed"
        });
        if (genderMatch && demographics.gender === "female") {
          reasonsEn.push("✓ Women Beneficiary Quota");
          reasonsHi.push("✓ महिला लाभार्थी पात्रता");
          reasonsMr.push("✓ महिला लाभार्थी पात्रता");
        }
      }
    }

    // 7. Land Ownership Criterion
    if (rules.requires_land_ownership !== undefined) {
      if (agri_specific.owns_land === null) {
        missingBlocking.push("agri_specific.owns_land");
        trace.push({
          field: "agri_specific.owns_land",
          label: "Land Ownership (7/12 Record)",
          required_condition: "Must own cultivable land",
          citizen_value: "Not specified",
          status: "missing_data"
        });
      } else {
        trace.push({
          field: "agri_specific.owns_land",
          label: "Land Ownership (7/12 Record)",
          required_condition: "Must own cultivable land",
          citizen_value: agri_specific.owns_land ? "Yes (Landowner)" : "No (Landless / Tenant)",
          status: agri_specific.owns_land === rules.requires_land_ownership ? "passed" : "failed"
        });
      }
    }

    // 8. Tenure Type Criterion
    if (rules.allowed_tenure_types && rules.allowed_tenure_types.length > 0) {
      if (agri_specific.tenure_type === null) {
        missingBlocking.push("agri_specific.tenure_type");
        trace.push({
          field: "agri_specific.tenure_type",
          label: "Tenure Proof / Type",
          required_condition: rules.allowed_tenure_types.join(" / "),
          citizen_value: "Not specified",
          status: "missing_data"
        });
      } else {
        const tenureOk = rules.allowed_tenure_types.includes(agri_specific.tenure_type);
        trace.push({
          field: "agri_specific.tenure_type",
          label: "Tenure Proof / Type",
          required_condition: rules.allowed_tenure_types.join(" / "),
          citizen_value: agri_specific.tenure_type,
          status: tenureOk ? "passed" : "failed"
        });
        if (tenureOk) {
          reasonsEn.push(
            agri_specific.tenure_type === "owner" ? "✓ Landowner (7/12 Title)" : "✓ Tenant Eligible"
          );
          reasonsHi.push(
            agri_specific.tenure_type === "owner" ? "✓ भूमि स्वामी (7/12)" : "✓ किरायेदार किसान पात्र"
          );
          reasonsMr.push(
            agri_specific.tenure_type === "owner" ? "✓ ७/१२ जमीन मालक" : "✓ कुळ / भाडेकरू शेतकरी पात्र"
          );
        }
      }
    }

    // 9. Irrigation Type Criterion
    if (rules.allowed_irrigation_types && rules.allowed_irrigation_types.length > 0) {
      if (agri_specific.irrigation_type === null) {
        missingBlocking.push("agri_specific.irrigation_type");
        trace.push({
          field: "agri_specific.irrigation_type",
          label: "Irrigation Source",
          required_condition: rules.allowed_irrigation_types.join(" / "),
          citizen_value: "Not specified",
          status: "missing_data"
        });
      } else {
        const irrOk = rules.allowed_irrigation_types.includes(agri_specific.irrigation_type);
        trace.push({
          field: "agri_specific.irrigation_type",
          label: "Irrigation Source",
          required_condition: rules.allowed_irrigation_types.join(" / "),
          citizen_value: agri_specific.irrigation_type,
          status: irrOk ? "passed" : "failed"
        });
      }
    }

    const failedCount = trace.filter((t) => t.status === "failed").length;
    const missingCount = trace.filter((t) => t.status === "missing_data").length;
    const passedCount = trace.filter((t) => t.status === "passed").length;

    let eligibility_status: SchemeEvaluationResult["eligibility_status"] = "ELIGIBLE";
    if (failedCount > 0) {
      eligibility_status = "INELIGIBLE";
    } else if (missingCount > 0) {
      eligibility_status = "CONDITIONALLY_ELIGIBLE";
    }

    return {
      scheme,
      eligibility_status,
      passed_checks: passedCount,
      total_checks: trace.length,
      missing_blocking_fields: Array.from(new Set(missingBlocking)),
      rule_trace: trace,
      qualify_reasons: {
        english: reasonsEn.slice(0, 3),
        hindi: reasonsHi.slice(0, 3),
        marathi: reasonsMr.slice(0, 3)
      }
    };
  });

  const order = { ELIGIBLE: 0, CONDITIONALLY_ELIGIBLE: 1, INELIGIBLE: 2 };
  return results.sort((a, b) => order[a.eligibility_status] - order[b.eligibility_status]);
}
