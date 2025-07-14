import { Body, Controller, Post } from '@nestjs/common';
import { GenerateWorkoutBody } from 'src/interfaces/GenerateWorkoutBody';
import { AiService } from 'src/services/ai/ai.service';

@Controller('ai')
export class AiController {
  constructor(private readonly aiService: AiService) {}

  @Post('parse-text')
  async parseText(@Body('text') text: string) {
    const result = await this.aiService.generateStructuredResponse(text);
    return result;
  }
  @Post('generate-workout')
  async generateWorkout(@Body() body: GenerateWorkoutBody) {
    return this.aiService.generateWorkoutPlan(body);
  }
}
