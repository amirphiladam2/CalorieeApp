import { MealType } from "./todayMeals";

export type MealCategory = {
  type: MealType;
  label: string;
  icon: string;
  bgColor: string;
  activeBgColor: string;
  textColor: string;
  activeTextColor: string;
};

export const mealCategories: MealCategory[] = [
  {
    type: "Breakfast",
    label: "Breakfast",
    icon: "☀️",
    bgColor: "#FEF3C7",
    activeBgColor: "#F59E0B",
    textColor: "#92400E",
    activeTextColor: "#FFFFFF",
  },
  {
    type: "Lunch",
    label: "Lunch",
    icon: "🍽️",
    bgColor: "#ECFDF5",
    activeBgColor: "#10B981",
    textColor: "#0df2aaff",
    activeTextColor: "#FFFFFF",
  },
  {
    type: "Snacks",
    label: "Snack",
    icon: "🍪",
    bgColor: "#F3E8FF",
    activeBgColor: "#8B5CF6",
    textColor: "#5B21B6",
    activeTextColor: "#FFFFFF",
  },
  {
    type: "Dinner",
    label: "Dinner",
    icon: "🌙",
    bgColor: "#E0F2FE",
    activeBgColor: "#0EA5E9",
    textColor: "#075985",
    activeTextColor: "#FFFFFF",
  },
];
