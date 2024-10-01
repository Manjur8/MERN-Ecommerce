import {Request} from 'express';
import { BaseQuery, NewOrderRequestBody, NewProductRequestBody, SearchRequestQuery } from '../types/types.js';
import { TryCatch } from '../middlewares/error.js';
import { Product } from '../models/product.js';
import ErrorHandler from '../utils/utility-class.js';
import { rm } from 'fs';
import { myCache } from '../app.js';
import { invalidateCache, reduceStock } from '../utils/features.js';
import { Order } from '../models/order.js';

export const myOrders = TryCatch(async (req, res, _next) => {
    const {id: user} = req.query;

    let orders;

    if(myCache.has(`my-orders-${user}`)) {
        orders = JSON.parse(myCache.get(`my-orders-${user}`)!)
    } else {
        orders = await Order.find({ user })
        myCache.set(`my-orders-${user}`, JSON.stringify(orders))
    }


    return res.status(200).json({
        success: true,
        message: 'Orders fetched successfully',
        data: orders,
    })
})

export const allOrders = TryCatch(async (req, res, _next) => {

    let orders;

    if(myCache.has(`all-orders`)) {
        orders = JSON.parse(myCache.get(`all-orders`)!)
    } else {
        orders = await Order.find().populate("user", ["name", "email"])
        myCache.set(`all-orders`, JSON.stringify(orders))
    }


    return res.status(200).json({
        success: true,
        message: 'Orders fetched successfully',
        data: orders,
    })
})

export const getOrderById = TryCatch(async (req, res, next) => {
    const id = req.params.id

    let order;

    if(myCache.has(`order-${id}`)) {
        order = JSON.parse(myCache.get(`order-${id}`)!)
    } else {
        order = await Order.findById(id).populate("user", ["name", "email"]);
        myCache.set(`order-${id}`, JSON.stringify(order))
    }


    if(!order) return next(new ErrorHandler("Order not found", 404));

    return res.json({
        success: true,
        message: 'Order fetched successfully',
        data: order,
    })
})

export const newOrder = TryCatch(async (req: Request<{},{},NewOrderRequestBody>, res, next) => {
    const {shippingInfo, user, subtotal, tax, shippingCharges, discount, total, orderItems } = req.body;

    if(!shippingInfo || !user || !subtotal || !tax || !shippingCharges || !discount || !total || !orderItems) {
        return next(new ErrorHandler('Please add all fields', 400)) as any 
    }

    const order =  await Order.create({shippingInfo, user, subtotal, tax, shippingCharges, discount, total, orderItems });

    await reduceStock(orderItems);

    await invalidateCache({product: true, order: true, admin: true, userId: user})

    return res.status(201).send({
        success: true,
        message: "Order placed successfully",
        data: order
    })
})

export const updateOrder = TryCatch(async (req, res, next) => {
    const id = req.params.id

    const order = await Order.findById(id)

    if(!order) return next(new ErrorHandler("Order not found", 404))

    switch(order.status) {
        case "Processing":
            order.status = "Shipped";
            break;
        case "Shipped":
            order.status = "Delivered";
            break;
        default: order.status = "Delivered";
    }

    const updatedOrder = await order.save();

    await invalidateCache({product: false, order: true, admin: true, userId: order?.user})

    return res.status(200).send({
        success: true,
        message: "Status Updated successfully",
        data: updatedOrder
    })
})

export const deleteOrder = TryCatch(async (req, res, next) => {
    const id = req.params.id

    const order = await Order.findById(id)

    if(!order) return next(new ErrorHandler("Order not found", 404))

    await order.deleteOne()

    await invalidateCache({product: false, order: true, admin: true, userId: order?.user})

    return res.status(200).send({
        success: true,
        message: "Order deleted successfully",
    })
})