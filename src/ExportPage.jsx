import React, { useState, useEffect } from "react";
import {
    Box,
    Button,
    Heading,
    Text,
    VStack,
} from "@chakra-ui/react";
import { db } from "./firebaseConfig"; // Import firebase config
import { collection, getDocs } from "firebase/firestore";
import * as XLSX from "xlsx";

const EVENTS = [
    "Haldi",
    "Sangeet Night",
    "Mehendi",
    "PelliKoduku/ PelliKuthuru",
    "Wedding",
    "Vratam"
];

export default function ExportPage() {
    const [allUserData, setAllUserData] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const snapshot = await getDocs(collection(db, "rsvps"));
                const data = [];
                snapshot.forEach(doc => {
                    data.push(doc.data());
                });
                setAllUserData(data);
            } catch (error) {
                console.error("Error fetching data from Firestore:", error);
            }
        };

        fetchData();
    }, []);

    const exportDataToExcel = () => {
        try {
            const workbook = XLSX.utils.book_new();

            EVENTS.forEach(event => {
                const rows = [];
                let totalAttendees = 0;

                allUserData.forEach((entry) => {
                    const data = entry.events[event];
                    if (data?.attending) {
                        totalAttendees += 1 + data.guests.length;
                        rows.push({
                            User: entry.name,
                            Attending: "Yes",
                            Guests: data.guests.join(", "),
                            Count: 1 + data.guests.length,
                        });
                    } else {
                        rows.push({
                            User: entry.name,
                            Attending: "No",
                            Guests: "",
                            Count: 0,
                        });
                    }
                });

                rows.push({ User: "Total", Attending: "", Guests: "", Count: totalAttendees });

                const sheet = XLSX.utils.json_to_sheet(rows);
                XLSX.utils.book_append_sheet(workbook, sheet, event);
            });

            XLSX.writeFile(workbook, `Wedding_RSVP_Data.xlsx`);
        } catch (error) {
            console.error("Error exporting data to Excel:", error);
        }
    };

    return (
        <Box maxW="600px" mx="auto" p={6}>
            <VStack spacing={4} align="start">
                <Heading size="lg">Export RSVP Data</Heading>
                <Text>Click the button below to export all RSVP data to an Excel file.</Text>
                <Button colorScheme="blue" onClick={exportDataToExcel} mt={4}>
                    Export to Excel
                </Button>
            </VStack>
        </Box>
    );
}
