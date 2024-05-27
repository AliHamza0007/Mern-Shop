import express from 'express';
import { IsAdmin } from '../middlewares/Auth.js';
import { getBarCharts, getDashboardStats, getLineCharts, getPieCharts, } from '../controllers/StatsController.js';
const app = express.Router();
// route - /api/v1/dashboard/stats
app.get('/stats', IsAdmin(), getDashboardStats);
// route - /api/v1/dashboard/pie
app.get('/pie', IsAdmin(), getPieCharts);
// route - /api/v1/dashboard/bar
app.get('/bar', IsAdmin(), getBarCharts);
// route - /api/v1/dashboard/line
app.get('/line', IsAdmin(), getLineCharts);
export default app;
