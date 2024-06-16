import { Body, Controller, Get, Post } from "@nestjs/common";
import { ProjectService } from "./project.service";
import { Project } from "./project.schema";

@Controller('api/v1/project')
export class ProjectController {
  constructor(private readonly projectService: ProjectService) { }

  @Get()
  async GetAllProject(): Promise<Project[]> {
    return this.projectService.getAllProjects();
  }

  @Post('/add')
  async CreateProject(@Body() project: Project): Promise<Project> {
    return this.projectService.createProject(project);
  }
}

