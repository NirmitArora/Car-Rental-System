const express = require('express');
const cors = require('cors'); 
const app = express();
const port = 3000; 
const path = require('path');
const mongoose = require('mongoose');
const paymentRoutes = require('./payment/paymentRoutes');
const chatbotRoutes = require('./chatbot/chatbotRoutes');
const { registerUser } = require('./register');
const { loginUser } = require('./login');
const { updateUserProfile } = require('./profile');
const { makeReservation, viewReservations } = require('./reservationController');
const upload = require('./multerconfig');
const {addCar, getCars, getCarById, updateCar, deleteCar, uploadCarMedia} = require('./carController');


app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use(cors());
app.use(express.json());
app.use('/payment', paymentRoutes);

// // MongoDB Connection
// mongoose.connect('mongodb://localhost:27017/carRentalDB', {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
// })
// .then(() => console.log('Connected to MongoDB'))
// .catch((err) => console.log('Error connecting to MongoDB:', err));

// Car Management Routes
app.post('/cars', addCar);
app.get('/cars', getCars);
app.get('/cars/:id', getCarById);
app.put('/cars/:id', updateCar);
app.delete('/cars/:id', deleteCar);
app.post('/cars/:id/upload', upload.array('media', 10), uploadCarMedia);

// Reservation Routes
app.post('/reservations', makeReservation);
app.get('/reservations', viewReservations);

// User Management Routes
app.post('/register', registerUser);
app.post('/login', loginUser);
app.put('/profile', updateUserProfile);

// Chatbot routes
app.use('/api/chatbot', chatbotRoutes);

// Start the server
app.listen(port, () => {
    console.log(`Server is running on port ` + port);
});