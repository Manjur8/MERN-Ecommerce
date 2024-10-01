import express from "express";
import { newUser, getAllUsers, getUserById, deleteUserById } from "../controllers/user.js";
import { isAdminOnly } from "../middlewares/auth.js";

const app = express.Router();

// ==route:- post- /api/v1/user/create=====
app.post("/create", newUser)

// ==route:- get- /api/v1/user/view-all=====
app.get("/view-all", isAdminOnly, getAllUsers)

// ==route:- get- /api/v1/user/${id}=====
app.route("/:id").get(isAdminOnly, getUserById).delete(isAdminOnly, deleteUserById)

export default app;