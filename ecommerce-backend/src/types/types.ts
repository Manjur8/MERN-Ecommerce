import { NextFunction, Request, Response } from "express"

export interface NewUserRequestBody {
    _id: string,
    name: string,
    email: string,
    photo: string,
    gender: string,
    dob: Date,
    role: 'admin' | 'user',
}

export interface NewProductRequestBody {
    name: string,
    category: string,
    price: number,
    stock: number,
}

export type ControllerType = (
    req: Request,
    res: Response,
    next: NextFunction
) => Promise<void | Response<any, Record<string, any>>>

export type SearchRequestQuery = {
    search?: string,
    category?: string,
    price?: string,
    sort?: string,
    page?: string,
}

export interface BaseQuery {
    name?: {
        $regex: string;
        $options: string;
    };
    price?: {
        $lte: number;
    };
    category?: string
}

export interface InvalidateCacheProps {
    product?: boolean
    order?: boolean
    admin?: boolean
    userId?: string
    productId?: string[]
}


// =========Order types===========
export type OrderItemType = {
    name: string;
    photo: string;
    price: number;
    quantity: number;
    productId: string;
};

export type ShippingInfoType = {
    address: string;
    city: string;
    state: string;
    country: string;
    pinCode: number;
};
export interface NewOrderRequestBody {
    shippingInfo: ShippingInfoType;
    user: string;
    subtotal: number;
    tax: number;
    shippingCharges: number;
    discount: number;
    total: number;
    orderItems: OrderItemType[];
}