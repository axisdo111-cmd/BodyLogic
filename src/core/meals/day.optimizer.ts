import { DayPlan } from "./day.generator";
import { Macros } from "../foods/food.types";
import { computeMacros } from "../nutrition/macros";

/**
 * Ajuste les quantités d'une journée pour se rapprocher des targets
 */
export function optimizeDayPlan(args: {
  day: DayPlan;
  targets: Macros;
  maxIterations?: number;
  stepPct?: number; // ex: 0.05 = ±5%
}): DayPlan {
  const { day, targets } = args;
  const maxIterations = args.maxIterations ?? 10;
  const stepPct = args.stepPct ?? 0.05;

  let meals = day.meals.map(m => ({ ...m }));

  for (let iter = 0; iter < maxIterations; iter++) {
    const total = meals.reduce(
      (acc, m) => ({
        calories: acc.calories + m.macros.calories,
        protein: acc.protein + m.macros.protein,
        carbs: acc.carbs + m.macros.carbs,
        fat: acc.fat + m.macros.fat,
      }),
      { calories: 0, protein: 0, carbs: 0, fat: 0 }
    );

    // ratio cible / actuel
    const ratioCalories =
      total.calories > 0 ? targets.calories / total.calories : 1;

    // clamp doux
    const ratio = Math.max(0.85, Math.min(1.15, ratioCalories));

    meals = meals.map(m => ({
      ...m,
      meal: {
        ...m.meal,
        items: m.meal.items.map(it => ({
          ...it,
          quantity: it.quantity * ratio,
        })),
      },
    }));
  }

  return {
    ...day,
    meals,
  };
}
