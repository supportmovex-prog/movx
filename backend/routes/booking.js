const express = require("express");
const router = express.Router();
const Booking = require("../models/Booking");

// ===== CREATE BOOKING =====
router.post("/booking", async (req, res) => {
  try {
    const booking = new Booking(req.body);
    await booking.save();
    res.json({ message: "Booking Successful" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ===== GET BOOKINGS BY USER =====
router.get("/bookings/:userId", async (req, res) => {
  try {
    const bookings = await Booking.find({ userId: req.params.userId });
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;