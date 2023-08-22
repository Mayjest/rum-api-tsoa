import { Body, Controller, Get, Path, Post, Route, SuccessResponse, TsoaResponse, Res } from "tsoa";
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
    @Post()
    public async createTraining(
        @Body() requestBody: TrainingCreationParams
    ): Promise<void> {
        this.setStatus(201)
        new TrainingService().create(requestBody)
    }

    /**
     * 
     * @param creationParams The combined params for training creation with extra bits for bulk creation
     * @param badRequestResponse Not a real param, ignore
     * @returns A 201 request on success, or a 400 with a reason on failure
     * @example {
     *    "startingDate": "2023-09-01T20:00:00.000Z",
     *    "endingDate": "2023-09-22T20:00:00.000Z",
     *    "cadence": 7,
     *    "location": "Bohunt School",
     *    "price": 9,
     *    "invitational": false,
     *    "level": "Beginner",
     *    "divisions": [
     *      "Mixed",
     *      "Open",
     *      "Womens"
     *      ]
     *    }
     */
    @SuccessResponse("201", "Created")
    @Post("bulk")
    public async bulkCreateTraining(
        @Body() creationParams: TrainingBulkCreationParams & TrainingCreationParams,
        @Res() badRequestResponse: TsoaResponse<400, { reason: string }>
    ): Promise<void> {
        if (creationParams.startingDate > creationParams.endingDate) {
            return badRequestResponse(400, { reason: "Starting date is after ending date" })
        }

        if ((creationParams.endingDate.getTime() - creationParams.startingDate.getTime()) % (creationParams.cadence * 24 * 60 * 60 * 1000) > 0) {
            return badRequestResponse(400, { reason: "Ending date does not match the cadence - there is left over time after the last training before the end date." })
        }
        this.setStatus(201)
        new TrainingService().bulkCreate(creationParams, creationParams)
    }
}