import { Meal, MealItem } from "./meal.types";
import { Food, FoodUnit } from "../foods/food.types";

/**
 * Builder immuable pour construire un Meal de manière contrôlée.
 * - aucune mutation externe
 * - cohérent avec quantity + unit
 * - utilisable par UI, tests, ou générateur
 */
export class MealBuilder {
  private readonly items: MealItem[];

  private constructor(items: MealItem[]) {
    this.items = items;
  }

  /* ============================================================================
   * Factories
   * ========================================================================== */

  static empty(): MealBuilder {
    return new MealBuilder([]);
  }

  static fromMeal(meal: Meal): MealBuilder {
    return new MealBuilder([...meal.items]);
  }

  /* ============================================================================
   * Mutations immuables
   * ========================================================================== */

  /**
   * Ajoute un aliment avec quantité + unité.
   */
  addFood(
    food: Food,
    quantity: number,
    unit: FoodUnit = food.defaultUnit ?? "g"
  ): MealBuilder {
    if (!Number.isFinite(quantity) || quantity <= 0) {
      throw new Error("MealBuilder.addFood: quantity must be > 0");
    }

    return new MealBuilder([
      ...this.items,
      { food, quantity, unit },
    ]);
  }

  /**
   * Met à jour la quantité d’un item existant (par index).
   */
  updateQuantity(index: number, quantity: number): MealBuilder {
    if (!Number.isFinite(quantity) || quantity <= 0) {
      throw new Error("MealBuilder.updateQuantity: quantity must be > 0");
    }
    if (index < 0 || index >= this.items.length) {
      throw new Error("MealBuilder.updateQuantity: index out of bounds");
    }

    return new MealBuilder(
      this.items.map((it, i) =>
        i === index ? { ...it, quantity } : it
      )
    );
  }

  /**
   * Met à jour l’unité (ex: g → piece).
   */
  updateUnit(index: number, unit: FoodUnit): MealBuilder {
    if (index < 0 || index >= this.items.length) {
      throw new Error("MealBuilder.updateUnit: index out of bounds");
    }

    return new MealBuilder(
      this.items.map((it, i) =>
        i === index ? { ...it, unit } : it
      )
    );
  }

  /**
   * Supprime un item.
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
   */
  withItems(items: MealItem[]): MealBuilder {
    return new MealBuilder([...items]);
  }

  /* ============================================================================
   * Accès & build
   * ========================================================================== */

  getItems(): MealItem[] {
    return [...this.items];
  }

  build(args: { id: string; }): Meal {
    if (!args.id || args.id.trim().length === 0) {
      throw new Error("MealBuilder.build: id is required");
    }

    if (this.items.length === 0) {
      throw new Error("MealBuilder.build: cannot build empty meal");
    }

    return {
      id: args.id,
      items: [...this.items],
    };
  }
}
