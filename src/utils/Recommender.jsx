import mealsData from "../assets/data/meals_with_embeddings.json"
import metaData from "../assets/data/meta.json";


const meals = mealsData;   // array of { id, name, cuisine, category, features, embedding }
const meta = metaData;   
export function encodeUserInput(userInput) {
  const {
    numFeatures,
    numMeans,
    numStds,
    cuisines,
    categories,
    cuisineWeight,
    categoryWeight,
  } = meta;

  const vec = [];

  // 1) Numeric part: StandardScaler (value - mean) / std
  numFeatures.forEach((feat, idx) => {
    const mean = numMeans[idx];
    const std = numStds[idx] || 1;

    const rawVal = userInput[feat] ?? 0;
    const val = Number(rawVal);
    const scaled = (val - mean) / std;

    vec.push(scaled);
  });

  // 2) Cuisine one-hot * weight
  cuisines.forEach((c) => {
    const bit = userInput.Cuisine === c ? 1 : 0;
    vec.push(bit * cuisineWeight);
  });

  // 3) Category one-hot * weight
  categories.forEach((cat) => {
    const bit = userInput.Category === cat ? 1 : 0;
    vec.push(bit * categoryWeight);
  });

  return vec;
}

/**
 * Simple squared Euclidean distance between two vectors
 */
function sqEuclidean(a, b) {
  let sum = 0;
  const len = a.length;

  for (let i = 0; i < len; i++) {
    const d = a[i] - b[i];
    sum += d * d;
  }

  return sum;
}

/**
 * Main function: get top N recommended meals for a user.
 *
 * userInput example:
 * {
 *   Calories: 500,
 *   FatContent: 20,
 *   SaturatedFatContent: 5,
 *   "CholesterolContent(mg)": 100,
 *   SodiumContent: 400,
 *   CarbohydrateContent: 50,
 *   FiberContent: 5,
 *   SugarContent: 5,
 *   ProteinContent: 30,
 *   RecipeServings: 1,
 *   Cuisine: "Turkish",
 *   Category: "Breakfast",
 * }
 */
export function recommendMeals(userInput, nResults = 5) {
  const userVec = encodeUserInput(userInput);

  // Compute distance to every meal
  const scored = meals.map((m) => ({
    meal: m,
    dist: sqEuclidean(userVec, m.embedding),
  }));

  // Sort by distance ascending (closest first)
  scored.sort((a, b) => a.dist - b.dist);

  // Return top N meal objects
  return scored.slice(0, nResults).map((s) => s.meal);
}