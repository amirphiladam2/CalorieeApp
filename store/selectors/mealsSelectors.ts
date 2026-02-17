import { createSelector } from "@reduxjs/toolkit";
import type { RootState } from "@/store";
import { getRangeForFilter } from "@/utils/DateRangeHelper";

type Filter = "Today" | "Week" | "Month";

type Macros = {
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
};

const selectMeals = (state: RootState) => state.meals.meals;

export const makeSelectMacrosByRange = (
  filter: Filter,
  referenceDate: string
) =>
  createSelector([selectMeals], (meals): Macros => {
    const { start, end } = getRangeForFilter(filter, referenceDate);

    return meals
      .filter((meal) => meal.date >= start && meal.date <= end)
      .reduce<Macros>(
        (acc, meal) => {
          acc.calories += meal.calories ?? 0;
          acc.protein += meal.protein ?? 0;
          acc.carbs += meal.carbs ?? 0;
          acc.fats += meal.fats ?? 0;
          return acc;
        },
        { calories: 0, protein: 0, carbs: 0, fats: 0 }
      );
  });
