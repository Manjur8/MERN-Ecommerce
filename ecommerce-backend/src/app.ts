import express from "express";

import NodeCache from "node-cache";
import { config } from "dotenv";

// =====impoting routes===
import userRoute from './routes/user.js'
import productRoute from './routes/product.js'
import orderRoute from './routes/order.js'
import paymentRoute from './routes/payment.js'
import dashboardRoute from './routes/stats.js'
import { connectDB } from "./utils/connectDB.js";
import { customError } from "./middlewares/error.js";

config({
    path: './.env',
})


const port = process.env.PORT;
const MONGO_URI="mongodb://localhost:27017/";
const app = express()
app.use(express.json())

connectDB(MONGO_URI)

export const myCache = new NodeCache()

// ====using rotes====
app.use("/api/v1/user", userRoute)
app.use("/api/v1/product", productRoute)
app.use("/api/v1/order", orderRoute)
app.use("/api/v1/payment", paymentRoute)
app.use("/api/v1/dashboard", dashboardRoute)

app.use('/uploads', express.static('uploads'));
app.use(customError)

app.listen(port, () => {
    console.log(`Server started on http://localhost:${port}`)
})