export type MealType = "Breakfast" | "Lunch" | "Snacks" | "Dinner"|"Shake";

export type Meal = {
  id: string;
  meal: MealType;
  calories: number;
  time: string;
  date:string;

  protein?:number;
  carbs?:number;
  fats?:number;
};

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
