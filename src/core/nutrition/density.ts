import { Macros } from "../foods/food.types";
import { Micros } from "../foods/food.types";

function clamp01(x: number) {
  return Math.max(0, Math.min(1, x));
}

/**
 * Score densité 0..100
 * - bonus: fibre, potassium, calcium, fer, vit C
 * - malus: sodium élevé
 * Normalisé par 100kcal (densité énergétique)
 */
export function scoreNutrientDensity(args: {
  macros: Macros;
  micros: Micros;
}): number {
  const { macros, micros } = args;

  const kcal = Math.max(1, macros.calories);
  const factor = 100 / kcal; // par 100 kcal

  const fiber = micros.fiber * factor;          // g/100kcal
  const potassium = micros.potassiumMg * factor; // mg/100kcal
  const calcium = micros.calciumMg * factor;
  const iron = micros.ironMg * factor;
  const vitC = micros.vitaminCMg * factor;
  const sodium = micros.sodiumMg * factor;

  // Cibles “soft” (heuristiques stables, pas médicales)
  const fiberScore = clamp01(fiber / 5);            // 5g/100kcal = excellent
  const potassiumScore = clamp01(potassium / 300);
  const calciumScore = clamp01(calcium / 200);
  const ironScore = clamp01(iron / 2);
  const vitCScore = clamp01(vitC / 30);

  const sodiumPenalty = clamp01(sodium / 400); // 400mg/100kcal -> pénalité forte

  const bonus =
    (fiberScore * 0.30) +
    (potassiumScore * 0.20) +
    (calciumScore * 0.15) +
    (ironScore * 0.15) +
    (vitCScore * 0.20);

  const score01 = clamp01(bonus - sodiumPenalty * 0.35);
  return Math.round(score01 * 1000) / 10; // 0..100 (1 décimale)
}
