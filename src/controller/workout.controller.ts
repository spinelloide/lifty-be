import { Controller, Get } from '@nestjs/common';
import { PostgrestError } from '@supabase/supabase-js';

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
}
