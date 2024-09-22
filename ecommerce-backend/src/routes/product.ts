import express from "express";
import { newUser, getAllUsers, getUserById, deleteUserById } from "../controllers/user.js";
import { newProduct } from "../controllers/product.js";

const app = express.Router();

// ==route:- post- /api/v1/product/create=====
app.post("/create", newProduct)

export default app;