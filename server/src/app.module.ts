import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ProjectModule } from './project/project.module';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [ProjectModule, MongooseModule.forRoot('mongodb+srv://tuan2203:tuan2001@cluster0.tx0xtot.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0')],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
