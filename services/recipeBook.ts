import AsyncStorage from "@react-native-async-storage/async-storage";

import { supabase } from "@/lib/supabase";
import type { GeneratedRecipe } from "@/services/recipeGenerator";

const RECIPE_DRAFT_KEY = "@caloriee_recipe_draft_v1";

type RecipeIngredient = GeneratedRecipe["ingredients"][number];
type RecipeNutrition = GeneratedRecipe["estimatedNutrition"];

export type StoredRecipe = GeneratedRecipe & {
  id: string;
  createdAt: string;
  sourcePrompt: string;
  sourceIngredients: string[];
};

type StageRecipeInput = {
  recipe: GeneratedRecipe;
  prompt: string;
  ingredients: string[];
};

type SavedRecipeRow = {
  id: string;
  user_id: string;
  title: string;
  summary: string;
  meal_type: string;
  servings: number;
  prep_time_minutes: number;
  cook_time_minutes: number;
  ingredients: RecipeIngredient[];
  steps: string[];
  estimated_nutrition: RecipeNutrition;
  tips: string[];
  source_prompt: string;
  source_ingredients: string[];
  created_at: string;
};

type SavedRecipeInsert = Omit<SavedRecipeRow, "id" | "created_at">;

const createDraftRecipe = ({
  recipe,
  prompt,
  ingredients,
}: StageRecipeInput): StoredRecipe => ({
  ...recipe,
  id: `draft-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`,
  createdAt: new Date().toISOString(),
  sourcePrompt: prompt,
  sourceIngredients: ingredients,
});

function mapRecipeBookError(error: unknown, fallbackMessage: string) {
  if (error && typeof error === "object" && "code" in error) {
    const code = String(error.code);

    if (code === "42P01") {
      return "Saved recipes are not set up in Supabase yet. Apply the saved_recipes migration first.";
    }

    if (code === "42501") {
      return "You do not have permission to access saved recipes right now. Check the saved_recipes policies.";
    }
  }

  if (error instanceof Error && error.message.trim()) {
    return error.message;
  }

  return fallbackMessage;
}

function mapRowToStoredRecipe(row: SavedRecipeRow): StoredRecipe {
  return {
    id: row.id,
    createdAt: row.created_at,
    title: row.title,
    summary: row.summary,
    mealType: row.meal_type,
    servings: row.servings,
    prepTimeMinutes: row.prep_time_minutes,
    cookTimeMinutes: row.cook_time_minutes,
    ingredients: Array.isArray(row.ingredients) ? row.ingredients : [],
    steps: Array.isArray(row.steps) ? row.steps : [],
    estimatedNutrition: row.estimated_nutrition,
    tips: Array.isArray(row.tips) ? row.tips : [],
    sourcePrompt: row.source_prompt,
    sourceIngredients: Array.isArray(row.source_ingredients)
      ? row.source_ingredients
      : [],
  };
}

function mapInputToInsert(userId: string, input: StageRecipeInput): SavedRecipeInsert {
  return {
    user_id: userId,
    title: input.recipe.title,
    summary: input.recipe.summary,
    meal_type: input.recipe.mealType,
    servings: input.recipe.servings,
    prep_time_minutes: input.recipe.prepTimeMinutes,
    cook_time_minutes: input.recipe.cookTimeMinutes,
    ingredients: input.recipe.ingredients,
    steps: input.recipe.steps,
    estimated_nutrition: input.recipe.estimatedNutrition,
    tips: input.recipe.tips,
    source_prompt: input.prompt,
    source_ingredients: input.ingredients,
  };
}

async function getCurrentUserId(required: true): Promise<string>;
async function getCurrentUserId(required?: false): Promise<string | null>;
async function getCurrentUserId(required = false) {
  const {
    data: { session },
  } = await supabase.auth.getSession();

  const userId = session?.user?.id ?? null;

  if (!userId && required) {
    throw new Error("Sign in to save recipes across devices.");
  }

  return userId;
}

export async function stageRecipeDraft(input: StageRecipeInput) {
  const draft = createDraftRecipe(input);
  await AsyncStorage.setItem(RECIPE_DRAFT_KEY, JSON.stringify(draft));
  return draft;
}

export async function getRecipeDraft() {
  const rawValue = await AsyncStorage.getItem(RECIPE_DRAFT_KEY);

  if (!rawValue) {
    return null;
  }

  try {
    return JSON.parse(rawValue) as StoredRecipe;
  } catch {
    return null;
  }
}

export async function getSavedRecipes(limit?: number) {
  const userId = await getCurrentUserId();

  if (!userId) {
    return [] as StoredRecipe[];
  }

  let query = supabase
    .from("saved_recipes")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (typeof limit === "number") {
    query = query.limit(limit);
  }

  const { data, error } = await query;

  if (error) {
    throw new Error(
      mapRecipeBookError(error, "Unable to load your saved recipes right now.")
    );
  }

  return ((data ?? []) as SavedRecipeRow[]).map(mapRowToStoredRecipe);
}

export async function listSavedRecipes(limit?: number) {
  return getSavedRecipes(limit);
}

export async function getSavedRecipeById(id: string) {
  const userId = await getCurrentUserId();

  if (!userId) {
    return null;
  }

  const { data, error } = await supabase
    .from("saved_recipes")
    .select("*")
    .eq("id", id)
    .eq("user_id", userId)
    .maybeSingle();

  if (error) {
    throw new Error(
      mapRecipeBookError(error, "Unable to open that saved recipe right now.")
    );
  }

  return data ? mapRowToStoredRecipe(data as SavedRecipeRow) : null;
}

export async function saveRecipe(input: StageRecipeInput) {
  const userId = await getCurrentUserId(true);

  const { data: existingRows, error: existingError } = await supabase
    .from("saved_recipes")
    .select("*")
    .eq("user_id", userId)
    .eq("title", input.recipe.title)
    .eq("source_prompt", input.prompt)
    .limit(1);

  if (existingError) {
    throw new Error(
      mapRecipeBookError(existingError, "Unable to check your saved recipes.")
    );
  }

  const existingRecipe = (existingRows as SavedRecipeRow[] | null)?.[0];

  if (existingRecipe) {
    return mapRowToStoredRecipe(existingRecipe);
  }

  const { data, error } = await supabase
    .from("saved_recipes")
    .insert(mapInputToInsert(userId, input))
    .select("*")
    .single();

  if (error || !data) {
    throw new Error(
      mapRecipeBookError(error, "Unable to save this recipe right now.")
    );
  }

  return mapRowToStoredRecipe(data as SavedRecipeRow);
}

export async function saveDraftRecipe() {
  const draft = await getRecipeDraft();

  if (!draft) {
    throw new Error("No recipe draft found. Generate a recipe first.");
  }

  return saveRecipe({
    recipe: draft,
    prompt: draft.sourcePrompt,
    ingredients: draft.sourceIngredients,
  });
}

export async function getRecipeForDetail(id?: string) {
  if (id) {
    const savedRecipe = await getSavedRecipeById(id);
    return {
      recipe: savedRecipe,
      source: savedRecipe ? ("saved" as const) : ("missing" as const),
    };
  }

  const draftRecipe = await getRecipeDraft();
  return {
    recipe: draftRecipe,
    source: draftRecipe ? ("draft" as const) : ("missing" as const),
  };
}

export async function deleteRecipe(id: string) {
  const userId = await getCurrentUserId(true);

  const { error } = await supabase
    .from("saved_recipes")
    .delete()
    .eq("id", id)
    .eq("user_id", userId);

  if (error) {
    throw new Error(
      mapRecipeBookError(error, "Unable to delete this recipe right now.")
    );
  }
}
