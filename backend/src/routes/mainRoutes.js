import express from 'express';
import authRoutes from './authRoutes.js';
import taskRoutes from './taskRoutes.js';
const router = express.Router();

router.use('/auth', authRoutes);
router.use('/tasks', taskRoutes);

export default router;
