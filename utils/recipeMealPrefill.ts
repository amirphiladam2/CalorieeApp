import type { MealType } from "@/data/todayMeals";

type RecipeMealPrefillSource = {
  title: string;
  summary: string;
  mealType: string;
  servings: number;
  estimatedNutrition: {
    calories: number;
    proteinGrams: number;
    carbsGrams: number;
    fatGrams: number;
  };
};

type BuildMealPrefillOptions = {
  sourcePrompt?: string;
};

const DEFAULT_MEAL_TIMES: Record<MealType, string> = {
  Breakfast: "08:00",
  Lunch: "13:00",
  Snacks: "16:00",
  Dinner: "19:00",
  Shake: "10:00",
};

function formatNutritionValue(value: number) {
  if (!Number.isFinite(value) || value <= 0) {
    return "";
  }

  const roundedValue = Math.round(value * 10) / 10;
  return Number.isInteger(roundedValue)
    ? String(roundedValue)
    : roundedValue.toFixed(1).replace(/\.0$/, "");
}

export function normalizeRecipeMealType(mealType: string | null | undefined): MealType {
  const normalizedMealType = mealType?.trim().toLowerCase() ?? "";

  if (normalizedMealType.includes("breakfast")) {
    return "Breakfast";
  }

  if (normalizedMealType.includes("lunch")) {
    return "Lunch";
  }

  if (
    normalizedMealType.includes("snack") ||
    normalizedMealType.includes("treat")
  ) {
    return "Snacks";
  }

  if (normalizedMealType.includes("dinner") || normalizedMealType.includes("supper")) {
    return "Dinner";
  }

  if (
    normalizedMealType.includes("shake") ||
    normalizedMealType.includes("smoothie")
  ) {
    return "Shake";
  }

  return "Breakfast";
}

export function buildMealPrefillFromRecipe(
  recipe: RecipeMealPrefillSource,
  options?: BuildMealPrefillOptions
) {
  const mealType = normalizeRecipeMealType(recipe.mealType);

  return {
    source: "recipe",
    meal: mealType,
    time: DEFAULT_MEAL_TIMES[mealType],
    calories: formatNutritionValue(recipe.estimatedNutrition.calories),
    protein: formatNutritionValue(recipe.estimatedNutrition.proteinGrams),
    carbs: formatNutritionValue(recipe.estimatedNutrition.carbsGrams),
    fats: formatNutritionValue(recipe.estimatedNutrition.fatGrams),
    recipeTitle: recipe.title,
    recipeSummary: recipe.summary,
    recipeServings: String(recipe.servings),
    recipeSourcePrompt: options?.sourcePrompt ?? "",
  };
}
