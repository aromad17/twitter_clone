import React from 'react'
import { useState } from 'react'
import { authService } from '../fbase';
import { GoogleAuthProvider, GithubAuthProvider, signInWithPopup } from "firebase/auth";

function Auth() {
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

  const toggleAccount = () => setNewAccount(prev => !prev);

  return (
    <div>
      <form onSubmit={onSubmit}>
        <input name="email" type="email" placeholder='email' required value={email} onChange={onChange} />
        <input name="password" type="password" placeholder='password' required value={password} onChange={onChange} />
        <input type="submit" value={newAccount ? "Create Account" : "Login"} />
        {error}
      </form>
      <div>
        <button onClick={onSocial} name="google">continue with GOOGLE Account</button>
        <button onClick={onSocial} name="github">continue with Github Account</button>
      </div>
      <span onClick={toggleAccount}>
        {newAccount ? "이미 계정이 있다면? 로그인으로 이동" : "계정이 없다면? 회원가입으로 이동"}
      </span>
    </div >
  )
}

export default Auth