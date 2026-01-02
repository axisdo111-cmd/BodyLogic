import { Meal } from "./meal.types";

const defaultPhaseOrder: Record<string, number> = {
  fiber: 10,
  protein: 20,
  carb: 30,
  fat: 40,
  other: 50,
};

export function sortMealItemsByIngestion(meal: Meal): Meal {
  const items = [...meal.items].sort((a, b) => {
    const pa =
      a.food.ingestionPriority ??
      defaultPhaseOrder[a.food.ingestionPhase ?? "other"];
    const pb =
      b.food.ingestionPriority ??
      defaultPhaseOrder[b.food.ingestionPhase ?? "other"];
    return pa - pb;
  });

  return { ...meal, items };
}

const DEFAULT_ORDER: Record<string, number> = {
  fiber: 10,
  protein: 20,
  carb: 30,
  fat: 40,
  other: 50,
};

export function sortMealByIngestion(meal: Meal): Meal {
  return {
    ...meal,
    items: [...meal.items].sort((a, b) => {
      const pa =
        a.food.ingestionPriority ??
        DEFAULT_ORDER[a.food.ingestionPhase ?? "other"];
      const pb =
        b.food.ingestionPriority ??
        DEFAULT_ORDER[b.food.ingestionPhase ?? "other"];
      return pa - pb;
    }),
  };
  
}
