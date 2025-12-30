import { Food } from "./food.types";

export type FoodConstraints = {
  includeTags?: string[];
  excludeTags?: string[];
  maxCaloriesPer100g?: number;
  minProteinPer100g?: number;
  textQuery?: string; // filtre simple sur le nom
};

function hasAnyTag(foodTags: string[] | undefined, tags: string[]): boolean {
  if (!tags.length) return true;
  const set = new Set(foodTags ?? []);
  return tags.some((t) => set.has(t));
}

function hasNoExcludedTag(foodTags: string[] | undefined, excluded: string[]): boolean {
  if (!excluded.length) return true;
  const set = new Set(foodTags ?? []);
  return !excluded.some((t) => set.has(t));
}

export function filterFoods(foods: Food[], constraints: FoodConstraints): Food[] {
  const include = constraints.includeTags ?? [];
  const exclude = constraints.excludeTags ?? [];

  const q = constraints.textQuery?.trim().toLowerCase();

  return foods.filter((food) => {
    if (q && !food.name.toLowerCase().includes(q)) return false;

    if (!hasAnyTag(food.tags, include)) return false;
    if (!hasNoExcludedTag(food.tags, exclude)) return false;

    if (constraints.maxCaloriesPer100g !== undefined) {
      if (food.macrosPer100g.calories > constraints.maxCaloriesPer100g) return false;
    }

    if (constraints.minProteinPer100g !== undefined) {
      if (food.macrosPer100g.protein < constraints.minProteinPer100g) return false;
    }

    return true;
  });
}
