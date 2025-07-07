import { Body, Controller, Get, Param, Post, Put } from '@nestjs/common';
import { PostgrestError } from '@supabase/supabase-js';

import { ExerciseService } from 'src/services/exercise/exercise.service';
import { ExerciseResponse } from 'src/services/exercise/response/exercise-data-response';
import { CreateExerciseDto } from 'src/dto/create-exercise.dto';
import { Exercise } from 'src/interfaces/Exercise';

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

  @Post()
  async createExercise(
    @Body() createExerciseDto: CreateExerciseDto,
  ): Promise<Exercise | { message: string; details: string }> {
    try {
      const exercise =
        await this.exerciseService.addUserExercise(createExerciseDto);
      return exercise;
    } catch (error) {
      console.error('Error creating exercise:', error);

      if (error instanceof PostgrestError) {
        return {
          message: 'Error creating exercise in Supabase',
          details: error.message,
        };
      }

      return {
        message: 'An unexpected error occurred',
        details: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  @Get('list/:workoutPlanId/:day')
  async getExerciseListByWorkoutIdAndDay(
    @Param('workoutPlanId') workoutPlanId: number,
    @Param('day') day: number,
  ): Promise<ExerciseResponse[] | { message: string; details: string }> {
    if (!day || !workoutPlanId) {
      return { message: 'Day/workoutId is required.', details: '' };
    }

    try {
      const exercises =
        await this.exerciseService.getExercisesByWorkoutPlanAndDay(
          workoutPlanId,
          day,
        );
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

  @Put('bulk-update')
  async bulkUpdateWeights(
    @Body('updates') updates: { id: number; weight: number[] }[],
  ): Promise<any> {
    try {
      const result = await this.exerciseService.bulkUpdateWeights(updates);
      return result;
    } catch (error) {
      console.error('Error bulk updating weights:', error);
      if (error instanceof PostgrestError) {
        return {
          message: 'Error bulk updating weights in Supabase',
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
