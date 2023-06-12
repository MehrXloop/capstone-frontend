import React, { useState, useEffect } from 'react';
import { Modal, Button, List, ListItem, ListItemText, Typography } from '@mui/material';
import { Box } from '@mui/system';
import moment from 'moment';
const PreviousNotes = () => {
    const [notes, setNotes] = useState([]);
    const [selectedNote, setSelectedNote] = useState(null);
    const [modalOpen, setModalOpen] = useState(false);

    useEffect(() => {
        fetchNotes();
    }, []);

    const fetchNotes = async () => {
        try {
            const response = await fetch("http://localhost:8086/notes/notesByPatientId/2");
            const data = await response.json();
            console.log(data)
            setNotes(data);
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
        setModalOpen(true);
    };

    const closeModal = () => {
        setSelectedNote(null);
        setModalOpen(false);
    };

    return (
        <Box display="flex" >
            <List sx={{
                bgcolor: "white",
                border: "1px solid rgba(0, 128, 128, 1)",
                borderRadius: "15px",
                p: 2,
                m: 2
            }}>
                <Typography variant='h5'>Patient previous Notes:</Typography>
                {notes.map((note) => {
                    const { date, time, day } = formatDateTime(note.created); // Destructure the values from formatDateTime
                    return (
                        <ListItem
                            button
                            key={note.id}
                            onClick={() => openModal(note)}
                            sx={{
                                bgcolor: "#a0d4d4",
                                borderRadius: "15px",
                                my: 2
                            }}
                        >
                            <ListItemText
                                primary={`Date: ${formatDateTime(note.created).date}`} // Display formatted date
                                secondary={`${formatDateTime(note.created).day}, ${time}`} // Display formatted day and time
                            />
                        </ListItem>
                    );
                })}
            </List>
            <Modal open={modalOpen} onClose={closeModal}>
                <Box display="flex" flexDirection="column" justifyContent="center" alignItems="flex-start"
                    sx={{
                        width: "50vw",
                        backgroundColor: "white",
                        padding: "30px 25px",
                        margin: "50px auto",
                        borderRadius: "15px",


                    }}
                >
                    {/* <Typography variant='h4'>Note Details</Typography> */}
                    {selectedNote && (
                        <>
                            <Typography variant='body1' align='left'
                                sx={{
                                    marginLeft: "12px"
                                }}
                            >Date: {formatDateTime(selectedNote.created).date}</Typography>
                            <Typography variant='body1'
                                sx={{
                                    marginLeft: "12px"
                                }}>Update Date: {selectedNote.updated}</Typography>
                            <Box
                                sx={{
                                    // backgroundColor:"green",
                                    width: "40vw",
                                    margin: "15px auto",
                                    padding: "15px",
                                    borderRadius: "15px",
                                }}>
                                <Typography variant='h4' align='center'>Note</Typography>
                                <Typography m="2"> {selectedNote.content}</Typography>
                            </Box>
                        </>
                    )}
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
                            m: 1,
                            alignSelf: "center",
                            '&:hover': {
                                border: '1px solid rgba(0, 128, 128, 1)',
                                backgroundColor: "white",

                            },
                        }}>
                        Close
                    </Button>
                </Box>
            </Modal>
        </Box>
    );
};

export default PreviousNotes;
