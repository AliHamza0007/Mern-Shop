import mongoose, { Schema } from 'mongoose';
const couponSchema = new mongoose.Schema({
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
export const Coupon = mongoose.model('Coupon', couponSchema);
