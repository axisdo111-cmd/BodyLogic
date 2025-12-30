import { Food, Micros } from "../foods/food.types";
import { Meal } from "../meals/meal.types";

/**
 * Micros à zéro (helper)
 */
export function zeroMicros(): Micros {
  return {
    fiber: 0,
    sodiumMg: 0,
    potassiumMg: 0,
    calciumMg: 0,
    ironMg: 0,
    vitaminCMg: 0,
  };
}

/**
 * Multiplie les micros par un facteur
 */
export function scaleMicros(m: Micros, factor: number): Micros {
  if (!Number.isFinite(factor) || factor < 0) {
    throw new Error("scaleMicros: factor must be >= 0");
  }

  return {
    fiber: m.fiber * factor,
    sodiumMg: m.sodiumMg * factor,
    potassiumMg: m.potassiumMg * factor,
    calciumMg: m.calciumMg * factor,
    ironMg: m.ironMg * factor,
    vitaminCMg: m.vitaminCMg * factor,
  };
}

/**
 * Somme une liste de micros
 */
export function sumMicros(list: Micros[]): Micros {
  return list.reduce<Micros>(
    (acc, m) => ({
      fiber: acc.fiber + m.fiber,
      sodiumMg: acc.sodiumMg + m.sodiumMg,
      potassiumMg: acc.potassiumMg + m.potassiumMg,
      calciumMg: acc.calciumMg + m.calciumMg,
      ironMg: acc.ironMg + m.ironMg,
      vitaminCMg: acc.vitaminCMg + m.vitaminCMg,
    }),
    zeroMicros()
  );
}

/**
 * Calcule les micros totaux d’un repas
 */
export function microsForMeal(meal: Meal): Micros {
  const microsList: Micros[] = [];

  for (const item of meal.items) {
    const food: Food = item.food;

    if (!food.microsPer100g) continue;

    const factor = item.grams / 100;
    microsList.push(scaleMicros(food.microsPer100g, factor));
  }

  return sumMicros(microsList);
}
