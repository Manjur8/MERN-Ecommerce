import {Request, Response, NextFunction} from 'express';
import { NewUserRequestBody } from '../types/types.js';
import { User } from '../models/user.js';
import { TryCatch } from '../middlewares/error.js';
import ErrorHandler from '../utils/utility-class.js';

export const newUser = TryCatch(async (req: Request<{},{},NewUserRequestBody>, res: Response, next: NextFunction) => {
    const {name, email, photo, gender, _id, dob} = req.body;

    let user = await User.findById({_id});

    if(user) {
        return res.status(200).json({
            success: true,
            message: `Welcome ${name}`,
        })
    }

    if(!_id || !name || !email || !photo || !gender || !dob )
        return next(new ErrorHandler('Please add all fields', 400)) as any;

    user =  await User.create({name, email, photo, gender, _id, dob: new Date(dob)});

    return res.status(201).send({
        success: true,
        message: "User created successfully"
    })
})

export const getAllUsers = TryCatch(async(req: Request<{},{},NewUserRequestBody>, res: Response, next: NextFunction) => {
    const allUsers = await User.find({})

    return res.status(200).json({
        success: true,
        message: 'Users fetched successfully',
        data: allUsers,
    })
})

export const getUserById = TryCatch(async(req: any, res, next) => {
    const id = req.params.id
    const user = await User.findById(id)

    if(!user) return next(new ErrorHandler('No user found', 400)) as any

    return res.status(200).json({
        success: true,
        message: 'User fetched successfully',
        data: user,
    })
})

export const deleteUserById = TryCatch(async(req: any, res, next) => {
    const id = req.params.id
    const user = await User.findById(id)

    if(!user) return next(new ErrorHandler('No user found', 400)) as any

    await user.deleteOne()

    return res.status(200).json({
        success: true,
        message: 'User deleted successfully',
        data: user,
    })
})