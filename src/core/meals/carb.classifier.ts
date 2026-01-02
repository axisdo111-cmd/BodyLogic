import { Macros } from "../foods/food.types";
import { EngineConfig } from "../engine/engine.config";

function kcalFromCarbs(carbsG: number) { return carbsG * 4; }
function kcalFromProtein(proteinG: number) { return proteinG * 4; }
function kcalFromFat(fatG: number) { return fatG * 9; }

export function classifyCarbMealType(macros: Macros, config?: EngineConfig) {
  const totalKcal =
    macros.calories > 0
      ? macros.calories
      : kcalFromCarbs(macros.carbs) + kcalFromProtein(macros.protein) + kcalFromFat(macros.fat);

  if (totalKcal <= 0) return "moderate" as const;

  const carbShare = kcalFromCarbs(macros.carbs) / totalKcal;

  // seuils simples (peuvent devenir config)
  if (carbShare >= 0.45) return "high" as const;
  if (carbShare <= 0.25) return "low" as const;
  return "moderate" as const;
}

/**
 * Carb-Cycling Clé centrale
 */
export type CarbMealType = "high" | "moderate" | "low";

/**
 * Classe un repas selon la part calorique issue des glucides.
 * Règle simple, stable, explicable UX.
 */
export function classifyCarbMeal(macros: Macros): CarbMealType {
  const calories =
    macros.calories > 0
      ? macros.calories
      : macros.carbs * 4 + macros.protein * 4 + macros.fat * 9;

  if (calories <= 0) return "moderate";

  const carbCalories = macros.carbs * 4;
  const ratio = carbCalories / calories;

  if (ratio >= 0.45) return "high";
  if (ratio <= 0.25) return "low";
  return "moderate";
}
