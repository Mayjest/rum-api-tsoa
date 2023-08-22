import { Body, Controller, Get, Post, Route, Response, SuccessResponse, Path, Delete } from "tsoa";
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

    @Delete("{seasonId}/tournaments/{tournamentId}")
    public async removeTournament(@Path() seasonId: number, @Path() tournamentId: number): Promise<Season | null> {
        return new SeasonService().removeTournament(seasonId, tournamentId)
    }

    @Post("{seasonId}/teams/{teamId}")
    public async addTeam(@Path() seasonId: number, @Path() teamId: number): Promise<Season | null> {
        return new SeasonService().addTeam(seasonId, teamId)
    }

    @Delete("{seasonId}/teams/{teamId}")
    public async removeTeam(@Path() seasonId: number, @Path() teamId: number): Promise<Season | null> {
        return new SeasonService().removeTeam(seasonId, teamId)
    }

    @Post("{seasonId}/trainings/{trainingId}")
    public async addTraining(@Path() seasonId: number, @Path() trainingId: number): Promise<Season | null> {
        return new SeasonService().addTraining(seasonId, trainingId)
    }

    @Delete("{seasonId}/trainings/{trainingId}")
    public async removeTraining(@Path() seasonId: number, @Path() trainingId: number): Promise<Season | null> {
        return new SeasonService().removeTraining(seasonId, trainingId)
    }
}