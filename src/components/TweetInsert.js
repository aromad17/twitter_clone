import React, { useState } from 'react'
import { collection, addDoc } from "firebase/firestore";
import { storage, db } from '../fbase';
import { v4 as uuidv4 } from 'uuid';
import { ref, uploadString, getDownloadURL } from "firebase/storage";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import "../style/tweetinsert.scss"


function TweetInsert({ userObj }) {


  const [attachment, setAttachment] = useState('');
  const [tweet, setTweet] = useState('');



  const onChange = (e) => {
    const { target: { value } } = e;
    setTweet(value);

    // console.log(tweet);
  }


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
    <form onSubmit={onSubmit} className='InsertForm'>
      <div className='InsertInput__container'>
        <input type='text' placeholder='What you gonna do?' maxLength={120} onChange={onChange} value={tweet} className='InsertInput__input' />
        <input type='submit' value='&rarr;' className='InsertInput__arrow' onClick={onSubmit} />
      </div>

      <label htmlFor="attach-file" className='InsertInput__label'>
        <span>Add Photos</span>
        <FontAwesomeIcon icon="fa-solid fa-plus" />
      </label>
      <input id="attach-file" type='file' accept='image/*' onChange={onFileChange} className='InsertInput__input' style={{ opacity: 0 }} />

      {attachment && ( //attachment 에 값이 있다면 true , undefiend,null,공백은 false 값이 있다면 true

        <div className='Insertform_attachment'>
          <img src={attachment} style={{ backgroundImage: attachment }} alt="으애" />
          <div className='Insertform__clear' onClick={onClearAttachment}>
            <span>Remove</span>
            <FontAwesomeIcon icon="fa-solid fa-xmark" />
          </div>



        </div>
      )

      }


    </form>
  )
}

export default TweetInsert