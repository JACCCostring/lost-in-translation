// importing css
import './css/styleForHomePage.css'

// importing components
import HomePage from './components/HomePage';
import TranslationPage from './components/TranslationPage';
import ProfilePage from './components/ProfilePage';

// importing Router things
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// importing context
import { authenticationContext } from './context/LogginContext';

//importing useState hooks
import { useState } from 'react';



function App() {
  //hooks to handle when user logg in and out
  const [login, setLogin] = useState(false);
  const [user, setUser] = useState(null)
  const [userId, setUserId] = useState(0)

  return (
  <Router>
    <authenticationContext.Provider value={{login, setLogin, user, setUser, userId, setUserId}}>
      
    <div className="App">
    <Routes>
        {/* if user is already logged then goes to TranslationPage 
          if not then send user to Home page*/}
        <Route path='/' element = {login ? <TranslationPage /> : <HomePage/>}/>
        {/* if user is already logged then goes to ProfilePage 
          if not then send user to Home page*/}
        <Route path='/Profile' element = {login ? <ProfilePage/> : <HomePage/>}/>

    </Routes>
    </div>
    </authenticationContext.Provider>
  </Router>
  );
}

export default App;
