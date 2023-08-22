import mongoose from "mongoose";

export interface Season {
    id: number,
    year: number,
    tournamentIDs: number[]
    teamIDs: number[]
    trainingIDs: number[]

}

const SeasonSchema = new mongoose.Schema<Season>({
    id: { type: Number, required: true },
    year: { type: Number, required: true },
    tournamentIDs: [{ type: Number, required: false }],
    teamIDs: [{ type: Number, required: false }],
    trainingIDs: [{ type: Number, required: false }]
})

export const SeasonModel = mongoose.model<Season>('Season', SeasonSchema)