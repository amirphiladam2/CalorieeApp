import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { Meal } from "@/data/todayMeals";

type MealsState = {
  meals: Meal[];
  loading: boolean;
};

const initialState: MealsState = {
  meals: [],
  loading: false,
};

const mealsSlice = createSlice({
  name: "meals",
  initialState,
  reducers: {
    setMeals(state, action: PayloadAction<Meal[]>) {
      state.meals = action.payload;
    },
    addMeal(state, action: PayloadAction<Meal>) {
      state.meals.unshift(action.payload);
    },
    updateMeal(
      state,
      action: PayloadAction<{ id: string; updates: Partial<Meal> }>
    ) {
      const meal = state.meals.find(m => m.id === action.payload.id);
      if (meal) Object.assign(meal, action.payload.updates);
    },
    deleteMeal(state, action: PayloadAction<string>) {
      state.meals = state.meals.filter(m => m.id !== action.payload);
    },
  },
});

export const {
  setMeals,
  addMeal,
  updateMeal,
  deleteMeal,
} = mealsSlice.actions;

export default mealsSlice.reducer;
