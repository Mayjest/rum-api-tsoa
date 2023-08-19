import { ServiceBase } from "../lib/serviceBase";
import { Team, TeamModel } from "./team";

export type TeamCreationParams = Pick<Team, "name" | "division" | "tournamentID">

export class TeamService extends ServiceBase {

    public async getAll(): Promise<Team[]> {
        return TeamModel.find()
    }

    public async create(teamCreationParams: TeamCreationParams): Promise<Team> {
        const item = {
            id: await this.findUnusedID(TeamModel),
            ...teamCreationParams
        }
        return new TeamModel(item).save()
    }
}