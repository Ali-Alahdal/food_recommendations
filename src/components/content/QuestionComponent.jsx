function QuestionComponent({ question, addAnswer }) {

    return ( 
        <section className="bg-(--cream-white) h-full w-full flex justify-center ">
            <div>
                <h2 className="text-2xl font-semibold mb-4 mt-8 text-(--charcoal)">{question.question}</h2>

                <ul className="space-y-2 text-center">
                    {question.answers.map((answer, index) => (
                        <li key={index} className="text-(--charcoal) " onClick={() => addAnswer(answer)}>{answer}</li>
                    ))}
                </ul>
            </div>
        </section>
     );
}

export default QuestionComponent;