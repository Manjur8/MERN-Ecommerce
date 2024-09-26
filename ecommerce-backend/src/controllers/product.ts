import {Request} from 'express';
import { BaseQuery, NewProductRequestBody, SearchRequestQuery } from '../types/types.js';
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

export const getLatestProducts = TryCatch(async (req, res, next) => {
    const products = await Product.find({}).sort({createdAt: -1}).limit(5);

    return res.json({
        success: true,
        message: 'Latest products fetched successfully',
        data: products,
    })
})

export const getAllCategories = TryCatch(async (req, res, next) => {
    const categories = await Product.distinct("category");

    return res.json({
        success: true,
        message: 'Catgegories fetched successfully',
        data: categories,
    })
})

export const getAdminProducts = TryCatch(async (req, res, next) => {
    const products = await Product.find({});

    return res.json({
        success: true,
        message: 'Products fetched successfully',
        data: products,
    })
})

export const getProductById = TryCatch(async (req, res, next) => {
    const product = await Product.findById(req.params.id);

    return res.json({
        success: true,
        message: 'Product fetched successfully',
        data: product,
    })
})

export const updateProduct = TryCatch(async (req, res, next) => {
    const {id} = req.params
    const {name, stock, price, category } = req.body;
    const photo = req.file

    const product = await Product.findById({_id: id})

    if(!product) return next(new ErrorHandler("Product not found", 400));
    
    if(photo) {
        rm(photo.path, () => {
            console.log('Old Photo deleted')
        })
        product.photo = photo.path
    }
    
    if(name) product.name = name;
    if(stock) product.stock = stock;
    if(price) product.price = price;
    if(category) product.category = category;
    
    await product.save()
    
    return res.status(200).send({
        success: true,
        message: "Product updated successfully",
        data: product
    })
})

export const deleteProduct = TryCatch(async (req, res, next) => {
    const product = await Product.findById({_id: req.params.id});
    
    if(!product) return next(new ErrorHandler("Product not found", 400));

    rm(product.photo, () => {
        console.log("Product photo deleted")
    })

    await product.deleteOne()

    return res.json({
        success: true,
        message: 'Product deleted successfully',
    })
})

export const getAllProducts = TryCatch(async (req: Request<{}, {}, {}, SearchRequestQuery>, res, next) => {

    const {search, sort, price, category } = req.query;

    const page = Number(req.query.page) || 1
    const limit = Number(process.env.PER_PAGE) || 10
    const skip = (page - 1) * limit;

    const baseQuery: BaseQuery = {}

    if(search) {
        baseQuery.name = {
            $regex: search,
            $options: "i",
        }
    }

    if(price) {
        baseQuery.price = {
            $lte: Number(price)
        }
    }

    if(category) {
        baseQuery.category = category
    }

    const productsPromise = await Product.find(baseQuery).sort(sort && {price: sort==='asc' ? 1 : -1}).limit(limit).skip(skip);

    const [products, filteredProducts] = await Promise.all([
        productsPromise,
        await Product.find(baseQuery),
    ])

    const totalPage = Math.ceil(filteredProducts.length / limit)

    return res.json({
        success: true,
        message: 'Latest products fetched successfully',
        data: {
            total_page: totalPage,
            per_page: limit,
            current_page: page,
            data: products,
        },
    })
})
