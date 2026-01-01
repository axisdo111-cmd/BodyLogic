import { Macros } from "../foods/food.types";
import { EngineConfig } from "../engine/engine.config";

/**
 * Profils nutritionnels standards
 */
export type NutritionProfile = "cut" | "maintenance" | "bulk";

export interface ProfileConfig {
  dailyTargets: Macros;
  engineOverrides: Partial<EngineConfig>;
}

/**
 * Profils par défaut (PRO)
 */
export const NUTRITION_PROFILES: Record<NutritionProfile, ProfileConfig> = {
  cut: {
    dailyTargets: {
      calories: 1800,
      protein: 160,
      carbs: 150,
      fat: 50,
    },
    engineOverrides: {
      densityWeight: 0.5,
    },
  },

  maintenance: {
    dailyTargets: {
      calories: 2300,
      protein: 140,
      carbs: 250,
      fat: 70,
    },
    engineOverrides: {
      densityWeight: 0.35,
    },
  },

  bulk: {
    dailyTargets: {
      calories: 2800,
      protein: 170,
      carbs: 350,
      fat: 90,
    },
    engineOverrides: {
      densityWeight: 0.25,
    },
  },
};
