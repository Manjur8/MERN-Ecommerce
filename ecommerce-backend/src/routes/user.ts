import express from "express";
import { newUser, getAllUsers, getUserById, deleteUserById } from "../controllers/user.js";

const app = express.Router();

// ==route:- post- /api/user/create=====
app.post("/create", newUser)

// ==route:- get- /api/user/view-all=====
app.get("/view-all", getAllUsers)

// ==route:- get- /api/user/view-all/${id}=====
app.route("/:id").get(getUserById).delete(deleteUserById)

export default app;