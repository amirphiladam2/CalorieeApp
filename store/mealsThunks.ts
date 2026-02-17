import type { MealType } from "@/data/todayMeals";
import { supabase } from "@/lib/supabase";
import type { AppDispatch } from ".";
import { addMeal as addMealAction,
   deleteMeal as deleteMealAction, 
setMeals, updateMeal as updateMealAction } from "./mealsSlice";
import { getLocalDateString } from "@/utils/DateRangeHelper";

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

    }
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

