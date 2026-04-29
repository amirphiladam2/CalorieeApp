const PROTEIN_CALORIE_RATIO = 0.3;
const CARBS_CALORIE_RATIO = 0.4;
const FATS_CALORIE_RATIO = 0.3;

const PROTEIN_CALORIES_PER_GRAM = 4;
const CARBS_CALORIES_PER_GRAM = 4;
const FATS_CALORIES_PER_GRAM = 9;

export type MacroTargets = {
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
};

function safeWholeNumber(value: number) {
  if (!Number.isFinite(value) || value <= 0) {
    return 1;
  }

  return Math.max(1, Math.round(value));
}

export function getMacroTargets(
  calorieGoal: number,
  days = 1,
  fallbackProteinGoal?: number | null,
  fallbackCarbsGoal?: number | null,
  fallbackFatsGoal?: number | null
): MacroTargets {
  const safeDays = safeWholeNumber(days);
  const totalCalories = safeWholeNumber(calorieGoal) * safeDays;

  return {
    calories: totalCalories,
    protein: fallbackProteinGoal
      ? Math.max(1, fallbackProteinGoal * safeDays)
      : 0,
    carbs: fallbackCarbsGoal
      ? Math.max(1, fallbackCarbsGoal * safeDays)
      : 0,
    fats: fallbackFatsGoal
      ? Math.max(1, fallbackFatsGoal * safeDays)
      : 0,
  };
}

export function getInclusiveDayCount(start: string, end: string) {
  const [startYear, startMonth, startDay] = start.split("-").map(Number);
  const [endYear, endMonth, endDay] = end.split("-").map(Number);

  const startDate = new Date(startYear, startMonth - 1, startDay);
  const endDate = new Date(endYear, endMonth - 1, endDay);

  const millisecondsPerDay = 24 * 60 * 60 * 1000;
  const dayCount =
    Math.floor((endDate.getTime() - startDate.getTime()) / millisecondsPerDay) + 1;

  return safeWholeNumber(dayCount);
}

export function getMacroCalorieBreakdown(
  proteinGrams: number,
  carbsGrams: number,
  fatsGrams: number
) {
  const proteinCalories = Math.max(0, proteinGrams) * PROTEIN_CALORIES_PER_GRAM;
  const carbsCalories = Math.max(0, carbsGrams) * CARBS_CALORIES_PER_GRAM;
  const fatsCalories = Math.max(0, fatsGrams) * FATS_CALORIES_PER_GRAM;
  const totalMacroCalories = proteinCalories + carbsCalories + fatsCalories;

  return {
    proteinCalories,
    carbsCalories,
    fatsCalories,
    totalMacroCalories,
  };
}
