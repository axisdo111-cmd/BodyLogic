import { Food, Macros } from "../foods/food.types";

export interface MealItem {
  food: Food;
  grams: number; // portion en grammes
}

export interface Meal {
  id: string;
  name?: string;
  items: MealItem[];
}

export interface MealWithAnalysis {
  meal: Meal;
  macros: Macros;
}
