import { Inject, Injectable } from '@nestjs/common';
import { SupabaseClient } from '@supabase/supabase-js';
import { CreateWorkoutDayDto } from 'src/dto/create-workout-day.dto';

@Injectable()
export class WorkoutDayService {
  constructor(@Inject('SUPABASE_CLIENT') private supabase: SupabaseClient) {}
  async createWorkoutPlan(createWorkoutDto: CreateWorkoutDayDto): Promise<any> {
    const { workout_plan_id, count } = createWorkoutDto;

    // Map training_days from DTO to days in database schema
    const {
      data,
      error,
    }: {
      data: {
        workout_plan_id: number;
        count: number;
      } | null;
      error: any;
    } = await this.supabase
      .from('workout_day')
      .insert([
        {
          workout_plan_id,
          count,
        },
      ])
      .select()
      .single();

    if (error) {
      console.error('Error creating workout plan:', error);
      throw error;
    }

    return data as any;
  }

  // Metodo per ottenere i piani di allenamento
  async getDaysByWorkoutPlanId(workoutId: number): Promise<any[]> {
    const { data, error } = await this.supabase
      .from('workout_day')
      .select('*')
      .eq('workout_plan_id', workoutId);

    if (error) {
      console.error('Error:', error); // Aggiungi un log dell'errore
      throw error; // Lancia l'errore senza modificarlo
    }

    // console.log('Data:', data);

    return data as [];
  }
}
