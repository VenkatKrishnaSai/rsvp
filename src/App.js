import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import WeddingRSVPPage from './WeddingRSVPPage';
import ExportPage from './ExportPage';
import { ChakraProvider } from "@chakra-ui/react";

function App() {
    return (
        <ChakraProvider>
            <Router>
                <Routes>
                    <Route path="/" element={<WeddingRSVPPage />} />
                    <Route path="/export" element={<ExportPage />} />
                </Routes>
            </Router>
        </ChakraProvider>
    );
}

export default App;
