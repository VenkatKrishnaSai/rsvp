import React, { useState, useEffect } from "react";
import { Box, Button, Card, CardContent, TextField, Typography, Stack } from "@mui/material";

const EVENTS = [
    "Mehendi Ceremony",
    "Sangeet Night",
    "Wedding Ceremony",
    "Reception Dinner",
    "Post-Wedding Brunch"
];

// Background image URLs for each event
const EVENT_IMAGES = {
    "Mehendi Ceremony": "url('/images/mehendi.jpg')",
    "Sangeet Night": "url('/images/sangeet-background.jpg')",
    "Wedding Ceremony": "url('/images/wedding-background.jpg')",
    "Reception Dinner": "url('/images/reception-background.jpg')",
    "Post-Wedding Brunch": "url('/images/brunch-background.jpg')"
};

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

    useEffect(() => {
        const currentGuests = rsvpData[currentEvent].guests;
        if (rsvpData[currentEvent].attending && currentGuests.length === 0) {
            for (let i = currentPage - 1; i >= 0; i--) {
                const prevEvent = EVENTS[i];
                const prevData = rsvpData[prevEvent];
                if (prevData.attending && prevData.guests.length > 0) {
                    setGuestCount(prevData.guests.length);
                    setRsvpData(prev => ({
                        ...prev,
                        [currentEvent]: {
                            ...prev[currentEvent],
                            guests: [...prevData.guests]
                        }
                    }));
                    return;
                }
            }
        } else {
            setGuestCount(currentGuests.length);
        }
    }, [currentPage, currentEvent, rsvpData]);

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

    const nextPage = () => {
        if (currentPage < EVENTS.length - 1) {
            setCurrentPage(prev => prev + 1);
            setGuestCount(0);
        } else {
            setSubmitted(true);
        }
    };

    return (
        <Box
            sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "100vh",
                backgroundImage: EVENT_IMAGES[currentEvent],
                backgroundSize: "cover",
                backgroundPosition: "center",
                padding: 3,
            }}
        >
            <Box
                sx={{
                    maxWidth: "600px",
                    width: "100%",
                    backgroundColor: "rgba(255, 255, 255, 0.8)",
                    borderRadius: 3,
                    boxShadow: 3,
                    padding: 4,
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                }}
            >
                {submitted ? (
                    <Box textAlign="center">
                        <Typography variant="h4" gutterBottom>
                            Thank You, {name}!
                        </Typography>
                        <Typography variant="body1" paragraph>
                            Your RSVP has been successfully recorded for all events.
                        </Typography>
                        <Button
                            variant="contained"
                            color="primary"
                            sx={{ mt: 3 }}
                            onClick={() => alert("Exporting data to Excel...")}
                        >
                            Export All RSVPs to Excel
                        </Button>
                    </Box>
                ) : (
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
                                        sx={{ flexGrow: 1 }}
                                    >
                                        Yes
                                    </Button>
                                    <Button
                                        variant={rsvpData[currentEvent].attending === false ? "contained" : "outlined"}
                                        onClick={() => setAttendance(false)}
                                        sx={{ flexGrow: 1 }}
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
                                onClick={nextPage}
                                sx={{ mt: 2 }}
                            >
                                {currentPage === EVENTS.length - 1 ? "Submit RSVP" : "Next"}
                            </Button>
                        </CardContent>
                    </Card>
                )}
            </Box>
        </Box>
    );
}
