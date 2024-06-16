import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type ProjectDocument = HydratedDocument<Project>;


@Schema()
export class Project {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  resume: string;

  @Prop({ required: true })
  content: string;

  @Prop()
  updatedAt: Date;
}

export const ProjectSchema = SchemaFactory.createForClass(Project);

