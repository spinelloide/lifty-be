import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';

import { WorkoutService } from './services/workout/workout.service';
import { WorkoutController } from './controller/workout.controller';
import { UsersController } from './controller/user.controller';
import { UserService } from './services/user/user.service';

@Module({
  imports: [ConfigModule.forRoot()],
  controllers: [AppController, WorkoutController, UsersController],
  providers: [AppService, WorkoutService, UserService],
})
export class AppModule {}
