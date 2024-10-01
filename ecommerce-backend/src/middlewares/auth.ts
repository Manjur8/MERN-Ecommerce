import { User } from "../models/user.js";
import ErrorHandler from "../utils/utility-class.js";
import { TryCatch } from "./error.js";

export const isAdminOnly = TryCatch(async(req, res, next) => {
    const id = req.query.id
    const user = await User.findById(id);
    if(!id || !user) return next(new ErrorHandler('Unauthorized', 401)) as any
    
    if(user.role !== 'admin') {
        return next(new ErrorHandler('Permission not found', 403)) as any
    }

    next()
})