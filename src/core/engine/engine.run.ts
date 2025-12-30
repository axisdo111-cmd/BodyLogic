import { Food } from "../foods/food.types";
import { Macros } from "../foods/food.types";
import { FoodConstraints, filterFoods } from "../foods/filters";
import { EngineConfig } from "./engine.config";
import { generateMeals } from "../meals/meal.generator";
import { Meal } from "../meals/meal.types";
import { macrosForMeal } from "../nutrition/macros";
import { validateMeal } from "../meals/meal.validator";
import { scoreMeal } from "../nutrition/scoring";
import { microsForMeal } from "../nutrition/micros";
import { Micros } from "../foods/food.types";

export type EngineContext = {
  foods: Food[];
  constraints: FoodConstraints;
  targets: Macros;
  config: EngineConfig;
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
  rankedMeals: RankedMeal[]; // triés par score desc
  best: RankedMeal | null;
  meta: EngineMeta;
};

export function runEngine(ctx: EngineContext): EngineResult {
  // 1) Filters
  const eligibleFoods = filterFoods(ctx.foods, ctx.constraints);

  // 2) Meal generation (candidats)
  const candidates = generateMeals({ foods: eligibleFoods, config: ctx.config });

  // 3) Macro computation + 4) Validation + 5) Scoring
  const ranked: RankedMeal[] = [];
  let rejected = 0;

  for (const meal of candidates) {
    const macros = macrosForMeal(meal);
    const micros = microsForMeal(meal);

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

    const score = scoreMeal({
      macros,
      micros,
      targets: ctx.targets,
      config: ctx.config,
    });

    ranked.push({ meal, macros, micros, score });
  }

  // 6) Ranked results
  ranked.sort((a, b) => b.score - a.score);

  const result: EngineResult = {
    rankedMeals: ranked,
    best: ranked.length > 0 ? ranked[0] : null,
    meta: {
      foodsTotal: ctx.foods.length,
      foodsEligible: eligibleFoods.length,
      mealsGenerated: candidates.length,
      mealsValid: ranked.length,
      mealsRejected: rejected,
    },
  };

  return result;
}
