export interface Exercise {
  id: number;
  workout_plan_id: number;
  name: string;
  muscle_group: string;
  sets: number;
  reps: number;
  rest_time: number;
  day: number;
  created_at: string;
  updated_at: string;
}
