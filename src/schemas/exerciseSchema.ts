import z from 'zod';

export const exerciseSchema = z.object({
  name: z.string(),
  muscle_group: z.string(),
  sets: z.number(),
  reps: z.number(),
  rest_time: z.number(),
  day: z.number(),
});
