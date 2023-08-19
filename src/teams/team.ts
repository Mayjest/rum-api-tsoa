import mongoose from "mongoose";
import { Division } from "../division/division";

/**
 * Teams are not a consistent thing for a season - they are a one off event for that specific group of players
 * at that specific tournament. Multiple teams can be created for the same tournament, and using the same division.
 */
export interface Team {
    id: number;
    name: string;
    division: Division;
    tournamentID: number;
    /**
     * The captain of the team
     * Replace this with a direct reference to the player?
     */
    captains: string[];
    spiritCaptains: string[];
}

const TeamSchema = new mongoose.Schema<Team>({
    id: { type: Number, required: true },
    name: { type: String, required: true },
    division: { type: String, required: true },
    tournamentID: { type: Number, required: true },
    captains: { type: [String], required: false },
    spiritCaptains: { type: [String], required: false }
})

export const TeamModel = mongoose.model<Team>('Team', TeamSchema)