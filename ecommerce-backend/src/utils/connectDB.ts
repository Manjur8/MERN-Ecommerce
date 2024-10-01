import mongoose from 'mongoose';

export const connectDB = (uri: string) => {
    const MONGO_URI=uri
    mongoose.connect(MONGO_URI, {
        dbName: 'Ecommerce',
    }).then((c) => {
        console.log(`DB connected successfully to ${c.connection.host}`)
    }).catch(err => {
        console.log(err)
    })
}