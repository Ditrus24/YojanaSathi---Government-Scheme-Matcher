import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import {
  CitizenExtractedSchema,
  EmpatheticExplanationResponse,
  ExplainLanguage,
  SchemeEvaluationResult
} from "./src/types/yojana.ts";
import {
  computeMissingFields,
  evaluateCitizenEligibility
} from "./src/engine/ruleEngine.ts";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function getGeminiClient() {
  return new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build"
      }
    }
  });
}

const EXTRACTION_SYSTEM_INSTRUCTION = `You are the core intelligence layer of YojanaSathi, a public welfare eligibility platform in India.
Task A: Profile Extraction (Natural Language -> JSON)
When the citizen speaks or types casually (e.g., "I have 3 acres of land in Nashik, annual family income is around 1.8 Lakhs, and I want drip irrigation subsidy"):
1. Convert units accurately into hectares (1 Acre ≈ 0.404 Hectares, rounded to 2 decimal places; e.g., 3 acres = 1.21 hectares; 2.5 acres = 1.01 hectares; 1 Hectare ≈ 2.47 Acres).
2. Identify missing fields (e.g., demographics.age, demographics.gender, agri_specific.tenure_type / tenure proof) and list them in the "missing_fields" array rather than assuming defaults.
3. Return ONLY the JSON object matching the Universal & Agricultural Schema Definition.
4. Normalize state names: if a district/city in Maharashtra (e.g., Nashik, Pune, Solapur, Wardha, Latur, Nagpur, Satara) is mentioned, set state to "Maharashtra".
5. Normalize annual income in INR: e.g., "1.8 Lakhs" -> 180000.
6. Note on tenure_type: Only set tenure_type to "owner" if the citizen explicitly states they own the land (e.g. "I own 3 acres", "majhya swatahachi zameen"). If they casually say "I have 3 acres of land" without specifying ownership vs lease/tenancy proof, set owns_land to true, tenure_type to null, and flag "agri_specific.tenure_type" in missing_fields so tenure proof is verified.`;

const EXTRACTION_RESPONSE_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    demographics: {
      type: Type.OBJECT,
      properties: {
        age: {
          type: Type.NUMBER,
          nullable: true,
          description: "Age of the citizen in years, or null if not mentioned."
        },
        gender: {
          type: Type.STRING,
          nullable: true,
          enum: ["male", "female", "all"],
          description: "Gender of the citizen: 'male', 'female', 'all', or null if not mentioned."
        },
        annual_income: {
          type: Type.NUMBER,
          nullable: true,
          description: "Annual household/family income in INR (e.g., 1.8 Lakhs -> 180000), or null if not mentioned."
        },
        state: {
          type: Type.STRING,
          description: "Standard Indian State name (e.g. 'Maharashtra') or 'all' if not mentioned."
        },
        occupation: {
          type: Type.STRING,
          enum: [
            "farmer",
            "student",
            "business_owner",
            "unemployed",
            "homemaker",
            "other"
          ],
          description: "Primary occupation category."
        }
      },
      required: ["age", "gender", "annual_income", "state", "occupation"]
    },
    agri_specific: {
      type: Type.OBJECT,
      properties: {
        is_farmer: {
          type: Type.BOOLEAN,
          description: "True if the person is engaged in farming, agriculture, or allied agricultural activities."
        },
        owns_land: {
          type: Type.BOOLEAN,
          nullable: true,
          description: "True if owns agricultural land, false if landless/tenant without ownership, or null if unknown."
        },
        land_hectares: {
          type: Type.NUMBER,
          nullable: true,
          description: "Landholding size normalized strictly into Hectares (1 Acre = 0.404 Hectares, e.g., 3 acres = 1.21 ha), or null if not mentioned."
        },
        tenure_type: {
          type: Type.STRING,
          nullable: true,
          enum: ["owner", "tenant", "allied"],
          description: "'owner', 'tenant', 'allied', or null if formal tenure proof is not explicitly confirmed."
        },
        irrigation_type: {
          type: Type.STRING,
          nullable: true,
          enum: ["rainfed", "borewell_drip", "canal"],
          description: "'rainfed', 'borewell_drip' (includes drip irrigation, borewell, well, sprinkler), 'canal', or null."
        }
      },
      required: [
        "is_farmer",
        "owns_land",
        "land_hectares",
        "tenure_type",
        "irrigation_type"
      ]
    },
    missing_fields: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "Array of missing or ambiguous field keys, e.g. 'demographics.age', 'agri_specific.tenure_type'."
    },
    extracted_summary: {
      type: Type.STRING,
      description: "Concise summary of extracted citizen parameters and unit conversions (e.g. 3 acres = 1.21 hectares)."
    }
  },
  required: ["demographics", "agri_specific", "missing_fields", "extracted_summary"]
};

const EXPLANATION_RESPONSE_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    language: {
      type: Type.STRING,
      enum: ["english", "hinglish", "marathi"]
    },
    greeting_and_overview: {
      type: Type.STRING,
      description: "Empathetic, warm, non-bureaucratic opening addressing the citizen directly in the requested language."
    },
    scheme_explanations: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          scheme_id: { type: Type.STRING },
          scheme_name: { type: Type.STRING },
          headline_benefit: {
            type: Type.STRING,
            description: "2 simple sentences summarizing what the scheme provides and its core benefit."
          },
          why_you_qualify: {
            type: Type.STRING,
            description: "Explicitly explain why they matched based on their specific numbers (e.g., 'Matched because your landholding of 1.21 ha is below the 5.0 ha ceiling for small/marginal farmer subsidy and your income of ₹1.8L is within the ₹2.5L limit')."
          },
          how_to_apply_steps: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: "Actionable next steps in simple conversational terms."
          },
          documents_checklist: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: "Documents required in conversational terms (e.g., 7/12 Satbara extract for tenure proof, Aadhaar-linked bank passbook)."
          }
        },
        required: [
          "scheme_id",
          "scheme_name",
          "headline_benefit",
          "why_you_qualify",
          "how_to_apply_steps",
          "documents_checklist"
        ]
      }
    },
    missing_info_guidance: {
      type: Type.STRING,
      description: "Conversational note on which missing fields (like age or formal 7/12 tenure proof) the citizen should confirm."
    },
    closing_encouragement: {
      type: Type.STRING,
      description: "Warm closing reassurance."
    }
  },
  required: [
    "language",
    "greeting_and_overview",
    "scheme_explanations",
    "missing_info_guidance",
    "closing_encouragement"
  ]
};

async function extractCitizenProfile(query: string): Promise<CitizenExtractedSchema> {
  const ai = getGeminiClient();
  const response = await ai.models.generateContent({
    model: "gemini-3.8-flash",
    contents: `Extract the Universal & Agricultural JSON Schema from this citizen query:\n\n"${query}"`,
    config: {
      systemInstruction: EXTRACTION_SYSTEM_INSTRUCTION,
      responseMimeType: "application/json",
      responseSchema: EXTRACTION_RESPONSE_SCHEMA,
      temperature: 0.1
    }
  });

  const rawText = response.text || "{}";
  const parsed = JSON.parse(rawText) as CitizenExtractedSchema;

  const normalized: CitizenExtractedSchema = {
    demographics: {
      age: typeof parsed.demographics?.age === "number" ? parsed.demographics.age : null,
      gender: parsed.demographics?.gender ?? null,
      annual_income:
        typeof parsed.demographics?.annual_income === "number"
          ? parsed.demographics.annual_income
          : null,
      state: parsed.demographics?.state || "all",
      occupation: parsed.demographics?.occupation || "other"
    },
    agri_specific: {
      is_farmer: Boolean(
        parsed.agri_specific?.is_farmer || parsed.demographics?.occupation === "farmer"
      ),
      owns_land:
        typeof parsed.agri_specific?.owns_land === "boolean"
          ? parsed.agri_specific.owns_land
          : null,
      land_hectares:
        typeof parsed.agri_specific?.land_hectares === "number"
          ? Number(parsed.agri_specific.land_hectares.toFixed(2))
          : null,
      tenure_type: parsed.agri_specific?.tenure_type ?? null,
      irrigation_type: parsed.agri_specific?.irrigation_type ?? null
    },
    missing_fields: Array.isArray(parsed.missing_fields) ? parsed.missing_fields : [],
    extracted_summary: parsed.extracted_summary || "Extracted citizen parameters from natural query."
  };

  normalized.missing_fields = computeMissingFields(normalized);
  return normalized;
}

async function generateEmpatheticExplanation(
  profile: CitizenExtractedSchema,
  evaluations: SchemeEvaluationResult[],
  language: ExplainLanguage
): Promise<EmpatheticExplanationResponse> {
  const ai = getGeminiClient();
  const eligibleAndConditional = evaluations.filter(
    (e) => e.eligibility_status === "ELIGIBLE" || e.eligibility_status === "CONDITIONALLY_ELIGIBLE"
  );

  const languageInstructions: Record<ExplainLanguage, string> = {
    english:
      "Write in warm, conversational, non-bureaucratic Indian English.",
    hinglish:
      "Write in natural, conversational, empathetic Hinglish (Hindi in Roman script mixed with clear terms).",
    marathi:
      "Write in warm, easy-to-understand conversational Marathi (मराठी देवनागरी लिपीत)."
  };

  const promptPayload = {
    citizen_profile: profile,
    verified_eligible_schemes: eligibleAndConditional.map((item) => ({
      scheme_id: item.scheme.id,
      scheme_name: item.scheme.name,
      status: item.eligibility_status,
      annual_benefit_inr: item.scheme.annual_benefit_inr,
      benefit_summary: item.scheme.benefit_summary,
      required_documents: item.scheme.required_documents,
      application_channel: item.scheme.application_channel,
      rules: item.scheme.rules,
      missing_blocking_fields: item.missing_blocking_fields
    }))
  };

  const response = await ai.models.generateContent({
    model: "gemini-3.8-flash",
    contents: `Task B: Explain Matched Schemes to the citizen.\nTarget Language Mode: ${language.toUpperCase()}\n${
      languageInstructions[language]
    }\n\nVerified Engine Input:\n${JSON.stringify(promptPayload, null, 2)}`,
    config: {
      systemInstruction: `You are Task B of YojanaSathi (Direct Citizen Entitlement Engine).
When provided with an evaluated citizen profile and matching schemes from the YojanaSathi rule engine:
1. Summarize each scheme in 2 simple sentences in "headline_benefit".
2. In "why_you_qualify", explain explicitly why they matched based on their specific numbers (e.g., "Matched because your landholding of 1.21 ha is below the 5.0 ha ceiling for small/marginal farmer subsidy, and your annual income of ₹1.8L is within the ₹2.5L threshold").
3. List actionable next steps ("how_to_apply_steps") and documents required ("documents_checklist") in conversational terms.
4. Never hallucinate schemes outside the provided list.`,
      responseMimeType: "application/json",
      responseSchema: EXPLANATION_RESPONSE_SCHEMA,
      temperature: 0.25
    }
  });

  const parsed = JSON.parse(response.text || "{}") as EmpatheticExplanationResponse;
  return {
    language,
    greeting_and_overview: parsed.greeting_and_overview || "",
    scheme_explanations: Array.isArray(parsed.scheme_explanations)
      ? parsed.scheme_explanations
      : [],
    missing_info_guidance: parsed.missing_info_guidance || "",
    closing_encouragement: parsed.closing_encouragement || ""
  };
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: "2mb" }));

  // Endpoint 1: Task A — Strict Schema Extraction from natural query
  app.post("/api/extract", async (req, res) => {
    try {
      const { query } = req.body;
      if (!query || typeof query !== "string") {
        return res.status(400).json({ error: "Citizen query string is required." });
      }
      const extracted = await extractCitizenProfile(query);
      return res.json(extracted);
    } catch (error: any) {
      console.error("Error in /api/extract:", error);
      return res.status(500).json({
        error: error?.message || "Failed to extract structured schema from citizen query."
      });
    }
  });

  // Endpoint 2: Deterministic Rule Engine Evaluation
  app.post("/api/evaluate", (req, res) => {
    try {
      const profile = req.body.profile as CitizenExtractedSchema;
      if (!profile || !profile.demographics || !profile.agri_specific) {
        return res.status(400).json({ error: "Valid CitizenExtractedSchema profile is required." });
      }
      profile.missing_fields = computeMissingFields(profile);
      const evaluations = evaluateCitizenEligibility(profile);
      return res.json({
        profile,
        evaluations
      });
    } catch (error: any) {
      console.error("Error in /api/evaluate:", error);
      return res.status(500).json({
        error: error?.message || "Failed to evaluate deterministic rules."
      });
    }
  });

  // Endpoint 3: Task B — Empathetic Regional Explanation
  app.post("/api/explain", async (req, res) => {
    try {
      const {
        profile,
        evaluations,
        language = "english"
      }: {
        profile: CitizenExtractedSchema;
        evaluations?: SchemeEvaluationResult[];
        language?: ExplainLanguage;
      } = req.body;

      if (!profile || !profile.demographics) {
        return res.status(400).json({ error: "Citizen profile is required for explanation." });
      }

      const resolvedEvaluations = evaluations || evaluateCitizenEligibility(profile);
      const explanation = await generateEmpatheticExplanation(
        profile,
        resolvedEvaluations,
        language
      );

      return res.json(explanation);
    } catch (error: any) {
      console.error("Error in /api/explain:", error);
      return res.status(500).json({
        error: error?.message || "Failed to generate scheme explanation."
      });
    }
  });

  // Endpoint 4: Full Pipeline (Task A + Deterministic Engine + Task B)
  app.post("/api/analyze", async (req, res) => {
    try {
      const { query, language = "english" }: { query: string; language?: ExplainLanguage } =
        req.body;
      if (!query || typeof query !== "string") {
        return res.status(400).json({ error: "Citizen query string is required." });
      }

      const profile = await extractCitizenProfile(query);
      const evaluations = evaluateCitizenEligibility(profile);
      const explanation = await generateEmpatheticExplanation(profile, evaluations, language);

      return res.json({
        profile,
        evaluations,
        explanation
      });
    } catch (error: any) {
      console.error("Error in /api/analyze:", error);
      return res.status(500).json({
        error: error?.message || "Failed to run YojanaSathi intelligence pipeline."
      });
    }
  });

  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa"
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(__dirname, "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`YojanaSathi Server running on http://localhost:${PORT}`);
  });
}

startServer();
