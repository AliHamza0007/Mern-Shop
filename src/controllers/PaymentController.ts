import { stripe } from '../index.js';
import { TryCatch } from '../middlewares/Error.js';
import { Coupon } from '../models/CouponModel.js';
import ErrorHandler from '../utils/Utility.class.js';

export const createPaymentIntent = TryCatch(async (req, res, next) => {
  const { amount } = req.body;

  if (!amount) return next(new ErrorHandler('Please enter amount', 400));

  const paymentIntent = await stripe.paymentIntents.create({
    amount: Number(amount) * 100,
    currency: 'PKR',
  });

  return res.status(201).json({
    success: true,
    clientSecret: paymentIntent.client_secret,
  });
});
export const newCoupon = TryCatch(async (req, res, next) => {
  const { coupon, amount } = req.body;
  if (!coupon || !amount)
    return next(new ErrorHandler('Please enter both coupon and amount', 400));

  const response = await Coupon.findOne({ coupon });

  if (response)
    return next(new ErrorHandler(`Already Coupon ${coupon}  Exist`, 400));

  await Coupon.create({ coupon, amount });

  return res.status(201).json({
    success: true,
    message: `Coupon ${coupon} Created Successfully`,
  });
});
export const updateCoupon = TryCatch(async (req, res, next) => {
  const { id } = req.params;
  const { coupon, amount } = req.body;

  const result = await Coupon.findById(id);
  if (!result) return next(new ErrorHandler('Coupon Not Found Sorry', 400));

  if (!coupon || !amount)
    return next(new ErrorHandler('Please enter both coupon and amount', 400));

  await Coupon.findByIdAndUpdate(id, { coupon, amount }, { new: true });

  return res.status(201).json({
    success: true,
    message: `Coupon ${coupon} updated Successfully`,
  });
});

export const applyDiscount = TryCatch(async (req, res, next) => {
  const { coupon } = req.query;

  const discount = await Coupon.findOne({ coupon });

  if (!discount) return next(new ErrorHandler('Invalid Coupon Code', 400));

  return res.status(200).json({
    success: true,
    discount: discount.amount,
  });
});

export const getAllCoupons = TryCatch(async (req, res, next) => {
  const coupons = await Coupon.find({});

  return res.status(200).json({
    success: true,
    coupons,
  });
});

export const deleteCoupon = TryCatch(async (req, res, next) => {
  const { id } = req.params;

  const coupon = await Coupon.findByIdAndDelete(id);

  if (!coupon) return next(new ErrorHandler('Invalid Coupon ID ', 400));

  return res.status(200).json({
    success: true,
    message: `Coupon ${coupon.coupon} Deleted Successfully`,
  });
});
