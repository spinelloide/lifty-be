import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SupabaseClient, createClient } from '@supabase/supabase-js';

@Injectable()
export class UserService {
  private supabase: SupabaseClient;

  constructor(private configService: ConfigService) {
    const url = this.configService.get<string>('SUPABASE_URL') ?? '';
    const key = this.configService.get<string>('SUPABASE_KEY') ?? '';

    this.supabase = createClient(url, key);
  }

  // Metodo per ottenere gli esercizi per un determinato workout_plan_id
  async getExerciseList(workoutPlanId: number): Promise<any> {
    const { data, error } = await this.supabase
      .from('exercises')
      .select('*')
      .eq('workout_plan_id', workoutPlanId); // Aggiungi il filtro per workout_plan_id

    if (error) {
      console.error('Error:', error); // Aggiungi un log dell'errore
      throw error; // Lancia l'errore senza modificarlo
    }

    return data;
  }
}
