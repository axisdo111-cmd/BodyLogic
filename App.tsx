import { ScrollView, Text, View } from "react-native";

import { runEngine } from "./src/core/engine/engine.run";
import { DEFAULT_ENGINE_CONFIG } from "./src/core/engine/engine.config";
import { getAllFoods } from "./src/core/foods/food.db";
import { defaultTargets } from "./src/core/nutrition/targets";

export default function App() {
  const result = runEngine({
    foods: getAllFoods(),
    constraints: {},
    targets: defaultTargets,
    config: DEFAULT_ENGINE_CONFIG,
  });

  return (
    <ScrollView style={{ padding: 20 }}>
      <Text style={{ fontSize: 22, fontWeight: "bold", marginBottom: 10 }}>
        🍽️ BodyLogic
      </Text>

      {result.best ? (
        <>
          <Text style={{ fontSize: 16, marginBottom: 6 }}>
            Score: {result.best.score}
          </Text>

          {result.best.meal.items.map((item) => (
            <Text key={item.food.id}>
              • {item.food.name} – {item.grams} g
            </Text>
          ))}
        </>
      ) : (
        <Text>No meal found</Text>
      )}
    </ScrollView>
  );
}
