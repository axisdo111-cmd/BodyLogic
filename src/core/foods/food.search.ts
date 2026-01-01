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

type FoodIndexEntry = {
  food: Food;
  normalizedName: string;
  tokens: string[];
};

const FOOD_INDEX: ReadonlyArray<FoodIndexEntry> = FOOD_DB.map((food) => {
  const sources = [
    food.name,
    ...(food.aliases ?? []),
  ];

  const tokens = Array.from(
    new Set(
      sources
        .flatMap(s => normalizeFoodText(s).split(" "))
        .filter(Boolean)
    )
  );

  return {
    food,
    normalizedName: normalizeFoodText(food.name),
    tokens,
  };
});

/**
 * Recherche tolérante (name + aliases)
 */
export function searchFoods(query: string): Food[] {
  const q = normalizeFoodText(query);
  const qTokens = q.split(" ").filter(Boolean);

  return FOOD_INDEX
    .map(({ food, normalizedName, tokens }) => {
      let score = 0;

      /* ===== MODE BROWSE (query vide) ===== */
      if (!q) {
        score += 1; // base
      } else {
        /* ===== MATCH TEXTE ===== */
        if (normalizedName === q) score += 100;
        if (normalizedName.startsWith(q)) score += 50;

        for (const qt of qTokens) {
          if (tokens.includes(qt)) score += 20;
          if (tokens.some(t => t.startsWith(qt))) score += 10;
        }
      }

      /* ===== BOOST UX ===== */
      score += food.popularity ?? 0;

      return { food, score };
    })
    .filter(r => r.score > 0)
    .sort((a, b) => b.score - a.score)
    .map(r => r.food);
}
