
import { useContext, useEffect, useMemo, useState } from "react";
import { UserContext } from "../../utils/Context/UserContext";
import Questions from "../sections/Questions";
import Recommendations from "../Recommendations";



function Main() {


  const { userData, setUserData } = useContext(UserContext);

  useEffect(() => {
    console.log("User Data in Main:", userData);
  } , )
  return (
    <main className="max-w-5xl mx-auto text-slate-100 flex-1 flex flex-col gap-6 w-full">

      <section className="flex flex-col lg:flex-row gap-5 justify-center items-start flex-1 flex-wrap">

        {userData == null ?
          <div className="w-full lg:w-1/2">
            <Questions />
          </div>
          : null}

      </section>

      {userData && <Recommendations />}
    </main>
  );
}

export default Main;
