/**
 * Calculate discounts based on booking details.
 * @param {Date} startDate - The start date of the reservation.
 * @param {Date} endDate - The end date of the reservation.
 * @param {number} pricePerDay - The price per day for the car.
 * @returns {object} - An object containing the discount percentage and the discount amount.
 */
const calculateDiscount = (startDate, endDate, pricePerDay) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const currentDate = new Date();
    const totalDays = (end - start) / (1000 * 60 * 60 * 24);

    let discountPercentage = 0;

    // Early Bird Discount (10% for bookings 15+ days in advance)
    if ((start - currentDate) / (1000 * 60 * 60 * 24) >= 15) {
        discountPercentage = 10; // 10%
    } 
    // Last-Minute Discount (5% for bookings made within 1-2 days)
    else if ((start - currentDate) / (1000 * 60 * 60 * 24) <= 2) {
        discountPercentage = 5; // 5%
    } 
    // Long-Term Rental Discount (20% for rentals 20 days or more)
    else if (totalDays >= 20) {
        discountPercentage = 20; // 20%
    }

    // Calculate total discount amount
    const totalAmount = pricePerDay * totalDays;
    const discountAmount = (discountPercentage / 100) * totalAmount;

    return {
        discountPercentage,
        discountAmount,
        totalAmountAfterDiscount: totalAmount - discountAmount,
    };
};

module.exports = { calculateDiscount };