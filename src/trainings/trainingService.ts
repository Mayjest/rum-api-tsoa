import { DeleteResult } from "mongodb";
import { ServiceBase } from "../lib/serviceBase";
import { SeasonService } from "../season/seasonService";
import { TournamentModel } from "../tournaments/tournament";
import { Training, TrainingModel } from "./training";

export type TrainingCreationParams = Omit<Training, "id">
export type TrainingUpdateParams = Partial<Training>
export type TrainingBulkCreationParams = {
    /**
     * The first training session (dates inclusive)
     * @example "2023-09-01T20:00:00.000Z"
     */
    startingDate: Date;
    /**
     * The last training session (dates inclusive)
     * @example "2023-09-22T20:00:00.000Z"
     */
    endingDate: Date;
    /**
     * How many days between each training
     * e.g. 7 for weekly
     * @example 7
     */
    cadence: number;
}

export class TrainingService extends ServiceBase {
    public async getAll(): Promise<Training[]> {
        return TrainingModel.find()
    }

    public async get(id: number): Promise<Training | null> {
        return TrainingModel.findOne({ id: id }).exec()
    }

    public async create(training: TrainingCreationParams): Promise<Training> {
        const item = {
            id: await this.findUnusedID(TrainingModel),
            ...training
        }
        return new TrainingModel(item).save()
    }

    public async bulkCreate(bulkParams: TrainingBulkCreationParams, training: TrainingCreationParams): Promise<Training[]> {
        const { startingDate, endingDate, cadence } = bulkParams
        const noOfTrainings = Math.floor((endingDate.getTime() - startingDate.getTime()) / (cadence * 24 * 60 * 60 * 1000)) + 1
        const trainings = Array(noOfTrainings).fill(training)
        const newTrainings: Training[] = await Promise.all(trainings.map(async (training, index) => ({
            id: await this.findUnusedID(TrainingModel),
            location: training.location,
            price: training.price,
            invitational: training.invitational,
            level: training.level,
            divisions: training.divisions,
            date: new Date(startingDate.getTime() + (index * cadence * 24 * 60 * 60 * 1000))
        })))
        // check math
        if (newTrainings[newTrainings.length - 1].date.getTime() !== endingDate.getTime()) {
            throw new Error("Ending date does not match the cadence, did bad math")
        }
        return TrainingModel.insertMany(newTrainings)
    }

    public async update(id: number, trainingUpdateParams: TrainingUpdateParams): Promise<Training | null> {
        this.checkID(id, trainingUpdateParams)
        return TrainingModel.findOneAndUpdate({ id: id }, trainingUpdateParams, { new: true }).exec()
    }

    public async delete(id: number, cascade: false): Promise<DeleteResult> {

        const seasons_with_training = await new SeasonService().getSeasonIDsByTrainingID(id)
        if (seasons_with_training.length > 0) {
            if (!cascade) {
                console.log(`Training ${id} is owned by a season, not deleting.`)
                return { acknowledged: false, deletedCount: seasons_with_training.length }
            }

            await new SeasonService().removeTrainingFromAll(id)
        }
        return await TournamentModel.deleteOne({ id: id })
    }
}