import React, { useEffect, useState } from 'react'
import AppRouter from "./components/AppRouter";
import { authService } from "./fbase"

function App() {

  const [isLoggedIn, setIsLoggedIn] = useState(authService.currentUser);
  const [init, setInit] = useState(false);


  const [userObj, setUserObj] = useState('');

  useEffect(() => {

    authService.onAuthStateChanged((user) => {
      if (user) {
        setIsLoggedIn(true);
        console.log(user);
        setUserObj(user);
      } else {
        setIsLoggedIn(false);
      }
      setInit(true);
    })
  })

  return (
    <>
      {init ? <AppRouter isLoggedIn={isLoggedIn} userObj={userObj}/> : "Loading...." 
        
      }
    </>
  );
}

export default App;
