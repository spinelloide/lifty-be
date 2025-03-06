import { Inject, Injectable } from '@nestjs/common';
import { SupabaseClient } from '@supabase/supabase-js';
import { MuscleGroup } from 'src/interfaces/MuscleGroup';
import { WorkoutPlan } from 'src/interfaces/WorkoutPlan';

@Injectable()
export class WorkoutService {
  constructor(@Inject('SUPABASE_CLIENT') private supabase: SupabaseClient) {}

  // Metodo per ottenere i piani di allenamento
  async getWorkoutPlans(): Promise<WorkoutPlan[]> {
    const { data, error } = await this.supabase
      .from('workout_plans')
      .select('*');

    if (error) {
      console.error('Error:', error); // Aggiungi un log dell'errore
      throw error; // Lancia l'errore senza modificarlo
    }

    // console.log('Data:', data);

    return data as WorkoutPlan[];
  }

  async getMuscleGroups(): Promise<MuscleGroup[]> {
    const { data, error } = await this.supabase
      .from('muscle_groups')
      .select('*');

    if (error) {
      console.error('Error:', error); // Aggiungi un log dell'errore
      throw error; // Lancia l'errore senza modificarlo
    }

    // console.log('Muscle groups:', data);

    return data as MuscleGroup[];
  }
}
