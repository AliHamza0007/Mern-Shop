import express from 'express';
import { getAllCoupons, applyDiscount, createPaymentIntent, deleteCoupon, newCoupon, updateCoupon, } from '../controllers/PaymentController.js';
import { IsAdmin } from '../middlewares/Auth.js';
const Router = express.Router();
// route - /api/v1/payment/create
Router.post('/create', createPaymentIntent);
// route - /api/v1/payment/coupon/new
Router.get('/discount/', applyDiscount);
// route - /api/v1/payment/coupon
Router.route('/coupon/')
    .post(IsAdmin(), newCoupon)
    .get(IsAdmin(), getAllCoupons);
// route - /api/v1/payment/coupon/:id
Router.route('/coupon/:id')
    .put(IsAdmin(), updateCoupon)
    .delete(IsAdmin(), deleteCoupon);
export default Router;
