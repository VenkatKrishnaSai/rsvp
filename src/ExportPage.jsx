import React, { useState, useEffect } from "react";
import { Box, Button, Typography, Paper, CircularProgress } from "@mui/material";
import { db } from "./firebaseConfig";
import { collection, getDocs } from "firebase/firestore";
import * as XLSX from "xlsx";

const EVENTS = [
    "Haldi",
    "Sangeet Night",
    "Mehendi",
    "PelliKoduku_PelliKuthuru",
    "Wedding",
    "Vratam"
];

export default function ExportPage() {
    const [allUserData, setAllUserData] = useState([]);
    const [loading, setLoading] = useState(true);

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
            } finally {
                setLoading(false);
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
                            Count: 1 + data.guests.length
                        });
                    } else {
                        rows.push({
                            User: entry.name,
                            Attending: "No",
                            Guests: "",
                            Count: 0
                        });
                    }
                });

                rows.push({ User: "Total", Attending: "", Guests: "", Count: totalAttendees });

                const sheet = XLSX.utils.json_to_sheet(rows);
                console.log(sheet);
                XLSX.utils.book_append_sheet(workbook, sheet, event);
            });

            XLSX.writeFile(workbook, `Wedding_RSVP_Data.xlsx`);
        } catch (error) {
            console.error("Error exporting data to Excel:", error);
            alert("There was an error exporting the data. Please try again.");
        }
    };

    return (
        <Box
            minHeight="100vh"
            display="flex"
            justifyContent="center"
            alignItems="center"
            sx={{ background: "linear-gradient(to right, #fdeff9, #ec38bc)" }}
        >
            <Paper elevation={6} sx={{ p: 4, maxWidth: 600, width: "100%", borderRadius: 4 }}>
                {loading ? (
                    <Box display="flex" justifyContent="center" alignItems="center" height={200}>
                        <CircularProgress />
                    </Box>
                ) : (
                    <>
                        <Typography variant="h4" fontWeight="bold" mb={2} color="primary">
                            Export RSVP Data
                        </Typography>
                        <Typography variant="body1" mb={3}>
                            Click the button below to export all RSVP data to an Excel file. Each event will be in its own sheet.
                        </Typography>
                        <Button
                            variant="contained"
                            color="secondary"
                            fullWidth
                            size="large"
                            onClick={exportDataToExcel}
                        >
                            Export to Excel
                        </Button>
                    </>
                )}
            </Paper>
        </Box>
    );
}
