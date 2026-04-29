import type { MealRecipeMetadata, MealType } from "@/data/todayMeals";
import { supabase } from "@/lib/supabase";
import { getLocalDateString } from "@/utils/DateRangeHelper";
import type { AppDispatch } from ".";
import {
    addMeal as addMealAction,
    deleteMeal as deleteMealAction,
    setMeals, updateMeal as updateMealAction
} from "./mealsSlice";

export const fetchTodayMeals =(userId: string) => async (dispatch: AppDispatch) => {
    const today=getLocalDateString();

    const { data, error } = await supabase
      .from("meals")
      .select("*")
      .eq("user_id", userId)
      .eq("date", today);

    if (!error && data) {
      dispatch(setMeals(data));
    }
  };

export const createMeal =
  (userId: string,
    meal: MealType,
    calories: number,
    time: string,
    date:string,
    macros?:{
      protein?:number;
      carbs?:number;
      fats?:number;
    },
    recipeMetadata?: MealRecipeMetadata
  ) =>async (dispatch: AppDispatch) => {


      const { data, error } = await supabase
        .from("meals")
        .insert({
          user_id: userId,
          meal,
          calories,
          time,
          date,
          protein:macros?.protein??null,
          carbs:macros?.carbs??null,
          fats:macros?.fats??null,
          recipe_title: recipeMetadata?.recipe_title ?? null,
          recipe_summary: recipeMetadata?.recipe_summary ?? null,
          recipe_source_prompt: recipeMetadata?.recipe_source_prompt ?? null,
          recipe_servings: recipeMetadata?.recipe_servings ?? null,
        })
        .select()
        .single();

      if (!error && data) {
        dispatch(addMealAction(data));
      }
    };

export const updateMeal =
  (
    mealId: string,
    updates: {
      meal: MealType;
      calories: number;
      time: string;
      protein?: number;
      carbs?: number;
      fats?: number;
      recipe_title?: string | null;
      recipe_summary?: string | null;
    }
  ) =>
  async (dispatch: AppDispatch) => {
    const { error } = await supabase
      .from("meals")
      .update({
        meal: updates.meal,
        calories: updates.calories,
        time: updates.time,
        protein: updates.protein ?? null,
        carbs: updates.carbs ?? null,
        fats: updates.fats ?? null,
        recipe_title: updates.recipe_title !== undefined ? updates.recipe_title : undefined,
        recipe_summary: updates.recipe_summary !== undefined ? updates.recipe_summary : undefined,
      })
      .eq("id", mealId);

    if (!error) {
      dispatch(
        updateMealAction({
          id: mealId,
          updates,
        })
      );
    }
  };

export const deleteMeal =
  (mealId: string) =>
    async (dispatch: AppDispatch) => {
      const { error } = await supabase
        .from("meals")
        .delete()
        .eq("id", mealId);

      if (!error) {
        dispatch(deleteMealAction(mealId));
      }
    };

