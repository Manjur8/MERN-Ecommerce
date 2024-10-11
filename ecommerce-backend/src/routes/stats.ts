import express from 'express';
import { getDashboardStats } from '../controllers/stats.js';
import { isAdminOnly } from '../middlewares/auth.js';

const app = express.Router();

app.get('/stats', isAdminOnly, getDashboardStats)

export default app;