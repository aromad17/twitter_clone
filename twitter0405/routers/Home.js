import React, { useEffect, useState } from 'react'
import { collection, addDoc, onSnapshot, query, orderBy } from "firebase/firestore";
import { storage, db } from '../fbase';
import Tweet from '../components/Tweets';
import { v4 as uuidv4 } from 'uuid';
import { ref, uploadString, getDownloadURL, deleteObject } from "firebase/storage";
import TweetInsert from '../../src/components/TweetInsert';


function Home({ userObj }) {

  const [tweet, setTweet] = useState('');
  const [tweets, setTweets] = useState([]);
  const [attachment, setAttachment] = useState('');

  const onChange = (e) => {
    const { target: { value } } = e;
    setTweet(value);

    // console.log(tweet);
  }

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



  const onSubmit = async (e) => {

    e.preventDefault();

    try {
      let attachmentUrl = "";

      if (attachment !== "") {
        const storageRef = ref(storage, `${userObj.uid}/${uuidv4()}`);
        // ref(storage, '경로')
        // `${userObj.uid}/${uuidv4()}` -> `${로그인한아이디}/${고유 아이디}`
        const response = await uploadString(storageRef, attachment, 'data_url');
        console.log('response->', response);
        attachmentUrl = await getDownloadURL(ref(storage, response.ref));
      }
      const docRef = await addDoc(collection(db, "newTweet"), {
        text: tweet,
        createdAt: Date.now(),
        creatorId: userObj.uid, //userObj => 로그인한 사용자 정보
        attachmentUrl
      });
      // console.log("Document written with ID: ", docRef.id);
    } catch (e) {
      console.error("Error adding document: ", e);
    }
    setTweet('');
    setAttachment('');
  }

  const onFileChange = (e) => {

    console.log('e->', e);

    const { target: { files } } = e;
    const theFile = files[0];

    const reader = new FileReader();
    // 1. 사진을 보이게 하려면 FileReader()라는 브라우저 api 사용이 불가피함
    reader.readAsDataURL(theFile);
    // 2. theFile이라는 이미지객체의 데이터를 FileReader로 돌려 데이터 url로 추출해준다.
    reader.onloadend = (finishedEvent) => {
      console.log('finEnd ->', finishedEvent);
      const { currentTarget: { result } } = finishedEvent;
      setAttachment(result);
      // 3.추출된 url을 finishedEvent 객체로 지정하고 setAttachment에 삽입
    }
  }

  const onClearAttachment = () => {
    setAttachment('');
  }


  return (
    <>

      <TweetInsert userObj={userObj} />


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

    </>
  )
}

export default Home