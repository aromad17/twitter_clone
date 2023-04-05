import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import { authService, db } from '../fbase'
import { collection, query, where, onSnapshot, orderBy } from "firebase/firestore";
import { useState } from 'react';
import Tweets from '../components/Tweets';

function Profiles({ userObj }) {

  const navigate = useNavigate();
  const [tweets, setTweets] = useState([]);
  const [newDisplayName, setNewDisplayName] = useState('');


  useEffect(() => {
    const q = query(collection(db, "newTweet"), where("creatorId", "==", userObj.uid), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const tweetArray = [];
      querySnapshot.forEach((doc) => {
        tweetArray.push({ ...doc.data(), id: doc.id });
      });
      setTweets(tweetArray);
    });
  }, [])

  const onLogOutClick = () => {
    authService.signOut();
    navigate('/'); //강제로 '/'로 페이지를 이동시킨다
  }

  const onSubmit = () => {}
  const onChange = () => {}


  return (
    <>
      <form onSubmit={onSubmit}>
        <input type='text' onChange={onChange} value={newDisplayName} placeholder='Display name' />
        <input type='submit' value='update tweet' />
      </form>

      {tweets.map((tweet, idx) => (
        <Tweets
          key={idx}
          tweetObj={tweet}
          isOwner={tweet.creatorId === userObj.uid}
        />

      ))}
      <button onClick={onLogOutClick}>Log Out</button>
    </>
  )
}

export default Profiles