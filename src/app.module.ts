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
import { JwtModule } from '@nestjs/jwt';
import { ExerciseController } from './controller/exercise.controller';
import { ExerciseService } from './services/exercise/exercise.service';
import { WorkoutDayService } from './services/workout_day/workout_day.service';
import { WorkoutDayController } from './controller/workout_day.controller';
import { AiController } from './controller/ai.controller';
import { AiService } from './services/ai/ai.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    SupabaseModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET, // Configura il secret del JWT, recuperato dal file .env
      signOptions: { expiresIn: '1h' }, // Opzionale: puoi definire il tempo di scadenza del token
    }),
  ],
  controllers: [
    AppController,
    AiController,
    WorkoutController,
    UsersController,
    ExerciseController,
    AuthController,
    WorkoutDayController,
  ],
  providers: [
    AppService,
    WorkoutService,
    AiService,
    UserService,
    AuthService,
    ExerciseService,
    WorkoutDayService,
  ],
})
export class AppModule {}
