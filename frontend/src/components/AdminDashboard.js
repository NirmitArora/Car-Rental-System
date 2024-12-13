import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AdminDashboard = () => {
    const [cars, setCars] = useState([]);
    const [reservations, setReservations] = useState([]);  // State for reservations
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);
    const [editCar, setEditCar] = useState(null); // Holds the car to be edited
    const [formData, setFormData] = useState({
        Make: '',
        Model: '',
        Year: '',
        PricePerDay: '',
        Location: '',
        AvailabilityStatus: '',
    });

    // Fetch cars and reservations data on component mount
    useEffect(() => {
        const fetchData = async () => {
            try {
                const carResponse = await axios.get('http://localhost:3000/cars');
                setCars(carResponse.data);

                const reservationResponse = await axios.get('http://localhost:3000/reservations'); // Fetch reservations data
                setReservations(reservationResponse.data);
            } catch (err) {
                setError('Failed to fetch data.');
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    // Handle delete car
    const handleDeleteCar = async (id) => {
        try {
            await axios.delete(`http://localhost:3000/cars/${id}`);
            setCars((prevCars) => prevCars.filter((car) => car.id !== id));
            alert('Car deleted successfully.');
        } catch (err) {
            alert('Failed to delete car.');
        }
    };

    // Handle edit button click
    const handleEditCar = (car) => {
        setEditCar(car);
        setFormData({
            Make: car.Make,
            Model: car.Model,
            Year: car.Year,
            PricePerDay: car.PricePerDay,
            Location: car.Location,
            AvailabilityStatus: car.AvailabilityStatus,
        });
    };

    // Handle form input changes
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    // Handle update car submission
    const handleUpdateCar = async (e) => {
        e.preventDefault();
        try {
            await axios.put(`http://localhost:3000/cars/${editCar.id}`, formData);
            setCars((prevCars) =>
                prevCars.map((car) =>
                    car.id === editCar.id ? { ...car, ...formData } : car
                )
            );
            alert('Car updated successfully.');
            setEditCar(null); // Close the edit form
        } catch (err) {
            alert('Failed to update car.');
        }
    };

    if (loading) {
        return <p>Loading...</p>;
    }

    if (error) {
        return <p style={{ color: 'red' }}>{error}</p>;
    }

    return (
        <div style={styles.container}>
            <h1>Admin Dashboard</h1>

            {/* Car Management Section */}
            <h3>Car Management</h3>
            <table style={styles.table}>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Make</th>
                        <th>Model</th>
                        <th>Year</th>
                        <th>Price/Day</th>
                        <th>Location</th>
                        <th>Status</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {cars.map((car) => (
                        <tr key={car.id}>
                            <td>{car.id}</td>
                            <td>{car.Make}</td>
                            <td>{car.Model}</td>
                            <td>{car.Year}</td>
                            <td>{car.PricePerDay}</td>
                            <td>{car.Location}</td>
                            <td>{car.AvailabilityStatus}</td>
                            <td>
                                <button
                                    style={styles.editButton}
                                    onClick={() => handleEditCar(car)}
                                >
                                    Edit
                                </button>
                                <button
                                    style={styles.deleteButton}
                                    onClick={() => handleDeleteCar(car.id)}
                                >
                                    Delete
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* Reservation Details Section */}
            <h3>Reservation Details</h3>
            <table style={styles.table}>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Car ID</th>
                        <th>User ID</th>
                        <th>Start Date</th>
                        <th>End Date</th>
                        <th>Total Price</th>
                    </tr>
                </thead>
                <tbody>
                    {reservations.map((reservation) => (
                        <tr key={reservation.id}>
                            <td>{reservation.id}</td>
                            <td>{reservation.carId}</td>
                            <td>{reservation.userId}</td>
                            <td>{reservation.startDate}</td>
                            <td>{reservation.endDate}</td>
                            <td>{reservation.totalPrice}</td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* Edit Car Form */}
            {editCar && (
                <div style={styles.editFormContainer}>
                    <h3>Edit Car</h3>
                    <form onSubmit={handleUpdateCar}>
                        <label>
                            Make:
                            <input
                                type="text"
                                name="Make"
                                value={formData.Make}
                                onChange={handleChange}
                            />
                        </label>
                        <label>
                            Model:
                            <input
                                type="text"
                                name="Model"
                                value={formData.Model}
                                onChange={handleChange}
                            />
                        </label>
                        <label>
                            Year:
                            <input
                                type="number"
                                name="Year"
                                value={formData.Year}
                                onChange={handleChange}
                            />
                        </label>
                        <label>
                            Price/Day:
                            <input
                                type="number"
                                name="PricePerDay"
                                value={formData.PricePerDay}
                                onChange={handleChange}
                            />
                        </label>
                        <label>
                            Location:
                            <input
                                type="text"
                                name="Location"
                                value={formData.Location}
                                onChange={handleChange}
                            />
                        </label>
                        <label>
                            Status:
                            <input
                                type="text"
                                name="AvailabilityStatus"
                                value={formData.AvailabilityStatus}
                                onChange={handleChange}
                            />
                        </label>
                        <button type="submit" style={styles.saveButton}>
                            Save
                        </button>
                        <button
                            type="button"
                            style={styles.cancelButton}
                            onClick={() => setEditCar(null)}
                        >
                            Cancel
                        </button>
                    </form>
                </div>
            )}
        </div>
    );
};

const styles = {
    container: {
        padding: '20px',
        textAlign: 'center',
    },
    table: {
        width: '100%',
        borderCollapse: 'collapse',
        marginTop: '20px',
    },
    editButton: {
        backgroundColor: '#007bff',
        color: '#fff',
        border: 'none',
        padding: '5px 10px',
        marginRight: '5px',
        cursor: 'pointer',
    },
    deleteButton: {
        backgroundColor: '#dc3545',
        color: '#fff',
        border: 'none',
        padding: '5px 10px',
        cursor: 'pointer',
    },
    editFormContainer: {
        marginTop: '20px',
        padding: '20px',
        border: '1px solid #ccc',
        borderRadius: '5px',
        display: 'inline-block',
    },
    saveButton: {
        backgroundColor: '#28a745',
        color: '#fff',
        border: 'none',
        padding: '5px 10px',
        cursor: 'pointer',
        marginTop: '10px',
    },
    cancelButton: {
        backgroundColor: '#6c757d',
        color: '#fff',
        border: 'none',
        padding: '5px 10px',
        cursor: 'pointer',
        marginTop: '10px',
        marginLeft: '10px',
    },
};

export default AdminDashboard;
