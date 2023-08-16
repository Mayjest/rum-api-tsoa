/**
 * Tournament objects hold the basic information for a tournament 
 * & their default costs. Other costs & players/teams can use the 
 * ID to track when they're used. Recurring tournaments should have 
 * multiple unique tournaments in the DB.
 */
export interface Tournament {
    id: number;
    name: string;
    dates: string;
    teamfee: number;
    playerfee: number;
    currency: string;
}