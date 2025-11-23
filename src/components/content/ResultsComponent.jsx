import FoodCard from "../cards/FoodCard";

function ResultsComponent({results}) {
     

    return ( 
        <section>
            <h2 className="text-2xl font-semibold  text-(--charcoal) text-center">Your Results</h2>
            <div className="flex w-full justify-around mt-8">
                <div>
                    <h3>Breakfast</h3>
                    {results.breakfast.map((item, index) => (
                        <FoodCard key={index} foodName={item.name} foodImage={item.image}/>
                    ))}
                </div>
                <div>
                    <h3>Lunch</h3>
                    {results.lunch.map((item, index) => (
                        <FoodCard key={index} foodName={item.name} foodImage={item.image}/>
                    ))}
                </div>
                <div>
                    <h3>Dinner</h3>
                    {results.dinner.map((item, index) => (
                        <FoodCard key={index} foodName={item.name} foodImage={item.image}/>
                    ))}
                </div>
            </div>
        </section>
     );
}

export default ResultsComponent;