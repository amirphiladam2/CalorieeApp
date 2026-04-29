import Ionicons from "@expo/vector-icons/Ionicons";

import { MealType } from "./todayMeals";

export type MealCategory = {
  type: MealType;
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  bgColor: string;
  activeBgColor: string;
  textColor: string;
  activeTextColor: string;
};

export const mealCategories: MealCategory[] = [
  {
    type: "Breakfast",
    label: "Breakfast",
    icon: "sunny-outline",
    bgColor: "#FEF3C7",
    activeBgColor: "#F59E0B",
    textColor: "#92400E",
    activeTextColor: "#FFFFFF",
  },
  {
    type: "Lunch",
    label: "Lunch",
    icon: "restaurant-outline",
    bgColor: "#DCFCE7",
    activeBgColor: "#10B981",
    textColor: "#047857",
    activeTextColor: "#FFFFFF",
  },
  {
    type: "Snacks",
    label: "Snack",
    icon: "cafe-outline",
    bgColor: "#FCE7F3",
    activeBgColor: "#EC4899",
    textColor: "#9D174D",
    activeTextColor: "#FFFFFF",
  },
  {
    type: "Dinner",
    label: "Dinner",
    icon: "moon-outline",
    bgColor: "#DBEAFE",
    activeBgColor: "#3B82F6",
    textColor: "#1D4ED8",
    activeTextColor: "#FFFFFF",
  },
  {
    type: "Shake",
    label: "Shake",
    icon: "water-outline",
    bgColor: "#E0F2FE",
    activeBgColor: "#06B6D4",
    textColor: "#0F766E",
    activeTextColor: "#FFFFFF",
  },
];
