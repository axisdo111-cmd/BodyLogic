import { Food, FoodUnit } from "../foods/food.types";

export function quantityToGrams(
  food: Food,
  quantity: number,
  unit: FoodUnit
): number {
  if (unit === "g") return quantity;

  const gramsPerUnit = food.units?.[unit];
  if (!gramsPerUnit) {
    throw new Error(`Unit '${unit}' not defined for food '${food.id}'`);
  }

  return quantity * gramsPerUnit;
}
