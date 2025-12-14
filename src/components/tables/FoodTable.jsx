import { useContext } from "react";
import { FoodContext } from "../../utils/Context/FoodContext";
import { UserContext } from "../../utils/Context/UserContext";
function FoodTable() {



  const { foodData, setFoodData } = useContext(FoodContext);
  const { setUserData } = useContext(UserContext);

  const renderCells = (meals = []) => {
    return [0, 1, 2].map((i) => (
      <td key={i} className="border border-slate-700/60 bg-slate-900/40 p-2 md:p-3">
        {meals?.[i]?.friendlyName ?? meals?.[i]?.name ?? "-"}
      </td>
    ));
  };

  const rest = () => {
    setFoodData(null);
    setUserData(null);
  }
    return (
    <>
    <div className="glass-card p-5 space-y-4 w-full">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div>
          <p className="pill">Your weekly line-up</p>
          <h3 className="text-xl font-semibold text-white">Personalized meal plan</h3>
        </div>
        <button className="ghost-btn" onClick={rest}>
          Reset plan
        </button>
      </div>
      <div className="w-full overflow-x-auto">
        <table className="min-w-full border border-slate-700/60 text-xs md:text-sm rounded-xl overflow-hidden table-fixed">
          <thead className="bg-slate-800/70">
            <tr>
              <th className="border border-slate-700/60 p-2 md:p-3 text-left w-[18%]">Day</th>
              <th className="border border-slate-700/60 p-2 md:p-3 text-left w-[27%]">Breakfast</th>
              <th className="border border-slate-700/60 p-2 md:p-3 text-left w-[27%]">Lunch</th>
              <th className="border border-slate-700/60 p-2 md:p-3 text-left w-[28%]">Dinner</th>
            </tr>
          </thead>

          <tbody>
            <tr>
              <td className="border border-slate-700/60 p-2 md:p-3 font-semibold bg-slate-800/60">Monday</td>
              {renderCells(foodData?.monday)}
            </tr>

            <tr>
              <td className="border border-slate-700/60 p-2 md:p-3 font-semibold bg-slate-800/60">Tuesday</td>
              {renderCells(foodData?.tuesday)}
            </tr>

            <tr>
              <td className="border border-slate-700/60 p-2 md:p-3 font-semibold bg-slate-800/60">Wednesday</td>
              {renderCells(foodData?.wednesday)}
            </tr>

            <tr>
              <td className="border border-slate-700/60 p-2 md:p-3 font-semibold bg-slate-800/60">Thursday</td>
              {renderCells(foodData?.thursday)}
            </tr>

            <tr>
              <td className="border border-slate-700/60 p-2 md:p-3 font-semibold bg-slate-800/60">Friday</td>
              {renderCells(foodData?.friday)}
            </tr>

            <tr>
              <td className="border border-slate-700/60 p-2 md:p-3 font-semibold bg-slate-800/60">Saturday</td>
              {renderCells(foodData?.saturday)}
            </tr>

            <tr>
              <td className="border border-slate-700/60 p-2 md:p-3 font-semibold bg-slate-800/60">Sunday</td>
              {renderCells(foodData?.sunday)}
            </tr>
          </tbody>
        </table>
      </div>
    </div>

      </>
  );
}

export default FoodTable;
