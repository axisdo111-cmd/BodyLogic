import { Food, FoodUnit, Macros, Micros } from "../foods/food.types";

/* ============================
 * MealItem
 * ============================ */
export interface MealItem {
  food: Food;
  quantity: number;
  unit: FoodUnit;
}

/* ============================
 * Meal (structure pure)
 * Name donnée métier
 * ============================ */
export interface Meal {
  id?: string;
  name?: string;
  items: MealItem[];
}

/* ============================
 * Analyse & intelligence
 * ============================ */
export type MealWarning =
  | { type: "macro_low"; macro: keyof Macros; value: number; target: number }
  | { type: "macro_high"; macro: keyof Macros; value: number; target: number }
  | { type: "calories_out_of_bounds"; calories: number }
  | { type: "constraint_too_strict"; message: string };

export type MealSuggestion =
  | { type: "increase_portion"; foodId: string; reason: string }
  | { type: "add_food"; category: string; reason: string }
  | { type: "relax_constraint"; constraint: string; reason: string };

export interface MealWithAnalysis {
  meal: Meal;
  macros: Macros;
  micros: Micros;
  score: number;
  warnings: MealWarning[];
  suggestions: MealSuggestion[];
}

// meal.types.ts 

export type CarbMealType = "high" | "moderate" | "low";

export interface MealWithAnalysis {
  meal: Meal;
  macros: Macros;
  micros: Micros;
  score: number;
  warnings: MealWarning[];
  suggestions: MealSuggestion[];

  // 🔽 NOUVEAU (optionnel)
  carbType?: CarbMealType;

  // utile plus tard: post-workout, workday, rest-day
  tags?: string[];
}
