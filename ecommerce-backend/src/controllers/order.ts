import {Request} from 'express';
import { BaseQuery, NewOrderRequestBody, NewProductRequestBody, SearchRequestQuery } from '../types/types.js';
import { TryCatch } from '../middlewares/error.js';
import { Product } from '../models/product.js';
import ErrorHandler from '../utils/utility-class.js';
import { rm } from 'fs';
import { myCache } from '../app.js';
import { invalidateCache, reduceStock } from '../utils/features.js';
import { Order } from '../models/order.js';

export const newOrder = TryCatch(async (req: Request<{},{},NewOrderRequestBody>, res, next) => {
    const {shippingInfo, user, subtotal, tax, shippingCharges, discount, total, orderItems } = req.body;

    if(!shippingInfo || !user || !subtotal || !tax || !shippingCharges || !discount || !total || !orderItems) {
        return next(new ErrorHandler('Please add all fields', 400)) as any 
    }

    const order =  await Order.create({shippingInfo, user, subtotal, tax, shippingCharges, discount, total, orderItems });

    await reduceStock(orderItems);

    // await invalidateCache({product: true})

    return res.status(201).send({
        success: true,
        message: "Order placed successfully",
        data: order
    })
})

export const myOrders = TryCatch(async (req, res, _next) => {
    const {id: user} = req.query;

    const orders = await Order.find({ user })

    return res.status(200).json({
        success: true,
        message: 'Orders fetched successfully',
        data: orders,
    })
})