import { useContext } from "react";
import { FoodContext } from "../../utils/Context/FoodContext";
import { UserContext } from "../../utils/Context/UserContext";
function FoodTable() {



  const { foodData } = useContext(FoodContext);
  const { setUserData } = useContext(UserContext);

  const renderCells = (meals = []) => {
    return [0, 1, 2].map((i) => (
      <td key={i} className="border p-2">
        {meals?.[i]?.name ?? "—"}
      </td>
    ));
  };

  const rest = () => {
    setUserData(null);
  }
  return (
    <>
    <table className="w-3/4 border border-gray-300 text-sm">
      <thead className="bg-gray-200">
        <tr>
          <th className="border p-2">Day</th>
          <th className="border p-2">Breakfast</th>
          <th className="border p-2">Lunch</th>
          <th className="border p-2">Dinner</th>
        </tr>
      </thead>

      <tbody>
        <tr>
          <td className="border p-2 font-bold bg-gray-200">Monday</td>
          {renderCells(foodData?.monday)}
        </tr>

        <tr>
          <td className="border p-2 font-bold bg-gray-200">Tuesday</td>
          {renderCells(foodData?.tuesday)}
        </tr>

        <tr>
          <td className="border p-2 font-bold bg-gray-200">Wednesday</td>
          {renderCells(foodData?.wednesday)}
        </tr>

        <tr>
          <td className="border p-2 font-bold bg-gray-200">Thursday</td>
          {renderCells(foodData?.thursday)}
        </tr>

        <tr>
          <td className="border p-2 font-bold bg-gray-200">Friday</td>
          {renderCells(foodData?.friday)}
        </tr>

        <tr>
          <td className="border p-2 font-bold bg-gray-200">Saturday</td>
          {renderCells(foodData?.saturday)}
        </tr>

        <tr>
          <td className="border p-2 font-bold bg-gray-200">Sunday</td>
          {renderCells(foodData?.sunday)}
        </tr>
      </tbody>


   
    </table>

       <button onClick={rest}>
        Rest
      </button>

      </>
  );
}

export default FoodTable;
