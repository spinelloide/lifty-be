import { IsNotEmpty, IsNumber, Min } from 'class-validator';

export class CreateWorkoutDayDto {
  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  workout_plan_id: number;

  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  count: number;
}
