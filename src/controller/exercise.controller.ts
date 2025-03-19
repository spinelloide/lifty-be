import { Controller, Get, Param } from '@nestjs/common';
import { PostgrestError } from '@supabase/supabase-js';

import { ExerciseService } from 'src/services/exercise/exercise.service';
import { ExerciseResponse } from 'src/services/exercise/response/exercise-data-response';

@Controller('exercise')
export class ExerciseController {
  constructor(private readonly exerciseService: ExerciseService) {}

  @Get('muscle-group/:id')
  async getExercisesByMuscleGroup(
    @Param('id') id: number,
  ): Promise<ExerciseResponse[] | { message: string; details: string }> {
    if (!id) {
      return { message: 'Muscle group ID is required.', details: '' };
    }

    try {
      const exercises = await this.exerciseService.getExercisesByMuscleId(id);
      return exercises;
    } catch (error) {
      console.error('Error retrieving exercises:', error);

      if (error instanceof PostgrestError) {
        return {
          message: 'Error retrieving exercises from Supabase',
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
