import { DeleteResult } from "mongodb";
import { SeasonModel } from "../season/season";
import { Tournament, TournamentModel } from "./tournament";

/**
 * @Hidden
 */
export type TournamentCreationParams = Pick<Tournament, "name" | "dates" | "teamfee" | "playerfee" | "currency">

export class TournamentService {

    public async getAll(): Promise<Tournament[]> {
        return TournamentModel.find()
    }

    public async get(id: number): Promise<Tournament | null> {
        return TournamentModel.findOne({ id: id }).exec()
    }

    public async create(tournamentCreationParams: TournamentCreationParams): Promise<Tournament> {
        const item = {
            id: await this.findUnusedID(),
            ...tournamentCreationParams
        }
        return new TournamentModel(item).save()
    }

    public async delete(id: number, cascade: boolean = false): Promise<DeleteResult> {
        // Make sure the tournament isn't owned by a season
        const seasons_with_tournament = await SeasonModel.find({ tournaments: { $in: [id] } }).exec()
        if (seasons_with_tournament.length > 0) {
            if (!cascade) {
                console.log(`Tournament ${id} is owned by a season, not deleting.`)
                return { acknowledged: true, deletedCount: 0 }
            }

            seasons_with_tournament.map(async (season) => {
                season.tournaments = season.tournaments.filter((tournament) => tournament !== id)
                await season.save()
            })
        }
        return await TournamentModel.deleteOne({ id: id })
    }

    public async findUnusedID(): Promise<number> {
        const newest = await TournamentModel.findOne().sort({ 'created_at': -1 }).exec()
        if (newest === null) {
            return 1
        } else {
            return newest.id + 1
        }
    }
}