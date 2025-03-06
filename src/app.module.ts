import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';

import { WorkoutService } from './services/workout/workout.service';
import { WorkoutController } from './controller/workout.controller';
import { UsersController } from './controller/user.controller';
import { UserService } from './services/user/user.service';
import { AuthService } from './services/auth/auth.service';
import { SupabaseModule } from './modules/supabase/supabase.module';
import { AuthController } from './controller/auth.controller';

@Module({
  imports: [ConfigModule.forRoot(), SupabaseModule],
  controllers: [
    AppController,
    WorkoutController,
    UsersController,
    AuthController,
  ],
  providers: [AppService, WorkoutService, UserService, AuthService],
})
export class AppModule {}
