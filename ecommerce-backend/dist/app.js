import express from "express";
// =====impoting routes===
import userRoute from './routes/user.js';
import { connectDB } from "./utils/connectDB.js";
const port = 4000;
const app = express();
app.use(express.json());
connectDB();
// ====using rotes====
app.use("/api/v1/user", userRoute);
app.listen(port, () => {
    console.log(`Server started on http://localhost:${port}`);
});
