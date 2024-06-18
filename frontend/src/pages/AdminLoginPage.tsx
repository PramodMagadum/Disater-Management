import React, { useState, useEffect } from 'react';
import CreateContentBox from '../content-box/CreateContentBox';
import ReadContentBox from '../content-box/ReadContentBox';
import UpdateContentBox from '../content-box/UpdateContentBox';
import { DisasterEvent } from '../entities/DisasterEvent';
import './AdminLoginPage.css';
import { FaUserLock } from 'react-icons/fa';


const AdminLoginPage: React.FC = () => {

    // Move state variables and functions from App.tsx here
    const [disasterEvents, setDisasterEvents] = useState<DisasterEvent[]>([]);
    const [selectedEvent, setSelectedEvent] = useState<DisasterEvent | null>(null);
    const [editing, setEditing] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [showLogin, setShowLogin] = useState(true);
    const [password, setPassword] = useState('');
    const [passwordError, setPasswordError] = useState('');

    useEffect(() => {
        fetchDisasterEvents();
    }, []);

    const fetchDisasterEvents = () => {
        setErrorMessage(''); // Reset error before fetching
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

    const handleCreateSubmit = async (newDisasterEventData: Omit<DisasterEvent, 'id'>) => {
        try {
            const response = await fetch('http://localhost:8080/api/disaster-events', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newDisasterEventData),
            });

            if (response.ok) {
                const createdEvent: DisasterEvent = await response.json();
                // (Optional) If you want to display a success message:
                setErrorMessage('Disaster event reported successfully!');

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
        // Send the updatedEvent object to your backend to update the record
        fetch(`http://localhost:8080/api/disaster-events/${updatedEvent.id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(updatedEvent), // send updatedEvent to backend
        })
            .then(res => {
                if (!res.ok) {
                    throw new Error('Network response was not ok.');
                }
                return res.json();
            })
            .then((updatedEventFromServer: DisasterEvent) => {
                // Update the disasterEvents state with the modified event
                setDisasterEvents(disasterEvents.map(e => e.id === updatedEventFromServer.id ? updatedEventFromServer : e));
                setEditing(false); // Switch back to create mode
                setSelectedEvent(null); // Clear the selected event
                setErrorMessage('');
            })
            .catch(error => {
                console.error('Error updating event:', error);
                setErrorMessage('Failed to update disaster event.');
            });
    };

    const handleDeleteClick = (id: number) => {
        fetch(`http://localhost:8080/api/disaster-events/${id}`, { method: 'DELETE' })
            .then(() => {
                setDisasterEvents(disasterEvents.filter(e => e.id !== id));
                setErrorMessage('');
            })
            .catch(error => {
                console.error('Error deleting event:', error);
                setErrorMessage('Failed to delete disaster event.');
            });
    };

    const handleFetchError = (error: Error) => {
        console.error('Fetch Error:', error);
        setErrorMessage('An error occurred while communicating with the server.');
    };

    const handleLogin = (event: React.FormEvent) => {
        event.preventDefault();
        if (password === '1234') { // Replace with your actual password
            setShowLogin(false);
            setPasswordError('');
            fetchDisasterEvents();
        } else {
            setPasswordError('Incorrect password');
        }
    };


return (
    <div className="incident-reporting-page">
        {showLogin ? (
            <section className="login-section">
                <div className="login-container"> {/* Added container for styling */}
                    <FaUserLock className="login-icon" /> {/* Login icon */}
                    <h2>Admin Login</h2>
                    <form onSubmit={handleLogin}>
                        <div className="form-group">
                            <input
                                type="text"
                                placeholder="Admin Name"
                                className="form-control"
                            />
                        </div>
                        <div className="form-group">
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Enter password"
                                className="form-control"
                            />
                        </div>
                        <button type="submit" className="btn-primary">Login</button>
                        {passwordError && <p className="error-message">{passwordError}</p>}
                    </form>
                </div>
            </section>
        ) : (
            <section className="event-list-section">
                <h2 className="page-title">Reported Disaster Events</h2>
                {errorMessage && <div className="error-message">{errorMessage}</div>}
                <div className="event-list-container">  {/* Added container for list styling */}
                    <ul className="event-list">
                        {disasterEvents.map(event => (
                            <li key={event.id} className="event-item">
                                {editing && selectedEvent?.id === event.id ? (
                                    <UpdateContentBox
                                        event={selectedEvent!}
                                        onSubmit={handleUpdateSubmit}

                                    />
                                ) : (
                                    <ReadContentBox
                                        event={event}
                                        onEdit={() => handleEditClick(event)}
                                        onDelete={() => handleDeleteClick(event.id)}
                                    />
                                )}
                            </li>
                        ))}
                    </ul>
                </div>
            </section>
        )}
    </div>
);
}
;

export default AdminLoginPage;