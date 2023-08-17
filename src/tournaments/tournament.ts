/**
 * Tournament objects hold the basic information for a tournament 
 * & their default costs. Other costs & players/teams can use the 
 * ID to track when they're used. Recurring tournaments should have 
 * multiple unique tournaments in the DB.
 * 
 * 
 * @example {
 *  "id": "1"
 *  "name": "Windmill"
 *  "dates": "May 2023"
 *  "teamfee": "200"
 *  "playerfee": "20"
 *  "currency": "€"
 * }
 */
export interface Tournament {
    id: number;
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