import { DeleteResult } from "mongodb";
import { SeasonService } from "../season/seasonService";
import { ServiceBase } from "../lib/serviceBase";
import { Tournament, TournamentModel } from "./tournament";

export type TournamentCreationParams = Omit<Tournament, "id">

export type TournamentUpdateParams = Partial<Tournament>

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

    /**
     * 
     * @param id ID of the tournament to delete
     * @param cascade Where to cascade delete to seasons (DANGER!)
     * @returns Promise<DeleteResult>. If acknowledged == false but deletedCount > 0, 
     *          it means it was referred to by a season but could not cascade delete
     */
    public async delete(id: number, cascade: boolean = false): Promise<DeleteResult> {
        // Make sure the tournament isn't owned by a season

        const seasons_with_tournament = await new SeasonService().getSeasonIDsByTournamentID(id)
        if (seasons_with_tournament.length > 0) {
            if (!cascade) {
                console.log(`Tournament ${id} is owned by a season, not deleting.`)
                return { acknowledged: false, deletedCount: seasons_with_tournament.length }
            }

            await new SeasonService().removeTournamentFromAll(id)
        }
        return await TournamentModel.deleteOne({ id: id })
    }

}