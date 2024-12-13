// src/components/Home.js
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Using useNavigate for navigation

const Home = () => {
    const navigate = useNavigate(); // Hook to programmatically navigate
    const [showMessage, setShowMessage] = useState(true); // State to control message visibility

    useEffect(() => {
        // Set a timer to hide the welcome message and navigate after 3 seconds
        const timer = setTimeout(() => {
            setShowMessage(false); // Hide the message
            navigate('/cars'); // Navigate to the CarList page
        }, 3000); // 3000ms = 3 seconds
        
        // Cleanup the timer if the component is unmounted
        return () => clearTimeout(timer);
    }, [navigate]); // The effect runs once on mount and on route change

    return (
        <div style={styles.container}>
            <div style={styles.overlay}></div>
            <div style={styles.content}>
                {showMessage && (
                    <>
                        <h1 style={styles.title}>Your Next Adventure Awaits!</h1>
                        <p style={styles.subtitle}>Discover the perfect ride, at the perfect price, just for you.</p>
                    </>
                )}
            </div>
        </div>
    );
};

// Enhanced inline styles with animations
const styles = {
    container: {
        position: 'relative',
        textAlign: 'center',
        height: '100vh',
        backgroundImage: 'url("https://wallpapers.com/images/featured/4k-car-background-u1m38vaxvibzrer8.jpg")', // Stunning car background image
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        animation: 'fadeIn 1.5s ease-out', // Fade in effect for the entire page
    },
    overlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)', // Slight dark overlay to make text more readable
        zIndex: 1,
    },
    content: {
        position: 'relative',
        zIndex: 2,
        color: '#fff',
        textShadow: '2px 2px 6px rgba(0, 0, 0, 0.8)', // Text shadow for better contrast
    },
    title: {
        fontSize: '56px',
        marginBottom: '20px',
        fontWeight: 'bold',
        textTransform: 'uppercase',
        letterSpacing: '2px',
        animation: 'fadeInDown 1.5s ease-out',
    },
    subtitle: {
        fontSize: '28px',
        marginBottom: '40px',
        animation: 'fadeInUp 1.5s ease-out',
        letterSpacing: '1px',
    },
};

// Animations for fadeIn and fadeInDown
const globalStyles = {
    '@keyframes fadeIn': {
        '0%': { opacity: 0 },
        '100%': { opacity: 1 },
    },
    '@keyframes fadeInDown': {
        '0%': { opacity: 0, transform: 'translateY(-30px)' },
        '100%': { opacity: 1, transform: 'translateY(0)' },
    },
    '@keyframes fadeInUp': {
        '0%': { opacity: 0, transform: 'translateY(30px)' },
        '100%': { opacity: 1, transform: 'translateY(0)' },
    },
};

export default Home;
