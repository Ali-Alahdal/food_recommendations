
import { useState } from 'react';
import './App.css'
import Header from './components/layout/Header'
import Main from './components/layout/Main'
import { UserContext } from './utils/Context/UserContext';

function App() {
  
  const [userData , setUserData] = useState(null);
  return (
    <>
      <div className='h-screen'>
        <Header />

        <UserContext.Provider value={{userData , setUserData}}>
        
          <Main />
        </UserContext.Provider>
      </div>
      
    </>
  )
}

export default App
