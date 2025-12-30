import { Food, FoodTag, Macros } from "./food.types";
import { FoodCategory } from "../engine/engine.config";

/**
 * Helpers internes
 */
function m(
  calories: number,
  protein: number,
  carbs: number,
  fat: number
): Macros {
  return { calories, protein, carbs, fat };
}

function f(
  id: string,
  name: string,
  category: FoodCategory,
  macrosPer100g: Macros,
  tags: FoodTag[] = [],
  options?: Partial<Food>
): Food {
  return {
    id,
    name,
    category,
    macrosPer100g,
    tags,
    ...options,
  };
}


/**
 * Base alimentaire statique
 * Valeurs approximatives, standardisées / 100g
 */
export const FOOD_DB: ReadonlyArray<Food> = Object.freeze([
  // ===== PROTEINS =====
  f("chicken_breast", "Chicken breast", "protein", m(165, 31, 0, 3.6), [
    "high_protein",
    "gluten_free",
    "dairy_free",
  ]),
  f("salmon", "Salmon", "protein", m(208, 20, 0, 13), [
    "high_protein",
    "gluten_free",
  ]),
  f(
  "eggs_whole",
  "Whole eggs",
  "protein",
  m(155, 13, 1.1, 11),
  ["high_protein", "gluten_free"],
  {
    aliases: ["egg", "eggs", "œuf", "oeuf", "œufs"],
    defaultUnit: "piece",
    units: { piece: 60 },
    popularity: 90,
  }
),
  f("tofu_firm", "Tofu (firm)", "protein", m(144, 17, 3, 8), [
    "vegan",
    "vegetarian",
    "gluten_free",
    "high_protein",
  ]),

  // ===== CARBS =====
  f("rice_white", "White rice (cooked)", "carb", m(130, 2.7, 28, 0.3), [
    "vegan",
    "vegetarian",
    "gluten_free",
  ]),
  f("pasta_whole", "Whole wheat pasta (cooked)", "carb", m(124, 5, 25, 1.1), [
    "vegan",
    "vegetarian",
  ]),
  f("potato_boiled", "Potato (boiled)", "carb", m(87, 2, 20, 0.1), [
    "vegan",
    "vegetarian",
    "gluten_free",
  ]),

  // ===== FATS =====
  f(
  "olive_oil",
  "Olive oil",
  "fat",
  m(884, 0, 0, 100),
  ["vegan", "vegetarian", "gluten_free"],
  {
    aliases: ["huile olive", "oliveoil"],
    defaultUnit: "tbsp",
    units: {
      tbsp: 13.5,
      tsp: 4.5,
    },
    popularity: 95,
  }
),
  f("butter", "Butter", "fat", m(717, 0.9, 0.1, 81), ["vegetarian"]),

  // ===== VEGETABLES =====
  f("broccoli", "Broccoli", "vegetable", m(35, 2.4, 7.2, 0.4), [
    "vegan",
    "vegetarian",
    "gluten_free",
  ]),
  f("spinach", "Spinach", "vegetable", m(23, 2.9, 3.6, 0.4), [
    "vegan",
    "vegetarian",
    "gluten_free",
  ]),

  // ===== FRUITS =====
  f(
  "banana",
  "Banana",
  "fruit",
  m(89, 1.1, 23, 0.3),
  ["vegan", "vegetarian", "gluten_free"],
  {
    aliases: ["banane", "bananas"],
    defaultUnit: "piece",
    units: { piece: 120 },
    popularity: 85,
  }
),
  f("apple", "Apple", "fruit", m(52, 0.3, 14, 0.2), [
    "vegan",
    "vegetarian",
    "gluten_free",
  ]),

  // ===== DAIRY =====
  f("milk_skim", "Skim milk", "dairy", m(34, 3.4, 5, 0.1), [
    "vegetarian",
    "gluten_free",
  ]),
  f("yogurt_greek_0", "Greek yogurt 0%", "dairy", m(59, 10.3, 3.6, 0.4), [
    "vegetarian",
    "gluten_free",
    "high_protein",
  ]),

  // ===== MIXED =====
  f("lentils_cooked", "Lentils (cooked)", "mixed", m(116, 9, 20, 0.4), [
    "vegan",
    "vegetarian",
    "gluten_free",
    "high_protein",
  ]),
]);

/**
 * Helpers publics
 */
export function getAllFoods(): Food[] {
  return [...FOOD_DB];
}

export function getFoodsByCategory(category: FoodCategory): Food[] {
  return FOOD_DB.filter((f) => f.category === category);
}

export function getFoodsByTag(tag: FoodTag): Food[] {
  return FOOD_DB.filter((f) => f.tags?.includes(tag));
}

export function getFoodById(id: string): Food | undefined {
  return FOOD_DB.find((f) => f.id === id);
}
