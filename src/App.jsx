import { useState } from "react";
import {
    Box,
    Button,
    Card,
    CardContent,
    TextField,
    Typography
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
    const [rsvpData, setRsvpData] = useState(
        EVENTS.reduce((acc, event) => {
            acc[event] = { attending: false, guests: [""] };
            return acc;
        }, {})
    );
    const [submitted, setSubmitted] = useState(false);

    const currentEvent = EVENTS[currentPage];

    const handleToggleAttendance = () => {
        setRsvpData(prev => ({
            ...prev,
            [currentEvent]: {
                ...prev[currentEvent],
                attending: !prev[currentEvent].attending
            }
        }));
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

    const addGuestField = () => {
        setRsvpData(prev => ({
            ...prev,
            [currentEvent]: {
                ...prev[currentEvent],
                guests: [...prev[currentEvent].guests, ""]
            }
        }));
    };

    const nextPage = () => {
        if (currentPage < EVENTS.length - 1) {
            setCurrentPage(prev => prev + 1);
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
                        <Typography variant="subtitle1">Will you attend?</Typography>
                        <Button
                            variant={rsvpData[currentEvent].attending ? "contained" : "outlined"}
                            onClick={handleToggleAttendance}
                            sx={{ mt: 1, mb: 2 }}
                        >
                            {rsvpData[currentEvent].attending ? "Yes" : "No"}
                        </Button>
                    </Box>

                    {rsvpData[currentEvent].attending && (
                        <Box mb={3}>
                            <Typography variant="subtitle1" gutterBottom>
                                Guests You're Bringing
                            </Typography>
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
                            <Button variant="outlined" onClick={addGuestField} sx={{ mt: 1 }}>
                                Add Another Guest
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
