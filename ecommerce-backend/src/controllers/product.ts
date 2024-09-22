import {Request} from 'express';
import { NewProductRequestBody } from '../types/types.js';
import { TryCatch } from '../middlewares/error.js';
import { Product } from '../models/product.js';

export const newProduct = TryCatch(async (req: Request<{},{},NewProductRequestBody>, res, next) => {
    const {name, stock, price, category } = req.body;
    const photo = req.file


    const product =  await Product.create({name, stock, price, category: category.toLowerCase(), photo: photo?.path});

    return res.status(201).send({
        success: true,
        message: "Product added successfully",
        data: product
    })
})