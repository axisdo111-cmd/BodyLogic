import { Food, FoodUnit, Macros, Micros } from "../foods/food.types";

export interface MealItem {
  food: Food;
  quantity: number;
  unit: FoodUnit;
}

export interface Meal {
  id?: string;
  items: MealItem[];
}

/**
 * Résultat enrichi du générateur
 */
export interface MealWithAnalysis {
  meal: Meal;
  macros: Macros;
  micros: Micros;
  score: number; // scoreMacrosSimple
}
