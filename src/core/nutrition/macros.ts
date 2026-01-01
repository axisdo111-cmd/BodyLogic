import { Food, FoodUnit, Macros } from "../foods/food.types";
import { Meal } from "../meals/meal.types";

/**
 * Multiplie des macros par un facteur
 */
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

/**
 * Somme une liste de macros
 */
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

/**
 * Calcule les macros pour un aliment donné en grammes
 */
export function macrosForFood(food: Food, grams: number): Macros {
  if (!Number.isFinite(grams) || grams <= 0) {
    throw new Error("macrosForFood: grams must be a finite number > 0");
  }
  const factor = grams / 100;
  return scaleMacros(food.macrosPer100g, factor);
}

/**
 * Calcule les macros totales d’un repas
 */                                                         
export function macrosForMeal(meal: Meal): Macros {
  const itemsMacros = meal.items.map((it) =>
    computeMacros(it.food, it.quantity, it.unit)
  );
  return sumMacros(itemsMacros);
}


/**
 * UX helper : quantité + unité → macros
 * (conversion vers grammes puis délégation à macrosForFood)
 */
export function computeMacros(
  food: Food,
  quantity: number,
  unit: FoodUnit = "g"
): Macros {
  if (!Number.isFinite(quantity) || quantity <= 0) {
    throw new Error("computeMacros: quantity must be a finite number > 0");
  }

  let grams = quantity;

  if (unit !== "g") {
    const gramsPerUnit = food.units?.[unit];
    if (!gramsPerUnit) {
      throw new Error(
        `computeMacros: unit '${unit}' not defined for food '${food.id}'`
      );
    }
    grams = quantity * gramsPerUnit;
  }

  return macrosForFood(food, grams);
}
