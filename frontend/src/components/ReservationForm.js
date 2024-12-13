import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './ReservationForm.css';

const ReservationForm = () => {
    const { carId } = useParams();
    const navigate = useNavigate();
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        setError('');

        axios.post('http://localhost:3000/reservations', {
            userId: 1, // Replace with actual user ID from context or authentication
            carId: parseInt(carId),
            startDate,
            endDate
        })
        .then(response => {
            const reservation = response.data.reservation;

            // Payment functionality - Step 1: Call the backend to create an order
            setIsLoading(true); // Start loading state
            axios.post('http://localhost:3000/payment/create-order', {
                amount: reservation.totalPrice,
            })
            .then(paymentResponse => {
                const data = paymentResponse.data;
                if (!data.success) {
                    throw new Error('Failed to create payment order');
                }

                // Step 2: Initialize Razorpay Checkout
                const options = {
                    key: 'rzp_test_iiWd5oMIjo6kcY', // Replace with your Razorpay Key ID
                    amount: data.amount, // Amount in paise
                    currency: data.currency,
                    name: 'Car Rental System',
                    description: `Payment for reservation ${reservation.id}`,
                    order_id: data.orderId, // Order ID from backend
                    handler: async (response) => {
                        try {
                            // Step 3: Verify payment on the backend
                            const verifyResponse = await axios.post('http://localhost:3000/payment/verify-payment', {
                                razorpay_order_id: response.razorpay_order_id,
                                razorpay_payment_id: response.razorpay_payment_id,
                                razorpay_signature: response.razorpay_signature,
                            });
                            const verifyData = verifyResponse.data;

                            if (verifyData.success) {
                                
                                navigate('/price', { state: { reservation } }); // Navigate to the Price Page
                            } else {
                                alert('Payment verification failed. Please try again.');
                            }
                        } catch (verificationError) {
                            console.error('Error during payment verification:', verificationError);
                            alert('Something went wrong during payment verification.');
                        }
                    },
                    prefill: {
                        name: reservation.userName || 'John Doe', // Replace with user's name if available
                        email: reservation.userEmail || 'johndoe@example.com', // Replace with user's email if available
                        contact: reservation.userContact || '9999999999', // Replace with user's contact if available
                    },
                    theme: {
                        color: '#3399cc',
                    },
                };

                const razorpay = new window.Razorpay(options);
                razorpay.on('payment.failed', (response) => {
                    alert('Payment failed. Please try again.');
                    console.error('Payment failed:', response.error);
                });

                razorpay.open();
            })
            .catch(error => {
                console.error('Error during payment:', error);
                alert('Something went wrong. Please try again.');
            })
            .finally(() => {
                setIsLoading(false); // End loading state
            });
        })
        .catch(err => {
            const status = err.response ? err.response.status : null;
            const message = err.response && err.response.data ? err.response.data.message : 'Something went wrong!';

            if (status === 400 && message.includes('Invalid date')) {
                setError('Invalid date selected. Please choose future dates.');
            } else if (status === 400 && message.includes('Car not available')) {
                setError('The car is already reserved for the selected dates. Please choose different dates.');
            } else {
                setError('Error making reservation. Please try again.');
            }
        });
    };

    return (
        <div className="reservation-container">
            <div className="form-box">
                <h2 className="form-title">Make a Reservation</h2>
                <form onSubmit={handleSubmit}>
                    <label className="form-label">
                        Start Date:
                        <input 
                            type="date" 
                            value={startDate} 
                            onChange={(e) => setStartDate(e.target.value)} 
                            className="form-input"
                            required 
                        />
                    </label>
                    <label className="form-label">
                        End Date:
                        <input 
                            type="date" 
                            value={endDate} 
                            onChange={(e) => setEndDate(e.target.value)} 
                            className="form-input"
                            required 
                        />
                    </label>
                    <button type="submit" className="form-button">Calculate Price & Reserve</button>
                </form>
                {error && <p className="error-message">{error}</p>}
                {isLoading && <p>Processing payment...</p>}
            </div>
        </div>
    );
};

export default ReservationForm;
