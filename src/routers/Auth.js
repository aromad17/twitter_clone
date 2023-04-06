import React from 'react'
import '../style/auth.scss'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import AuthForm from '../components/AuthForm';
import { GithubAuthProvider, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { authService } from '../fbase';
import { useState } from 'react';




function Auth() {

  const [error, setError] = useState('');

  const onSocial = async (e) => {
    const { target: { name } } = e;
    let provider;

    if (name === "google") {
      //구글눌렀을때
      provider = new GoogleAuthProvider();
    } else if (name === "github") {
      //깃헙눌렀을때
      provider = new GithubAuthProvider();
    }
    try {
      const data = await signInWithPopup(authService, provider);
      console.log("data->", data);
    } catch (error) {
      setError(error.message);
    }
  }


  return (
    <div className='authContainer'>
      <FontAwesomeIcon icon="fa-brands fa-twitter" size="8x" color={'#04AAFF'} style={{ marginBottom: 30 }} />

      <AuthForm />

      <div className='authBtns'>

        <button onClick={onSocial} name="google" className='authBtn'>continue with GOOGLE Account <FontAwesomeIcon icon="fa-brands fa-google" /></button>

        <button onClick={onSocial} name="github" className='authBtn'>continue with Github Account<FontAwesomeIcon icon="fa-brands fa-github" /></button>

      </div>

    </div >
  )
}

export default Auth