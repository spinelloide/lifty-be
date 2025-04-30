import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { PostgrestError } from '@supabase/supabase-js';
import { CreateWorkoutDayDto } from 'src/dto/create-workout-day.dto';

import { WorkoutDayService } from 'src/services/workout_day/workout_day.service';

@Controller('workout_day')
export class WorkoutDayController {
  constructor(private readonly workoutDayService: WorkoutDayService) {}

  @Get('list/:id')
  async getDaysByWorkoutPlanId(
    @Param('id') id: number,
  ): Promise<any[] | { message: string; details: string }> {
    try {
      // Otteniamo i piani di allenamento

      const daysList = await this.workoutDayService.getDaysByWorkoutPlanId(id);

      return daysList as [];
    } catch (error) {
      console.error('Error retrieving workout plans:', error);

      // Gestisci l'errore con dettagli più chiari
      if (error instanceof PostgrestError) {
        return {
          message: 'Error retrieving workout plans from Supabase',
          details: error.message,
        };
      }

      // In caso di errore imprevisto
      return {
        message: 'An unexpected error occurred',
        details: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  @Post('create')
  async createWorkoutDay(
    @Body() createWorkoutDto: CreateWorkoutDayDto,
  ): Promise<any> {
    try {
      const newWorkout =
        await this.workoutDayService.createWorkoutPlan(createWorkoutDto);
      return newWorkout;
    } catch (error) {
      console.error('Error creating workout plan:', error);

      // Gestisci l'errore con dettagli più chiari
      if (error instanceof PostgrestError) {
        return {
          message: 'Error creating workout plan in Supabase',
          details: error.message,
        };
      }

      // In caso di errore imprevisto
      return {
        message: 'An unexpected error occurred',
        details: error instanceof Error ? error.message : 'Unknown error',
      };
    }

    return 'ok';
  }
}
