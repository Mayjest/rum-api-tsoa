import { DeleteResult } from "mongodb";
import { SeasonModel } from "../season/season";
import { Tournament, TournamentModel } from "./tournament";
import { ServiceBase } from "../lib/serviceBase";

export type TournamentCreationParams = Omit<Tournament, "id">

export type TournamentUpdateParams = Partial<Tournament>
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

export class TournamentService extends ServiceBase {

    public async getAll(): Promise<Tournament[]> {
        return TournamentModel.find()
    }

    public async get(id: number): Promise<Tournament | null> {
        return TournamentModel.findOne({ id: id }).exec()
    }

    public async create(tournamentCreationParams: TournamentCreationParams): Promise<Tournament> {
        const item = {
            id: await this.findUnusedID(TournamentModel),
            ...tournamentCreationParams
        }
        return new TournamentModel(item).save()
    }

    public async update(id: number, tournamentUpdateParams: TournamentUpdateParams): Promise<Tournament | null> {
        this.checkID(id, tournamentUpdateParams)

        return TournamentModel.findOneAndUpdate({ id: id }, tournamentUpdateParams, { new: true }).exec()
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

}