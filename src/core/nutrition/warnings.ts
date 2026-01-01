import { Macros } from "../foods/food.types";
import { MacroTargetsRange } from "./targets";
import { MealWarning } from "../meals/meal.types";

export function computeMacroWarnings(
  macros: Macros,
  ranges: MacroTargetsRange
): MealWarning[] {
  const warnings: MealWarning[] = [];

  (Object.keys(macros) as (keyof Macros)[]).forEach((key) => {
    const value = macros[key];
    const range = ranges[key];

    if (value < range.min) {
      warnings.push({
        type: "macro_low",
        macro: key,
        value,
        target: range.min,
      });
    }

    if (value > range.max) {
      warnings.push({
        type: "macro_high",
        macro: key,
        value,
        target: range.max,
      });
    }
  });

  return warnings;
}
