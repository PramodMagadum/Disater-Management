import React from 'react';
import './Navbar.css'; // Import your custom styles
import { Link } from 'react-router-dom';

const Navbar: React.FC = () => {
    return (
        <nav className="navbar">
            <div className="container">
                <Link to="/" className="logo">Crisis Response Management</Link>
                <ul className="nav-links">
                    <li><Link to="/">Home</Link></li>
                    <li><Link to="/report-incident">Report an Incident</Link></li>
                    <li><Link to="/collaborate">Collaboration</Link></li>
                    <li><Link to="/contact">Communication Center</Link></li>
                    <li><Link to="/about-us">About</Link></li>
                    <li className="admin-link">
                        <Link to="/admin-login">Admin Login</Link>
                    </li>
                </ul>
            </div>
        </nav>
    );
};

export default Navbar;
