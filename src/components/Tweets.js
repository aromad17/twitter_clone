import { deleteDoc, doc, updateDoc } from 'firebase/firestore';
import React, { useState } from 'react';
import { storage, db } from '../fbase';
import { deleteObject, ref } from 'firebase/storage';

function Tweets(props) {
  console.log("props->", props);
  const { tweetObj, tweetObj: { text, key, createdAt, id, attachmentUrl }, isOwner } = props;
  const [editing, setEditing] = useState(false);
  const [editTweet, setEditTweet] = useState(text);


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

  return (
    <div key={key}>
      {editing ? (
        <>
          <form>
            <input type="text" onChange={onChange} name="edit" value={editTweet} required />
            <input type='submit' value='edit confirm' onClick={onSubmit} />
          </form>
          <button onClick={toggleEditing}>Cancel</button>
        </>
      ) : (
        <>
          <h4>{text}</h4>
          {attachmentUrl &&
            <img src={attachmentUrl} width="150" height="150" alt="" />
          }
          <hr />
          {isOwner && (
            <>
              <button onClick={onDeleteClick}>Delete Tweet</button>
              <button onClick={toggleEditing}>Edit Tweet</button>
            </>
          )}
        </>
      )}
    </div>
  );
}

export default Tweets;
