import { corsHeaders } from "../_shared/cors.ts";

type GenerateRecipeRequest = {
  ingredients: string[];
  calorieTarget?: number | null;
  servings?: number | null;
  mealType?: string | null;
  notes?: string | null;
};

type GeminiCandidate = {
  content?: {
    parts?: Array<{
      text?: string;
    }>;
  };
};

type GeminiResponse = {
  candidates?: GeminiCandidate[];
  error?: {
    message?: string;
  };
};

const GEMINI_MODEL = "gemini-2.5-flash";

function getGeminiApiKey() {
  const rawKey = Deno.env.get("GEMINI_API_KEY");

  if (!rawKey) {
    return null;
  }

  const normalizedKey = rawKey.trim().replace(/^['"]|['"]$/g, "");

  return normalizedKey || null;
}

const geminiApiKey = getGeminiApiKey();

if (!geminiApiKey) {
  console.error("Missing GEMINI_API_KEY secret for generate-recipe function.");
}

const recipeSchema = {
  type: "object",
  properties: {
    title: { type: "string" },
    summary: { type: "string" },
    mealType: { type: "string" },
    servings: { type: "number" },
    prepTimeMinutes: { type: "number" },
    cookTimeMinutes: { type: "number" },
    ingredients: {
      type: "array",
      items: {
        type: "object",
        properties: {
          name: { type: "string" },
          amount: { type: "string" },
          preparation: { type: ["string", "null"] },
        },
        required: ["name", "amount", "preparation"],
        additionalProperties: false,
      },
    },
    steps: {
      type: "array",
      items: { type: "string" },
    },
    estimatedNutrition: {
      type: "object",
      properties: {
        calories: { type: "number" },
        proteinGrams: { type: "number" },
        carbsGrams: { type: "number" },
        fatGrams: { type: "number" },
      },
      required: ["calories", "proteinGrams", "carbsGrams", "fatGrams"],
      additionalProperties: false,
    },
    tips: {
      type: "array",
      items: { type: "string" },
    },
  },
  required: [
    "title",
    "summary",
    "mealType",
    "servings",
    "prepTimeMinutes",
    "cookTimeMinutes",
    "ingredients",
    "steps",
    "estimatedNutrition",
    "tips",
  ],
  additionalProperties: false,
} as const;

function jsonResponse(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      ...corsHeaders,
      "Content-Type": "application/json",
    },
  });
}

function getRecipeFunctionError(error: unknown) {
  const fallbackMessage = "Recipe generation failed.";

  if (!(error instanceof Error)) {
    return {
      status: 500,
      message: fallbackMessage,
    };
  }

  const message = error.message || fallbackMessage;
  const normalizedMessage = message.toLowerCase();

  if (
    normalizedMessage.includes("invalid api key") ||
    normalizedMessage.includes("api key not valid") ||
    normalizedMessage.includes("permission denied")
  ) {
    return {
      status: 500,
      message:
        "Gemini API key is invalid. Update the GEMINI_API_KEY Supabase secret and redeploy the generate-recipe function.",
    };
  }

  if (
    normalizedMessage.includes("quota") ||
    normalizedMessage.includes("rate limit") ||
    normalizedMessage.includes("resource exhausted")
  ) {
    return {
      status: 429,
      message: "Gemini rate limit reached. Please try again in a moment.",
    };
  }

  if (
    normalizedMessage.includes("model") &&
    (normalizedMessage.includes("not found") ||
      normalizedMessage.includes("unsupported"))
  ) {
    return {
      status: 500,
      message:
        "The Gemini model configuration is invalid. Update the model in the generate-recipe function and redeploy.",
    };
  }

  return {
    status: 500,
    message,
  };
}

function extractGeminiText(payload: GeminiResponse) {
  const parts = payload.candidates?.[0]?.content?.parts ?? [];

  return parts
    .map((part) => part.text ?? "")
    .join("\n")
    .trim();
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return jsonResponse({ error: "Method not allowed" }, 405);
  }

  try {
    if (!geminiApiKey) {
      throw new Error("Missing GEMINI_API_KEY secret.");
    }

    const {
      ingredients,
      calorieTarget,
      servings,
      mealType,
      notes,
    } = (await req.json()) as GenerateRecipeRequest;

    const normalizedIngredients = Array.isArray(ingredients)
      ? ingredients.map((item) => item.trim()).filter(Boolean)
      : [];

    if (normalizedIngredients.length === 0) {
      return jsonResponse(
        { error: "Provide at least one ingredient." },
        400,
      );
    }

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-goog-api-key": geminiApiKey,
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: [
                    "You are a recipe API.",
                    "Generate practical recipes from ingredient lists.",
                    "Return only JSON that fits the provided schema.",
                    "Prefer recipes that use most of the provided ingredients.",
                    "If an ingredient is optional or not used, mention it in tips rather than inventing uses.",
                    "Nutrition values should be reasonable estimates.",
                    `Ingredients: ${normalizedIngredients.join(", ")}`,
                    `Desired meal type: ${mealType?.trim() || "Any"}`,
                    `Target servings: ${servings ?? 2}`,
                    `Target calories: ${calorieTarget ?? 500}`,
                    `Additional notes: ${notes?.trim() || "None"}`,
                  ].join("\n"),
                },
              ],
            },
          ],
          generationConfig: {
            responseMimeType: "application/json",
            responseJsonSchema: recipeSchema,
          },
        }),
      },
    );

    const data = (await response.json()) as GeminiResponse;

    if (!response.ok) {
      throw new Error(data.error?.message || "Gemini request failed.");
    }

    const content = extractGeminiText(data);

    if (!content) {
      throw new Error("Gemini returned an empty recipe response.");
    }

    return jsonResponse(JSON.parse(content));
  } catch (error) {
    const { status, message } = getRecipeFunctionError(error);

    return jsonResponse({ error: message }, status);
  }
});
