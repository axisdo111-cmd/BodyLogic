import { Meal, MealItem } from "./meal.types";
import { Food } from "../foods/food.types";

/**
 * Builder immuable pour construire un Meal de manière contrôlée.
 * - aucune mutation externe
 * - recalcul délégué aux modules nutrition
 * - utilisable par UI, tests, ou générateur
 */
export class MealBuilder {
  private readonly items: MealItem[];

  private constructor(items: MealItem[]) {
    this.items = items;
  }

  /**
   * Crée un builder vide
   */
  static empty(): MealBuilder {
    return new MealBuilder([]);
  }

  /**
   * Crée un builder à partir d’un meal existant (clone)
   */
  static fromMeal(meal: Meal): MealBuilder {
    return new MealBuilder([...meal.items]);
  }

  /**
   * Ajoute un aliment avec une portion donnée.
   * - grams doit être > 0
   * - retourne un NOUVEAU builder
   */
  addFood(food: Food, grams: number): MealBuilder {
    if (!Number.isFinite(grams) || grams <= 0) {
      throw new Error("MealBuilder.addFood: grams must be a finite number > 0");
    }

    return new MealBuilder([
      ...this.items,
      { food, grams },
    ]);
  }

  /**
   * Met à jour la portion d’un item existant (par index).
   * Utile pour UI (slider, +/-).
   */
  updatePortion(index: number, grams: number): MealBuilder {
    if (!Number.isFinite(grams) || grams <= 0) {
      throw new Error("MealBuilder.updatePortion: grams must be > 0");
    }
    if (index < 0 || index >= this.items.length) {
      throw new Error("MealBuilder.updatePortion: index out of bounds");
    }

    return new MealBuilder(
      this.items.map((it, i) =>
        i === index ? { ...it, grams } : it
      )
    );
  }

  /**
   * Supprime un item par index.
   */
  removeItem(index: number): MealBuilder {
    if (index < 0 || index >= this.items.length) {
      throw new Error("MealBuilder.removeItem: index out of bounds");
    }

    return new MealBuilder(
      this.items.filter((_, i) => i !== index)
    );
  }

  /**
   * Remplace complètement les items.
   * Pratique pour normaliser / reconstruire un repas.
   */
  withItems(items: MealItem[]): MealBuilder {
    return new MealBuilder([...items]);
  }

  /**
   * Retourne les items (copie défensive).
   */
  getItems(): MealItem[] {
    return [...this.items];
  }

  /**
   * Finalise le repas.
   * - id requis (contrôle explicite)
   * - name optionnel (UI)
   */
  build(args: { id: string; name?: string }): Meal {
    if (!args.id || args.id.trim().length === 0) {
      throw new Error("MealBuilder.build: id is required");
    }

    if (this.items.length === 0) {
      throw new Error("MealBuilder.build: cannot build empty meal");
    }

    return {
      id: args.id,
      name: args.name,
      items: [...this.items],
    };
  }
}
