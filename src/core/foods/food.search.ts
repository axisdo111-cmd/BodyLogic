import { FOOD_DB } from "./food.db";
import { Food } from "./food.types";

/**
 * Normalisation texte (search UX-friendly)
 */
export function normalizeFoodText(input: string): string {
  return input
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .replace(/[^a-z0-9\s]/g, "")
    .trim();
}

/**
 * Recherche tolérante (name + aliases)
 */
export function searchFoods(query: string): Food[] {
  const q = normalizeFoodText(query);
  if (!q) return [...FOOD_DB];

  return FOOD_DB
    .map((food) => {
      const fields = [
        food.name,
        ...(food.aliases ?? []),
      ].map(normalizeFoodText);

      let score = 0;
      if (fields.some(f => f === q)) score += 10;
      if (fields.some(f => f.startsWith(q))) score += 5;
      if (fields.some(f => f.includes(q))) score += 2;

      score += food.popularity ?? 0;

      return { food, score };
    })
    .filter(r => r.score > 0)
    .sort((a, b) => b.score - a.score)
    .map(r => r.food);
}
