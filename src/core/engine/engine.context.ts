import { Food } from "../foods/food.types";
import { Macros } from "../foods/food.types";
import { FoodConstraints } from "../foods/filters";
import { EngineConfig, DEFAULT_ENGINE_CONFIG } from "./engine.config";

/**
 * EngineContext
 * ----------------
 * Représente TOUT ce que le moteur BodyLogic doit connaître
 * pour exécuter un calcul complet.
 *
 * Ce contexte est :
 * - immuable (par convention)
 * - sérialisable
 * - indépendant de toute UI
 */
export interface EngineContext {
  /**
   * Base alimentaire disponible pour le moteur.
   * Doit être considérée comme read-only.
   */
  foods: ReadonlyArray<Food>;

  /**
   * Contraintes utilisateur pour le filtrage des aliments.
   */
  constraints: FoodConstraints;

  /**
   * Objectifs nutritionnels cibles (macros).
   * Valeurs exprimées pour le repas cible.
   */
  targets: Macros;

  /**
   * Configuration du moteur.
   * Permet d’ajuster le comportement sans modifier le code.
   */
  config: EngineConfig;
}

/**
 * Helper PRO : crée un EngineContext normalisé.
 * - Applique la config par défaut
 * - Gèle les structures critiques (optionnel mais recommandé)
 */
export function createEngineContext(args: {
  foods: Food[];
  constraints?: FoodConstraints;
  targets: Macros;
  config?: Partial<EngineConfig>;
}): EngineContext {
  const mergedConfig: EngineConfig = {
    ...DEFAULT_ENGINE_CONFIG,
    ...args.config,
    tolerancesPct: {
      ...DEFAULT_ENGINE_CONFIG.tolerancesPct,
      ...args.config?.tolerancesPct,
    },
    scoringWeights: {
      ...DEFAULT_ENGINE_CONFIG.scoringWeights,
      ...args.config?.scoringWeights,
    },
    hardLimits: {
      ...DEFAULT_ENGINE_CONFIG.hardLimits,
      ...args.config?.hardLimits,
    },
  };

  return {
    foods: Object.freeze([...args.foods]),
    constraints: args.constraints ?? {},
    targets: args.targets,
    config: mergedConfig,
  };
}

// engine.context.ts

export type Sex = "male" | "female";

export type ActivityLevel =
  | "sedentary"
  | "occasional"
  | "regular"
  | "sporty"
  | "intensive"
  | "athletic";

export interface UserProfile {
  sex: Sex;
  age: number;   // years
  weight: number; // kg
  activityLevel: ActivityLevel;
}

export type CarbMealType = "high" | "moderate" | "low";

export interface CarbCyclingContext {
  /** type de journée calculée ou imposée */
  dayType?: CarbMealType;

  /** selon l'habitude d'activité */
  activityLevel?: ActivityLevel;

  /** séance aujourd’hui ? (et idéalement timing) */
  hasWorkoutToday?: boolean;
  workoutDone?: boolean; // true si séance déjà faite
  workoutIntensity?: number; // 0..1 (optionnel)
  previousCarbTypes?: Array<"high"|"moderate"|"low">;

  /** anti-adaptation: historique court */
  previousMealTypes?: CarbMealType[]; // ex: ["high","moderate","low"]
}

export interface EngineContext {
  foods: ReadonlyArray<Food>;
  constraints: FoodConstraints;
  targets: Macros;
  config: EngineConfig;

  // 🔽 NOUVEAU (optionnel, rétro-compatible)
  user?: UserProfile;
  carbCycling?: CarbCyclingContext;
}

