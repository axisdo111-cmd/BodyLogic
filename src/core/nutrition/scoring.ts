import { Macros, Micros } from "../foods/food.types";
import { EngineConfig } from "../engine/engine.config";
import { scoreNutrientDensity } from "./density";

function safeRelativeError(value: number, target: number): number {
  if (target === 0) return value === 0 ? 0 : 1;
  return Math.abs(value - target) / Math.max(1e-9, target);
}
function clamp01(x: number): number {
  return Math.max(0, Math.min(1, x));
}

export function scoreMeal(args: {
  macros: Macros;
  micros: Micros;
  targets: Macros;
  config: EngineConfig;
}): number {
  const { macros, micros, targets, config } = args;
  const w = config.scoringWeights;

  // 1) Macro fit 0..100
  const eCal = safeRelativeError(macros.calories, targets.calories);
  const eP = safeRelativeError(macros.protein, targets.protein);
  const eC = safeRelativeError(macros.carbs, targets.carbs);
  const eF = safeRelativeError(macros.fat, targets.fat);

  const wSum = w.calories + w.protein + w.carbs + w.fat;
  const weightedError =
    (w.calories * eCal + w.protein * eP + w.carbs * eC + w.fat * eF) / Math.max(1e-9, wSum);

  const macroFit = (1 - clamp01(weightedError)) * 100;

  // 2) Nutrient density 0..100
  const density = scoreNutrientDensity({ macros, micros });

  // 3) Fusion premium
  const dw = clamp01(config.densityWeight);
  const final = macroFit * (1 - dw) + density * dw;

  return Math.round(final * 10) / 10;
}
