const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    resetOTP: {
        type: String,
        default: null
    },
    resetOTPExpiry: {
        type: Date,
        default: null
    }
});

module.exports = mongoose.model("User", userSchema);