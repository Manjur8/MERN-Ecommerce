import express from 'express';
import { getDashboardStats, getPieCharts } from '../controllers/stats.js';
import { isAdminOnly } from '../middlewares/auth.js';

const app = express.Router();

// ==route:- post- /api/v1/dashboard/stats=====
app.get('/stats', isAdminOnly, getDashboardStats)

// ==route:- post- /api/v1/dashboard/pie=====
app.get('/pie', isAdminOnly, getPieCharts)

export default app;