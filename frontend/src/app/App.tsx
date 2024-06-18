import React, { useState, useEffect } from 'react';
import './App.css';
import { Route, Routes, Navigate } from "react-router-dom";
import HomePage from "../pages/HomePage";
import IncidentReportingPage from "../pages/IncidentReportingPage";
import CollaborationPage from "../pages/CollaborationPage";
import CommunicationCenterPage from "../pages/CommunicationCenterPage";
import AboutPage from "../pages/AboutPage";
import AdminLoginPage from "../pages/AdminLoginPage";
import Navbar from "../components/Navbar"; // Import DisasterEvent from here
import { Link } from 'react-router-dom';
import UpdateContentBox from "../content-box/UpdateContentBox"; //Import UpdateContentBox
import { DisasterEvent } from '../entities/DisasterEvent'; // Import the DisasterEvent interface


const App: React.FC = () => {
    const [disasterEvents, setDisasterEvents] = useState<DisasterEvent[]>([]);
    const [selectedEvent, setSelectedEvent] = useState<DisasterEvent | null>(null);
    const [editing, setEditing] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        fetchDisasterEvents();
    }, []);

    const fetchDisasterEvents = () => {
        setErrorMessage('');
        fetch('http://localhost:8080/api/disaster-events')
            .then(res => {
                if (!res.ok) {
                    throw new Error('Network response was not ok.');
                }
                return res.json();
            })
            .then((data: DisasterEvent[]) => setDisasterEvents(data))
            .catch(handleFetchError);
    };

    const handleCreateSubmit = async (newDisasterEvent: Omit<DisasterEvent, 'id'>) => {
        try {
            const response = await fetch('http://localhost:8080/api/disaster-events', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newDisasterEvent), // Fix: Remove extra variable
            });

            if (response.ok) {
                const createdEvent: DisasterEvent = await response.json();
                setDisasterEvents([createdEvent, ...disasterEvents]);
                setErrorMessage('');
            } else {
                throw new Error('Failed to report disaster event.');
            }

        } catch (error) {
            console.error('Error reporting disaster event:', error);
            setErrorMessage('An error occurred while reporting the disaster event.');
        }
    };

    const handleEditClick = (event: DisasterEvent) => {
        setSelectedEvent(event);
        setEditing(true);
    };

    const handleUpdateSubmit = (updatedEvent: DisasterEvent) => {
        fetch(`http://localhost:8080/api/disaster-events/${updatedEvent.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updatedEvent),
        })
            .then(res => res.json())
            .then((updatedEventFromServer: DisasterEvent) => {
                setDisasterEvents(disasterEvents.map(e => e.id === updatedEventFromServer.id ? updatedEventFromServer : e));
                setEditing(false);
                setSelectedEvent(null);
                setErrorMessage('');
            })
            .catch(handleFetchError);
    };

    const handleDeleteClick = (id: number) => {
        fetch(`http://localhost:8080/api/disaster-events/${id}`, { method: 'DELETE' })
            .then(() => {
                setDisasterEvents(disasterEvents.filter(e => e.id !== id));
                setErrorMessage('');
            })
            .catch(handleFetchError);
    };

    const handleFetchError = (error: Error) => {
        console.error('Fetch Error:', error);
        setErrorMessage('An error occurred while communicating with the server.');
    };
    return (
        <div className="app">
            <Navbar />
            <main className="app-container">
                {/* Display Error Message if any */}
                {errorMessage && <div className="error-message">{errorMessage}</div>}

                <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/report-incident" element={
                        <IncidentReportingPage
                        />}
                    />
                    <Route path="/collaborate" element={<CollaborationPage />} />
                    <Route path="/contact" element={<CommunicationCenterPage />} />
                    <Route path="/about-us" element={<AboutPage />} />
                    <Route path="/admin-login" element={<AdminLoginPage />} />
                    <Route path="*" element={<Navigate to="/" />} /> {/* Redirect for unknown paths */}
                </Routes>
            </main>
        </div>
    );
};

export default App;