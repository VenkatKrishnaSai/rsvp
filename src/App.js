import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import WeddingRSVPPage from './WeddingRSVPPage';
import ExportPage from './ExportPage';

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<WeddingRSVPPage />} />
                <Route path="/export" element={<ExportPage />} />
            </Routes>
        </Router>
    );
}

export default App;
