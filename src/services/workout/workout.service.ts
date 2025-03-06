import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SupabaseClient, createClient } from '@supabase/supabase-js';
import { WorkoutPlan } from 'src/interfaces/WorkoutPlan';

@Injectable()
export class WorkoutService {
  private supabase: SupabaseClient;

  constructor(private configService: ConfigService) {
    const url = this.configService.get<string>('SUPABASE_URL') ?? '';
    const key = this.configService.get<string>('SUPABASE_KEY') ?? '';

    this.supabase = createClient(url, key);
  }

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

  async getMuscleGroups(): Promise<any> {
    const { data, error } = await this.supabase
      .from('muscle_groups')
      .select('*');

    if (error) {
      console.error('Error:', error); // Aggiungi un log dell'errore
      throw error; // Lancia l'errore senza modificarlo
    }

    // console.log('Muscle groups:', data);

    return data as WorkoutPlan[];
  }
}
