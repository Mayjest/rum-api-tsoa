import { Body, Controller, Get, Path, Post, Put, Route, SuccessResponse } from "tsoa";
import { Team } from "./team";
import { TeamCreationParams, TeamService, TeamUpdateParams } from "./teamService";

@Route("teams")
export class TeamController extends Controller {

    @Get()
    public async getAllTeams(): Promise<Team[]> {
        return new TeamService().getAll();
    }

    @SuccessResponse("201", "Created")
    @Post()
    public async createTeam(@Body() requestBody: TeamCreationParams): Promise<void> {
        this.setStatus(201)
        new TeamService().create(requestBody)
    }

    @Put("{teamId}")
    public async updateTournament(
        @Path() teamId: number,
        @Body() requestBody: TeamUpdateParams
    ): Promise<Team | null> {
        return new TeamService().update(teamId, requestBody)
    }
}