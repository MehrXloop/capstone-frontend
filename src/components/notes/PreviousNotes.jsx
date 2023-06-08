import React, { useState, useEffect } from 'react';
import { Modal, Button, List, ListItem, ListItemText, Typography } from '@mui/material';
import { Box } from '@mui/system';

const PreviousNotes = () => {
    const [notes, setNotes] = useState([]);
    const [selectedNote, setSelectedNote] = useState(null);
    const [modalOpen, setModalOpen] = useState(false);

    useEffect(() => {
        fetchNotes();
    }, []);

    const fetchNotes = async () => {
        try {
            const response = await fetch('http://localhost:8086/notes/all');
            const data = await response.json();
            setNotes(data);
        } catch (error) {
            console.error('Error fetching notes:', error);
        }
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
        <Box display="flex" bgcolor="white" >
            <List sx={{
                border: "1px solid rgba(0, 128, 128, 1)",
                borderRadius: "15px",
                p: 2,
                m: 2
            }}>
                <Typography variant='h5'>Patient previous records:</Typography>
                {notes.map((note) => (
                    <ListItem button key={note.id} onClick={() => openModal(note)} sx={{
                        bgcolor: "#a0d4d4",
                        borderRadius: "15px",
                        my: 2
                    }}>
                        <ListItemText
                            primary={`Date & Time: ${note.created}`}
                            secondary={`Friday 6:00PM`}
                        />
                    </ListItem>
                ))}
            </List>
            <Modal open={modalOpen} onClose={closeModal}>
                <div style={{ margin: '50px', backgroundColor: 'white', padding: '20px' }}>
                    <h2>Note Details</h2>
                    {selectedNote && (
                        <>
                            <p>Created: {selectedNote.created}</p>
                            <p>Updated: {selectedNote.updated}</p>
                            <p>Content: {selectedNote.content}</p>
                        </>
                    )}
                    <Button
                        variant="contained"
                        onClick={closeModal}
                        sx={{
                            backgroundColor: "rgba(0, 128, 128, 1)",
                            color: 'black',
                            fontSize: '1em',
                            border: '1px solid white',
                            padding: '0.5em 1em',
                            borderRadius: '15px',
                            m: 1,
                            '&:hover': {
                                border: '1px solid rgba(0, 128, 128, 1)',
                                backgroundColor: "white",

                            },
                        }}>
                        Close
                    </Button>
                </div>
            </Modal>
        </Box>
    );
};

export default PreviousNotes;
