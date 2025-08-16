import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { connectDB } from './src/config/db.js';
import { errorHandler } from './src/middleware/errorMiddleware.js';
import mainRoutes from './src/routes/mainRoutes.js';
import authRoutes from './src/routes/authRoutes.js';

// Load environment-specific configuration
// First check if NODE_ENV is set via command line/system environment
let NODE_ENV = process.env.NODE_ENV;

if (NODE_ENV === 'production') {
  // Load production environment variables and override any existing ones
  dotenv.config({ path: '.env.production', override: true });
  console.log('Loading production environment variables from .env.production');
} else {
  // Load development environment variables (default)
  dotenv.config();
  console.log('Loading development environment variables from .env');
}

// After loading dotenv, get NODE_ENV again (in case it was set in the .env file)
NODE_ENV = process.env.NODE_ENV || 'development';

connectDB();

const PORT = process.env.PORT || 3000;

const app = express();

// CORS configuration based on environment
const corsOptions = {
  origin: NODE_ENV === 'production' 
    ? process.env.FRONTEND_URL || 'https://your-frontend-domain.com'
    : ['http://localhost:5173', 'http://localhost:3000'],
  credentials: true
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check route
app.get('/', (req, res) => {
  console.log('Health check route hit');
  res.status(200).json({ 
    status: 'ok', 
    message: 'Server is healthy',
    environment: NODE_ENV
  });
});

app.use('/api', mainRoutes);

// app.get('/health', (req, res) => {
//   res.status(200).json({ status: 'ok', message: 'Server is healthy' });
// });

app.use(errorHandler);
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT} in ${NODE_ENV} mode`);
  console.log(`Using MongoDB: ${process.env.MONGO_URI ? 'Connected' : 'Not configured'}`);
  console.log(`JWT Secret: ${process.env.JWT_SECRET ? 'Configured' : 'Not configured'}`);
  console.log(`CORS Frontend URL: ${process.env.FRONTEND_URL || 'Not specified'}`);
});