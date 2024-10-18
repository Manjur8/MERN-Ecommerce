import { myCache } from "../app.js";
import { Order } from "../models/order.js";
import { Product } from "../models/product.js";
import { InvalidateCacheProps, OrderItemType } from "../types/types.js";

export const invalidateCache = async ({product, order, admin, userId, orderId, productId} : InvalidateCacheProps) => {
    if(product) {
        const productKeys: string[] = [
            'latest-products',
            'categories',
            'all-products'
        ];

        if(typeof(productId) === 'string') productKeys.push(`product-${productId}`)

        if(typeof(productId) === 'object') productId.forEach((item) => (`product-${item}`))

        myCache.del(productKeys)
    }

    // =====If order is true, userId is must to wotk the function=====
    if(order) {
        const orderKeys = ["all-orders", `my-orders-${userId}`, `order-${orderId}`]

        myCache.del(orderKeys);
    }

    if(admin) {
        myCache.del([
            "admin-stats",
            "admin-pie-charts",
            "admin-bar-charts",
            "admin-line-charts",
        ]);
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

export const calculatePercentage = (thisMonth: number, lastMonth: number) => {
    if(lastMonth === 0) return thisMonth*100;
    return ((thisMonth - lastMonth)/lastMonth)*100;
}

export const getInventoriesCount = async (categories: string[], productCount: number) => {
    const categoriesCountPromises = categories.map((category) => Product.countDocuments({ category }));
    const categoriesCount = await Promise.all(categoriesCountPromises);

    const categoryCountPercentages = categories.map((category, index) => {
        return { [category]: Math.round((categoriesCount[index]/productCount)*100) }
    })

    return categoryCountPercentages
}