import React from 'react';
import { useLocation } from 'react-router-dom';
import './PricePage.css'; // Ensure correct styling is linked

const PricePage = () => {
    const location = useLocation();
    const { reservation } = location.state || {};

    if (!reservation) {
        return <p>Reservation not found</p>;
    }

    const { totalPrice, discountDetails } = reservation;

    return (
        <div className="price-page-container">
            <div className="price-box">
                <h1>Booking Successful!</h1>
                <p>Your booking reference: <strong>{reservation.id}</strong></p>
                <p>Car Model: <strong>{reservation.carModel}</strong></p>
                <p>Start Date: <strong>{reservation.startDate}</strong></p>
                <p>End Date: <strong>{reservation.endDate}</strong></p>

                {/* Show the total price after applying the discount */}
                <p>
                    <strong>Total Price After Discount: ₹{totalPrice}</strong>
                </p>

                {/* Show discount details if applicable */}
                {discountDetails && (
                    <div className="discount-details">
                        <h2>Discount Details</h2>
                        <p>Discount Percentage: <strong>{discountDetails.discountPercentage}%</strong></p>
                        <p>Discount Amount: <strong>₹{discountDetails.discountAmount}</strong></p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default PricePage;