import { Meal, MealSuggestion, MealWarning } from "./meal.types";
import { EngineConfig } from "../engine/engine.config";

/**
 * Génère des suggestions intelligentes à partir des warnings détectés.
 * - SAFE (aucun accès non sécurisé)
 * - Sans doublons
 * - Extensible (profils, journée, UI)
 */
export function generateMealSuggestions(args: {
  meal: Meal;
  warnings: MealWarning[];
  config: EngineConfig;
}): MealSuggestion[] {
  const { meal, warnings, config } = args;

  const suggestions: MealSuggestion[] = [];

  const hasSuggestion = (predicate: (s: MealSuggestion) => boolean) =>
    suggestions.some(predicate);

  const firstItem = meal.items[0];

  for (const w of warnings) {
    /* ============================
     * Protéines trop basses
     * ============================ */
    if (w.type === "macro_low" && w.macro === "protein") {
      if (
        !hasSuggestion(
          (s) => s.type === "add_food" && s.category === "protein"
        )
      ) {
        suggestions.push({
          type: "add_food",
          category: "protein",
          reason: "Apport protéique insuffisant pour ce repas",
        });
      }
    }

    /* ============================
     * Calories trop basses
     * ============================ */
    if (w.type === "macro_low" && w.macro === "calories") {
      if (
        firstItem &&
        !hasSuggestion((s) => s.type === "increase_portion")
      ) {
        suggestions.push({
          type: "increase_portion",
          foodId: firstItem.food.id,
          reason: "Apport calorique trop faible",
        });
      }
    }

    /* ============================
     * Calories hors limites hard
     * ============================ */
    if (w.type === "calories_out_of_bounds") {
      if (
        !hasSuggestion((s) => s.type === "relax_constraint")
      ) {
        suggestions.push({
          type: "relax_constraint",
          constraint: "hardLimits",
          reason: "Calories hors des limites définies",
        });
      }
    }
  }

  /* ============================
   * Contraintes trop strictes
   * ============================ */
  if (warnings.length >= 3) {
    if (
      !hasSuggestion(
        (s) =>
          s.type === "relax_constraint" &&
          s.constraint === "tolerancesPct"
      )
    ) {
      suggestions.push({
        type: "relax_constraint",
        constraint: "tolerancesPct",
        reason:
          "Plusieurs contraintes ne sont pas satisfaites simultanément",
      });
    }
  }

  /* ============================
   * Manque de variété (PRO UX)
   * ============================ */
  if (
    meal.items.length < config.itemsPerMeal &&
    !hasSuggestion((s) => s.type === "add_food")
  ) {
    suggestions.push({
      type: "add_food",
      category: "mixed",
      reason: "Repas peu varié, ajouter un aliment complémentaire",
    });
  }

  return suggestions;
}
