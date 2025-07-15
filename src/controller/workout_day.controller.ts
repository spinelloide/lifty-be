import { Body, Controller, Get, Param, Post, Put } from '@nestjs/common';
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

  @Put(':id')
  async updateDayLabel(
    @Param('id') id: number,
    @Body('label') label: string,
  ): Promise<any> {
    try {
      const updated = await this.workoutDayService.updateDayLabel(id, label);
      return updated;
    } catch (error) {
      console.error('Error updating workout day label:', error);
      if (error instanceof PostgrestError) {
        return {
          message: 'Error updating workout day label in Supabase',
          details: error.message,
        };
      }
      return {
        message: 'An unexpected error occurred',
        details: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  @Put(':id/decrement')
  async decrementDayCount(@Param('id') id: number): Promise<any> {
    try {
      const updated = await this.workoutDayService.decrementDayCount(id);
      return updated;
    } catch (error) {
      console.error('Error decrementing workout day count:', error);
      if (error instanceof PostgrestError) {
        return {
          message: 'Error decrementing workout day count in Supabase',
          details: error.message,
        };
      }
      return {
        message: 'An unexpected error occurred',
        details: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }
}
