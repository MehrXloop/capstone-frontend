import React, { useState, useEffect } from 'react';
import { Modal, Button, List, ListItem, ListItemText, Typography, TextField } from '@mui/material';
import { Box } from '@mui/system';
import moment from 'moment';

const PreviousNotes = () => {
    const [notes, setNotes] = useState([]);
    const [selectedNote, setSelectedNote] = useState(null);
    const [modalOpen, setModalOpen] = useState(false);
    const [editedContent, setEditedContent] = useState('');
    const [isEditing, setIsEditing] = useState(false);

    useEffect(() => {
        fetchNotes();
    }, [notes]);

    const fetchNotes = async () => {
        try {
            const response = await fetch("http://notes.us-west-2.elasticbeanstalk.com/notes/notesByPatientId/2");
            const data = await response.json();
            //without moment.js
            // const sortedNotes = data.sort((a, b) => new Date(b.created) - new Date(a.created));

            //sorting date
            const sortedNotes = data.sort((a, b) => moment(b.created).diff(moment(a.created)));
            setNotes(sortedNotes);
        } catch (error) {
            console.error('Error fetching notes:', error);
        }
    };

    const formatDateTime = (dateTime) => {
        const formattedDate = moment.utc(dateTime).format('MMMM Do YYYY');
        const formattedTime = moment.utc(dateTime).format('h:mm A');
        const dayOfWeek = moment.utc(dateTime).format('dddd');
        return {
            date: formattedDate,
            time: formattedTime,
            day: dayOfWeek,
        };
    };

    const openModal = (note) => {
        setSelectedNote(note);
        setEditedContent(note.content);
        setModalOpen(true);
    };

    const closeModal = () => {
        setSelectedNote(null);
        setModalOpen(false);
        setIsEditing(false);
    };

    function handleEditNote() {
        const updatedNote = {
            ...selectedNote,
            content: editedContent,
            updated: moment().utc().toISOString()
        };

        fetch('http://notes.us-west-2.elasticbeanstalk.com/notes/update', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(updatedNote)
        })
            .then(response => {
                if (response.ok) {
                    fetchNotes();
                    closeModal();
                } else {
                    console.error('Failed to update note:', response.status);
                }
            })
            .catch(error => {
                console.error('Error updating note:', error);
            });
    }

    const enableEditing = () => {
        setIsEditing(true);
    };

    return (
        <Box display="flex" height="100vh" overflow="hidden">
            <List
                sx={{
                    bgcolor: "white",
                    border: "1px solid rgba(0, 128, 128, 1)",
                    borderRadius: "15px",
                    p: 2,
                    m: 2,
                    overflow: "auto",
                }}
            >
                <Typography variant='h5'>Patient previous Notes:</Typography>
                {notes.length === 0 ? (
                    <ListItem sx={{ bgcolor: "#a0d4d4", borderRadius: "15px", my: 2 }}>
                        <ListItemText primary="No previous notes available" />
                    </ListItem>
                ) : (
                    notes.map((note) => {
                        const { time } = formatDateTime(note.created);
                        return (
                            <ListItem
                                button
                                data-testid="click-note"
                                key={note.id}
                                onClick={() => openModal(note)}
                                sx={{ bgcolor: "#a0d4d4", borderRadius: "15px", my: 2 }}
                            >
                                <ListItemText
                                    primary={`Date: ${formatDateTime(note.created).date}`}
                                    secondary={`${formatDateTime(note.created).day}, ${time}`}
                                />
                            </ListItem>
                        );
                    })
                )}
            </List>
            <Modal open={modalOpen} onClose={closeModal}>
                <Box
                    display="flex"
                    flexDirection="column"
                    justifyContent="center"
                    alignItems="flex-start"
                    sx={{
                        width: "50vw",
                        backgroundColor: "white",
                        padding: "30px 25px",
                        margin: "50px auto",
                        borderRadius: "15px"
                    }}
                >
                    {selectedNote && (
                        <>
                            <Typography
                                variant='body1'
                                align='left'
                                sx={{
                                    marginLeft: "12px"
                                }}
                            >
                                Date: {formatDateTime(selectedNote.created).date}
                            </Typography>
                            <Typography
                                variant='body1'
                                sx={{
                                    marginLeft: "12px"
                                }}
                            >
                                Update Date: {formatDateTime(selectedNote.updated).date}
                            </Typography>
                            <Box
                                sx={{
                                    width: "40vw",
                                    margin: "15px auto",
                                    padding: "15px",
                                    borderRadius: "15px"
                                }}
                            >
                                <Typography variant='h4' align='center'>Note</Typography>
                                <TextField
                                    multiline
                                    m="2"
                                    sx={{
                                        width: "40vw",
                                        '& .MuiOutlinedInput-notchedOutline': {
                                            border: 'none',
                                            outline: 'none',
                                        },
                                        '&:hover .MuiOutlinedInput-notchedOutline': {
                                            border: 'none',
                                            outline: 'none',
                                        },
                                        '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                            border: 'none',
                                            outline: 'none',
                                        },
                                    }}
                                    value={editedContent}
                                    onChange={event => setEditedContent(event.target.value)}
                                    onClick={enableEditing}
                                />
                            </Box>
                        </>
                    )}
                    <Box display="flex" justifyContent="center" alignItems="center" sx={{
                        width: "100%"
                    }}>
                        <Button
                            variant="contained"
                            onClick={closeModal}
                            sx={{
                                backgroundColor: "#a0d4d4",
                                color: 'black',
                                fontSize: '1em',
                                border: '1px solid white',
                                padding: '0.5em 1em',
                                borderRadius: '15px',
                                '&:hover': {
                                    border: '1px solid rgba(0, 128, 128, 1)',
                                    backgroundColor: "white"
                                }
                            }}
                        >
                            Close
                        </Button>
                        {isEditing && (
                            <Button
                                variant="contained"
                                onClick={handleEditNote}
                                sx={{
                                    backgroundColor: "#a0d4d4",
                                    color: 'black',
                                    fontSize: '1em',
                                    border: '1px solid white',
                                    padding: '0.5em 1em',
                                    borderRadius: '15px',
                                    m: 1,
                                    alignSelf: "center",
                                    display: 'inline-block',
                                    '&:hover': {
                                        border: '1px solid rgba(0, 128, 128, 1)',
                                        backgroundColor: "white"
                                    }
                                }}
                            >
                                Save Update
                            </Button>
                        )}
                    </Box>
                </Box>
            </Modal>
        </Box>
    );
};

export default PreviousNotes;
