import React, { useState, useEffect } from "react";
import { Box, Button, Typography } from "@mui/material";
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
                    if (data.attending) {
                        // Count the main user + guests
                        totalAttendees += 1 + data.guests.length;

                        rows.push({
                            User: entry.name,
                            Attending: "Yes",
                            Guests: data.guests.join(", "),
                            Count: 1 + data.guests.length,  // Main user + guests
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
            alert("There was an error exporting the data. Please try again.");
        }
    };

    return (
        <Box maxWidth={600} mx="auto" p={3}>
            <Typography variant="h4" gutterBottom>
                Export RSVP Data
            </Typography>
            <Typography variant="body1" gutterBottom>
                Click the button below to export all RSVP data to an Excel file.
            </Typography>
            <Button variant="outlined" onClick={exportDataToExcel} sx={{ mt: 2 }}>
                Export to Excel
            </Button>
        </Box>
    );
}
