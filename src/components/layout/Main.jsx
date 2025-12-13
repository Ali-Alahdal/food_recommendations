
import { useContext, useEffect, useMemo, useState } from "react";
import { UserContext } from "../../utils/Context/UserContext";
import Questions from "../sections/Questions";
import FoodTable from "../tables/FoodTable";
import Recommendations from "../Recommendations";



function Main() {


  const { userData, setUserData } = useContext(UserContext);

  useEffect(() => {
    console.log("User Data in Main:", userData);
  } , )
  return (
    <main className="bg-white   h-full ">

      <section className="flex justify-center text-center items-center h-full ">


        {userData == null ?
          <Questions />
          
  
          :
          <FoodTable />


        }

      </section>

      <Recommendations />



    </main>
  );
}

export default Main;