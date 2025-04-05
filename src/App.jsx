import { useState, useEffect } from "react";
import {
    Box,
    Button,
    Card,
    CardContent,
    TextField,
    Typography,
    Stack
} from "@mui/material";

const EVENTS = [
    "Mehendi Ceremony",
    "Sangeet Night",
    "Wedding Ceremony",
    "Reception Dinner",
    "Post-Wedding Brunch"
];

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
        // Prefill guest names from previous event if available
        if (rsvpData[currentEvent].guests.length === 0 && currentPage > 0) {
            const previousEvent = EVENTS[currentPage - 1];
            const previousGuests = rsvpData[previousEvent].guests || [];
            setGuestCount(previousGuests.length);
            setRsvpData(prev => ({
                ...prev,
                [currentEvent]: {
                    ...prev[currentEvent],
                    guests: [...previousGuests]
                }
            }));
        }
    }, [currentPage]);

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
            setGuestCount(0); // Reset guest count (will be refilled if guests exist)
        } else {
            setSubmitted(true);
            console.log("Final RSVP:", { name, rsvpData });
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
                        onClick={nextPage}
                        sx={{ mt: 2 }}
                    >
                        {currentPage === EVENTS.length - 1 ? "Submit RSVP" : "Next"}
                    </Button>
                </CardContent>
            </Card>
        </Box>
    );
}
