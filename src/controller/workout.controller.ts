import { Body, Controller, Get, Post } from '@nestjs/common';
import { PostgrestError } from '@supabase/supabase-js';
import { CreateWorkoutDto } from 'src/dto/create-workout.dto';
import { MuscleGroup } from 'src/interfaces/MuscleGroup';
import { WorkoutPlan } from 'src/interfaces/WorkoutPlan';
import { WorkoutService } from 'src/services/workout/workout.service';

@Controller('workout')
export class WorkoutController {
  constructor(private readonly workoutService: WorkoutService) {}

  // Endpoint per testare il collegamento con Supabase
  @Get('list')
  async getWorkoutPlans(): Promise<
    WorkoutPlan[] | { message: string; details: string }
  > {
    try {
      // Otteniamo i piani di allenamento
      const plans = await this.workoutService.getWorkoutPlans();

      return plans;
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

  // Endpoint per testare il collegamento con Supabase
  @Get('muscle_groups/list')
  async getMuscleGroups(): Promise<
    MuscleGroup[] | { message: string; details: string }
  > {
    try {
      // Otteniamo i piani di allenamento

      const muscleGroups = await this.workoutService.getMuscleGroups();

      return muscleGroups;
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
  async createWorkout(
    @Body() createWorkoutDto: CreateWorkoutDto,
  ): Promise<WorkoutPlan | { message: string; details: string }> {
    try {
      const newWorkout =
        await this.workoutService.createWorkoutPlan(createWorkoutDto);
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
  }
}
