import { Inject, Injectable } from '@nestjs/common';
import { SupabaseClient } from '@supabase/supabase-js';
import { ExerciseResponse } from './response/exercise-data-response';
import { Exercise } from 'src/interfaces/Exercise';
import { CreateExerciseDto } from 'src/dto/create-exercise.dto';

@Injectable()
export class ExerciseService {
  constructor(@Inject('SUPABASE_CLIENT') private supabase: SupabaseClient) {}

  async getExercisesByMuscleId(muscleId: number): Promise<ExerciseResponse[]> {
    const { data, error }: { data: ExerciseResponse[] | null; error: any } =
      await this.supabase
        .from('exercises_list')
        .select('*')
        .eq('muscle_group_id', muscleId);

    if (error) {
      console.error('Error:', error);
      throw error;
    }

    return data as ExerciseResponse[];
  }

  async getExercisesByWorkoutPlanAndDay(
    workoutPlanId: number,
    day: number,
  ): Promise<ExerciseResponse[]> {
    const { data, error } = await this.supabase
      .from('user_exercises')
      .select('*')
      .eq('workout_plan_id', workoutPlanId)
      .eq('day', day);

    if (error) {
      console.error('Error retrieving exercises:', error);
      throw error;
    }

    return data as ExerciseResponse[];
  }

  async addUserExercise(exercise: CreateExerciseDto): Promise<Exercise> {
    const { data, error } = await this.supabase
      .from('user_exercises')
      .insert([exercise])
      .select()
      .single();

    if (error) {
      console.error('Error adding exercise:', error);
      throw error;
    }

    return data as Exercise;
  }

  async bulkUpdateWeights(
    updates: { id: number; weight: number[] }[],
  ): Promise<any[]> {
    const results: any[] = [];
    for (const update of updates) {
      const { data, error } = await this.supabase
        .from('user_exercises')
        .update({ weight: update.weight })
        .eq('id', update.id)
        .select();
      if (error) {
        console.error('Error updating weight:', error);
        throw error;
      }
      results.push(data);
    }
    return results;
  }
}
