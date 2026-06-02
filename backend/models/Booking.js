// models/Booking.js  <-- yeh file backend mein models/ folder mein honi chahiye

const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema({
  userId:    { type: String, required: true },
  name:      { type: String, required: true },
  phone:     { type: String, required: true },
  pickup:    { type: String, required: true },
  drop:      { type: String, required: true },
  truckType: { type: String, required: true },  // goods + weight yahan aayega
  notes:     { type: String, default: "" },
  company:   { type: String, default: "" },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Booking", bookingSchema);