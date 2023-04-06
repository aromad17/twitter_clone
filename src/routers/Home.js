import React, { useEffect, useState } from 'react'
import { collection, onSnapshot, query, orderBy } from "firebase/firestore";
import { db } from '../fbase';
import Tweet from '../components/Tweets';
import TweetInsert from '../components/TweetInsert';


function Home({ userObj }) {

  const [tweets, setTweets] = useState([]);



  // const getTweets = async (e) => {
  //   const querySnapshot = await getDocs(collection(db, "newTweet"));
  //   querySnapshot.forEach((doc) => {
  //     // console.log(`${doc.id} => ${doc.data()}`);
  //     const tweetObject = { ...doc.data(), id: doc.id }
  //     setTweets(prev => [tweetObject, ...prev]);//새 트윗을 가장 위로 보내기
  //     //ex) ary[1,2,3,4,5,] => 새트윗 작성후 : [tweetObject,1,2,3,4,5]

  //   });

  // }

  useEffect(() => {
    const q = query(collection(db, "newTweet"), orderBy("createdAt", "desc"));

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const newArray = [];
      querySnapshot.forEach((doc) => {
        newArray.push({ ...doc.data(), id: doc.id });
      });

      setTweets(newArray);
    });


  }, []);

  return (
    <div className='container'>
      <TweetInsert userObj={userObj} />

      <div>
        {tweets.map((tweet, idx) => (
          // <div key={tweet.id}>
          //   <h4>
          //     {tweet.text}
          //   </h4>
          // </div>

          <Tweet
            key={idx}
            tweetObj={tweet}
            isOwner={tweet.creatorId === userObj.uid}
          />

        ))}
      </div>
      <footer>&copy; {new Date().getFullYear()}Twiiter app</footer>
    </div>
  )
}

export default Home