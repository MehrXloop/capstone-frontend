import React, { useState, useEffect } from "react";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from "@mui/material";
const AppointmentTable = () => {
    const [appointments, setAppointments] = useState([]);
    const [isLoading, setLoading] = useState(true);
    useEffect(() => {
        fetchAppointments();
    }, []);
    const fetchAppointments = async () => {
        try {
            const response = await fetch("http://appointment.us-west-2.elasticbeanstalk.com/appointments/getall");
            const data = await response.json();
            setAppointments(data);
            setLoading(false);
        } catch (error) {
            console.error("Error fetching appointments:", error);
        }
    };
    return (
        <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
                <TableHead>
                    <TableRow>
                        <TableCell>ID</TableCell>
                        <TableCell>Created</TableCell>
                        <TableCell>Updated</TableCell>
                        <TableCell>Availability ID</TableCell>
                        <TableCell>Patient ID</TableCell>
                        <TableCell>Confirmed</TableCell>
                        <TableCell>Deleted</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {isLoading ? (
                        <TableRow>
                            <TableCell colSpan={7}>Loading...</TableCell>
                        </TableRow>
                    ) : (
                        appointments.map((appointment) => (
                            <TableRow key={appointment.id}>
                                <TableCell>{appointment.id}</TableCell>
                                <TableCell>{appointment.created}</TableCell>
                                <TableCell>{appointment.updated}</TableCell>
                                <TableCell>{appointment.availability_id}</TableCell>
                                <TableCell>{appointment.patient_id}</TableCell>
                                <TableCell>{appointment.confirmed ? "Yes" : "No"}</TableCell>
                                <TableCell>{appointment.deleted}</TableCell>
                            </TableRow>
                        ))
                    )}
                </TableBody>
            </Table>
        </TableContainer>
    );
};
export default AppointmentTable;