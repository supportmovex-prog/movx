const express = require("express");

const router = express.Router();

const bcrypt = require("bcryptjs");

const jwt = require("jsonwebtoken");

const User = require("../models/User");




// ===== SIGNUP =====

router.post("/signup", async (req, res) => {

    try {

        const { name, email, password } = req.body;


        // CHECK EXISTING USER

        const existingUser = await User.findOne({ email });

        if(existingUser){

            return res.json({
                message: "User Already Exists"
            });

        }


        // HASH PASSWORD

        const hashedPassword = await bcrypt.hash(password, 10);


        // CREATE USER

        const newUser = new User({

            name,
            email,
            password: hashedPassword

        });


        await newUser.save();


        res.json({

            message: "Signup Successful"

        });


    } catch (err) {

        res.status(500).json({
            error: err.message
        });

    }

});






// ===== LOGIN =====

router.post("/login", async (req, res) => {

    try {

        const { email, password } = req.body;


        // FIND USER

        const user = await User.findOne({ email });

        if(!user){

            return res.json({
                message: "User Not Found"
            });

        }


        // PASSWORD MATCH

        const isMatch = await bcrypt.compare(password, user.password);

        if(!isMatch){

            return res.json({
                message: "Wrong Password"
            });

        }


        // TOKEN

        const token = jwt.sign(

            {
                id: user._id
            },

            "movexsecretkey",

            {
                expiresIn: "7d"
            }

        );


        res.json({

            token,

            user: {

                id: user._id,
                name: user.name,
                email: user.email

            }

        });

    } catch (err) {

        res.status(500).json({
            error: err.message
        });

    }

});



module.exports = router;