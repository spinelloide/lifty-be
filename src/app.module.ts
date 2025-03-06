import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';

import { WorkoutService } from './services/workout/workout.service';
import { WorkoutController } from './controller/workout.controller';

@Module({
  imports: [ConfigModule.forRoot()],
  controllers: [AppController, WorkoutController],
  providers: [AppService, WorkoutService],
})
export class AppModule {}
