import { Inject, Injectable } from '@nestjs/common';

import { SupabaseClient } from '@supabase/supabase-js';
import { Exercise } from 'src/interfaces/Exercise';

@Injectable()
export class UserService {
  constructor(@Inject('SUPABASE_CLIENT') private supabase: SupabaseClient) {}

  // Metodo per ottenere gli esercizi per un determinato workout_plan_id
  async getExerciseList(workoutPlanId: number): Promise<Exercise[]> {
    const { data, error } = await this.supabase
      .from('user_exercises')
      .select('*')
      .eq('workout_plan_id', workoutPlanId); // Aggiungi il filtro per workout_plan_id

    if (error) {
      console.error('Error:', error); // Aggiungi un log dell'errore
      throw error; // Lancia l'errore senza modificarlo
    }

    return data as Exercise[];
  }
}
