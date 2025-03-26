import { IsNotEmpty, IsNumber, IsString, Min } from 'class-validator';

export class CreateExerciseDto {
  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  workout_plan_id: number;

  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  muscle_group: string;

  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  sets: number;

  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  reps: number;

  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  rest_time: number;

  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  day: number;
}
