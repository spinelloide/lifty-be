import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { PostgrestError } from '@supabase/supabase-js';
import { CreateWorkoutDto } from 'src/dto/create-workout.dto';
import { MuscleGroup } from 'src/interfaces/MuscleGroup';
import { WorkoutPlan } from 'src/interfaces/WorkoutPlan';
import { WorkoutService } from 'src/services/workout/workout.service';

@Controller('workout')
export class WorkoutController {
  constructor(private readonly workoutService: WorkoutService) {}

  // Endpoint per testare il collegamento con Supabase
  @Get('list/:userId')
  async getWorkoutPlans(
    @Param('userId') userId: number,
  ): Promise<WorkoutPlan[] | { message: string; details: string }> {
    try {
      if (!userId) {
        return { message: 'User ID is required.', details: '' };
      }
      // Otteniamo i piani di allenamento
      const plans = await this.workoutService.getWorkoutPlans(userId);

      return plans;
    } catch (error) {
      console.error('Error retrieving workout plans:', error);

      // Gestisci l'errore con dettagli più chiari
      if (error instanceof PostgrestError) {
        return {
          message: 'Error retrieving workout plans from Supabase',
          details: error.message,
        };
      }

      // In caso di errore imprevisto
      return {
        message: 'An unexpected error occurred',
        details: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  // Endpoint per testare il collegamento con Supabase
  @Get('muscle_groups/list')
  async getMuscleGroups(): Promise<
    MuscleGroup[] | { message: string; details: string }
  > {
    try {
      // Otteniamo i piani di allenamento

      const muscleGroups = await this.workoutService.getMuscleGroups();

      return muscleGroups;
    } catch (error) {
      console.error('Error retrieving workout plans:', error);

      // Gestisci l'errore con dettagli più chiari
      if (error instanceof PostgrestError) {
        return {
          message: 'Error retrieving workout plans from Supabase',
          details: error.message,
        };
      }

      // In caso di errore imprevisto
      return {
        message: 'An unexpected error occurred',
        details: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  @Post('create')
  async createWorkout(
    @Body() createWorkoutDto: CreateWorkoutDto,
  ): Promise<WorkoutPlan | { message: string; details: string }> {
    try {
      const newWorkout =
        await this.workoutService.createWorkoutPlan(createWorkoutDto);

      return newWorkout;
    } catch (error) {
      console.error('Error creating workout plan:', error);

      // Gestisci l'errore con dettagli più chiari
      if (error instanceof PostgrestError) {
        return {
          message: 'Error creating workout plan in Supabase',
          details: error.message,
        };
      }

      // In caso di errore imprevisto
      return {
        message: 'An unexpected error occurred',
        details: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  @Get(':id')
  async getWorkoutPlan(
    @Param('id') id: number,
  ): Promise<WorkoutPlan | { message: string; details: string }> {
    if (!id) {
      return { message: 'ID is required.', details: '' };
    }

    try {
      const workoutPlan = await this.workoutService.getWorkoutPlanById(id);
      if (!workoutPlan) {
        return {
          message: 'Workout plan not found',
          details: `No workout plan found with id ${id}`,
        };
      }
      return workoutPlan;
    } catch (error) {
      console.error('Error retrieving workout plan:', error);

      if (error instanceof PostgrestError) {
        return {
          message: 'Error retrieving workout plan from Supabase',
          details: error.message,
        };
      }

      return {
        message: 'An unexpected error occurred',
        details: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  @Put('status/:id')
  async updateWorkoutPlanStatus(
    @Param('id') id: number,
    @Body('isActive') isActive: boolean,
  ): Promise<WorkoutPlan | { message: string; details: string }> {
    if (!id) {
      return { message: 'ID is required.', details: '' };
    }

    if (typeof isActive !== 'boolean') {
      return {
        message: 'Invalid input',
        details: 'isActive must be a boolean value',
      };
    }

    try {
      const updatedWorkoutPlan =
        await this.workoutService.updateWorkoutPlanStatus(id, isActive);
      if (!updatedWorkoutPlan) {
        return {
          message: 'Workout plan not found',
          details: `No workout plan found with id ${id}`,
        };
      }
      return updatedWorkoutPlan;
    } catch (error) {
      console.error('Error updating workout plan status:', error);
      if (error instanceof PostgrestError) {
        return {
          message: 'Error updating workout plan status in Supabase',
          details: error.message,
        };
      }
      return {
        message: 'An unexpected error occurred',
        details: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  @Put(':id/decrement-completed')
  async decrementCompletedCount(
    @Param('id') id: number,
  ): Promise<WorkoutPlan | { message: string; details: string }> {
    try {
      const updated = await this.workoutService.decrementCompletedCount(id);
      if (!updated) {
        return {
          message: 'Workout plan not found',
          details: `No workout plan found with id ${id}`,
        };
      }
      return updated;
    } catch (error) {
      console.error('Error decrementing completed_count:', error);
      if (error instanceof PostgrestError) {
        return {
          message: 'Error decrementing completed_count in Supabase',
          details: error.message,
        };
      }
      return {
        message: 'An unexpected error occurred',
        details: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  @Get('active/:userId')
  async getActiveWorkoutPlans(
    @Param('userId') userId: number,
  ): Promise<WorkoutPlan[] | { message: string; details: string }> {
    if (!userId) {
      return { message: 'User ID is required.', details: '' };
    }

    try {
      const activePlans =
        await this.workoutService.getActiveWorkoutPlans(userId);
      return activePlans;
    } catch (error) {
      console.error('Error retrieving active workout plans:', error);

      if (error instanceof PostgrestError) {
        return {
          message: 'Error retrieving active workout plans from Supabase',
          details: error.message,
        };
      }

      return {
        message: 'An unexpected error occurred',
        details: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  @Delete('delete/:id')
  async deleteWorkoutPlan(
    @Param('id') id: number,
  ): Promise<WorkoutPlan | { message: string; details: string }> {
    if (!id) {
      return { message: 'ID is required.', details: '' };
    }
    try {
      const deletedWorkoutPlan =
        await this.workoutService.deleteWorkoutPlan(id);
      if (!deletedWorkoutPlan) {
        return {
          message: 'Workout plan not found',
          details: `No workout plan found with id ${id}`,
        };
      }
      return deletedWorkoutPlan;
    } catch (error) {
      console.error('Error deleting workout plan:', error);
      if (error instanceof PostgrestError) {
        return {
          message: 'Error deleting workout plan from Supabase',
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
