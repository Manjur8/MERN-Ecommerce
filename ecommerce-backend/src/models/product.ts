import mongoose from "mongoose";

interface IProduct extends Document {
    name: string,
    photo: string,
    category: string,
    price: number,
    stock: number,
    createdAt: Date,
    updatedAt: Date,
}

const schema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Name is required"],
        },
        photo: {
            type: String,
            required: [true, "Photo is required"],
        },
        category: {
            type: String,
            required: [true, "Category is required"],
            trim: true,
        },
        price: {
            type: Number,
            required: [true, 'Price is required'],
        },
        stock: {
            type: Number,
            required: [true, 'Stock is required'],
        }
    },
    {
        timestamps: true,
    }
)

export const Product = mongoose.model<IProduct>("Product", schema)