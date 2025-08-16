import express from 'express';
import { registeruser, loginUser } from '../controller/authController.js';

const router = express.Router();

// Register route
router.post('/register', registeruser);

// Login route
router.post('/login', loginUser);

export default router;
