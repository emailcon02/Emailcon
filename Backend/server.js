import express from 'express';
import cors from 'cors';
import studentRoutes from './routes/MainRoutes.js';
import connectDB from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import dotenv from 'dotenv';
import './config/cron-scheduler.js';
import './config/cron-birthday.js';
import './config/cron-userexpiry.js';
import createOrderRoute from './routes/create-order.js';

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

// Middleware - CORRECTED VERSION
app.use(cors());
app.use(express.json({ limit: '100mb' })); // For JSON payloads
app.use(express.urlencoded({ limit: '100mb', extended: true })); // For URL-encoded data


// Routes
app.use('/stud', studentRoutes);
app.use('/auth', authRoutes);
app.use('/admin', adminRoutes);
app.use("/order", createOrderRoute);

app.get('/', (req, res) => {
    res.json('Hello');
});

// Error Handling
app.use((req, res) => {
    res.status(404).json({ message: 'Route not found' });
});

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Internal Server Error' });
});

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));