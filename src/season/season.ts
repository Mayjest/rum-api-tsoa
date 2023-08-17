import mongoose from "mongoose";

export interface Season {
    id: number,
    year: number,
    tournaments: number[]
}

const SeasonSchema = new mongoose.Schema<Season>({
    id: { type: Number, required: true },
    year: { type: Number, required: true },
    tournaments: [{ type: Number, required: false }]
})

export const SeasonModel = mongoose.model<Season>('Season', SeasonSchema)