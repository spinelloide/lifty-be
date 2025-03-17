import { IsNotEmpty, IsNumber, IsString, Min } from 'class-validator';

export class CreateWorkoutDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsString()
  description: string;

  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  training_days: number;

  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  user_id: number;
}
