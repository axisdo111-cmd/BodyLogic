import { Food } from "../foods/food.types";
import { FoodUnit } from "../foods/food.types";
import { searchFoods } from "../foods/food.search";
import { EngineConfig, FoodCategory } from "../engine/engine.config";
import { Meal, MealItem, MealWithAnalysis } from "./meal.types";
import { macrosForMeal } from "../nutrition/macros";
import { scoreMacrosSimple } from "../nutrition/scoring";
import { microsForMeal } from "../nutrition/micros";
import { filterFoodsByConstraints } from "../engine/user.constraints";
import { computeMacroWarnings } from "../nutrition/warnings";
import { targetsToRanges } from "../nutrition/targets";
import { DEFAULT_MACRO_TARGETS } from "../nutrition/targets";
import { generateMealSuggestions } from "./suggestions";

/* ============================================================================
 * Utils
 * ========================================================================== */

function clampInt(n: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, Math.floor(n)));
}

/**
 * Convertit une quantité interne (en grammes logiques)
 * vers quantity + unit selon le food
 */

function gramsToQuantity(
  food: Food,
  grams: number
): { quantity: number; unit: FoodUnit } {
  const unit: FoodUnit = food.defaultUnit ?? "g";

  if (unit === "g") {
    return { quantity: grams, unit };
  }

  const gramsPerUnit = food.units?.[unit];
  if (!gramsPerUnit || gramsPerUnit <= 0) {
    return { quantity: grams, unit: "g" };
  }

  return {
    quantity: grams / gramsPerUnit,
    unit,
  };
}

/* ============================================================================
 * Recherche simple (UX)
 * ========================================================================== */

export function generateMealFromQuery(
  query: string,
  quantity = 1
): Meal {
  const foods = searchFoods(query);
  if (!foods.length) {
    throw new Error(`No food found for '${query}'`);
  }

  const food = foods[0];
  const unit = food.defaultUnit ?? "g";

  return {
    items: [
      {
        food,
        quantity,
        unit,
      },
    ],
  };
}

/* ============================================================================
 * Génération automatique
 * ========================================================================== */

/**
 * Heuristique stable :
 * - priorité à la densité protéique
 * - tri déterministe
 */
function rankFoodsForGeneration(foods: Food[]): Food[] {
  return [...foods].sort((a, b) => {
    const aCal = Math.max(1, a.macrosPer100g.calories);
    const bCal = Math.max(1, b.macrosPer100g.calories);

    const aScore = a.macrosPer100g.protein / aCal;
    const bScore = b.macrosPer100g.protein / bCal;

    if (bScore !== aScore) return bScore - aScore;
    if (a.name !== b.name) return a.name.localeCompare(b.name);
    return a.id.localeCompare(b.id);
  });
}

function pickFromCategory(
  foods: Food[],
  category: FoodCategory,
  startIndex: number
): Food | null {
  const filtered = foods.filter((f) => f.category === category);
  if (!filtered.length) return null;
  return filtered[startIndex % filtered.length];
}

/* ============================================================================
 * Générateur principal
 * ========================================================================== */

export type MealGenerationRequest = {
  foods: Food[];
  config: EngineConfig;
};

export function generateMeals(
  req: MealGenerationRequest
): MealWithAnalysis[] {
  const foodsFiltered = filterFoodsByConstraints(
  req.foods,
  req.config.userConstraints ?? {}
  );

  const foodsRanked = rankFoodsForGeneration(foodsFiltered);

  if (!foodsRanked.length) return [];

  const itemsPerMeal = clampInt(req.config.itemsPerMeal, 1, 8);
  const candidates = clampInt(req.config.candidatesToGenerate, 1, 500);

  const gramsOptions =
    req.config.portionGramsOptions.length > 0
      ? [...req.config.portionGramsOptions]
      : [100];

  gramsOptions.sort((a, b) => a - b);

  const results: MealWithAnalysis[] = [];
  let cursor = 0;

  const macroRanges = targetsToRanges({
    targets: DEFAULT_MACRO_TARGETS,
    tolerancesPct: req.config.tolerancesPct,
  });

  for (let i = 0; i < candidates; i++) {
    const grams = gramsOptions[i % gramsOptions.length];
    const items: MealItem[] = [];
    const used = new Map<string, number>();

    for (const category of req.config.categoryPlan) {
      const food = pickFromCategory(foodsRanked, category, cursor);
      if (!food) continue;

      const count = used.get(food.id) ?? 0;
      if (count >= req.config.maxSameFoodPerMeal) continue;

      used.set(food.id, count + 1);

      const { quantity, unit } = gramsToQuantity(food, grams);
      items.push({ food, quantity, unit });

      cursor++;
      if (items.length >= itemsPerMeal) break;
    }

    if (!items.length) continue;

    const meal: Meal = {
      id: `meal_${i + 1}`,
      items,
    };

    const macros = macrosForMeal(meal);
    const micros = microsForMeal(meal);
    const score = scoreMacrosSimple(macros);
    const warnings = computeMacroWarnings(macros, macroRanges);

    const suggestions = generateMealSuggestions({
      meal,
      warnings,
      config: req.config,
    });

    results.push({
      meal,
      macros,
      micros,
      score,
      warnings,
      suggestions,
    });
  }

  // 🥇 meilleurs repas en premier
  results.sort((a, b) => b.score - a.score);

  return results;
}
