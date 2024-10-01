import express from "express";
import { singleUpload } from "../middlewares/multer.js";
import { isAdminOnly } from "../middlewares/auth.js";
import { allOrders, deleteOrder, getOrderById, myOrders, newOrder, updateOrder } from "../controllers/order.js";

const app = express.Router();

// ==route:- post- /api/v1/order/create=====
app.post("/create", newOrder)

// route - /api/v1/order/my-orders
app.get("/my-orders", myOrders);

// route - /api/v1/order/all-orders
app.get("/all-orders", isAdminOnly, allOrders);

// route - /api/v1/order/${order_id}
app.route("/:id").get(getOrderById).put(isAdminOnly, updateOrder).delete(isAdminOnly, deleteOrder);

export default app;