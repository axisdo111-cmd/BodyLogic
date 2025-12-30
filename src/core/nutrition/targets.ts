import { Macros } from "../foods/food.types";

/**
 * Objectif nutritionnel journalier ou par repas
 * (adaptable plus tard via UI)
 */
export const DEFAULT_MACRO_TARGETS: Macros = {
  calories: 600,
  protein: 35,
  carbs: 60,
  fat: 20,
};

/**
 * Alias pratique (UI / moteur)
 */
export const defaultTargets = DEFAULT_MACRO_TARGETS;


/**
 * Représente un intervalle cible (min..max) pour un macro.
 * Exemple: calories min=600 max=800 pour un repas.
 */
export interface MacroRange {
  min: number;
  max: number;
}

/**
 * Targets sous forme d'intervalles pour la validation.
 * Utile pour accepter un repas dans une fenêtre plutôt qu'une valeur unique.
 */
export interface MacroTargetsRange {
  calories: MacroRange;
  protein: MacroRange;
  carbs: MacroRange;
  fat: MacroRange;
}

/**
 * Utilitaires
 */
function isFiniteNonNegative(n: number): boolean {
  return Number.isFinite(n) && n >= 0;
}

function clampToNonNegative(n: number): number {
  if (!Number.isFinite(n)) return 0;
  return n < 0 ? 0 : n;
}

function ensureRange(min: number, max: number, field: string): MacroRange {
  const a = clampToNonNegative(min);
  const b = clampToNonNegative(max);
  const lo = Math.min(a, b);
  const hi = Math.max(a, b);

  // Sécurité pro : si hi == 0 mais lo > 0 (cas bizarre), on rectifie.
  if (hi === 0 && lo > 0) {
    throw new Error(`targets: invalid range for ${field}`);
  }
  return { min: lo, max: hi };
}

/**
 * Crée une plage (min/max) autour d'une valeur cible via une tolérance en %.
 * ex: target=100, tol=0.1 => [90..110]
 */
export function rangeFromTargetPct(target: number, tolerancePct: number): MacroRange {
  if (!Number.isFinite(tolerancePct) || tolerancePct < 0) {
    throw new Error("targets: tolerancePct must be a finite number >= 0");
  }

  const t = clampToNonNegative(target);
  if (t === 0) {
    // Quand la cible est 0, on exige 0 (range dégénérée)
    return { min: 0, max: 0 };
  }

  const min = t * (1 - tolerancePct);
  const max = t * (1 + tolerancePct);
  return ensureRange(min, max, "target");
}

/**
 * Convertit une cible "valeur unique" (Macros) en cible "plages" (MacroTargetsRange),
 * en appliquant une tolérance % par macro.
 *
 * Utile si tu veux que validateMeal travaille sur des ranges plutôt que recalculer min/max.
 */
export function targetsToRanges(args: {
  targets: Macros;
  tolerancesPct: { calories: number; protein: number; carbs: number; fat: number };
}): MacroTargetsRange {
  const { targets, tolerancesPct } = args;

  return {
    calories: rangeFromTargetPct(targets.calories, tolerancesPct.calories),
    protein: rangeFromTargetPct(targets.protein, tolerancesPct.protein),
    carbs: rangeFromTargetPct(targets.carbs, tolerancesPct.carbs),
    fat: rangeFromTargetPct(targets.fat, tolerancesPct.fat),
  };
}

/**
 * Validation pure : indique si des macros sont dans une plage cible.
 * Renvoie un résultat riche (utilisable pour affichage / debug).
 */
export type TargetsCheck =
  | { ok: true }
  | { ok: false; violations: Array<{ key: keyof Macros; value: number; min: number; max: number }> };

export function checkMacrosAgainstRanges(macros: Macros, ranges: MacroTargetsRange): TargetsCheck {
  const violations: Array<{ key: keyof Macros; value: number; min: number; max: number }> = [];

  const check = (key: keyof Macros, range: MacroRange) => {
    const value = macros[key];
    if (!isFiniteNonNegative(value)) {
      violations.push({ key, value, min: range.min, max: range.max });
      return;
    }
    if (value < range.min || value > range.max) {
      violations.push({ key, value, min: range.min, max: range.max });
    }
  };

  check("calories", ranges.calories);
  check("protein", ranges.protein);
  check("carbs", ranges.carbs);
  check("fat", ranges.fat);

  return violations.length === 0 ? { ok: true } : { ok: false, violations };
}

/**
 * Option PRO (très utile) : construit une cible repas à partir d'une cible journalière.
 * Exemple: 3 repas/jour => targetMeal = daily / 3.
 *
 * Ce helper reste pur et te permet de standardiser les objectifs.
 */
export function perMealTargetsFromDaily(args: {
  dailyTargets: Macros;
  mealsPerDay: number;
}): Macros {
  const { dailyTargets, mealsPerDay } = args;

  if (!Number.isFinite(mealsPerDay) || mealsPerDay <= 0) {
    throw new Error("targets: mealsPerDay must be a finite number > 0");
  }

  const d = dailyTargets;
  const div = mealsPerDay;

  return {
    calories: d.calories / div,
    protein: d.protein / div,
    carbs: d.carbs / div,
    fat: d.fat / div,
  };
}
