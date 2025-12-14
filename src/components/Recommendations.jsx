    // Helper to get a unique key for a meal
    function mealKey(meal) {
      return meal?.id ?? meal?._id ?? meal?.meal_id ?? meal?.Id ?? meal?.ID ?? meal?.name ?? Math.random();
    }
  // Helper to pick a unique meal for a given input and set
  function pickUniqueMeal(input, usedKeys) {
    const candidates = recommendMeals(input, 10); // get top 10 candidates
    for (const meal of candidates) {
      const key = meal.id ?? meal._id ?? meal.meal_id ?? meal.Id ?? meal.ID;
      if (!usedKeys.has(key)) {
        usedKeys.add(key);
        return meal;
      }
    }
    return null;
  }
import React, { useEffect, useMemo, useState, useContext } from "react";
import * as XLSX from "xlsx";
import { recommendMeals } from "../utils/Recommender";
import { FoodContext } from "../utils/Context/FoodContext";
import { UserContext } from "../utils/Context/UserContext";
function Recommendations() {

  const { userData } = useContext(UserContext);
  const [calories, setCalories] = useState(userData?.targetCalories / 3 || 500);
  const [protein, setProtein] = useState(userData?.proteinG / 3 || 30);
  const [fat, setFat] = useState(userData?.fatG / 3 || 20);
  const [carbs, setCarbs] = useState(userData?.carbsG / 3 || 50);

  // Personalized message for user's goal
  const goalMessages = {
    lose: "To lose weight, you will need the following daily nutrition targets:",
    gain: "To gain weight, you will need the following daily nutrition targets:",
    maintain: "To maintain your weight, you will need the following daily nutrition targets:",
    build: "To build muscle, you will need the following daily nutrition targets:",
  };
  const userMacros = userData && (
    <div className="glass-card bg-white/10 border border-white/10 p-4 rounded-xl mb-4">
      <div className="mb-2 text-slate-200 font-medium">
        {goalMessages[userData.goal] || "Here are your daily nutrition targets:"}
      </div>
      <div className="flex flex-wrap gap-4">
        <div className="flex flex-col items-center">
          <span className="text-slate-400 text-xs">Calories</span>
          <span className="text-white font-bold">{userData.targetCalories} kcal</span>
        </div>
        <div className="flex flex-col items-center">
          <span className="text-slate-400 text-xs">Protein</span>
          <span className="text-white font-bold">{userData.proteinG} g</span>
        </div>
        <div className="flex flex-col items-center">
          <span className="text-slate-400 text-xs">Fat</span>
          <span className="text-white font-bold">{userData.fatG} g</span>
        </div>
        <div className="flex flex-col items-center">
          <span className="text-slate-400 text-xs">Carbs</span>
          <span className="text-white font-bold">{userData.carbsG} g</span>
        </div>
      </div>
      <div className="mt-2 text-slate-400 text-xs">Calculated for your BMI and goal: <span className="font-semibold text-white">{userData.bmi}</span> BMI, <span className="font-semibold text-white">{userData.goal}</span></div>
    </div>
  );
  const [SodiumContent, setSodiumContent] = useState(400);

  const [cuisine, setCuisine] = useState(userData?.cuisine || "Turkish");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [nameLookup, setNameLookup] = useState({});
  const [datasetLookup, setDatasetLookup] = useState({});

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
  const normalize = (v) => String(v ?? "").trim().toLowerCase();
  const CATEGORIES = useMemo(() => ["Breakfast", "Lunch", "Dinner"], []);
  const categoryOrder = useMemo(() => {
    const map = {};
    CATEGORIES.forEach((c, idx) => { map[normalize(c)] = idx; });
    return map;
  }, [CATEGORIES]);

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

  // ...existing code...

  const resolveName = (meal) => {
    if (!meal) return "Unknown";
    const id =
      meal?.id ??
      meal?._id ??
      meal?.meal_id ??
      meal?.Id ??
      meal?.ID;
    const key = id != null ? String(id) : null;
    const lookup = key ? nameLookup[key] : null;
    if (lookup) {
      if (typeof lookup === "string") return lookup;
      if (lookup?.name) return lookup.name;
    }

    return (
      meal?.friendlyName ??
      meal?.name ??
      meal?.["Dish Name"] ??
      meal?.dish_name ??
      "Unknown"
    );
  };

  const buildWeeklyPlan = (flatMeals) => {
    const plan = {};
    for (let d = 0; d < 7; d++) {
      plan[DAYS[d]] = flatMeals.slice(d * 3, d * 3 + 3);
    }
    return plan;
  };

  const handleRecommend = () => {
    if (!userData) return;
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

        // If your dataset is small, some slots may be null; we keep "-" in table
        if (meal) {
          const friendlyName = resolveName(meal);
          flat.push({ ...meal, friendlyName });
        } else {
          flat.push(null);
        }
      }
    }

    const filtered = flat.filter(Boolean);
    const ordered = orderResults(filtered);

    setResults(ordered); // ordered list of meals
    setFoodData(buildWeeklyPlan(flat)); // table keeps positions (Breakfast/Lunch/Dinner)
  };

  // Auto-randomize whenever sliders/inputs change
  useEffect(() => {
    handleRandomizing();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [calories, protein, fat, carbs, SodiumContent]);

  useEffect(() => {
    handleRecommend();

  },[userData, cuisine])

  useEffect(() => {
    if (!userData) {
      setResults([]);
      setFoodData(null);
      return;
    }

    setCuisine(userData.cuisine || "Turkish");
    setCalories(userData.targetCalories ? userData.targetCalories / 3 : 500);
    setProtein(userData.proteinG ? userData.proteinG / 3 : 30);
    setFat(userData.fatG ? userData.fatG / 3 : 20);
    setCarbs(userData.carbsG ? userData.carbsG / 3 : 50);
  }, [userData]);

  useEffect(() => {
    const loadDishNames = async () => {
      try {
        const res = await fetch(new URL("../assets/data/dataset.xlsx", import.meta.url));
        const buffer = await res.arrayBuffer();
        const wb = XLSX.read(new Uint8Array(buffer), { type: "array" });
        const sheet = wb.Sheets[wb.SheetNames[0]];
        const rows = XLSX.utils.sheet_to_json(sheet, { defval: null });

        const map = {};
        const macroMap = {};
        rows.forEach((row) => {
          const id =
            row?.id ??
            row?.Id ??
            row?.ID ??
            row?.meal_id;
          const name =
            row?.["Dish Name"] ??
            row?.DishName ??
            row?.dish_name ??
            row?.name ??
            row?.Name;

          if (id != null && name) {
            map[String(id)] = { name };
            macroMap[String(id)] = {
              calories: row?.Calories ?? row?.calories ?? null,
              protein: row?.["ProteinContent(g)"] ?? row?.ProteinContent ?? null,
              fat: row?.["FatContent(g)"] ?? row?.FatContent ?? null,
              carbs: row?.["CarbohydrateContent(g)"] ?? row?.CarbohydrateContent ?? null,
            };
          }
        });

        setNameLookup(map);
        setDatasetLookup(macroMap);
      } catch (error) {
        console.error("Failed to load dish names from dataset.xlsx", error);
      }
    };

    loadDishNames();
  }, []);

  useEffect(() => {
    if (Object.keys(nameLookup).length) {
      handleRecommend();
    }
  }, [nameLookup]);

  const firstMatch = (meal, keys) => {
    for (const k of keys) {
      const v = meal?.[k] ?? meal?.features?.[k];
      if (v !== undefined && v !== null) return v;
    }
    return null;
  };

  const macroValue = (meal, keys, suffix = "") => {
    let v = firstMatch(meal, keys);
    if (v === null) {
      const id =
        meal?.id ??
        meal?._id ??
        meal?.meal_id ??
        meal?.Id ??
        meal?.ID;
      const key = id != null ? String(id) : null;
      const ds = key ? datasetLookup[key] : null;
      if (ds) {
        if (keys[0]?.toLowerCase().includes("cal")) v = ds.calories;
        else if (keys[0]?.toLowerCase().includes("protein")) v = ds.protein;
        else if (keys[0]?.toLowerCase().includes("fat")) v = ds.fat;
        else if (keys[0]?.toLowerCase().includes("carb")) v = ds.carbs;
      }
    }

    if (v === null || v === undefined) return "-";
    const num = Number(v);
    const safe = Number.isFinite(num) ? Math.round(num) : v;
    return suffix ? `${safe}${suffix}` : safe;
  };

  const orderResults = (items = []) => {
    const nameOf = (m) => (m?.friendlyName ?? resolveName(m) ?? "").toLowerCase();
    const catOf = (m) => {
      const cat = normalize(m?.category ?? m?.Category ?? m?.meal_type ?? m?.MealType);
      return categoryOrder[cat] ?? 999;
    };
    const cuisineOf = (m) => normalize(m?.cuisine ?? m?.Cuisine ?? "");

    return items.slice().sort((a, b) => {
      const ca = catOf(a);
      const cb = catOf(b);
      if (ca !== cb) return ca - cb;

      const cuA = cuisineOf(a);
      const cuB = cuisineOf(b);
      if (cuA !== cuB) return cuA.localeCompare(cuB);

      return nameOf(a).localeCompare(nameOf(b));
    });
  };

  const renderCard = (meal, idx) => {
    const name = meal?.friendlyName ?? resolveName(meal);
    const cuisineLabel = meal?.cuisine ?? meal?.Cuisine ?? "Cuisine";
    const categoryLabel = meal?.category ?? meal?.Category ?? meal?.meal_type ?? "Meal";

    const caloriesVal = macroValue(meal, ["Calories", "calories", "kcal"], " kcal");
    const proteinVal = macroValue(meal, ["ProteinContent", "ProteinContent(g)", "protein"], " g");
    const fatVal = macroValue(meal, ["FatContent", "FatContent(g)", "fat"], " g");
    const carbsVal = macroValue(meal, ["CarbohydrateContent", "CarbohydrateContent(g)", "carbs"], " g");

    return (
      <div key={`${mealKey(meal)}-${idx}`} className="glass-card p-4 space-y-3">
        <div className="flex items-start justify-between gap-2">
          <div>
            <p className="text-xs text-slate-400 uppercase tracking-[0.08em]">{cuisineLabel}</p>
            <h4 className="text-lg font-semibold text-white leading-snug">{name}</h4>
            <p className="text-sm text-slate-300">{categoryLabel}</p>
          </div>
          <div className="pill text-xs">{caloriesVal}</div>
        </div>
        <div className="grid grid-cols-3 gap-2 text-sm">
          <div className="glass-card bg-white/5 border border-white/5 p-3 rounded-xl">
            <p className="text-slate-400 text-xs">Protein</p>
            <p className="text-white font-semibold">{proteinVal}</p>
          </div>
          <div className="glass-card bg-white/5 border border-white/5 p-3 rounded-xl">
            <p className="text-slate-400 text-xs">Fat</p>
            <p className="text-white font-semibold">{fatVal}</p>
          </div>
          <div className="glass-card bg-white/5 border border-white/5 p-3 rounded-xl">
            <p className="text-slate-400 text-xs">Carbs</p>
            <p className="text-white font-semibold">{carbsVal}</p>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-4">
      {userMacros}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <p className="pill">Recommended meals</p>
          <h3 className="text-xl font-semibold text-white">Balanced picks for you</h3>
        </div>
        <button className="ghost-btn" onClick={handleRecommend}>
          Refresh picks
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center items-center min-h-[120px]">
          {/* Loader removed */}
        </div>
      ) : results.length === 0 ? (
        <div className="glass-card p-4 text-slate-300 text-sm">
          No meals yet. Complete your info and we will suggest options with macros.
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {results.map((meal, idx) => renderCard(meal, idx))}
        </div>
      )}
    </div>
  );
}

export default Recommendations;
