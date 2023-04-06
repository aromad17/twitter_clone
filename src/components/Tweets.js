import { deleteDoc, doc, updateDoc } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { storage, db } from '../fbase';
import { deleteObject, ref } from 'firebase/storage';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import "../style/tweet.scss"
function Tweets(props) {
  const { tweetObj, tweetObj: { text, key, createdAt, id, attachmentUrl }, isOwner } = props;
  const [editing, setEditing] = useState(false);
  const [editTweet, setEditTweet] = useState(text);
  const [nowDate, setNowDate] = useState(createdAt);

  const onDeleteClick = async (e) => {
    const ok = window.confirm("삭제하시겠습니까?");

    if (ok) {
      await deleteDoc(doc(db, "newTweet", `/${id}`));
      const desertRef = ref(storage, attachmentUrl);
      await deleteObject(desertRef);
    }
  };


  const toggleEditing = () => setEditing((prev) => !prev); // false는 true값으로 true는 false로, 이전 상태로 변경해준다

  const onChange = (e) => {
    e.preventDefault();
    const { target: { value } } = e;
    setEditTweet(value);
  }

  const onSubmit = async (e) => {
    e.preventDefault();

    const updateTweetRef = doc(db, "newTweet", `${id}`);
    await updateDoc(updateTweetRef, {
      text: editTweet,
      createdAt: Date.now(),
    })

    setEditing(false);
  }

  // const onEditClick = (e) => { third }

  useEffect(() => {
    let timeStamp = createdAt;
    const now = new Date(timeStamp);
    setNowDate(now.toDateString());
    //toDatetring()은 날짜만 나오고 toUTCString은 시간도 나옴


  }, [])

  return (
    <div className='tweet'>
      {editing ? (
        <>
          <form className='container tweet_edit'>
            <img src={attachmentUrl} alt="" />

            <input type="text" onChange={onChange} name="edit" value={editTweet} required />

            <input type='submit' value='edit confirm' onClick={onSubmit} className='formBtn' />

          </form>
          <button className='cancelBtn' onClick={toggleEditing}>Cancel</button>
        </>
      ) : (
        <>
          {text ? <h4>{text}</h4> : <h4>&nbsp;</h4>}
          {attachmentUrl &&
            <img src={attachmentUrl} alt="" />
          }
          <span>{nowDate}</span>

          {isOwner && (
            <div className='tweet__actions'>
              <span onClick={toggleEditing}>
                <FontAwesomeIcon icon="fa-solid fa-pencil" />
              </span>
              <span onClick={onDeleteClick}>
                <FontAwesomeIcon icon="fa-solid fa-trash" />
              </span>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default Tweets;
