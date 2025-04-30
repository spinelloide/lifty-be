import { Test, TestingModule } from '@nestjs/testing';
import { WorkoutDayService } from './workout_day.service';

describe('WorkoutDayService', () => {
  let service: WorkoutDayService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [WorkoutDayService],
    }).compile();

    service = module.get<WorkoutDayService>(WorkoutDayService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
