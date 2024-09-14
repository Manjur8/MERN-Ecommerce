import mongoose from "mongoose";
import validator from 'validator';
const schema = new mongoose.Schema({
    _id: {
        type: String,
        required: [true, "ID is required"]
    },
    name: {
        type: String,
        required: [true, "Name is required"]
    },
    email: {
        type: String,
        unique: [true, "This email is already present"],
        required: [true, "Email ID is required"],
        validate: validator.default.isEmail,
    },
    photo: {
        type: String,
        required: [true, "Photo is required"]
    },
    role: {
        type: String,
        enum: ["admin", "user"],
        default: "user"
    },
    gender: {
        type: String,
        enum: ["male", 'female'],
        required: [true, 'Gender is required']
    },
    dob: {
        type: Date,
        required: [true, 'Date of birth is required']
    }
}, {
    timestamps: true
});
schema.virtual("age").get(function () {
    const today = new Date();
    const dob = this.dob;
    let age = today.getFullYear() - dob.getFullYear();
    if (today.getMonth() < dob.getMonth() || (today.getMonth() === dob.getMonth() && today.getDate() < dob.getDate())) {
        age--;
    }
    return age;
});
export const User = mongoose.model("User", schema);
