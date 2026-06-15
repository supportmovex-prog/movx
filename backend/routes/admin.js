const express = require("express");
const router = express.Router();
const Booking = require("../models/Booking");

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

// ===== ADMIN LOGIN =====
router.post("/admin/login", (req, res) => {
    const { password } = req.body;
    if(password === ADMIN_PASSWORD) {
        res.json({ success: true, token: "movex_admin_" + Date.now() });
    } else {
        res.status(401).json({ success: false, message: "Wrong Password" });
    }
});

// ===== GET ALL BOOKINGS =====
router.get("/admin/bookings", async (req, res) => {
    try {
        const adminToken = req.headers['admin-token'];
        if(!adminToken || !adminToken.startsWith('movex_admin_')) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        const bookings = await Booking.find().sort({ createdAt: -1 });
        res.json({ bookings });
    } catch(err) {
        res.status(500).json({ error: err.message });
    }
});

// ===== UPDATE BOOKING STATUS =====
router.put("/admin/booking/:id", async (req, res) => {
    try {
        const adminToken = req.headers['admin-token'];
        if(!adminToken || !adminToken.startsWith('movex_admin_')) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        const { status } = req.body;
        await Booking.findByIdAndUpdate(req.params.id, { status });
        res.json({ message: "Status Updated" });
    } catch(err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;