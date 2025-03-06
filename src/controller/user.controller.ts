import { Controller, Get, Query } from '@nestjs/common';
import { PostgrestError } from '@supabase/supabase-js';
import { UserService } from 'src/services/user/user.service';

@Controller('user')
export class UsersController {
  constructor(private readonly userService: UserService) {}

  // Endpoint per testare il collegamento con Supabase
  // Endpoint per ottenere la lista degli esercizi per un workout_plan_id specifico
  @Get('list')
  async getExercisesList(@Query('id') id: number): Promise<any> {
    if (!id) {
      return { message: 'ID is required.' };
    }

    try {
      const exercises = await this.userService.getExerciseList(id);
      return exercises;
    } catch (error) {
      console.error('Error retrieving exercises:', error);

      if (error instanceof PostgrestError) {
        return {
          message: 'Error retrieving exercises from Supabase',
          details: error.message,
        };
      }

      return {
        message: 'An unexpected error occurred',
        details: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }
}
