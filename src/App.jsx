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
        // Prefill guest names from the previous event if attending
        if (currentPage > 0) {
            const previousEvent = EVENTS[currentPage - 1];
            const previousGuests = rsvpData[previousEvent]?.guests || [];

            if (rsvpData[previousEvent]?.attending && previousGuests.length > 0) {
                // Pre-fill the guest names in the current event
                setGuestCount(previousGuests.length);
                setRsvpData(prev => ({
                    ...prev,
                    [currentEvent]: {
                        ...prev[currentEvent],
                        guests: [...previousGuests] // Fill guests from previous event
                    }
                }));
            }
        }
    }, [currentPage, rsvpData]);

    const setAttendance = (attending) => {
        setRsvpData(prev => ({
            ...prev,
            [currentEvent]: {
                ...prev[currentEvent],
                attending,
                guests: attending ? Array(guestCount).fill("") : [] // Reset guests if not attending
            }
        }));
    };

    const handleGuestCountChange = (value) => {
        const count = parseInt(value, 10);
        setGuestCount(count);

        // Update the guest list based on the new count
        if (rsvpData[currentEvent].attending) {
            setRsvpData(prev => ({
                ...prev,
                [currentEvent]: {
                    ...prev[currentEvent],
                    guests: Array(count).fill("") // Reset guest names if the count changes
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

    const handleAddGuest = () => {
        setGuestCount(prevCount => prevCount + 1);
        setRsvpData(prev => ({
            ...prev,
            [currentEvent]: {
                ...prev[currentEvent],
                guests: [...prev[currentEvent].guests, ""] // Add an empty guest field
            }
        }));
    };

    const handleRemoveGuest = (index) => {
        const updatedGuests = rsvpData[currentEvent].guests.filter((_, i) => i !== index);
        setGuestCount(updatedGuests.length);
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
                                <Box key={index} mb={2}>
                                    <TextField
                                        value={guest}
                                        onChange={(e) => handleGuestChange(index, e.target.value)}
                                        placeholder={`Guest ${index + 1}`}
                                        fullWidth
                                        margin="dense"
                                    />
                                    <Button
                                        variant="outlined"
                                        color="error"
                                        onClick={() => handleRemoveGuest(index)}
                                        sx={{ mt: 1 }}
                                    >
                                        Remove
                                    </Button>
                                </Box>
                            ))}
                            <Button
                                variant="outlined"
                                color="primary"
                                onClick={handleAddGuest}
                                sx={{ mt: 2 }}
                            >
                                Add Guest
                            </Button>
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
