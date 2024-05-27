import mongoose, { Schema, Document } from 'mongoose';

interface CouponModel extends Document {
  coupon: any;
  amount: number;
}

const couponSchema: Schema<CouponModel> = new mongoose.Schema({
  coupon: {
    type: Schema.Types.Mixed, // Using Mixed type for 'any'
    required: [true, 'Please enter the Coupon Code'],
    unique: true,
  },
  amount: {
    type: Number,
    required: [true, 'Please enter the Discount Amount'],
  },
});

export const Coupon = mongoose.model<CouponModel>('Coupon', couponSchema);
