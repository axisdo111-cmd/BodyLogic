import { FoodCategory } from "../engine/engine.config";

/**
 * Représente les macronutriments standards
 * Valeurs exprimées en grammes, sauf kcal
 */
export interface Macros {
  calories: number; // kcal
  protein: number;  // g
  carbs: number;    // g
  fat: number;      // g
}

/**
 * Représente les micronutriments standards
 * Unités explicites
 */
export interface Micros {
  fiber: number;       // g
  sodiumMg: number;    // mg
  potassiumMg: number; // mg
  calciumMg: number;   // mg
  ironMg: number;      // mg
  vitaminCMg: number;  // mg
}

/**
 * 
 * 
 */
export type FoodUnit =
  | "g"
  | "piece"
  | "tbsp"
  | "tsp"
  | "portion";

/**
 * Tags alimentaires (extensibles)
 */
export type FoodTag =
  | "vegan"
  | "vegetarian"
  | "gluten_free"
  | "dairy_free"
  | "high_protein"
  | "low_carb";

/**
 * Aliment de base du moteur
 */
export interface Food {
  id: string;
  name: string;

  /**
   * Catégorie nutritionnelle principale
   * utilisée par le générateur de repas
   */
  category: FoodCategory;

  /** valeurs nutritionnelles pour 100g */
  macrosPer100g: Macros;

  /** micronutriments pour 100g (optionnels) */
  microsPer100g?: Micros;

  /** tags fonctionnels */
  tags?: FoodTag[];
  
   // 🔽 NOUVEAUX (optionnels)
  aliases?: string[];          // synonymes, pluriels, autres langues
  defaultUnit?: FoodUnit;      // g | piece | tbsp | portion
  units?: Partial<Record<FoodUnit, number>>; 
  // ex: piece: 60 => 1 pièce = 60g

  popularity?: number;         // aide au tri UX

  // 🔽 NOUVEAU (optionnel)
  ingestionPhase?: IngestionPhase;
  ingestionPriority?: number; // plus petit = plus tôt
}

/**
 * Ingestion Order
 */
export type IngestionPhase =
  | "fiber"
  | "protein"
  | "carb"
  | "fat"
  | "other";

export interface Food {
  // existant …

  // 🔽 BodyLogic (OPTIONNEL)
  ingestionPhase?: IngestionPhase;
  ingestionPriority?: number; // override fin si besoin
}
