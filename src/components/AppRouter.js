import React from 'react'
import { BrowserRouter, HashRouter as Router, Route, Routes } from 'react-router-dom';
import Auth from '../routers/Auth';
import Home from '../routers/Home';
import Nav from './Nav';
import Profile from '../routers/Profiles';

function AppRouter({ isLoggedIn, userObj }) {




  return (
    <BrowserRouter>
      {isLoggedIn && <Nav userObj={userObj} />}
      <Routes>
        {isLoggedIn ? (
          <>
            <Route path='/' element={<Home userObj={userObj} />} />
            <Route path='/profile' element={<Profile userObj={userObj} />} />
          </>
        ) : (
          <Route path='/' element={<Auth />} />
        )}
      </Routes>
    </BrowserRouter>
  )
}

export default AppRouter

