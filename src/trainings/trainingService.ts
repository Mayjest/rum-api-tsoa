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
     */
    startingDate: Date;
    /**
     * The last training session (dates inclusive)
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
        const newTrainings: Training[] = trainings.map((training, index) => ({
            ...training,
            id: this.findUnusedID(TrainingModel),
            date: new Date(startingDate.getTime() + (index * cadence * 24 * 60 * 60 * 1000))
        }))
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