import React, { useEffect, useState } from 'react';
import { getCars } from '../api'; // Assuming you have this function set up to fetch cars data
import './CarList.css'; // Add a separate CSS file for better organization
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
const CarList = () => {
    const [cars, setCars] = useState([]);
    const navigate = useNavigate(); // Hook to navigate programmatically
    const { isAuthenticated } = useAuth(); // Using useAuth hook to check authentication status

    useEffect(() => {
        getCars()
            .then(response => {
                setCars(response.data);
            })
            .catch(error => {
                console.error('Error fetching cars:', error);
            });
    }, []);

    const handleReserve = (carId) => {
        if (!isAuthenticated) {
            // Redirect to login page if not authenticated
            navigate('/login');
        } else {
            // If authenticated, navigate to the reservation page
            navigate(`/reserve/${carId}`);
        }
    };

    return (
        <div className="car-list-container">
            <h2 className="title">Available Cars</h2>
            <div className="car-grid">
                {cars.map(car => (
                    <div key={car.id} className="car-card">
                        <h3>{car.Make} {car.Model} - {car.Year}</h3>
                        <p className="price">Price: ₹{car.PricePerDay} per day</p>
                        <p className="location">Location: {car.Location}</p>

                        {/* Display Car Image */}
                        {car.photos && car.photos.length > 0 ? (
                            <img
                                src={`http://localhost:3000/${car.photos[0].replace(/\\/g, '/')}`}
                                alt={`${car.Make} ${car.Model}`}
                                className="car-image"
                            />
                        ) : (
                            <p>No image available</p>
                        )}

                        {/* Display Car Video */}
                        {car.videos && car.videos.length > 0 ? (
                            <video
                                controls
                                className="car-video"
                            >
                                <source src={`http://localhost:3000/${car.videos[0].replace(/\\/g, '/')}`} type="video/mp4" />
                                Your browser does not support the video tag.
                            </video>
                        ) : (
                            <p>No video available</p>
                        )}

                        {/* Display Reservation Button or Unavailable Status */}
                        {car.AvailabilityStatus === "Available" ? (
                            
                            <button
                                className="reserve-button"
                                onClick={() => handleReserve(car.id)}
                            >
                                Reserve Now
                            </button>
                            
                        ) : (
                            <p className="unavailable-text">Unavailable</p>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default CarList;
