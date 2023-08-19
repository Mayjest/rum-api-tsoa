import { DeleteResult } from "mongodb";
import { SeasonModel } from "../season/season";
import { Tournament, TournamentModel } from "./tournament";

/**
 * @Hidden
 */
export type TournamentCreationParams = Pick<Tournament, "name" | "dates" | "teamfee" | "playerfee" | "currency">

/**
 * The result of a delete operation
 */
export type TournamentDeleteResult = {
    /**
     * Whether the delete operation succeeded
     */
    succeeded: boolean,
    /**
     * If the season is deleted, will be the DeleteResult from mongo. Else null
     */
    deleteResult: DeleteResult | null,
    /**
     * Array of season IDs that referred to this tournament. If cascade was used they will have been updated
     * to remove the ID. If it wasn't used then these tournaments are blocking the delete.
     */
    seasonsAffected: number[]
}

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

    public async delete(id: number, cascade: boolean = false): Promise<TournamentDeleteResult> {
        // Make sure the tournament isn't owned by a season
        const seasons_with_tournament = await SeasonModel.find({ tournaments: { $in: [id] } }).exec()
        if (seasons_with_tournament.length > 0) {
            if (!cascade) {
                console.log(`Tournament ${id} is owned by a season, not deleting.`)
                return { succeeded: false, deleteResult: null, seasonsAffected: seasons_with_tournament.map((season) => season.id) }
            }

            seasons_with_tournament.map(async (season) => {
                season.tournaments = season.tournaments.filter((tournament) => tournament !== id)
                await season.save()
            })
        }
        return { succeeded: true, deleteResult: await TournamentModel.deleteOne({ id: id }), seasonsAffected: seasons_with_tournament.map((season) => season.id) }
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