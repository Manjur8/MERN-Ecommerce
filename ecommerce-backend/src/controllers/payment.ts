import { TryCatch } from "../middlewares/error.js";
import { Coupon } from "../models/coupon.js";
import ErrorHandler from "../utils/utility-class.js";

export const newCoupon = TryCatch(async(req, res, next) => {
    const {coupon, amount} = req.body

    if(!coupon) return next(new ErrorHandler('Coupon Code is required', 400))
    if(!amount) return next(new ErrorHandler('Coupon Amount is required', 400))

    await Coupon.create({ code: coupon, amount })

    return res.status(201).json({
        success: true,
        message: `Coupon ${coupon} is created successfully`,
    })
})

export const applyDiscount = TryCatch(async(req, res, next) => {
    const {coupon} = req.query

    if(!coupon) return next(new ErrorHandler('Coupon Code is required', 400))

    const couponResp= await Coupon.findOne({code: coupon});

    if(!couponResp) return next(new ErrorHandler('Coupon Code is invalid', 400))

    return res.status(200).json({
        success: true,
        message: `Discount is applied successfully`,
        data: {
            discount: couponResp.amount
        }
    })
})

export const allCoupons = TryCatch(async (req, res, next) => {
    const coupons = await Coupon.find({});

    return res.status(201).json({
        succrss: true,
        message: "Coupons fetched successfully",
        data: coupons,
    })
})

export const deleteCoupon = TryCatch(async(req, res, next) => {
    const {id} = req.params

    if(!id) return next(new ErrorHandler('Coupon ID is required', 400))

   const coupon = await Coupon.findByIdAndDelete(id)

   if(!coupon) return next(new ErrorHandler('Coupon ID is invalid', 400))

    return res.status(200).json({
        success: true,
        message: `Coupon ${coupon.code} is deleted successfully`,
    })
})