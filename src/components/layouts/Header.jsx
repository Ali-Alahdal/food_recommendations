function Header() {
    return (
        <header className=" bg-(--charcoal) p-4 flex justify-between text-(--cream)">

            <div>
                <h1 className="text-xl font-bold   ">Food Recommendation System</h1>  
            </div>

            <div className="flex">
                <ul className="flex gap-5 text-sm items-center   align-middle ">
                    <li className="self-center items-center "> <a className="hover:text-(--tomato) active:text-(--warm-yellow)  " href="">Sign Up</a> </li>
                    <li> <a className="hover:text-(--tomato) active:text-(--warm-yellow) " href="">Sign In </a> </li>
                </ul>
            </div>
        </header>
    );
}

export default Header;