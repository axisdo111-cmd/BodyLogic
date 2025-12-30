import { FOOD_DB } from "./food.db";
import { FoodCategory } from "../engine/engine.config";
import { FoodTag } from "./food.types";

export function getAllFoods() {
  return [...FOOD_DB];
}

export function getFoodsByCategory(category: FoodCategory) {
  return FOOD_DB.filter(f => f.category === category);
}

export function getFoodsByTag(tag: FoodTag) {
  return FOOD_DB.filter(f => f.tags?.includes(tag));
}

export function getFoodById(id: string) {
  return FOOD_DB.find(f => f.id === id);
}
