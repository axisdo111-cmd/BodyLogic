import { Food } from "../foods/food.types";
import { EngineConfig, FoodCategory } from "../engine/engine.config";
import { Meal, MealItem } from "./meal.types";

export type MealGenerationRequest = {
  foods: Food[];
  config: EngineConfig;
};

function clampInt(n: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, Math.floor(n)));
}

/**
 * Heuristique stable : on trie les foods par "densité protéine"
 * (protein per calorie) puis on cycle pour fabriquer des candidats.
 */
function rankFoodsForGeneration(foods: Food[]): Food[] {
  return [...foods].sort((a, b) => {
    const aCal = Math.max(1, a.macrosPer100g.calories);
    const bCal = Math.max(1, b.macrosPer100g.calories);
    const aScore = a.macrosPer100g.protein / aCal;
    const bScore = b.macrosPer100g.protein / bCal;
    // Desc
    if (bScore !== aScore) return bScore - aScore;
    // Tie-break stable: name then id
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
  if (filtered.length === 0) return null;
  return filtered[startIndex % filtered.length];
}       

function buildMealItems(
  foodsRanked: Food[],
  startIndex: number,
  itemsPerMeal: number,
  grams: number
): MealItem[] {
  const items: MealItem[] = [];
  const n = foodsRanked.length;
  for (let i = 0; i < itemsPerMeal; i++) {
    const idx = (startIndex + i) % n;
    items.push({ food: foodsRanked[idx], grams });
  }
  return items;
}

export function generateMeals(req: MealGenerationRequest): Meal[] {
  const foodsRanked = rankFoodsForGeneration(req.foods);
  if (foodsRanked.length === 0) return [];

  const itemsPerMeal = clampInt(req.config.itemsPerMeal, 1, 8);
  const candidates = clampInt(req.config.candidatesToGenerate, 1, 500);

  const gramsOptions =
    req.config.portionGramsOptions.length > 0
      ? [...req.config.portionGramsOptions]
      : [100];

  // Stable: tri asc pour portions (reproductible)
  gramsOptions.sort((a, b) => a - b);

  const meals: Meal[] = [];
  let cursor = 0;

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
    items.push({ food, grams });
    cursor++;
  }

  if (items.length > 0) {
    meals.push({
      id: `meal_${i + 1}`,
      items,
    });
  }
}
  return meals;
}

