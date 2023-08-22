import { Body, Controller, Get, Path, Post, Route, Response, SuccessResponse, Example, Delete, Hidden, Put } from "tsoa";
import { Tournament } from "./tournament";
import { TournamentCreationParams, TournamentService, TournamentUpdateParams } from "./tournamentService";
import { Division } from "../division/division";

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
        currency: "€",
        divisions: [Division.Mixed, Division.Open, Division.Women]
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

    @Response<ValidationErrorJSON>(422, "Validation Failed")
    @Put("{tournamentId}")
    public async updateTournament(
        @Path() tournamentId: number,
        @Body() requestBody: TournamentUpdateParams
    ): Promise<Tournament | null> {
        return new TournamentService().update(tournamentId, requestBody)
    }

    /**
     * Deletes an existing tournament
     * 
     * This is to be used almost the entire time. When authorizations are added, club admins will use this
     * 
     * @param tournamentId The tournament ID
     */
    @SuccessResponse("204", "Deleted")
    @Response("403", "Tournament is referred to by a season, cannot delete",)
    @Delete("{tournamentId}")
    public async deleteTournament(@Path() tournamentId: number): Promise<void> {
        this.setStatus(204)
        const result = await new TournamentService().delete(tournamentId)
        // If it's not acknowledged, but it deleted something, it's because delete was called without cascade but
        // referred to by a season. In that case, we want to return a 403
        // return a 403
        if (!result.acknowledged && result.deletedCount > 0) {
            this.setStatus(403)
        }
        return
    }

    /**
     * Deletes an existing tournament and removes that ID from any seasons that use it.
     * 
     * Should only be used by global admins, and in practise never at all.
     * @param tournamentId The tournament ID
     */
    @Hidden()
    @Delete("{tournamentId}/cascade")
    public async deleteTournamentCascade(@Path() tournamentId: number): Promise<void> {
        new TournamentService().delete(tournamentId, true)
    }
}