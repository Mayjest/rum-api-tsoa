import mongoose from "mongoose";
import { Division } from "../division/division";

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
    /**
     * The currency the tournament is charged in
     * May just get rid of this & not have an exchange rate facility thing
     * 
     * @example "€"
     */
    currency: string;
    /**
     * The division(s) available at the tournament
     * @example [Division.Mixed, Division.Womens]
     */
    divisions: Division[];
}

const TournamentSchema = new mongoose.Schema<Tournament>({
    id: { type: Number, required: true },
    name: { type: String, required: true },
    dates: { type: String, required: true },
    teamfee: { type: Number, required: false },
    playerfee: { type: Number, required: false },
    currency: { type: String, required: false, default: "£" },
    divisions: { type: [String], required: true }
})

export const TournamentModel = mongoose.model<Tournament>('Tournament', TournamentSchema)
