import React, { useState, useContext, useMemo } from "react";
import { UserContext } from "../../utils/Context/UserContext";

const CUISINES = [
    "American",
    "Arabic",
    "Chinese",
    "French",
    "Greek",
    "Indian",
    "Italian",
    "Japanese",
    "Mexican",
    "Spanish",
    "Turkish"
];

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
    const [preferredCuisine, setPreferredCuisine] = useState("Turkish");

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

                // Adjust calories and macros based on goal
                let targetCalories = maintenanceCalories;
                let proteinG = Math.round(weightKg * proteinPerKg);
                let fatP = fatPercent;

                if (goal === "lose") {
                    targetCalories = maintenanceCalories - 500;
                    proteinG = Math.round(weightKg * 2.0); // higher protein for weight loss
                    fatP = 0.22;
                } else if (goal === "gain") {
                    targetCalories = maintenanceCalories + 300;
                    proteinG = Math.round(weightKg * 1.7);
                    fatP = 0.28;
                } else if (goal === "build") {
                    targetCalories = maintenanceCalories + 200;
                    proteinG = Math.round(weightKg * 2.2); // highest protein for muscle gain
                    fatP = 0.25;
                } else {
                    // maintain
                    targetCalories = maintenanceCalories;
                    proteinG = Math.round(weightKg * proteinPerKg);
                    fatP = fatPercent;
                }

                targetCalories = Math.round(targetCalories);
                const proteinCals = proteinG * 4;
                const fatCals = Math.round(targetCalories * clamp(fatP, 0.15, 0.40));
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
            const payload = {
                ...result,
                goal,
                activity,
                sex,
                age,
                heightCm,
                weightKg,
                cuisine: preferredCuisine
            };
            setUserData(payload);
            console.log(payload);

        } else {


        }
    }
    return (
    <form className="glass-card p-6 md:p-8 space-y-5 w-full">
        <div className="flex items-start justify-between gap-3">
            <div className="space-y-2 text-left">
                <p className="pill">Fuel your week</p>
                <h2 className="text-2xl md:text-3xl font-bold gradient-text">Dial in your targets</h2>
                <p className="text-slate-300 max-w-xl">Answer a few quick questions so we can craft meals that match your energy needs and your favorite cuisine.</p>
            </div>
            <div className="hidden md:block text-sm text-slate-400">
                Step {currentStep} of 3
            </div>
        </div>

        <div className="stepper">
            {[1,2,3].map((step) => (
                <div key={step} className={`step ${currentStep === step ? "active" : ""}`}>
                    {step}
                </div>
            ))}
        </div>

        {currentStep === 1 && (
            <div className="grid gap-4">
                <div className="field">
                    <label htmlFor="sex">Sex</label>
                    <select className="input" id="sex" value={sex} onChange={(e) => setSex(e.target.value)}>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                    </select>
                </div>

                <div className="field">
                    <label htmlFor="age">Age</label>
                    <input className="input" id="age" type="number" value={age} onChange={(e) => setAge(Number(e.target.value))} />
                </div>
            </div>
        )}

        {currentStep === 2 && (
            <div className="grid md:grid-cols-2 gap-4">
                <div className="field">
                    <label htmlFor="weight">Weight (kg)</label>
                    <input className="input" id="weight" type="number" value={weightKg} onChange={(e) => setWeightKg(Number(e.target.value))} />
                </div>

                <div className="field">
                    <label htmlFor="height">Height (cm)</label>
                    <input className="input" id="height" type="number" value={heightCm} onChange={(e) => setHeightCm(Number(e.target.value))} />
                </div>
            </div>

        )}

        {currentStep === 3 && (
            <div className="grid md:grid-cols-2 gap-4">
                <div className="field">
                    <label htmlFor="goal">Goal</label>
                    <select className="input" id="goal" value={goal} onChange={(e) => setGoal(e.target.value)}>
                        <option value="lose">Lose Weight</option>
                        <option value="gain">Gain Weight</option>
                        <option value="maintain">Maintain Weight</option>
                        <option value="build">Build Muscles</option>
                    </select>
                </div>

                <div className="field">
                    <label htmlFor="preferredCuisine">Preferred Cuisine</label>

                    <select
                        className="input"
                        id="preferredCuisine"
                        value={preferredCuisine}
                        onChange={(e) => setPreferredCuisine(e.target.value)}
                    >
                        {CUISINES.map((cuisine) => (
                            <option key={cuisine} value={cuisine}>
                                {cuisine}
                            </option>
                        ))}
                    </select>
                </div>
            </div>
        )}

        <div className="flex items-center justify-between">
            <span className="text-sm text-slate-400">We calculate macros with the Mifflin-St Jeor formula + your activity level.</span>
            <button className="primary-btn" onClick={handleNext}>
                {currentStep < 3 ? "Next" : "See my plan"}
            </button>
        </div>
    </form>
    );
}

export default Questions;
