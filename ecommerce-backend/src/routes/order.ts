import express from "express";
import { newUser, getAllUsers, getUserById, deleteUserById } from "../controllers/user.js";
import { deleteProduct, getAdminProducts, getAllCategories, getAllProducts, getLatestProducts, getProductById, newProduct, updateProduct } from "../controllers/product.js";
import { singleUpload } from "../middlewares/multer.js";
import { isAdminOnly } from "../middlewares/auth.js";
import { myOrders, newOrder } from "../controllers/order.js";

const app = express.Router();

// ==route:- post- /api/v1/order/create=====
app.post("/create", newOrder)

// route - /api/v1/order/my-orders
app.get("/my-orders", myOrders);

export default app;