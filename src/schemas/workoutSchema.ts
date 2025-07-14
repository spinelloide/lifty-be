import z from 'zod';

export const workoutSchema = z.object({
  title: z.string(),
  description: z.string(),
  duration: z.number(),
  days: z.number(),
  completed_count: z.number(),
  is_active: z.boolean(),
});

export type WorkoutPlan = z.infer<typeof workoutSchema>;
