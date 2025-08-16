import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import asyncHandler from 'express-async-handler';

export const registeruser = asyncHandler(async (req, res) => {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
        res.status(400);
        throw new Error('Please fill all the fields');
    }
    const userExists = await User.findOne({ email });
    if (userExists) {
        res.status(400);
        throw new Error('User already exists');
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
        name,
        email,
        password: hashedPassword,
    });
    if (user) {
        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
        });
    } else {
        res.status(400);
        throw new Error('Invalid user data');
    }

});

export const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        res.status(400);
        throw new Error('Please provide email and password');
    }
    const user = await User.findOne({ email });
    if (!user) {
        res.status(401);
        throw new Error('Invalid credentials');
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        res.status(401);
        throw new Error('Invalid credentials');
    }
    // Generate JWT token valid for 1 day
    const token = jwt.sign(
        { userId: user._id, email: user.email },
        process.env.JWT_SECRET || 'defaultsecret',
        { expiresIn: '1d' }
    );
    res.status(200).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        token,
    });
});