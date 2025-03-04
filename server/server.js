import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
dotenv.config();
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import helmet from 'helmet';
import sequelize from './config/connectDB.js';
import userRouter from './route/user.route.js';
import cartRoutes from "./route/cart.routes.js";

// Initialize Express
const app = express();

// Middleware
app.use(cors({
    credentials: true,
    origin: process.env.FRONTEND_URL
}));
app.use(express.json());
app.use(cookieParser());
app.use(morgan("dev")); // ✅ Fixed morgan issue
app.use(helmet({
    crossOriginResourcePolicy: false
}));

// Set PORT properly
const PORT = process.env.PORT || 8080;

// Test Route
app.get("/", (req, res) => {
    res.json({ message: `Server is running on port ${PORT}` });
});

// Routes
app.use("/api/cart", cartRoutes);
app.use('/api/user', userRouter);

// Sync Database & Start Server
sequelize.sync({ alter: true }) // Sync models
    .then(() => {
        console.log('Database synced');
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    })
    .catch(err => console.error('Error syncing database:', err));
