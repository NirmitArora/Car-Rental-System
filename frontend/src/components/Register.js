// src/components/Register.js
import React, { useState } from 'react';
import axios from 'axios'; // For making HTTP requests
import { useNavigate } from 'react-router-dom';

// Function to generate a strong password
const generateStrongPassword = (length = 12) => {
    const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+";
    let password = "";
    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * charset.length);
        password += charset[randomIndex];
    }
    return password;
};

const Register = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false); // State to toggle password visibility
    const [suggestedPassword, setSuggestedPassword] = useState('');
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const response = await axios.post('http://localhost:3000/register', {
                username,
                email,
                password,
            });
            if (response.status === 201) {
                alert('Registration successful!');
                navigate('/login'); // Redirect to the login page after successful registration
            }
        } catch (err) {
            setError(err.response.data.message || 'Registration failed. Please check your details and try again.');
        } finally {
            setLoading(false);
        }
    };

    // Function to suggest a strong password when the password input is clicked
    const handlePasswordClick = () => {
        const suggested = generateStrongPassword();
        setSuggestedPassword(suggested);
    };

    // Function to handle suggested password being used
    const handleUseSuggestedPassword = () => {
        setPassword(suggestedPassword);
        setSuggestedPassword(''); // Clear suggested password after using it
    };

    return (
        <div style={styles.container}>
            <h2>Register</h2>
            <form onSubmit={handleRegister} style={styles.form}>
                <div style={styles.formGroup}>
                    <label htmlFor="username">Username:</label>
                    <input
                        type="text"
                        id="username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        style={styles.input}
                        required
                    />
                </div>
                <div style={styles.formGroup}>
                    <label htmlFor="email">Email:</label>
                    <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        style={styles.input}
                        required
                    />
                </div>
                <div style={styles.formGroup}>
                    <label htmlFor="password">Password:</label>
                    <div style={styles.passwordContainer}>
                        <input
                            type={showPassword ? 'text' : 'password'} // Toggle between text and password
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            onClick={handlePasswordClick} // Show suggested password on click
                            style={styles.input}
                            required
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)} // Toggle password visibility
                            style={styles.eyeButton}
                        >
                            {showPassword ? '👁️' : '👁️‍🗨️'} {/* Eye icon */}
                        </button>
                    </div>
                    {suggestedPassword && (
                        <div style={styles.suggestedPasswordContainer}>
                            <p style={styles.suggestedPasswordText}>Suggested Password: {suggestedPassword}</p>
                            <button 
                                type="button" 
                                onClick={handleUseSuggestedPassword} 
                                style={styles.useButton}
                            >
                                Use this password
                            </button>
                        </div>
                    )}
                </div>
                {error && <p style={styles.error}>{error}</p>}
                <button type="submit" style={styles.button} disabled={loading}>
                    {loading ? 'Registering...' : 'Register'}
                </button>
            </form>
        </div>
    );
};

// Inline styles for simplicity
const styles = {
    container: {
        textAlign: 'center',
        marginTop: '50px',
    },
    form: {
        display: 'inline-block',
        textAlign: 'left',
    },
    formGroup: {
        marginBottom: '15px',
    },
    label: {
        display: 'block',
        marginBottom: '5px',
    },
    input: {
        width: '100%',
        padding: '8px',
        fontSize: '16px',
        borderRadius: '4px',
        border: '1px solid #ccc',
    },
    passwordContainer: {
        display: 'flex',
        alignItems: 'center',
    },
    eyeButton: {
        border: 'none',
        background: 'none',
        cursor: 'pointer',
        marginLeft: '8px',
        fontSize: '20px',
    },
    suggestedPasswordContainer: {
        marginTop: '10px',
    },
    suggestedPasswordText: {
        color: 'black', // Changed to black for better visibility
    },
    useButton: {
        marginTop: '5px',
        padding: '5px 10px',
        fontSize: '14px',
        cursor: 'pointer',
        border: 'none',
        borderRadius: '4px',
        backgroundColor: '#007bff', // Blue button for visibility
        color: '#fff',
    },
    button: {
        padding: '10px 20px',
        fontSize: '16px',
        cursor: 'pointer',
        border: 'none',
        borderRadius: '4px',
        backgroundColor: '#ff6200',
        color: '#fff',
        transition: 'background-color 0.3s ease',
    },
    error: {
        color: 'red',
        marginBottom: '15px',
    },
};

export default Register;
