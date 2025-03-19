import { Inject, Injectable } from '@nestjs/common';
import { SupabaseClient } from '@supabase/supabase-js';
import { ExerciseResponse } from './response/exercise-data-response';

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
}
