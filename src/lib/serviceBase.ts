import mongoose from "mongoose";

export class ServiceBase {

    async findUnusedID(model: mongoose.Model<any>) {
        const newest = await model.findOne().sort({ 'created_at': -1 }).exec()
        if (newest === null) {
            return 1
        } else {
            return newest.id + 1
        }
    }
}