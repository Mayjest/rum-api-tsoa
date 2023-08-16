import { Tournament } from "./tournament";

export type TournamentCreationParams = Pick<Tournament, "name" | "dates" | "teamfee"| "playerfee" | "currency">

export class TournamentService {
    public get(id: number, name?: string): Tournament {
        return {
            id,
            name: name ?? "Windmill",
            dates: "May 2023",
            teamfee: 200,
            playerfee: 20,
            currency: "€"
        }
    }

    public create (tournamentCreationParams: TournamentCreationParams): Tournament {
        return {
            id: Math.floor(Math.random() * 10000),
            ...tournamentCreationParams
        }
    }
}