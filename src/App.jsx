
import { useState } from 'react';
import './App.css'
import Header from './components/layout/Header'
import Main from './components/layout/Main'
import { UserContext } from './utils/Context/UserContext';
import { FoodContext } from './utils/Context/FoodContext';

function App() {
  
  const [userData , setUserData] = useState(null);
  const [foodData , setFoodData] = useState(null);
  return (
    <div className="page-shell flex flex-col gap-6">
      <Header />
      <FoodContext.Provider value={{foodData , setFoodData}}>
      <UserContext.Provider value={{userData , setUserData}}>
      
        <Main />
      </UserContext.Provider>
       </FoodContext.Provider>

    </div>
  )
}

export default App
