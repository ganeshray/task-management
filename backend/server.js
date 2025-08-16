import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { connectDB } from './src/config/db.js';
import { errorHandler } from './src/middleware/errorMiddleware.js';
import mainRoutes from './src/routes/mainRoutes.js';
import authRoutes from './src/routes/authRoutes.js';
dotenv.config();
connectDB();

const PORT = process.env.PORT || 3000;


const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// Health check route
app.get('/', (req, res) => {
    console.log('Health check route hit');
  res.status(200).json({ status: 'ok', message: 'Server is healthy' });
});
app.use('/api', mainRoutes);
app.use('/api/auth', authRoutes);

// app.get('/health', (req, res) => {
//   res.status(200).json({ status: 'ok', message: 'Server is healthy' });
// });

app.use(errorHandler);
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});