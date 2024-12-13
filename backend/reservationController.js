const { readFile, writeFile, initializeFile } = require('./fs');
const { calculateDiscount } = require('./discount');
const RESERVATIONS_FILE = './reservations.json';
const CARS_FILE = './cars.json';

initializeFile(RESERVATIONS_FILE);

const isCarAvailable = (carId, startDate, endDate) => {
    const reservations = readFile(RESERVATIONS_FILE);
    return !reservations.some(reservation =>
        reservation.carId === carId &&
        (
            (new Date(startDate) <= new Date(reservation.endDate) && new Date(endDate) >= new Date(reservation.startDate))
        )
    );
};

const makeReservation = (req, res) => {
    const { userId, carId, startDate, endDate } = req.body;

    const start = new Date(startDate);
    const end = new Date(endDate);
    const currentDate = new Date();

    if (start < currentDate || end < currentDate) {
        return res.status(400).json({ message: 'Invalid date: Reservation dates must be in the future' });
    }

    if (end < start) {
        return res.status(400).json({ message: 'Invalid date: End date cannot be before start date' });
    }

    const cars = readFile(CARS_FILE);
    const car = cars.find(car => car.id === carId);

    if (!car) {
        return res.status(400).json({ message: 'Car not found' });
    }

    if (!isCarAvailable(carId, startDate, endDate)) {
        return res.status(400).json({ message: 'Car not available for the selected dates' });
    }

    // Use the calculateDiscount function to calculate total price and discount
    const { discountPercentage, discountAmount, totalAmountAfterDiscount } = calculateDiscount(startDate, endDate, car.PricePerDay);

    const newReservation = {
        id: Date.now(),
        userId,
        carId,
        carModel: car.Model,
        startDate,
        endDate,
        totalPrice: totalAmountAfterDiscount, // Total price after applying discount
        discountDetails: {
            discountPercentage,
            discountAmount,
        },
    };

    const reservations = readFile(RESERVATIONS_FILE);
    reservations.push(newReservation);
    writeFile(RESERVATIONS_FILE, reservations);

    car.availabilityStatus = 'unavailable';
    writeFile(CARS_FILE, cars);

    // Send the reservation object with discount details
    res.status(201).json({ message: 'Reservation successful', reservation: newReservation });
};

const viewReservations = (req, res) => {
    const { userId } = req.query;
    const reservations = readFile(RESERVATIONS_FILE).filter(reservation => !userId || reservation.userId === userId);
    res.status(200).json(reservations);
};

module.exports = { makeReservation, viewReservations };