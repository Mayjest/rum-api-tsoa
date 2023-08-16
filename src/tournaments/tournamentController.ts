import { Body, Controller, Get, Path, Post, Query, Route, SuccessResponse } from "tsoa";
import { Tournament } from "./tournament";
import { TournamentCreationParams, TournamentService } from "./tournamentService";

@Route("tournaments")
export class TournamentController extends Controller {
    @Get("{tournamentId}")
    public async getTournament(
        @Path() tournamentId: number,
        @Query() name?: string
    ): Promise<Tournament> {
        return new TournamentService().get(tournamentId, name);
    }

    @SuccessResponse("201", "Created")
    @Post()
    public async createTournament(
        @Body() requestBody: TournamentCreationParams
    ): Promise<void> {
        this.setStatus(201)
        new TournamentService().create(requestBody)
    }
}