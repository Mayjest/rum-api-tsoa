import { Tournament, TournamentModel } from "./tournament";

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

    public async findUnusedID(): Promise<number> {
        const newest = await TournamentModel.findOne().sort({ 'created_at': -1 }).exec()
        if (newest === null) {
            return 1
        } else {
            return newest.id + 1
        }
    }
}