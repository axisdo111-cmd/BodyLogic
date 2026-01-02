import { Food } from "../foods/food.types";
import { Macros, Micros } from "../foods/food.types";
import { FoodConstraints, filterFoods } from "../foods/filters";
import { EngineConfig } from "./engine.config";

import { generateMeals } from "../meals/meal.generator";
import { Meal, MealWithAnalysis } from "../meals/meal.types";

import { validateMeal } from "../meals/meal.validator";

export type CarbMealType = "high" | "moderate" | "low";
export type ActivityLevel =
  | "sedentary" | "occasional" | "regular" | "sporty" | "intensive" | "athletic";

export type UserProfile = {
  sex: "male" | "female";
  age: number;
  weight: number;
  activityLevel: ActivityLevel;
};

export type CarbCyclingContext = {
  dayType?: CarbMealType;
  hasWorkoutToday?: boolean;
  workoutDone?: boolean;
  workoutIntensity?: number;
  previousMealTypes?: CarbMealType[];
};

/* ============================================================================
 * Types
 * ========================================================================== */

export type EngineContext = {
  foods: Food[];
  constraints: FoodConstraints;
  targets: Macros;
  config: EngineConfig;

  // 🔽 NOUVEAU optionnel
  user?: UserProfile;
  carbCycling?: CarbCyclingContext;
};

export type RankedMeal = {
  meal: Meal;
  macros: Macros;
  micros: Micros;
  score: number;
};

export type EngineMeta = {
  foodsTotal: number;
  foodsEligible: number;
  mealsGenerated: number;
  mealsValid: number;
  mealsRejected: number;
};

export type EngineResult = {
  rankedMeals: RankedMeal[];
  best: RankedMeal | null;
  meta: EngineMeta;
};

/* ============================================================================
 * Engine runner (PRO)
 * ========================================================================== */

export function runEngine(ctx: EngineContext): EngineResult {
  /* ------------------------------------------------------------------------
   * 1) Filtrage des aliments
   * ---------------------------------------------------------------------- */
  const eligibleFoods = filterFoods(ctx.foods, ctx.constraints);

  /* ------------------------------------------------------------------------
   * 2) Génération des repas (déjà analysés)
   * ---------------------------------------------------------------------- */
  const generated: MealWithAnalysis[] = generateMeals({
    foods: eligibleFoods,
    config: ctx.config,
  });

  /* ------------------------------------------------------------------------
   * 3) Validation & sélection
   * ---------------------------------------------------------------------- */
  const rankedMeals: RankedMeal[] = [];
  let rejected = 0;

  for (const analysis of generated) {
    const { meal, macros, micros, score } = analysis;

    const validation = validateMeal({
      meal,
      macros,
      targets: ctx.targets,
      config: ctx.config,
    });

    if (!validation.valid) {
      rejected += 1;
      continue;
    }

    rankedMeals.push({
      meal,
      macros,
      micros,
      score,
    });
  }

  /* ------------------------------------------------------------------------
   * 4) Classement final
   * ---------------------------------------------------------------------- */
  rankedMeals.sort((a, b) => b.score - a.score);

  /* ------------------------------------------------------------------------
   * 5) Résultat moteur
   * ---------------------------------------------------------------------- */
  return {
    rankedMeals,
    best: rankedMeals.length > 0 ? rankedMeals[0] : null,
    meta: {
      foodsTotal: ctx.foods.length,
      foodsEligible: eligibleFoods.length,
      mealsGenerated: generated.length,
      mealsValid: rankedMeals.length,
      mealsRejected: rejected,
    },
  };
}
