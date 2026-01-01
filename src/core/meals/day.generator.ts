import { MealWithAnalysis } from "./meal.types";
import { Macros } from "../foods/food.types";
import { sumMacros } from "../nutrition/macros";

/**
 * Représente une journée complète
 */
export interface DayPlan {
  meals: MealWithAnalysis[];
  totalMacros: Macros;
  score: number;
}

/**
 * Génère une journée complète à partir de pools de repas
 */
export function generateDayPlan(args: {
  mealsPool: MealWithAnalysis[];
  mealsPerDay: number;
}): DayPlan | null {
  const { mealsPool, mealsPerDay } = args;

  if (mealsPool.length < mealsPerDay) return null;

  // stratégie simple & stable : meilleurs repas en premier
  const selected = mealsPool.slice(0, mealsPerDay);

  const totalMacros = sumMacros(selected.map(m => m.macros));

  const score =
    selected.reduce((acc, m) => acc + m.score, 0) / mealsPerDay;

  return {
    meals: selected,
    totalMacros,
    score: Math.round(score),
  };
}
