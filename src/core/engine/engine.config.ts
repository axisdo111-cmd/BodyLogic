export type MacroTolerancePct = {
  calories: number; // ex: 0.10 = ±10%
  protein: number;
  carbs: number;
  fat: number;
};

export type ScoringWeights = {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
};

export type FoodCategory =
  | "protein"
  | "carb"
  | "vegetable"
  | "fat"
  | "fruit"
  | "dairy"
  | "mixed";

export interface EngineConfig {
  /**
   * Nombre de repas candidats à générer avant validation/scoring.
   */
  candidatesToGenerate: number;

  /**
   * Nombre d'items (aliments) par repas candidat.
   */
  itemsPerMeal: number;

  /**
   * Portions testées (en grammes) pour chaque item.
   */
  portionGramsOptions: number[];

    /**
   * Plan de structure d’un repas :
   * ex: ["protein","carb","vegetable","fat"]
   */
  categoryPlan: FoodCategory[];

  /**
   * Tolérance de répétition : max fois qu’un même food
   * peut apparaître dans un meal.
   */
  maxSameFoodPerMeal: number;

  /**
   * Tolérances pour accepter un repas (validation).
   */
  tolerancesPct: MacroTolerancePct;

  /**
   * Poids utilisés pour le scoring macro.
   */
  scoringWeights: ScoringWeights;

  /**
   * Poids de la densité nutritionnelle (0..1)
   * ex: 0.35 = 35% densité, 65% macros
   */
  densityWeight: number;

  /**
   * Limites hard (sécurité moteur).
   */
  hardLimits?: {
    maxMealCalories?: number;
    minMealCalories?: number;
  };
}

export const DEFAULT_ENGINE_CONFIG: EngineConfig = {
  candidatesToGenerate: 80,
  itemsPerMeal: 3,
  portionGramsOptions: [80, 100, 120, 150, 200],

  categoryPlan: ["protein", "carb", "vegetable", "fat"],
  maxSameFoodPerMeal: 1,

  tolerancesPct: {
    calories: 0.12,
    protein: 0.15,
    carbs: 0.20,
    fat: 0.20,
  },

  scoringWeights: {
    calories: 1.0,
    protein: 1.3,
    carbs: 0.9,
    fat: 0.9,
  },

  densityWeight: 0.35,

  hardLimits: {
    maxMealCalories: 1200,
    minMealCalories: 200,
  },
};


