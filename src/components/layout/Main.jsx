import { useState } from "react";
import QuestionComponent from "../content/QuestionComponent";
import LoadingComponent from "../animated_components/LoadingComponent";
import ResultsComponent from "../content/ResultsComponent";
function Main() {
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [answers, setAnswers] = useState([]);

    const [isloading, setIsloading] = useState(false);


    const [pageState, setPageState] = useState("results"); 

    const [results, setResults] = useState({
        breakfast: [
            {
                name: "Pancakes",
                image: "https://example.com/pancakes.jpg"
            }
        ],
        lunch: [
            {
                name: "Caesar Salad",
                image: "https://example.com/caesar_salad.jpg"
            }
        ], 
        dinner: [
            {
                name: "Grilled Salmon",
                image: "https://example.com/grilled_salmon.jpg"
            }
        ]
    });

    const questions = [
        {
            question: "What is your favorite cuisine?",
            answers: ["Italian", "Chinese", "Mexican", "Indian"]
        },
        {
            question: "What is your preferred meal type?",
            answers: ["Breakfast", "Lunch", "Dinner", "Snack"]
        },
        {
            question: "Do you have any dietary restrictions?",
            answers: ["Vegetarian", "Vegan", "Gluten-Free", "None"]
        },
        {
            question: "What is your favorite flavor profile?",
            answers: ["Spicy", "Sweet", "Savory", "Sour"]
        }
    ]


    const addAnswerHandler = (answer) => {
        
        if(currentQuestionIndex < questions.length - 1){
            setAnswers([...answers, answer]);
            setCurrentQuestionIndex(currentQuestionIndex + 1);
            console.log(answers);
        }else{
            setAnswers([...answers, answer]);
            setIsloading(true);
            setPageState("loading");
            console.log(answers);

        }
       
    }
    return ( 
       <main className=" bg-(--cream-white) h-full ">

            {pageState === "questions" && <QuestionComponent question={questions[currentQuestionIndex]} addAnswer={addAnswerHandler} /> } 

            {pageState === "loading" && <LoadingComponent />  }

            {pageState === "results" && <ResultsComponent results={results} />  }
            
       </main>
     );
}

export default Main;