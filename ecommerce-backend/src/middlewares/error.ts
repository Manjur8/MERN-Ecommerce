import { NextFunction, Request, Response } from "express";
import ErrorHandler from "../utils/utility-class.js";
import { ControllerType } from "../types/types.js";

export const customError = (err: ErrorHandler, req: Request, res: Response, next: NextFunction) => {
    err.message ||= 'Internal Server Error'
    err.statusCode ||= 500
    
    // ======Mongo Error Message Cusomization=======
    if(err.name === 'CastError') err.message = "Invalid ID"
    if(err.name === 'MongoServerError') err.message = "Email ID is already registered"

    return res.status(err.statusCode).json({
        success: false,
        message: err.message
    })
}

export const TryCatch = (func: ControllerType) => {
        return (req: Request, res: Response, next: NextFunction) => {
            return Promise.resolve(func(req, res, next)).catch(next);
        }
}