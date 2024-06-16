import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Project, ProjectDocument } from './project.schema';

@Injectable()
export class ProjectService {
  constructor(@InjectModel(Project.name) private projectModel: Model<ProjectDocument>) { }

  async getAllProjects(): Promise<Project[]> {
    return this.projectModel.find().exec();
  }

  async createProject(project: Project): Promise<Project> {
    const createdProject = new this.projectModel(project);
    return createdProject.save();
  }
}

