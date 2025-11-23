function FoodCard({ foodName, foodImage }) {
    return ( 
        <article className="max-w-xs  border w-full h-full p-4  ">
            <div className="border ">
                <img src={foodImage} alt={foodName} />
            </div>
            <div>
                <p>{foodName}</p>
            </div>
        </article>
     );
}

export default FoodCard;