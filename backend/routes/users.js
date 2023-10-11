require('dotenv').config();
const express = require('express');
const bcrypt = require('bcrypt');
const User = require('../models/user');
const jwt = require('jsonwebtoken');
const authenticateJWT = require('../middleware/auth');


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

// User login route
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check if email and password are provided
        if (!email || !password) {
            return res.status(400).json({ message: 'Please provide email and password.' });
        }

        // Check if user exists
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Invalid email or password.' });
        }

        // Compare provided password with stored hashed password
        const isMatch = await bcrypt.compare(password, user.hashedPassword);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid email or password.' });
        }

        // Generate JWT
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });  // Use the secret key from the .env file

        res.status(200).json({ message: 'Logged in successfully!', token });

    } catch (error) {
        console.error('Error logging in user:', error);
        res.status(500).json({ message: 'Server error. Please try again later.' });
    }
});

// View User Profile Route
router.get('/profile', authenticateJWT, async (req, res) => {
    try {
        const userId = req.user.id;
        const user = await User.findById(userId).select('-hashedPassword'); // Exclude the hashed password from the result

        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }

        res.status(200).json(user);
    } catch (error) {
        console.error('Error fetching user profile:', error);
        res.status(500).json({ message: 'Server error. Please try again later.' });
    }
});

// Update User Profile Route
router.put('/profile', authenticateJWT, async (req, res) => {
    try {
        const userId = req.user.id;
        const { username, email } = req.body;

        // Find the user by ID
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }

        // Update the user's data
        if (username) user.username = username;
        if (email) user.email = email;

        await user.save();

        res.status(200).json({ message: 'Profile updated successfully!', user });

    } catch (error) {
        console.error('Error updating user profile:', error);
        res.status(500).json({ message: 'Server error. Please try again later.' });
    }
});

// TODO: Add other user-related routes (e.g., login, profile management, etc.)

module.exports = router;
