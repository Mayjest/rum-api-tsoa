import mongoose from "mongoose";
import { Division } from "../division/division";

export interface Training {
    id: number;
    date: Date;
    /**
     * @example: "Bohunt School"
     */
    location: string;
    /**
     * @example: 9
     */
    price: number;
    /**
     * i.e Is it open to all or restricted?
     * If invite/elite it's false, for example
     * @example: false
     */
    invitational: boolean;

    /**
     * @example "Beginner" or "Elite"
     */
    level?: string;
    /**
     * @example ["Mixed", "Open", "Womens"]
     */
    divisions?: Division[];
}

const TrainingSchema = new mongoose.Schema<Training>({
    id: { type: Number, required: true },
    date: { type: Date, required: true },
    location: { type: String, required: true },
    price: { type: Number, required: true },
    invitational: { type: Boolean, required: true },
    level: { type: String, required: false },
    divisions: { type: [String], required: false }
})

export const TrainingModel = mongoose.model<Training>('Training', TrainingSchema)