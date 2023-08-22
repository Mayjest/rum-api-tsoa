import { Body, Controller, Get, Path, Post, Route, Response, SuccessResponse } from "tsoa";
import { Training } from "./training";
import { TrainingBulkCreationParams, TrainingCreationParams, TrainingService } from "./trainingService";

@Route("trainings")
export class TrainingController extends Controller {

    @Get()
    public async getAllTrainings(): Promise<Training[]> {
        return new TrainingService().getAll();
    }

    @Get("{trainingId}")
    public async getTraining(
        @Path() trainingId: number
    ): Promise<Training | null> {
        return new TrainingService().get(trainingId);
    }

    @SuccessResponse("201", "Created")
    @Response("400", "Bad Request, Starting date is after ending date")
    @Post()
    public async createTraining(
        @Body() requestBody: TrainingCreationParams
    ): Promise<void> {
        this.setStatus(201)
        new TrainingService().create(requestBody)
    }

    @SuccessResponse("201", "Created")
    @Post("bulk")
    public async bulkCreateTraining(
        @Body() creationParams: TrainingBulkCreationParams & TrainingCreationParams,
    ): Promise<void> {
        if (creationParams.startingDate > creationParams.endingDate) {
            this.setStatus(400)
            return
        }
        this.setStatus(201)
        new TrainingService().bulkCreate(creationParams, creationParams)
    }
}