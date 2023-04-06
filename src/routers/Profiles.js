import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import { authService, db, storage } from '../fbase'
import { collection, query, where, onSnapshot, orderBy } from "firebase/firestore";
import { useState } from 'react';
import Tweets from '../components/Tweets';
import { updateProfile } from "@firebase/auth";
import { async } from "@firebase/util";
import { getDownloadURL, ref, uploadBytes, uploadString } from "firebase/storage";
import { v4 as uuidv4 } from 'uuid';
import '../style/profile.scss'


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
    navigate(-1); //강제로 '/'로 페이지를 이동시킨다
  }

  const onSubmit = async (e) => {

    e.preventDefault();

    let myPicUrl = "";

    try {

      const storageRef = ref(storage, `${userObj.uid}/${uuidv4()}`);
      const response = await uploadString(storageRef, myPic, 'data_url');
      console.log("ewqewq->", response);
      myPicUrl = await getDownloadURL(ref(storage, response.ref));

      await updateProfile(userObj, {
        displayName: newDisplayName,
        photoURL: myPicUrl,//!== "" ? myPicUrl : userObj.photoURL,
      });

    } catch (error) {
      console.log("error")
    }

    setMyPic('');
    setNewDisplayName('');
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
      setMyPic(result);
    }

  }

  return (
    <div className='container'>
      <form onSubmit={onSubmit} className='profileForm'>

        <img src={userObj.photoURL} width={100} height={100} alt='' />

        <input type='submit' value='update profile' style={{ cursor: 'pointer' }} className='formInput' />
        <input type='text' onChange={onChange} value={newDisplayName} placeholder='Set Your Name' className='formBtn' />
        <label className='formBtn' htmlFor='profileImg'>프로필 이미지 변경</label>
        <input type='file' accept='image/*' id='profileImg' onChange={onFileChange} className='profileImgChange' />
        {myPic ? <img src={myPic} alt='' width={100} height={100} /> : <></>}

      </form>

      <span onClick={onLogOutClick} className='formBtn cancelBtn logOut'>Log Out</span>

      {tweets.map((tweet, idx) => (
        <Tweets
          key={idx}
          tweetObj={tweet}
          isOwner={tweet.creatorId === userObj.uid}
        />

      ))}

    </div>
  )
}

export default Profiles