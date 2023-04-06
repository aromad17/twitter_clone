import React from 'react'
import { useState } from 'react';
import { authService } from '../fbase';
import '../style/authForm.scss';

function AuthForm() {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [newAccount, setNewAccount] = useState(true);
  const [error, setError] = useState('');

  const onChange = e => {
    // const {target:{name, value}} = e;

    // if(name === "email"){
    //   setEmail(value);
    // }else if(name === "password"){
    //   setPassword(value);
    // }
    if ("email" === e.target.name) {
      setEmail(e.target.value);
    } else if ("password" === e.target.name) {
      setPassword(e.target.value);
    }
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      let data;


      if (newAccount) {
        //create account
        data = await authService.createUserWithEmailAndPassword(email, password);
      } else {
        //login
        data = await authService.signInWithEmailAndPassword(email, password);
      }
      console.log(data);
    } catch (error) {
      setError(error.message);
    }
  };


  const toggleAccount = () => setNewAccount(prev => !prev);
  return (
    <>
      <form onSubmit={onSubmit} className='container'>

        <input name="email" type="email" placeholder='email' required value={email} onChange={onChange} className='authInput' />

        <input name="password" type="password" placeholder='password' required value={password} onChange={onChange} className='authInput' />

        <input type="submit" value={newAccount ? "Create Account" : "Login"} className='authInput' />
        {error && <span className='authError'>{error}</span>}
      </form>


      <span onClick={toggleAccount} className='authSwitch'>
        {newAccount ? "이미 계정이 있다면?로그인으로 이동" : "계정이 없다면? 회원가입으로 이동"}

      </span>
    </>
  )
}

export default AuthForm