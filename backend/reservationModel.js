const mongoose = require('mongoose');

const discountSchema = new mongoose.Schema({
  discountPercentage: {
    type: Number,
    required: true
  },
  discountAmount: {
    type: Number,
    required: true
  }
}, { _id: false });

const reservationSchema = new mongoose.Schema({
  id: {
    type: Number,
    required: true,
    unique: true
  },
  userId: {
    type: Number,
    required: true
  },
  carId: {
    type: Number,
    required: true
  },
  carModel: {
    type: String,
    required: true
  },
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date,
    required: true
  },
  totalPrice: {
    type: Number,
    required: true
  },
  discountDetails: {
    type: discountSchema,
    required: true
  }
});

const Reservation = mongoose.model('Reservation', reservationSchema);

module.exports = Reservation;
