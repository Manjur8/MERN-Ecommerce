import { myCache } from "../app.js";
import { Product } from "../models/product.js";
import { InvalidateCacheProps, OrderItemType } from "../types/types.js";

export const invalidateCache = async ({product, order, admin} : InvalidateCacheProps) => {
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

    if(order) {

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