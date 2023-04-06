import React from 'react'
import { Link } from 'react-router-dom'

function Nav({ userObj }) {
  console.log("userObj.>", userObj)
  return (
    <nav>
      <ul>
        <li><Link to="/">Home</Link></li>
        <li><Link to="/profile">
          <img src={userObj.photoURL} alt='' />
          {userObj.displayName}'s Profile</Link></li>
      </ul>
    </nav>
  )
}

export default Nav