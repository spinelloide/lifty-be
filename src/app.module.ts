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

@Module({
  imports: [
    ConfigModule.forRoot(),
    SupabaseModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET, // Configura il secret del JWT, recuperato dal file .env
      signOptions: { expiresIn: '1h' }, // Opzionale: puoi definire il tempo di scadenza del token
    }),
  ],
  controllers: [
    AppController,
    WorkoutController,
    UsersController,
    AuthController,
  ],
  providers: [AppService, WorkoutService, UserService, AuthService],
})
export class AppModule {}
