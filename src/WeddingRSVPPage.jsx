import { useState, useEffect } from "react";
import {
    Box,
    Button,
    Flex,
    FormControl,
    FormLabel,
    Input,
    Select,
    Text,
    VStack,
    useToast,
} from "@chakra-ui/react";
import * as XLSX from "xlsx";
import { db } from "./firebase";
import { ref, push } from "firebase/database";

const EVENTS = [
    "Haldi",
    "Sangeet Night",
    "Mehendi",
    "PelliKoduku/ PelliKuthuru",
    "Wedding",
    "Vratam"
];

const EVENT_IMAGES = {
    "Haldi": "/images/haldi.jpg",
    "Sangeet Night": "/images/sangeeth.jpg",
    "Mehendi": "/images/mehendi.jpg",
    "PelliKoduku/ PelliKuthuru": "/images/pellik.jpg",
    "Wedding": "/images/wedding.jpg",
    "Vratam": "/images/vratam.jpg"
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
    const toast = useToast();

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

    const handleSubmit = async () => {
        try {
            const entry = { name, rsvpData };
            await push(ref(db, 'rsvps'), entry);
            setSubmitted(true);
        } catch (error) {
            toast({ status: 'error', title: 'Submission failed' });
        }
    };

    if (submitted) {
        return (
            <Flex minH="100vh" justify="center" align="center" bgGradient="linear(to-b, pink.100, white)">
                <Box textAlign="center">
                    <Text fontSize="2xl" fontWeight="bold">Thank you, {name}!</Text>
                    <Text>Your RSVP has been recorded.</Text>
                </Box>
            </Flex>
        );
    }

    return (
        <Box
            minH="100vh"
            bgImage={`url('${EVENT_IMAGES[currentEvent]}')`}
            bgSize="cover"
            bgPos="center"
            p={4}
        >
            <Box maxW="480px" mx="auto" bg="whiteAlpha.900" borderRadius="lg" p={4}>
                <VStack spacing={4} align="stretch">
                    {currentPage === 0 && (
                        <FormControl>
                            <FormLabel>Your Name</FormLabel>
                            <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Enter your full name" />
                        </FormControl>
                    )}

                    <FormControl>
                        <FormLabel>{currentEvent}</FormLabel>
                        <Flex justify="space-around">
                            <Button colorScheme={rsvpData[currentEvent].attending ? 'teal' : 'gray'} onClick={() => setAttendance(true)}>
                                Yes
                            </Button>
                            <Button colorScheme={rsvpData[currentEvent].attending === false ? 'teal' : 'gray'} onClick={() => setAttendance(false)}>
                                No
                            </Button>
                        </Flex>
                    </FormControl>

                    {rsvpData[currentEvent].attending && (
                        <>
                            <FormControl>
                                <FormLabel>How many guests?</FormLabel>
                                <Select value={guestCount} onChange={handleGuestCountChange}>
                                    {[...Array(7).keys()].map(n => (
                                        <option key={n} value={n}>{n}</option>
                                    ))}
                                </Select>
                            </FormControl>
                            {rsvpData[currentEvent].guests.map((guest, index) => (
                                <FormControl key={index}>
                                    <FormLabel>Guest {index + 1}</FormLabel>
                                    <Input value={guest} onChange={(e) => handleGuestChange(index, e.target.value)} />
                                </FormControl>
                            ))}
                        </>
                    )}

                    <Button colorScheme="pink" onClick={() => {
                        if (currentPage < EVENTS.length - 1) {
                            setCurrentPage(prev => prev + 1);
                        } else {
                            handleSubmit();
                        }
                    }}>
                        {currentPage === EVENTS.length - 1 ? "Submit RSVP" : "Next"}
                    </Button>
                </VStack>
            </Box>
        </Box>
    );
}
