import { Body, Controller, Get, Path, Post, Route, Response, SuccessResponse, Example, Delete } from "tsoa";
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

    @Get()
    public async getAllTournaments(): Promise<Tournament[]> {
        return new TournamentService().getAll();
    }
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
        @Path() tournamentId: number
    ): Promise<Tournament | null> {
        return new TournamentService().get(tournamentId);
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

    @Delete("{tournamentId}")
    public async deleteTournament(@Path() tournamentId: number): Promise<void> {
        new TournamentService().delete(tournamentId)
    }

    @Delete("{tournamentId}/cascade")
    public async deleteTournamentCascade(@Path() tournamentId: number): Promise<void> {
        new TournamentService().delete(tournamentId, true)
    }
}