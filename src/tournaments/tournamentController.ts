import { Body, Controller, Get, Path, Post, Query, Route, Response, SuccessResponse, Example } from "tsoa";
import { Tournament } from "./tournament";
import { TournamentCreationParams, TournamentService } from "./tournamentService";

interface ValidationErrorJSON {
    message: "Validation Failed";
    details: {
        [name: string]: unknown,
        [teamfee: number]: unknown
    }
}

@Route("tournaments")
export class TournamentController extends Controller {
    /**
     * Retrieves the details of an existing tournament
     * @param tournamentId The tournament ID
     * @param name Provide a name to display (will remove later, I guess?)
     */
    @Example<Tournament>({
        id: 1,
        name: "Windmill Windup",
        dates: "May 2023",
        teamfee: 200,
        playerfee: 20,
        currency: "€"
    })
    @Get("{tournamentId}")
    public async getTournament(
        @Path() tournamentId: number,
        @Query() name?: string
    ): Promise<Tournament> {
        return new TournamentService().get(tournamentId, name);
    }

    @Response<ValidationErrorJSON>(422, "Validation Failed")
    @SuccessResponse("201", "Created")
    @Post()
    public async createTournament(
        @Body() requestBody: TournamentCreationParams
    ): Promise<void> {
        this.setStatus(201)
        new TournamentService().create(requestBody)
    }
}