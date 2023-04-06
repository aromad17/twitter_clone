import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import { authService, db } from '../fbase'
import { collection, query, where, onSnapshot, orderBy } from "firebase/firestore";
import { useState } from 'react';
import Tweets from '../components/Tweets';
import { updateProfile } from "@firebase/auth";
import { async } from "@firebase/util";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";



function Profiles({ userObj }) {

  const navigate = useNavigate();
  const [tweets, setTweets] = useState([]);
  const [newDisplayName, setNewDisplayName] = useState('');
  const [myPic, setMyPic] = useState('');

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

  async function onSubmit(e) {
    e.preventDefault();

    if (userObj.displayName !== newDisplayName) {
      await updateProfile(authService.currentUser, {
        displayName: newDisplayName,
      });
    }

    if (myPic !== "") {
      const storageRef = ref(db.storage(), `${userObj.uid}/profilePic`);
      await uploadBytes(storageRef, myPic).then(async (snapshot) => {
        const downloadURL = await getDownloadURL(snapshot.ref);
        await updateProfile(authService.currentUser, {
          photoURL: downloadURL,
        });
        setMyPic("");
      });
    }
  }
  const onChange = (e) => {
    const { target: { value } } = e;
    setNewDisplayName(value)
  }

  const onFileChange = (e) => {
    const { target: { files } } = e;
    const thePic = files[0];

    const reader = new FileReader();

    reader.readAsDataURL(thePic);

    reader.onloadend = (finishedEvent) => {
      const { currentTarget: { result } } = finishedEvent;
      const processedResult = result.substring(result.indexOf(',') + 1);
      setMyPic(processedResult);
      console.log(result);
    }

  }

  return (
    <>
      <form onSubmit={onSubmit}>
        <input type='text' onChange={onChange} value={newDisplayName} placeholder='Display name' />
        <input type='submit' value='update profile' style={{ cursor: 'pointer' }} />
        <input type='file' accept='image/*' onChange={onFileChange} />
        <img src={myPic} alt='' />
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