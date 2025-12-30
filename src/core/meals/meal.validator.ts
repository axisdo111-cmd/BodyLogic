import { Macros } from "../foods/food.types";
import { EngineConfig } from "../engine/engine.config";
import { Meal } from "./meal.types";

export type ValidationResult =
  | { valid: true }
  | { valid: false; reasons: string[] };

function withinTolerance(value: number, target: number, tolPct: number): boolean {
  // cas où target = 0 (évite division / comparaison absurde)
  if (target === 0) return value === 0;
  const min = target * (1 - tolPct);
  const max = target * (1 + tolPct);
  return value >= min && value <= max;
}

export function validateMeal(args: {
  meal: Meal;
  macros: Macros;
  targets: Macros;
  config: EngineConfig;
}): ValidationResult {
  const { macros, targets, config } = args;
  const reasons: string[] = [];

  // Hard limits (sécurité)
  const hard = config.hardLimits;
  if (hard?.maxMealCalories !== undefined && macros.calories > hard.maxMealCalories) {
    reasons.push(`Calories above hard max (${macros.calories.toFixed(0)} > ${hard.maxMealCalories})`);
  }
  if (hard?.minMealCalories !== undefined && macros.calories < hard.minMealCalories) {
    reasons.push(`Calories below hard min (${macros.calories.toFixed(0)} < ${hard.minMealCalories})`);
  }

  // Tolerances
  const tol = config.tolerancesPct;

  if (!withinTolerance(macros.calories, targets.calories, tol.calories)) {
    reasons.push("Calories out of tolerance");
  }
  if (!withinTolerance(macros.protein, targets.protein, tol.protein)) {
    reasons.push("Protein out of tolerance");
  }
  if (!withinTolerance(macros.carbs, targets.carbs, tol.carbs)) {
    reasons.push("Carbs out of tolerance");
  }
  if (!withinTolerance(macros.fat, targets.fat, tol.fat)) {
    reasons.push("Fat out of tolerance");
  }

  return reasons.length === 0 ? { valid: true } : { valid: false, reasons };
}
