import { Food, FoodTag } from "../foods/food.types";

export interface UserConstraints {
  excludedFoodIds?: string[];
  requiredTags?: FoodTag[];
  forbiddenTags?: FoodTag[];
    allergens?: {
    gluten?: boolean;
    lactose?: boolean;
    nuts?: boolean;
    eggs?: boolean;
    soy?: boolean;
  };
  maxCaloriesPerMeal?: number;
}

export function filterFoodsByConstraints(
  foods: Food[],
  constraints: UserConstraints
): Food[] {
  return foods.filter(food => {
    if (constraints.excludedFoodIds?.includes(food.id)) return false;

    if (
      constraints.requiredTags &&
      !constraints.requiredTags.every(t => food.tags?.includes(t))
    ) {
      return false;
    }

    if (
      constraints.forbiddenTags &&
      constraints.forbiddenTags.some(t => food.tags?.includes(t))
    ) {
      return false;
    }

    return true;
  });
}
