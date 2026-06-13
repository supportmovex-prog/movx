const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const User = require("../models/user");

// ===== EMAIL SETUP =====
const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

// ===== SIGNUP =====
router.post("/signup", async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const existingUser = await User.findOne({ email });
        if(existingUser){
            return res.json({ message: "User Already Exists" });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ name, email, password: hashedPassword });
        await newUser.save();
        res.json({ message: "Signup Successful" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ===== LOGIN =====
router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if(!user){
            return res.json({ message: "User Not Found" });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch){
            return res.json({ message: "Wrong Password" });
        }
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });
        res.json({
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email
            }
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ===== FORGOT PASSWORD — SEND OTP =====
router.post("/forgot-password", async (req, res) => {
    try {
        const { email } = req.body;

        const user = await User.findOne({ email });
        if(!user){
            return res.json({ message: "User Not Found" });
        }

        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const expiry = new Date(Date.now() + 10 * 60 * 1000);

        user.resetOTP = otp;
        user.resetOTPExpiry = expiry;
        await user.save();

        try {
            await transporter.sendMail({
                from: process.env.EMAIL_USER,
                to: email,
                subject: "MoveX — Password Reset OTP",
                html: `
                    <div style="font-family:Arial,sans-serif;max-width:500px;margin:auto;padding:30px;border:1px solid #eee;border-radius:10px;">
                        <h2 style="color:#1e3a5f;">MoveX 🚛</h2>
                        <p>Your OTP for password reset is:</p>
                        <h1 style="color:#f97316;letter-spacing:8px;">${otp}</h1>
                        <p>This OTP is valid for <strong>10 minutes</strong>.</p>
                        <p>If you did not request this, please ignore this email.</p>
                        <hr/>
                        <p style="color:#999;font-size:12px;">— Team MoveX</p>
                    </div>
                `
            });
            console.log("✅ Email sent to:", email);
            res.json({ message: "OTP Sent" });
        } catch(emailErr) {
            console.log("❌ Email Error:", emailErr.message);
            res.status(500).json({ error: emailErr.message });
        }

    } catch (err) {
        console.log("❌ Server Error:", err.message);
        res.status(500).json({ error: err.message });
    }
});

// ===== VERIFY OTP =====
router.post("/verify-otp", async (req, res) => {
    try {
        const { email, otp } = req.body;
        const user = await User.findOne({ email });
        if(!user){
            return res.json({ message: "User Not Found" });
        }
        if(user.resetOTP !== otp){
            return res.json({ message: "Invalid OTP" });
        }
        if(user.resetOTPExpiry < new Date()){
            return res.json({ message: "OTP Expired" });
        }
        res.json({ message: "OTP Verified" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ===== RESET PASSWORD =====
router.post("/reset-password", async (req, res) => {
    try {
        const { email, otp, newPassword } = req.body;
        const user = await User.findOne({ email });
        if(!user){
            return res.json({ message: "User Not Found" });
        }
        if(user.resetOTP !== otp || user.resetOTPExpiry < new Date()){
            return res.json({ message: "Invalid or Expired OTP" });
        }
        user.password = await bcrypt.hash(newPassword, 10);
        user.resetOTP = null;
        user.resetOTPExpiry = null;
        await user.save();
        res.json({ message: "Password Reset Successful" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;