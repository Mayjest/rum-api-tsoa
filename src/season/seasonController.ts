import { Body, Controller, Get, Post, Route, Response, SuccessResponse, Path } from "tsoa";
import { SeasonCreationParams, SeasonService } from "./seasonService";
import { Season } from "./season";

interface ValidationErrorJSON {
    message: "Validation Failed";
    details: {
        [year: string]: unknown
    }
}

@Route("seasons")
export class SeasonController extends Controller {

    @Get()
    public async getAllSeasons(): Promise<Season[]> {
        return new SeasonService().getAll();
    }

    @Get("{seasonId}")
    public async getSeason(@Path() seasonId: number): Promise<Season | null> {
        return new SeasonService().get(seasonId);
    }

    @Response<ValidationErrorJSON>(422, "Validation Failed")
    @SuccessResponse("201", "Created")
    @Post()
    public async createSeason(
        @Body() requestBody: SeasonCreationParams
    ): Promise<void> {
        this.setStatus(201)
        new SeasonService().create(requestBody)
    }

    @Post("{seasonId}/tournaments/{tournamentId}")
    public async addTournament(@Path() seasonId: number, @Path() tournamentId: number): Promise<Season | null> {
        return new SeasonService().addTournament(seasonId, tournamentId)
    }

}