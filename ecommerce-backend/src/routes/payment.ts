import express from "express";
import { allCoupons, applyDiscount, deleteCoupon, newCoupon } from "../controllers/payment.js";
import { isAdminOnly } from "../middlewares/auth.js";

const app = express.Router();

// ==route:- post- /api/v1/payment/discount=====
app.get('/coupon/discount', applyDiscount)

// ==route:- post- /api/v1/payment/discount=====
app.get('/coupon/all', isAdminOnly, allCoupons)

// ==route:- post- /api/v1/payment/coupon/create=====
app.post('/coupon/create', isAdminOnly, newCoupon)


// ==route:- post- /api/v1/payment/discount=====
app.delete('/coupon/delete/:id', isAdminOnly, deleteCoupon)

export default app;