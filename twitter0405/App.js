import React, { useEffect, useState } from 'react'
import AppRouter from "./components/AppRouter";
import { authService } from "./fbase"
import { config } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { library } from '@fortawesome/fontawesome-svg-core'
import { fas } from '@fortawesome/free-solid-svg-icons'
import { faTwitter, faFontAwesome, faGoogle, faGithub } from '@fortawesome/free-brands-svg-icons'
import ReactDOM from 'react-dom'
library.add(fas, faTwitter, faGoogle, faGithub)


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
      {init ? <AppRouter isLoggedIn={isLoggedIn} userObj={userObj} /> : " Loading...."

      }
    </>
  );
}

export default App;
