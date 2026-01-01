import { Macros } from "../foods/food.types";

export type Recommendation =
  | { type: "info"; message: string }
  | { type: "warning"; message: string }
  | { type: "suggestion"; message: string };

export function generateMacroRecommendations(args: {
  macros: Macros;
  targets: Macros;
}): Recommendation[] {
  const { macros, targets } = args;
  const recs: Recommendation[] = [];

  if (macros.protein < targets.protein * 0.85) {
    recs.push({
      type: "suggestion",
      message: "Augmenter légèrement les protéines",
    });
  }

  if (macros.calories > targets.calories * 1.15) {
    recs.push({
      type: "warning",
      message: "Repas trop calorique",
    });
  }

  if (macros.fat > targets.fat * 1.2) {
    recs.push({
      type: "info",
      message: "Lipides élevés, attention à l'équilibre",
    });
  }

  return recs;
}
