import React, { useState, useEffect } from 'react';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import './HomePage.css';
import YouTubeVideo from './YouTubeVideo';
import { useNavigate } from 'react-router-dom';
import heroImage from './assets/rescue-workers.jpg';

// Define the Update type outside the component
interface Update {
    type: 'video';
    videoId: string;
    title?: string; // Optional title for videos
}

const HomePage: React.FC = () => {
    const [updates, setUpdates] = useState<Update[]>([]);

    useEffect(() => {
        // Fetch video IDs (and titles) from your data source
        const fetchedUpdates: Update[] = [
            { type: 'video', videoId: 'XAt00mhwQkQ', title: 'California Wildfires' },
            { type: 'video', videoId: 'XAt00mhwQkQ', title: 'Swift Water Rescue' },
            { type: 'video', videoId: 'XAt00mhwQkQ', title: 'Earthquake Relief Efforts' },
        ];
        setUpdates(fetchedUpdates);
    }, []);

    const navigate = useNavigate();

    const handleGetHelpClick = () => {
        navigate('/contact'); // Navigate to Communication Center
    };

    const handleReportIncidentClick = () => {
        navigate('/report-incident'); // Navigate to Incident Report
    };

    return (
        <div className="home-page">
            {/* Carousel */}
            <Carousel autoPlay infiniteLoop showThumbs={false} className="carousel">
                <div>
                    <img src="https://cdn.pixabay.com/photo/2013/06/12/21/31/flood-139000_640.jpg"
                         alt="Flood Disaster"/>
                    <p className="legend">Swift Water Rescue</p>
                </div>
                <div>
                    <img
                        src="https://media.istockphoto.com/id/1349255827/photo/caldor-fire-california.jpg?s=612x612&w=0&k=20&c=dAyN-nBzuElOTHcOdvaUAQYp9fK7zsuiir3L1HFauyk="
                        alt="Wildfire Response"/>
                    <p className="legend">Wildfire Containment</p>
                </div>
                <div>
                    <img
                        src="https://static.toiimg.com/thumb/msid-97673203,width-1280,height-720,resizemode-4/97673203.jpg"
                        alt="Earthquake Relief"/>
                    <p className="legend">Earthquake Relief</p>
                </div>
                {/* ... (more slides) ... */}
            </Carousel>

            {/* About Us Section */}
            <section className="about">
                <h2>About Us</h2>
                <p>
                    We are a dedicated team of crisis response professionals committed to providing immediate,
                    effective assistance in any emergency. Our expertise spans natural disasters, technological
                    failures, and public health crises.
                </p>
            </section>

            {/* Hero Section */}
            <section className="hero">
                <div className="hero-content">
                    <h1>Responding to Emergencies</h1>
                    <p>Our mission is to make a difference when it matters most.</p>
                    <button className="btn-primary" onClick={handleGetHelpClick}>Get Help Now</button>
                    <button className="btn-secondary" onClick={handleReportIncidentClick}>Report an Incident</button>
                </div>
            </section>

            {/* Recent Updates */}
            <section className="updates">
                <h2>Recent Updates</h2>
                <div className="update-grid">
                    {updates.map((update, index) => (
                        <div key={index} className="update-item">
                            {update.type === 'video' && (
                                <>
                                    <h3>{update.title}</h3>
                                    <YouTubeVideo videoId={update.videoId} />
                                </>
                            )}
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
};

export default HomePage;
