import { Season, SeasonModel } from "./season";
import { DeleteResult } from "mongodb";

export type SeasonCreationParams = Pick<Season, "year">

export class SeasonService {
    public async getAll(): Promise<Season[]> {
        return SeasonModel.find()
    }

    public async get(id: number): Promise<Season | null> {
        return SeasonModel.findOne({ id: id }).exec()
    }

    public async create(seasonCreationParams: SeasonCreationParams): Promise<Season> {
        const item = {
            id: await this.findUnusedID(),
            tournames: [],
            ...seasonCreationParams
        }
        return new SeasonModel(item).save()
    }

    public async addTournament(seasonId: number, tournamentId: number): Promise<Season | null> {
        const season = await SeasonModel.findOne({ id: seasonId }).exec()
        if (season === null) {
            return null
        }
        season.tournaments.push(tournamentId)
        return season.save()
    }

    public async delete(id: number): Promise<DeleteResult> {
        // Make sure the season isn't owned by a player
        return await SeasonModel.deleteOne({ id: id })
    }

    public async findUnusedID(): Promise<number> {
        const newest = await SeasonModel.findOne().sort({ 'created_at': -1 }).exec()
        if (newest === null) {
            return 1
        } else {
            return newest.id + 1
        }
    }
}