import { useState } from "react";
import axios from "axios";
import { Box, Button, Card, CardContent, TextField, Typography, Stack } from "@mui/material";

// Constants
const EVENTS = [
    "Mehendi Ceremony",
    "Sangeet Night",
    "Wedding Ceremony",
    "Reception Dinner",
    "Post-Wedding Brunch"
];

const SPREADSHEET_ID = "1KKN9k02yL5cYVx98H76JOiVhma_EELjkbWPqoVp0Fmk"; // Your Google Sheet ID
const API_KEY = "AIzaSyDhM1p9WUCy-GjLKRphL6x8wsvFkjJnvT0"; // Your Google API Key

export default function WeddingRSVPApp() {
    const [currentPage, setCurrentPage] = useState(0);
    const [name, setName] = useState("");
    const [guestCount, setGuestCount] = useState(0);
    const [rsvpData, setRsvpData] = useState(
        EVENTS.reduce((acc, event) => {
            acc[event] = { attending: null, guests: [] };
            return acc;
        }, {})
    );
    const [submitted, setSubmitted] = useState(false);

    const currentEvent = EVENTS[currentPage];

    const setAttendance = (attending) => {
        setRsvpData(prev => ({
            ...prev,
            [currentEvent]: {
                ...prev[currentEvent],
                attending,
                guests: attending ? Array(guestCount).fill("") : []
            }
        }));
    };

    const handleGuestCountChange = (value) => {
        const count = parseInt(value, 10);
        setGuestCount(count);
        if (rsvpData[currentEvent].attending) {
            setRsvpData(prev => ({
                ...prev,
                [currentEvent]: {
                    ...prev[currentEvent],
                    guests: Array(count).fill("")
                }
            }));
        }
    };

    const handleGuestChange = (index, value) => {
        const updatedGuests = [...rsvpData[currentEvent].guests];
        updatedGuests[index] = value;
        setRsvpData(prev => ({
            ...prev,
            [currentEvent]: {
                ...prev[currentEvent],
                guests: updatedGuests
            }
        }));
    };

    const handleRSVPSubmit = async () => {
        try {
            // Prepare the data to send to Google Sheets
            const data = [
                [name, rsvpData[currentEvent].attending ? "Yes" : "No", ...rsvpData[currentEvent].guests],
            ];

            // Specify the event's sheet name
            const sheetName = currentEvent.replace(/\s+/g, '_'); // Replace spaces with underscores (to be valid for Google Sheets)

            const updateRequestBody = {
                range: `${sheetName}!A2`, // Starting point in your Google Sheet for this event
                values: data,
            };

            // Send data to Google Sheets API using axios
            const response = await axios.post(
                `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/${sheetName}!A2:append?valueInputOption=RAW&key=${API_KEY}`,
                updateRequestBody
            );

            console.log("Data submitted successfully", response);
            alert("RSVP submitted successfully!");

            // Move to the next page or mark as submitted
            if (currentPage < EVENTS.length - 1) {
                setCurrentPage(prev => prev + 1);
                setGuestCount(0);
            } else {
                setSubmitted(true);
            }
        } catch (error) {
            console.error("Error submitting RSVP:", error);
            alert("There was an error submitting your RSVP. Please try again.");
        }
    };

    if (submitted) {
        return (
            <Box maxWidth={600} mx="auto" p={3}>
                <Typography variant="h4" gutterBottom>
                    Thank you, {name}!
                </Typography>
                <Typography variant="body1">
                    Your RSVP has been recorded for all events.
                </Typography>
            </Box>
        );
    }

    return (
        <Box maxWidth={600} mx="auto" p={3}>
            <Card>
                <CardContent>
                    {currentPage === 0 && (
                        <Box mb={4}>
                            <TextField
                                label="Your Name"
                                fullWidth
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                margin="normal"
                            />
                        </Box>
                    )}

                    <Typography variant="h6" gutterBottom>
                        {currentEvent}
                    </Typography>

                    <Box mb={3}>
                        <Typography variant="subtitle1" gutterBottom>
                            Will you attend?
                        </Typography>
                        <Stack direction="row" spacing={2}>
                            <Button
                                variant={rsvpData[currentEvent].attending === true ? "contained" : "outlined"}
                                onClick={() => setAttendance(true)}
                            >
                                Yes
                            </Button>
                            <Button
                                variant={rsvpData[currentEvent].attending === false ? "contained" : "outlined"}
                                onClick={() => setAttendance(false)}
                            >
                                No
                            </Button>
                        </Stack>
                    </Box>

                    {rsvpData[currentEvent].attending && (
                        <Box mb={3}>
                            <TextField
                                label="How many guests are you bringing?"
                                type="number"
                                value={guestCount}
                                onChange={(e) => handleGuestCountChange(e.target.value)}
                                fullWidth
                                margin="normal"
                                inputProps={{ min: 0 }}
                            />
                            {rsvpData[currentEvent].guests.map((guest, index) => (
                                <TextField
                                    key={index}
                                    value={guest}
                                    onChange={(e) => handleGuestChange(index, e.target.value)}
                                    placeholder={`Guest ${index + 1}`}
                                    fullWidth
                                    margin="dense"
                                />
                            ))}
                        </Box>
                    )}

                    <Button
                        variant="contained"
                        fullWidth
                        onClick={handleRSVPSubmit}
                        sx={{ mt: 2 }}
                    >
                        {currentPage === EVENTS.length - 1 ? "Submit RSVP" : "Next"}
                    </Button>
                </CardContent>
            </Card>
        </Box>
    );
}
