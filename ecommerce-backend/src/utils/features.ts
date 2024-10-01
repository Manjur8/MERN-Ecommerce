import { myCache } from "../app.js";
import { Order } from "../models/order.js";
import { Product } from "../models/product.js";
import { InvalidateCacheProps, OrderItemType } from "../types/types.js";

export const invalidateCache = async ({product, order, admin, userId} : InvalidateCacheProps) => {
    if(product) {
        const productKeys: string[] = [
            'latest-products',
            'categories',
            'all-products'
        ];

        const products = await Product.find({}).select("_id")

        products.forEach(item => {
            productKeys.push(`product-${item?._id}`)
        })

        myCache.del(productKeys)
    }

    // =====If order is true, userId is must to wotk the function=====
    if(order) {
        const orderKeys = ["all-orders", `my-orders-${userId}`]

        const orders = await Order.find({}).select("_id")

        orders.forEach((item) => {
            orderKeys.push(`order-${item?._id}`)
        })

        myCache.del(orderKeys);
    }

    if(admin) {

    }
}

export const reduceStock = async (orderItems: OrderItemType[]) => {
    for(let i=0; i<orderItems.length; i++) {
        const order = orderItems[i];
        const product = await Product.findById(order.productId);
        if(!product) return new Error("Product not found");
        product.stock -= orderItems.length;
        product.save();
    }
}