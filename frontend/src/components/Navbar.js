import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Navbar.css'; // Optional: Add styles for the Navbar

const Navbar = () => {
    const { isAuthenticated, logout } = useAuth(); // Access authentication and logout function
    const navigate = useNavigate();

    const handleLogout = () => {
        logout(); // Perform logout (Assuming `logout` is defined in your AuthContext)
        navigate('/login'); // Redirect to login page after logging out
    };

    return (
        <nav className="navbar">
            <div className="navbar-brand">
                <Link to="/" className="navbar-logo">CarRental</Link>
            </div>
            <div className="navbar-links">
                <Link to="/" className="navbar-link">Home</Link>
                <Link to="/cars" className="navbar-link">Cars</Link>

                {!isAuthenticated ? (
                    <>
                        <Link to="/register" className="navbar-link">Sign Up</Link>
                        <Link to="/login" className="navbar-link">Login</Link>
                    </>
                ) : (
                    <>
                        <button className="navbar-link" onClick={handleLogout}>
                            Logout
                        </button>
                    </>
                )}
            </div>
        </nav>
    );
};

export default Navbar;