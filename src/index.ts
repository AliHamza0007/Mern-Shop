import express, { Request, Response, NextFunction } from 'express';
import dotenv from 'dotenv';
import NodeCache from 'node-cache';
import morgan from 'morgan';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import Stripe from 'stripe';
import { errorMiddleware } from './middlewares/Error.js';
import { ConnectDB } from './utils/Features.js';

// importing Routes
import UserRoute from './routes/UserRoutes.js';
import OrderRoute from './routes/OrderRoutes.js';
import ProductRoute from './routes/ProductRoutes.js';
import PaymentRoute from './routes/PaymentRoutes.js';
import StatsRoutes from './routes/StatsRoutes.js';

// configurations
dotenv.config();
ConnectDB();
const app = express();
app.use(express.json());
app.use(cors());
app.use(morgan('dev'));

// importing key or Urls and Ports
const stripeKey = process.env.STRIPE_KEY || '';
const PORT: string | number = process.env.PORT || 8000;
const ApiVersion = process.env.ApiVersion;

// export module
export const stripe = new Stripe(stripeKey);
export const myCache = new NodeCache();

// home Route for testing server
app.get('/', (req, res) => {
  res.send('Server Is Working ,This is a Proof Of Service...');
});

// sending Static Folder for getting imagers online
const __dirname = path.dirname(fileURLToPath(import.meta.url));
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// API's User Routes
app.use(ApiVersion + '/user', UserRoute);
app.use(ApiVersion + '/product', ProductRoute);
app.use(ApiVersion + '/order', OrderRoute);
app.use(ApiVersion + '/payment', PaymentRoute);
app.use(ApiVersion + '/dashboard', StatsRoutes);

// Error handler Middleware
app.use(errorMiddleware);

// Server is Start
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
