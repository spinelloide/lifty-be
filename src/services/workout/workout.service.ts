import { Inject, Injectable } from '@nestjs/common';
import { SupabaseClient } from '@supabase/supabase-js';
import { CreateWorkoutDto } from 'src/dto/create-workout.dto';
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

  // Metodo per creare un nuovo piano di allenamento
  async createWorkoutPlan(
    createWorkoutDto: CreateWorkoutDto,
  ): Promise<WorkoutPlan> {
    const { title, description, training_days, duration, user_id } =
      createWorkoutDto;

    // Map training_days from DTO to days in database schema
    const { data, error }: { data: WorkoutPlan | null; error: any } =
      await this.supabase
        .from('workout_plans')
        .insert([
          {
            title,
            description,
            training_days,
            duration,
            user_id,
          },
        ])
        .select()
        .single();

    if (error) {
      console.error('Error creating workout plan:', error);
      throw error;
    }

    return data as WorkoutPlan;
  }

  async deleteWorkoutPlan(id: number): Promise<WorkoutPlan | null> {
    // First delete all associated exercises
    const { error: exerciseDeleteError } = await this.supabase
      .from('user_exercises')
      .delete()
      .eq('workout_plan_id', id);

    if (exerciseDeleteError) {
      console.error(
        'Error deleting associated exercises:',
        exerciseDeleteError,
      );
      throw exerciseDeleteError;
    }

    const { error: daysDeleteError } = await this.supabase
      .from('workout_day')
      .delete()
      .eq('workout_plan_id', id);

    if (daysDeleteError) {
      console.error('Error deleting associated exercises:', daysDeleteError);
      throw daysDeleteError;
    }

    // Then delete the workout plan
    const { data, error }: { data: WorkoutPlan | null; error: any } =
      await this.supabase
        .from('workout_plans')
        .delete()
        .eq('id', id)
        .select()
        .single();

    if (error) {
      console.error('Error deleting workout plan:', error);
      throw error;
    }
    return data;
  }

  async getWorkoutPlanById(id: number): Promise<WorkoutPlan | null> {
    const { data, error }: { data: WorkoutPlan | null; error: any } =
      await this.supabase
        .from('workout_plans')
        .select('*')
        .eq('id', id)
        .single();

    if (error) {
      console.error('Error retrieving workout plan:', error);
      throw error;
    }

    return data as WorkoutPlan;
  }

  async updateWorkoutPlanStatus(
    id: number,
    isActive: boolean,
  ): Promise<WorkoutPlan | null> {
    const { data, error }: { data: WorkoutPlan | null; error: any } =
      await this.supabase
        .from('workout_plans')
        .update({ is_active: isActive })
        .eq('id', id)
        .select()
        .single();

    if (error) {
      console.error('Error updating workout plan status:', error);
      throw error;
    }

    return data as WorkoutPlan;
  }

  async getActiveWorkoutPlans(userId: number): Promise<WorkoutPlan[]> {
    const { data, error } = await this.supabase
      .from('workout_plans')
      .select('*')
      .eq('is_active', true)
      .eq('user_id', userId);

    if (error) {
      console.error('Error retrieving active workout plans:', error);
      throw error;
    }

    return data as WorkoutPlan[];
  }
}
