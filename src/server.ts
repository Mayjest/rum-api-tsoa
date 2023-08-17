// src/server.ts

import mongoose from 'mongoose';
import { app } from "./app";
import { connectMongo } from "./lib/mongoHelper";

const port = process.env.PORT || 3000;
const database = "rum-api-db"
const mongoUrl = `mongodb://127.0.0.1:27017/${database}`

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
    connectMongo(mongoUrl)

    mongoose.connection.on('open', () => {
        console.log("Mongo Connected")
    })
    mongoose.connection.on('error', () => {
        console.log("Error Mongo Connect")
    })
});