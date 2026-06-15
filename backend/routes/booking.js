const express = require("express");
const router = express.Router();
const Booking = require("../models/Booking");

// ===== WHATSAPP MESSAGE FUNCTION =====
function generateWhatsAppUrl(phone, name) {
    // Phone clean karo
    let cleanPhone = phone.replace(/\D/g, '');
    if(cleanPhone.startsWith('0')) cleanPhone = '91' + cleanPhone.slice(1);
    if(!cleanPhone.startsWith('91')) cleanPhone = '91' + cleanPhone;

    const message = encodeURIComponent(
        `Hi ${name}! 👋\n\n` +
        `Thank you for booking with *MoveX* 🚛\n\n` +
        `We have received your transport request! Our team is already finding the best truck for you.\n\n` +
        `✅ *Booking Received*\n` +
        `⏰ Our team will call you within *2 hours*.\n\n` +
        `Need help? WhatsApp us anytime!\n\n` +
        `— Team MoveX 🚛\n` +
        `📞 +91 9571910941\n` +
        `🌐 www.movex.services`
    );

    // YAHAN APNA WHATSAPP NUMBER HAI
    return `https://wa.me/${cleanPhone}?text=${message}`;
}

// ===== CREATE BOOKING =====
router.post("/booking", async (req, res) => {
    try {
        const booking = new Booking(req.body);
        await booking.save();

        // WhatsApp URL generate karo
        const whatsappUrl = generateWhatsAppUrl(
            req.body.phone,
            req.body.name
        );

        res.json({
            message: "Booking Successful",
            whatsappUrl: whatsappUrl
        });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ===== GET BOOKINGS BY USER =====
router.get("/bookings/:userId", async (req, res) => {
    try {
        const bookings = await Booking.find({ userId: req.params.userId })
            .sort({ createdAt: -1 });
        res.json(bookings);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;