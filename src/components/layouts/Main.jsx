import { useState } from "react";
import QuestionComponent from "../QuestionComponent";

function Main() {
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [answers, setAnswers] = useState([]);
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
        }
       
        
    }
    return ( 
       <main className=" bg-(--cream-white) h-full ">
            <QuestionComponent question={questions[currentQuestionIndex]} addAnswer={addAnswerHandler} />

       </main>
     );
}

export default Main;