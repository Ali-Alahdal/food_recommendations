import React, { useEffect, useMemo, useState, useContext } from "react";
import { recommendMeals } from "../utils/Recommender";
import { FoodContext } from "../utils/Context/FoodContext";
import { UserContext } from "../utils/Context/UserContext";
function Recommendations() {

  const { userData } = useContext(UserContext);
  const [calories, setCalories] = useState(userData?.targetCalories / 3 || 500);
  const [protein, setProtein] = useState(userData?.proteinG / 3 || 30);
  const [fat, setFat] = useState(userData?.fatG / 3 || 20);
  const [carbs, setCarbs] = useState(userData?.carbsG / 3 || 50);
  const [SodiumContent, setSodiumContent] = useState( 400);

  const [cuisine, setCuisine] = useState("Turkish");
  const [results, setResults] = useState([]);

  const { setFoodData } = useContext(FoodContext);

  const [caloriesList, setCaloriesList] = useState([]);
  const [proteinList, setProteinList] = useState([]);
  const [fatList, setFatList] = useState([]);
  const [carbsList, setCarbsList] = useState([]);
  const [sodiumList, setSodiumList] = useState([]);

  const DAYS = useMemo(
    () => ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"],
    []
  );
  const CATEGORIES = useMemo(() => ["Breakfast", "Lunch", "Dinner"], []);

  const normalize = (v) => String(v ?? "").trim().toLowerCase();

  const randInRange = (min, max) => Math.random() * (max - min) + min;

  const handleRandomizing = () => {
    const randomizedCalories = [];
    const randomizedProtein = [];
    const randomizedFat = [];
    const randomizedCarbs = [];
    const randomizedSodium = [];

    for (let i = 0; i < 7; i++) {
      randomizedCalories.push(randInRange(calories, calories + 500));
      randomizedProtein.push(randInRange(protein, protein + 40));
      randomizedFat.push(randInRange(fat, fat + 35));
      randomizedCarbs.push(randInRange(carbs, carbs + 60));
      randomizedSodium.push(randInRange(SodiumContent, SodiumContent + 200));
    }

    setCaloriesList(randomizedCalories);
    setProteinList(randomizedProtein);
    setFatList(randomizedFat);
    setCarbsList(randomizedCarbs);
    setSodiumList(randomizedSodium);
  };

  // A safe "unique key" even if some meals don't have id
  const mealKey = (m) => {
    const id = m?.id ?? m?._id ?? m?.meal_id;
    if (id != null) return `id:${id}`;
    return `name:${normalize(m?.name)}`;
  };

  // Enforce Cuisine + Category, then pick unique (no repetition)
  const pickUniqueMeal = (baseInput, usedKeys, tries = 45) => {
    let userInput = { ...baseInput };

    const wantedCuisine = normalize(baseInput.Cuisine);
    const wantedCategory = normalize(baseInput.Category);

    for (let t = 0; t < tries; t++) {
      // Ask many, then filter
      const recs = recommendMeals(userInput, 40) || [];

      const filtered = recs.filter((m) => {
        // support different dataset field names:
        const mealCuisine = normalize(m?.cuisine ?? m?.Cuisine);
        const mealCategory = normalize(
          m?.category ?? m?.Category ?? m?.meal_type ?? m?.MealType
        );

        return mealCuisine === wantedCuisine && mealCategory === wantedCategory;
      });

      const fresh = filtered.find((m) => m && !usedKeys.has(mealKey(m)));
      if (fresh) {
        usedKeys.add(mealKey(fresh));
        return fresh;
      }

      // jitter macros to avoid same top results every time
      userInput = {
        ...userInput,
        Calories: userInput.Calories + (Math.random() * 40 - 20),
        ProteinContent: userInput.ProteinContent + (Math.random() * 6 - 3),
        FatContent: userInput.FatContent + (Math.random() * 6 - 3),
        CarbohydrateContent: userInput.CarbohydrateContent + (Math.random() * 10 - 5),
        SodiumContent: userInput.SodiumContent + (Math.random() * 80 - 40),
      };
    }

    return null;
  };

  const buildWeeklyPlan = (flatMeals) => {
    const plan = {};
    for (let d = 0; d < 7; d++) {
      plan[DAYS[d]] = flatMeals.slice(d * 3, d * 3 + 3);
    }
    return plan;
  };

  const handleRecommend = () => {
    // Ensure lists are ready
    if (
      caloriesList.length !== 7 ||
      proteinList.length !== 7 ||
      fatList.length !== 7 ||
      carbsList.length !== 7 ||
      sodiumList.length !== 7
    ) {
      handleRandomizing();
      return;
    }

    const usedKeys = new Set();
    const flat = [];

    for (let i = 0; i < 7; i++) {
      for (const category of CATEGORIES) {
        const baseInput = {
          Calories: caloriesList[i],
          FatContent: fatList[i],
          SaturatedFatContent: 5,
          "CholesterolContent(mg)": 100,
          SodiumContent: sodiumList[i],
          CarbohydrateContent: carbsList[i],
          FiberContent: 5,
          SugarContent: 5,
          ProteinContent: proteinList[i],
          RecipeServings: 1,

          Cuisine: cuisine,
          Category: category, // <-- this is what we enforce
        };

        const meal = pickUniqueMeal(baseInput, usedKeys);

        // If your dataset is small, some slots may be null; we keep "—" in table
        if (meal) flat.push(meal);
        else flat.push(null);
      }
    }

    setResults(flat.filter(Boolean)); // list shows only found meals
    setFoodData(buildWeeklyPlan(flat)); // table keeps positions (Breakfast/Lunch/Dinner)
  };

  // Auto-randomize whenever sliders/inputs change
  useEffect(() => {
    handleRandomizing();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [calories, protein, fat, carbs, SodiumContent]);

  useEffect(() => {
    handleRecommend();

  },[userData])

  return (
    <div className="space-y-4">
      {/* <h2 className="text-lg font-bold">Meal Recommender</h2>

      <div className="grid grid-cols-2 gap-3 max-w-lg">
        <label className="flex flex-col gap-1">
          <span>Calories</span>
          <input
            className="border p-2 rounded"
            type="number"
            value={calories}
            onChange={(e) => setCalories(Number(e.target.value))}
          />
        </label>

        <label className="flex flex-col gap-1">
          <span>Protein (g)</span>
          <input
            className="border p-2 rounded"
            type="number"
            value={protein}
            onChange={(e) => setProtein(Number(e.target.value))}
          />
        </label>

        <label className="flex flex-col gap-1">
          <span>Carbs (g)</span>
          <input
            className="border p-2 rounded"
            type="number"
            value={carbs}
            onChange={(e) => setCarbs(Number(e.target.value))}
          />
        </label>

        <label className="flex flex-col gap-1">
          <span>Fat (g)</span>
          <input
            className="border p-2 rounded"
            type="number"
            value={fat}
            onChange={(e) => setFat(Number(e.target.value))}
          />
        </label>

        <label className="flex flex-col gap-1">
          <span>Sodium (mg)</span>
          <input
            className="border p-2 rounded"
            type="number"
            value={SodiumContent}
            onChange={(e) => setSodiumContent(Number(e.target.value))}
          />
        </label>

        <label className="flex flex-col gap-1">
          <span>Cuisine</span>
          <select
            className="border p-2 rounded"
            value={cuisine}
            onChange={(e) => setCuisine(e.target.value)}
          >
            <option value="Turkish">Turkish</option>
            <option value="Arabic">Arabic</option>
            <option value="Italian">Italian</option>
            <option value="Greek">Greek</option>
          </select>
        </label>
      </div>

      <div className="flex gap-2">
        <button className="px-4 py-2 border rounded" onClick={handleRandomizing}>
          Randomize targets (7 days)
        </button>

        <button className="px-4 py-2 border rounded font-bold" onClick={handleRecommend}>
          Recommend (Breakfast/Lunch/Dinner + unique)
        </button>
      </div>

      <div>
        <h3 className="font-semibold mb-2">Found Meals ({results.length})</h3>
        <ul className="list-disc pl-6 space-y-1">
          {results.map((meal, index) => (
            <li key={`${mealKey(meal)}-${index}`}>
              #{meal?.id ?? meal?._id ?? meal?.meal_id ?? "?"} – {meal?.name} (
              {meal?.cuisine ?? meal?.Cuisine}, {meal?.category ?? meal?.Category ?? meal?.meal_type}
              )
            </li>
          ))}
        </ul>
      </div> */}
    </div>
  );
}

export default Recommendations;
