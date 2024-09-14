import mongoose from 'mongoose';

export const connectDB = () => {
    const MONGO_URI="mongodb://localhost:27017/"
    mongoose.connect(MONGO_URI, {
        dbName: 'Ecommerce',
    }).then((c) => {
        console.log(`DB connected successfully to ${c.connection.host}`)
    }).catch(err => {
        console.log(err)
    })
}