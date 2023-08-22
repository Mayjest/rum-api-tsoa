import { DeleteResult } from "mongodb";
import { ServiceBase } from "../lib/serviceBase";
import { Season, SeasonModel } from "./season";

export type SeasonCreationParams = Pick<Season, "year">

export class SeasonService extends ServiceBase {
    public async getAll(): Promise<Season[]> {
        return SeasonModel.find()
    }

    public async get(id: number): Promise<Season | null> {
        return SeasonModel.findOne({ id: id }).exec()
    }

    public async create(seasonCreationParams: SeasonCreationParams): Promise<Season> {
        const item = {
            id: await this.findUnusedID(SeasonModel),
            tournamentIDs: [],
            teamIDs: [],
            trainingIDs: [],
            ...seasonCreationParams
        }
        return new SeasonModel(item).save()
    }

    public async addTournament(seasonId: number, tournamentId: number): Promise<Season | null> {
        const season = await SeasonModel.findOne({ id: seasonId }).exec()
        if (season === null) {
            return null
        }
        season.tournamentIDs.push(tournamentId)
        return season.save()
    }

    public async removeTournament(seasonId: number, tournamentId: number): Promise<Season | null> {
        const season = await SeasonModel.findOne({ id: seasonId }).exec()
        if (season === null) {
            return null
        }
        season.tournamentIDs = season.tournamentIDs.filter(id => id !== tournamentId)
        return season.save()
    }

    public async addTeam(seasonId: number, teamId: number): Promise<Season | null> {
        const season = await SeasonModel.findOne({ id: seasonId }).exec()
        if (season === null) {
            return null
        }
        season.teamIDs.push(teamId)
        return season.save()
    }

    public async removeTeam(seasonId: number, teamId: number): Promise<Season | null> {
        const season = await SeasonModel.findOne({ id: seasonId }).exec()
        if (season === null) {
            return null
        }
        season.teamIDs = season.teamIDs.filter(id => id !== teamId)
        return season.save()
    }

    public async addTraining(seasonId: number, trainingId: number): Promise<Season | null> {
        const season = await SeasonModel.findOne({ id: seasonId }).exec()
        if (season === null) {
            return null
        }
        season.trainingIDs.push(trainingId)
        return season.save()
    }

    public async removeTraining(seasonId: number, trainingId: number): Promise<Season | null> {
        const season = await SeasonModel.findOne({ id: seasonId }).exec()
        if (season === null) {
            return null
        }
        season.trainingIDs = season.trainingIDs.filter(id => id !== trainingId)
        return season.save()
    }

    public async delete(id: number): Promise<DeleteResult> {
        // Make sure the season isn't owned by a player
        return await SeasonModel.deleteOne({ id: id })
    }

    public async getSeasonIDsByTournamentID(tournamentId: number): Promise<Number[]> {
        const seasons = await SeasonModel.find({ tournamentIDs: { $in: [tournamentId] } }).exec()
        return seasons.map((season) => season.id)
    }

    public async getSeasonIDsByTeamID(teamId: number): Promise<Number[]> {
        const seasons = await SeasonModel.find({ teamIDs: { $in: [teamId] } }).exec()
        return seasons.map((season) => season.id)
    }

    public async getSeasonIDsByTrainingID(trainingId: number): Promise<Number[]> {
        const seasons = await SeasonModel.find({ trainingIDs: { $in: [trainingId] } }).exec()
        return seasons.map((season) => season.id)
    }

    public async removeTournamentFromAll(tournamentId: number): Promise<void> {
        const seasons = await SeasonModel.find({ tournamentIDs: { $in: [tournamentId] } }).exec()
        seasons.forEach(season => {
            season.tournamentIDs = season.tournamentIDs.filter(id => id !== tournamentId)
            season.save()
        })
    }

    public async removeTeamFromAll(teamId: number): Promise<void> {
        const seasons = await SeasonModel.find({ teamIDs: { $in: [teamId] } }).exec()
        seasons.forEach(season => {
            season.teamIDs = season.teamIDs.filter(id => id !== teamId)
            season.save()
        })
    }

    public async removeTrainingFromAll(trainingId: number): Promise<void> {
        const seasons = await SeasonModel.find({ trainingIDs: { $in: [trainingId] } }).exec()
        seasons.forEach(season => {
            season.trainingIDs = season.trainingIDs.filter(id => id !== trainingId)
            season.save()
        })
    }
}