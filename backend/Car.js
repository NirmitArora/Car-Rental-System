const mongoose = require('mongoose');

// Define the Car Schema
const carSchema = new mongoose.Schema({
    Make: { type: String, required: true },
    Model: { type: String, required: true },
    Year: { type: Number, required: true },
    VIN: { type: String, required: true },
    LicensePlate: { type: String, required: true },
    AvailabilityStatus: { type: String, required: true },  // e.g., Available, Reserved
    PricePerDay: { type: Number, required: true },
    Location: { type: String, required: true },
    photos: [String], // Array of photo URLs
    videos: [String], // Array of video URLs
});

// Create the Car model
module.exports = mongoose.model('Car', carSchema);
