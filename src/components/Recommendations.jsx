import React, { useState } from "react";
import { recommendMeals } from "../utils/Recommender";


function Recommendations() {
    const [calories, setCalories] = useState(500);
    const [protein, setProtein] = useState(30);
    const [fat, setFat] = useState(20);
    const [carbs, setCarbs] = useState(50);
    const [cuisine, setCuisine] = useState("Turkish");
    const [category, setCategory] = useState("Breakfast");
    const [results, setResults] = useState([]);

  const handleRecommend = () => {
    const userInput = {
      // keys must match your meta.numFeatures names exactly
      Calories: calories,
      FatContent: fat,
      SaturatedFatContent: 5,
      "CholesterolContent(mg)": 100,
      SodiumContent: 400,
      CarbohydrateContent: carbs,
      FiberContent: 5,
      SugarContent: 5,
      ProteinContent: protein,
      RecipeServings: 1,

      Cuisine: cuisine,
      Category: category,
    };

    const recs = recommendMeals(userInput, 5);
    setResults(recs);
  };

  return (
    <div>
      <h2>Meal Recommender</h2>

      <div>
        <label>
          Calories:
          <input
            type="number"
            value={calories}
            onChange={(e) => setCalories(Number(e.target.value))}
          />
        </label>
      </div>

      <div>
        <label>
          Protein (g):
          <input
            type="number"
            value={protein}
            onChange={(e) => setProtein(Number(e.target.value))}
          />
        </label>
      </div>

      <div>
        <label>
          Carbs (g):
          <input
            type="number"
            value={carbs}
            onChange={(e) => setCarbs(Number(e.target.value))}
          />
        </label>
      </div>

      <div>
        <label>
          Fat (g):
          <input
            type="number"
            value={fat}
            onChange={(e) => setFat(Number(e.target.value))}
          />
        </label>
      </div>

      <div>
        <label>
          Cuisine:
          <select value={cuisine} onChange={(e) => setCuisine(e.target.value)}>
            <option value="Turkish">Turkish</option>
            <option value="Arabic">Arabic</option>
            <option value="Italian">Italian</option>
            <option value="Greek">Greek</option>
          </select>
        </label>
      </div>

      <div>
        <label>
          Category:
          <select value={category} onChange={(e) => setCategory(e.target.value)}>
            <option value="Breakfast">Breakfast</option>
            <option value="Lunch">Lunch</option>
            <option value="Dinner">Dinner</option>
          </select>
        </label>
      </div>

      <button onClick={handleRecommend}>Recommend</button>

      <ul>
        {results.map((meal) => (
          <li key={meal.id}>
            #{meal.id} – {meal.name} ({meal.cuisine}, {meal.category})
          </li>
        ))}
      </ul>
    </div>
  );
}