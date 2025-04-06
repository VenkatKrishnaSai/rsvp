import React, { useState, useEffect } from "react";
import {
    Box,
    Button,
    TextField,
    Typography,
    Stack,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Card,
    LinearProgress
} from "@mui/material";

const EVENTS = [
    "Haldi",
    "Sangeeth Night",
    "Mehendi",
    "PelliKoduku/ PelliKuthuru",
    "Wedding",
    "Vratam"
];

const EVENT_IMAGES = {
    "Haldi": "/images/haldi.jpg",
    "Sangeeth Night": "/images/sangeeth.jpg",
    "Mehendi": "/images/mehendi.jpg",
    "PelliKoduku/ PelliKuthuru": "/images/pellik.jpg",
    "Wedding": "/images/wedding.jpg",
    "Vratam": "/images/vratam.jpg"
};

export default function WeddingRSVPApp() {
    const [currentPage, setCurrentPage] = useState(0);
    const [name, setName] = useState("");
    const [guestCount, setGuestCount] = useState(0);
    const [submitted, setSubmitted] = useState(false);
    const [rsvpData, setRsvpData] = useState(
        EVENTS.reduce((acc, event) => {
            acc[event] = { attending: null, guests: [] };
            return acc;
        }, {})
    );

    // const theme = useTheme();
    // const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

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

    const handleGuestCountChange = (e) => {
        const count = parseInt(e.target.value, 10);
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
                minHeight: "100vh",
                backgroundImage: `url('${EVENT_IMAGES[currentEvent]}')`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                px: 2,
                py: 4
            }}
        >
            {submitted ? (
                <Card sx={{ p: 4, textAlign: "center", backdropFilter: "blur(8px)" }}>
                    <Typography variant="h4">Thank You, {name}!</Typography>
                    <Typography>Your RSVP has been successfully recorded.</Typography>
                    <Button sx={{ mt: 3 }} onClick={() => alert("Exporting...")}>Export RSVPs</Button>
                </Card>
            ) : (
                <Card sx={{ width: "100%", maxWidth: 600, p: 4, borderRadius: 4, boxShadow: 6, backdropFilter: "blur(12px)" }}>
                    <LinearProgress variant="determinate" value={((currentPage + 1) / EVENTS.length) * 100} sx={{ mb: 2 }} />

                    {currentPage === 0 && (
                        <TextField
                            label="Your Name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            fullWidth
                            sx={{ mb: 3 }}
                        />
                    )}

                    <Typography variant="h6" gutterBottom>{currentEvent}</Typography>

                    <Stack direction="row" spacing={2} justifyContent="center" sx={{ mb: 3 }}>
                        <Button
                            variant={rsvpData[currentEvent].attending === true ? "contained" : "outlined"}
                            onClick={() => setAttendance(true)}
                        >Yes</Button>
                        <Button
                            variant={rsvpData[currentEvent].attending === false ? "contained" : "outlined"}
                            onClick={() => setAttendance(false)}
                        >No</Button>
                    </Stack>

                    {rsvpData[currentEvent].attending && (
                        <Box>
                            <FormControl fullWidth sx={{ mb: 2 }}>
                                <InputLabel>Guests</InputLabel>
                                <Select
                                    value={guestCount}
                                    label="Guests"
                                    onChange={handleGuestCountChange}
                                >
                                    {[...Array(7)].map((_, i) => (
                                        <MenuItem key={i} value={i}>{i}</MenuItem>
                                    ))}
                                </Select>
                            </FormControl>

                            {rsvpData[currentEvent].guests.map((guest, index) => (
                                <TextField
                                    key={index}
                                    value={guest}
                                    onChange={(e) => handleGuestChange(index, e.target.value)}
                                    label={`Guest ${index + 1}`}
                                    fullWidth
                                    sx={{ mb: 2 }}
                                />
                            ))}
                        </Box>
                    )}

                    <Button variant="contained" fullWidth onClick={nextPage}>
                        {currentPage === EVENTS.length - 1 ? "Submit RSVP" : "Next"}
                    </Button>
                </Card>
            )}
        </Box>
    );
}
