import React, { useState } from 'react'
import NotesCss from './Notes.module.css'
import CheckBoxRoundedIcon from '@mui/icons-material/CheckBoxRounded';

function Notes() {
  const [content, setContent] = useState('');

  function handleSave() {
    // const currentDate = new Date().toISOString();

    const newNote = {
      // id: 1,
      appointment_id: 2,
      patient_id: 2,
      // created: currentDate,
      // updated: currentDate,
      content: content,

    }
    fetch('http://localhost:8086/notes/add', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(newNote)
    })
      .then(response => {
        if (response.ok) {
          console.log('Note saved successfully!');
          setContent('');
        } else {
          throw new Error('Error saving note');
        }
      })
      .catch(error => {
        console.error('Error saving note:', error);
      });
    console.log(newNote)
  }
  return (
    <section className={NotesCss.main}>
      <h1 className={NotesCss.heading}>Notes</h1>
      <div className={NotesCss.textareaWrapper}>
        <textarea
          className={NotesCss.textarea}
          type="text"
          value={content}
          onChange={event => setContent(event.target.value)}
          placeholder="create a note for patient"
        />
        <div className={NotesCss.btnDiv}>

          <button className={NotesCss.btnSave} onClick={handleSave}><CheckBoxRoundedIcon className={NotesCss.saveIcon} /><span>Save</span> </button>
        </div>
      </div>
      <div className={NotesCss.costWrapper}>
        <h5>Cost: </h5>
        <input type='text' value="300$" readOnly className={NotesCss.costBox}></input>
      </div>
    </section>
  )
}

export default Notes
