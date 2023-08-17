import mongoose from "mongoose";

/**
 * Tournament objects hold the basic information for a tournament 
 * & their default costs. Other costs & players/teams can use the 
 * ID to track when they're used. Recurring tournaments should have 
 * multiple unique tournaments in the DB.
 */
export interface Tournament {
    id: number;
    /**
     * @example "Windmill"
     */
    name: string;
    /**
     * Simple date to differentiate versions of the same tournament
     * 
     * @example "May 2023"
     */
    dates: string;
    /**
     * @isInt Must be a whole number (not supporting pennies/cents for now)
     */
    teamfee: number;
    /**
     * @isInt Must be a whole number
     */
    playerfee: number;
    currency: string;
}

const TournamentSchema = new mongoose.Schema<Tournament>({
    id: { type: Number, required: true },
    name: { type: String, required: true },
    dates: { type: String, required: true },
    teamfee: { type: Number, required: false },
    playerfee: { type: Number, required: false },
    currency: { type: String, required: false, default: "£" }
})

export const TournamentModel = mongoose.model<Tournament>('Tournament', TournamentSchema)
