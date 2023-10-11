const express = require('express');
const bcrypt = require('bcrypt');
const User = require('../models/user');

const router = express.Router();

// User Registration Route
router.post('/register', async (req, res) => {
    try {
        const { username, email, password } = req.body;

        if (!username || !email || !password) {
            return res.status(400).json({ message: 'Please provide all required fields.' });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User with this email already exists.' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new User({
            username,
            email,
            hashedPassword
        });

        await newUser.save();
        res.status(201).json({ message: 'User registered successfully!', user: newUser });

    } catch (error) {
        console.error('Error registering user:', error);
        res.status(500).json({ message: 'Server error. Please try again later.' });
    }
});

// TODO: Add other user-related routes (e.g., login, profile management, etc.)

module.exports = router;
