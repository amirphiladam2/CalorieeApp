export type MealType = "Breakfast" | "Lunch" | "Snacks" | "Dinner"|"Shake";

export type MealRecipeMetadata = {
  recipe_title?: string | null;
  recipe_summary?: string | null;
  recipe_source_prompt?: string | null;
  recipe_servings?: number | null;
};

export type Meal = {
  id: string;
  meal: MealType;
  calories: number;
  time: string;
  date:string;

  protein?:number;
  carbs?:number;
  fats?:number;
} & MealRecipeMetadata;

export const todayMeals: Meal[] = [
  {
    id: "1",
    meal: "Breakfast",
    calories: 120,
    time: "08:30",
    date: "2026-01-01"

  },
  {
    id: "2",
    meal: "Lunch",
    calories: 320,
    time: "13:00",
    date: "2026-01-01"
 
  },
  {
    id: "3",
    meal: "Snacks",
    calories: 100,
    time: "16:30",
    date: "2026-01-01"
  },
  {
    id: "4",
    meal: "Dinner",
    calories: 480,
    time: "20:00",
    date: "2026-01-01"
  },
  {
    id: "5",
    meal: "Shake",
    calories: 480,
    time: "20:00",
    date: "2026-01-01"
  },
];
