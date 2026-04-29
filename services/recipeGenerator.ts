import type { Meal } from "@/data/todayMeals";

import { supabase } from "@/lib/supabase";

export type GeneratedRecipe = {
  title: string;
  summary: string;
  mealType: string;
  servings: number;
  prepTimeMinutes: number;
  cookTimeMinutes: number;
  ingredients: {
    name: string;
    amount: string;
    preparation: string | null;
  }[];
  steps: string[];
  estimatedNutrition: {
    calories: number;
    proteinGrams: number;
    carbsGrams: number;
    fatGrams: number;
  };
  tips: string[];
};

type GenerateRecipeParams = {
  ingredients: string[];
  calorieTarget?: number;
  mealType?: string;
  notes?: string;
  servings?: number;
};

export function parseIngredientInput(input: string) {
  return input
    .split(/\r?\n|,/)
    .map((item) => item.trim())
    .filter(Boolean);
}

export function buildRecipeNotes(meals: Meal[]) {
  if (meals.length === 0) {
    return "No meals logged yet today.";
  }

  return meals
    .map((meal) => `${meal.meal} at ${meal.time} (${meal.calories} cal)`)
    .join("; ");
}

async function getFunctionErrorMessage(error: unknown) {
  if (
    error &&
    typeof error === "object" &&
    "context" in error &&
    error.context &&
    typeof error.context === "object" &&
    "json" in error.context &&
    typeof error.context.json === "function"
  ) {
    try {
      const payload = await error.context.json();

      if (
        payload &&
        typeof payload === "object" &&
        "error" in payload &&
        typeof payload.error === "string"
      ) {
        return payload.error;
      }

      if (
        payload &&
        typeof payload === "object" &&
        "message" in payload &&
        typeof payload.message === "string"
      ) {
        return payload.message;
      }
    } catch {
      // Fall through to the generic error message below.
    }
  }

  if (error instanceof Error) {
    return error.message;
  }

  return "Recipe generation failed.";
}

function isGeneratedRecipe(value: unknown): value is GeneratedRecipe {
  if (!value || typeof value !== "object") {
    return false;
  }

  const candidate = value as Record<string, unknown>;

  return (
    typeof candidate.title === "string" &&
    typeof candidate.summary === "string" &&
    Array.isArray(candidate.ingredients) &&
    Array.isArray(candidate.steps) &&
    typeof candidate.estimatedNutrition === "object" &&
    candidate.estimatedNutrition !== null
  );
}

export async function generateRecipe(params: GenerateRecipeParams) {
  const {
    data: { session },
  } = await supabase.auth.getSession();

  const headers: Record<string, string> = {};

  if (session?.access_token) {
    headers.Authorization = `Bearer ${session.access_token}`;
  }

  const { data, error } = await supabase.functions.invoke("generate-recipe", {
    body: params,
    headers,
  });

  if (error) {
    throw new Error(await getFunctionErrorMessage(error));
  }

  if (
    data &&
    typeof data === "object" &&
    "error" in data &&
    typeof data.error === "string"
  ) {
    throw new Error(data.error);
  }

  if (!isGeneratedRecipe(data)) {
    throw new Error("Recipe generator returned an invalid response.");
  }

  return data;
}
