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
  /**
   *  ===== PROTEINS =====
   */
  f(
  "chicken_breast",
  "Chicken breast",
  "protein",
  m(165, 31, 0, 3.6),
  ["high_protein", "gluten_free", "dairy_free"],
  {
    aliases: ["chicken", "poulet", "blanc de poulet"],
    defaultUnit: "g",
    units: { portion: 150 },
    popularity: 95,
    microsPer100g: {
      fiber: 0,
      sodiumMg: 74,
      potassiumMg: 256,
      calciumMg: 15,
      ironMg: 1.3,
      vitaminCMg: 0,
    },
  }
),

f(
  "eggs_whole",
  "Whole eggs",
  "protein",
  m(155, 13, 1.1, 11),
  ["high_protein", "gluten_free"],
  {
    aliases: ["egg", "eggs", "oeuf", "œuf"],
    defaultUnit: "piece",
    units: { piece: 60 },
    popularity: 90,
    microsPer100g: {
      fiber: 0,
      sodiumMg: 124,
      potassiumMg: 126,
      calciumMg: 50,
      ironMg: 1.2,
      vitaminCMg: 0,
    },
  }
),

f(
  "salmon",
  "Salmon",
  "protein",
  m(208, 20, 0, 13),
  ["high_protein", "gluten_free"],
  {
    aliases: ["saumon", "salmon filet"],
    defaultUnit: "g",
    units: { portion: 150 },
    popularity: 85,
    microsPer100g: {
      fiber: 0,
      sodiumMg: 59,
      potassiumMg: 363,
      calciumMg: 9,
      ironMg: 0.3,
      vitaminCMg: 0,
    },
  }
),
  f("tofu_firm", "Tofu (firm)", "protein", m(144, 17, 3, 8), [
    "vegan",
    "vegetarian",
    "gluten_free",
    "high_protein",
  ]),

  /**
   *  ===== CARBS =====
   */
  f(
  "rice_white",
  "White rice (cooked)",
  "carb",
  m(130, 2.7, 28, 0.3),
  ["vegan", "vegetarian", "gluten_free", "low_carb"],
  {
    aliases: ["rice", "riz blanc", "riz"],
    defaultUnit: "g",
    units: { portion: 180 },
    popularity: 80,
    microsPer100g: {
      fiber: 0.4,
      sodiumMg: 1,
      potassiumMg: 35,
      calciumMg: 10,
      ironMg: 0.2,
      vitaminCMg: 0,
    },
  }
),

f(
  "oats",
  "Oats",
  "carb",
  m(389, 17, 66, 7),
  ["vegan", "vegetarian"],
  {
    aliases: ["oatmeal", "flocons d avoine", "avoine"],
    defaultUnit: "g",
    units: { portion: 60 },
    popularity: 90,
    microsPer100g: {
      fiber: 10.6,
      sodiumMg: 2,
      potassiumMg: 362,
      calciumMg: 54,
      ironMg: 4.7,
      vitaminCMg: 0,
    },
  }
),
  f("pasta_whole", "Whole wheat pasta (cooked)", "carb", m(124, 5, 25, 1.1), [
    "vegan",
    "vegetarian",
  ]),
  f("potato_boiled", "Potato (boiled)", "carb", m(87, 2, 20, 0.1), [
    "vegan",
    "vegetarian",
    "gluten_free",
  ]),

  /**
   *  ===== FATS =====
   */
  f(
  "olive_oil",
  "Olive oil",
  "fat",
  m(884, 0, 0, 100),
  ["vegan", "vegetarian", "gluten_free"],
  {
    aliases: ["huile olive", "huile d olive"],
    defaultUnit: "tbsp",
    units: { tbsp: 13.5, tsp: 4.5 },
    popularity: 95,
    microsPer100g: {
      fiber: 0,
      sodiumMg: 2,
      potassiumMg: 1,
      calciumMg: 1,
      ironMg: 0.6,
      vitaminCMg: 0,
    },
  }
),

f(
  "avocado",
  "Avocado",
  "fat",
  m(160, 2, 9, 15),
  ["vegan", "vegetarian", "gluten_free"],
  {
    aliases: ["avocat", "avocados"],
    defaultUnit: "portion",
    units: { portion: 100 },
    popularity: 85,
    microsPer100g: {
      fiber: 6.7,
      sodiumMg: 7,
      potassiumMg: 485,
      calciumMg: 12,
      ironMg: 0.6,
      vitaminCMg: 10,
    },
  }
),
  f("butter", "Butter", "fat", m(717, 0.9, 0.1, 81), ["vegetarian"]),

  /**
   *  ===== VEGETABLES =====
   */
f(
  "broccoli",
  "Broccoli",
  "vegetable",
  m(35, 2.4, 7.2, 0.4),
  ["vegan", "vegetarian", "gluten_free", "low_carb"],
  {
    aliases: ["brocoli"],
    defaultUnit: "g",
    units: { portion: 150 },
    popularity: 75,
    microsPer100g: {
      fiber: 2.6,
      sodiumMg: 33,
      potassiumMg: 316,
      calciumMg: 47,
      ironMg: 0.7,
      vitaminCMg: 89,
    },
  }
),
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
    popularity: 90,
    microsPer100g: {
      fiber: 2.6,
      sodiumMg: 1,
      potassiumMg: 358,
      calciumMg: 5,
      ironMg: 0.3,
      vitaminCMg: 8.7,
    },
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
  f(
  "yogurt_greek_0",
  "Greek yogurt 0%",
  "dairy",
  m(59, 10.3, 3.6, 0.4),
  ["vegetarian", "gluten_free", "high_protein"],
  {
    aliases: ["greek yogurt", "yaourt grec", "skyr"],
    defaultUnit: "portion",
    units: { portion: 170 },
    popularity: 85,
    microsPer100g: {
      fiber: 0,
      sodiumMg: 36,
      potassiumMg: 141,
      calciumMg: 110,
      ironMg: 0.1,
      vitaminCMg: 0,
    },
  }
),

/**
 *  ===== MIXED =====
 */
  f(
    "lentils_cooked", "Lentils (cooked)", "mixed", m(116, 9, 20, 0.4), [
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
