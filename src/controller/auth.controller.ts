// src/controllers/auth/auth.controller.ts
import { Controller, Post, Body } from '@nestjs/common';
import { User } from 'src/interfaces/User';
import { AuthService } from 'src/services/auth/auth.service';
import { SignUpResponse } from 'src/services/auth/response/signup-response';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  async signUp(@Body() user: User): Promise<SignUpResponse> {
    try {
      const newUser = await this.authService.signUp(user);
      return {
        message: 'User successfully registered',
        status: 'success',
        user: newUser,
      };
    } catch (error: unknown) {
      let errorMessage = 'An unexpected error occurred';

      if (error instanceof Error) {
        errorMessage = error.message;
      }

      return {
        message: 'Error during user registration',
        details: errorMessage,
      };
    }
  }
}
