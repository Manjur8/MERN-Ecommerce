import express from "express";
import { newUser, getAllUsers, getUserById, deleteUserById } from "../controllers/user.js";
import { deleteProduct, getAdminProducts, getAllCategories, getLatestProducts, getProductById, newProduct, updateProduct } from "../controllers/product.js";
import { singleUpload } from "../middlewares/multer.js";
import { isAdminOnly } from "../middlewares/auth.js";

const app = express.Router();

// ==route:- post- /api/v1/product/create=====
app.post("/create", isAdminOnly, singleUpload, newProduct)

// ==route:- get- /api/v1/product/latest=====
app.get("/latest", getLatestProducts)

// ==route:- get- /api/v1/product/categories=====
app.get("/categories", getAllCategories)

// ==route:- get- /api/v1/product/admin-products=====
app.get("/admin-products", isAdminOnly, getAdminProducts)

// ====/api/v1/product/${id}===========
app.route("/:id").get(getProductById).put(isAdminOnly, singleUpload, updateProduct).delete(isAdminOnly, deleteProduct)

export default app;