import { Macros } from "../foods/food.types";
import { Food } from "../foods/food.types";
import { Meal } from "../meals/meal.types";

export function scaleMacros(macros: Macros, factor: number): Macros {
  if (!Number.isFinite(factor) || factor < 0) {
    throw new Error("scaleMacros: factor must be a finite positive number");
  }
  return {
    calories: macros.calories * factor,
    protein: macros.protein * factor,
    carbs: macros.carbs * factor,
    fat: macros.fat * factor,
  };
}

export function sumMacros(list: Macros[]): Macros {
  return list.reduce<Macros>(
    (acc, m) => ({
      calories: acc.calories + m.calories,
      protein: acc.protein + m.protein,
      carbs: acc.carbs + m.carbs,
      fat: acc.fat + m.fat,
    }),
    { calories: 0, protein: 0, carbs: 0, fat: 0 }
  );
}

export function macrosForFood(food: Food, grams: number): Macros {
  if (!Number.isFinite(grams) || grams <= 0) {
    throw new Error("macrosForFood: grams must be a finite number > 0");
  }
  const factor = grams / 100;
  return scaleMacros(food.macrosPer100g, factor);
}

export function macrosForMeal(meal: Meal): Macros {
  const itemsMacros = meal.items.map((it) => macrosForFood(it.food, it.grams));
  return sumMacros(itemsMacros);
}
