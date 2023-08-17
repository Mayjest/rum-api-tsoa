import mongoose from 'mongoose';

const connectMongo = async (mongoUrl: string): Promise<void> => {
    await mongoose.connect(mongoUrl)
        .then(() => { console.log("Connected MongoDB (Helper)") })
        .catch(err => { console.log("Error Connect MongoDB (Helper)", err) })
}

const closeMongo = async (): Promise<void> => {
    await mongoose.disconnect()
}

export { connectMongo, closeMongo }