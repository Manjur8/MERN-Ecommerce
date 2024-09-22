import {Request} from 'express';
import { NewProductRequestBody } from '../types/types.js';
import { TryCatch } from '../middlewares/error.js';
import { Product } from '../models/product.js';
import ErrorHandler from '../utils/utility-class.js';
import { rm } from 'fs';

export const newProduct = TryCatch(async (req: Request<{},{},NewProductRequestBody>, res, next) => {
    const {name, stock, price, category } = req.body;
    const photo = req.file

    if(!photo) return next(new ErrorHandler('Please add photo', 400)) as any

    if(!name || !stock || !price || !category) {
        rm(photo.path, () => {
            console.log('Photo deleted')
        })
        return next(new ErrorHandler('Please add all fields', 400)) as any 
    }

    const product =  await Product.create({name, stock, price, category: category.toLowerCase(), photo: photo.path});

    return res.status(201).send({
        success: true,
        message: "Product added successfully",
        data: product
    })
})