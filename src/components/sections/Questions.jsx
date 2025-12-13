import React, { useState, useContext, useMemo } from "react";
import { UserContext } from "../../utils/Context/UserContext";




const ACTIVITY = {
    sedentary: 1.2,        // little/no exercise
    light: 1.375,          // 1-3 days/week
    moderate: 1.55,        // 3-5 days/week
    active: 1.725,         // 6-7 days/week
    veryActive: 1.9        // hard training/physical job
};

function clamp(n, min, max) {
    return Math.max(min, Math.min(max, n));
}

// Mifflin–St Jeor
function bmrMifflin({ sex, weightKg, heightCm, age }) {
    if (sex === "male") return 10 * weightKg + 6.25 * heightCm - 5 * age + 5;
    return 10 * weightKg + 6.25 * heightCm - 5 * age - 161;
}



function Questions() {

    const { userData, setUserData } = useContext(UserContext);

    const [sex, setSex] = useState("male");
    const [age, setAge] = useState(22);
    const [heightCm, setHeightCm] = useState(175);
    const [weightKg, setWeightKg] = useState(70);
    const [activity, setActivity] = useState("moderate");


    const [goal, setGoal] = useState("maintain");
    // kcal adjustment: typical ranges: lose -300..-700, gain +200..+500
    const [kcalAdjust, setKcalAdjust] = useState(0);

    // protein & fat rules (simple)
    // protein g/kg: 1.6 good default (training) / 1.2 non-training
    const [proteinPerKg, setProteinPerKg] = useState(1.6);
    // fat: 25% of calories default
    const [fatPercent, setFatPercent] = useState(0.25);

    const result = useMemo(() => {

        const heightM = heightCm / 100;
        const bmi = weightKg / (heightM * heightM);

        const bmr = bmrMifflin({ sex, weightKg, heightCm, age });
        const maintenanceCalories = bmr * (ACTIVITY[activity] ?? 1.2);

        let targetCalories = maintenanceCalories + kcalAdjust;
        // optional: if user chooses goal, you can auto adjust:
        // if (goal === "lose") targetCalories = maintenanceCalories - 500;
        // if (goal === "gain") targetCalories = maintenanceCalories + 300;

        targetCalories = Math.round(targetCalories);

        // macros
        const proteinG = Math.round(weightKg * proteinPerKg);
        const proteinCals = proteinG * 4;

        const fatCals = Math.round(targetCalories * clamp(fatPercent, 0.15, 0.40));
        const fatG = Math.round(fatCals / 9);

        const remainingCals = targetCalories - (proteinCals + fatCals);
        const carbsG = Math.max(0, Math.round(remainingCals / 4));

        return {
            bmi: Number(bmi.toFixed(1)),
            bmr: Math.round(bmr),
            maintenanceCalories: Math.round(maintenanceCalories),
            targetCalories,
            proteinG,
            fatG,
            carbsG
        };
    }, [sex, age, heightCm, weightKg, activity, goal, kcalAdjust, proteinPerKg, fatPercent]);


    const [currentStep, setCurrentStep] = useState(1);

    const handleNext = (e) => {
        e.preventDefault();
        setCurrentStep((prev) => prev + 1);
        if (currentStep >= 3) {
            setUserData(result);
            console.log(result);

        } else {


        }
    }
    return (<form className="text-center items-center content-center  border-[0.1px] p-10 rounded-lg shadow-lg w-1/2 ">

        {currentStep === 1 && (
            <>
                <h2 className="text-xl capitalize">We need some informations about you!</h2>
                <div className="flex justify-around gap-5 mt-8 ">

                    <label htmlFor="">Sex</label>

                    <select className="outline w-full" id="sex" value={sex} onChange={(e) => setSex(e.target.value)}>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                    </select>
                </div>

                <div className="flex justify-around gap-4 mt-3 ">

                    <label htmlFor="">Age</label>

                    <input className="outline w-full pl-1" type="number" name="" id="" value={age} onChange={(e) => setAge(Number(e.target.value))} />
                </div>

                <div className="flex ">
                    <button className="bg-gradient-to-r from-[#005461] to-[#00B7B5] text-white px-8 py-2 border-[#03c6e4] border-1 rounded-md mt-4 me-0 self-end mx-auto " onClick={handleNext}>Next</button>

                </div>
            </>
        )}

        {currentStep === 2 && (
            <>
                <h2 className="text-xl capitalize">Do not be Shiy Tell us !</h2>
                <div className="flex justify-around gap-3 mt-3 ">

                    <label htmlFor="">Weight (kg)</label>

                    <input className="outline w-[81%] pl-1" type="number" name="" id="" value={weightKg} onChange={(e) => setWeightKg(Number(e.target.value))} />
                </div>

                <div className="flex justify-around gap-3 mt-3 ">

                    <label htmlFor="">Height (cm)</label>

                    <input className="outline w-[81%] pl-1" type="number" name="" id="" value={heightCm} onChange={(e) => setHeightCm(Number(e.target.value))} />
                </div>

                <div className="flex ">
                    <button className="bg-gradient-to-r from-[#005461] to-[#00B7B5] text-white px-8 py-2 border-[#03c6e4] border-1 rounded-md mt-4 me-0 self-end mx-auto " onClick={handleNext}>Next</button>

                </div>
            </>

        )}

        {currentStep === 3 && (

            <>
                <h2 className="text-xl capitalize">There we go!</h2>

                <div className="flex justify-around gap-5 mt-8 ">

                    <label htmlFor="">Goal</label>

                    <select className="outline w-full" id="goal" value={goal} onChange={(e) => setGoal(e.target.value)}>
                        <option value="lose">Lose Weight</option>
                        <option value="gain">Gain Weight</option>
                        <option value="maintain">Maintain Weight</option>
                        <option value="build">Build Muscles</option>
                    </select>
                </div>

                <div className="flex ">
                    <button className="bg-gradient-to-r from-[#005461] to-[#00B7B5] text-white px-8 py-2 border-[#03c6e4] border-1 rounded-md mt-4 me-0 self-end mx-auto " onClick={handleNext}>Next</button>

                </div>
            </>
        )}
    </form>
    );
}

export default Questions;