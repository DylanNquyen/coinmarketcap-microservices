import {
  Body,
  Controller,
  Headers,
  Post,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import type { AuthCredentials } from './auth.types';

@Controller('auth') // Route: /api/auth
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register') // POST /api/auth/register
  async register(@Body() body: AuthCredentials) {
    return this.authService.register(body);
  }

  @Post('login') // POST /api/auth/login
  async login(@Body() body: AuthCredentials) {
    return this.authService.login(body);
  }

  @Post('verify')
  verifyToken(@Headers('authorization') authHeader: string) {
    if (!authHeader) {
      throw new UnauthorizedException('Không tìm thấy Token!');
    }
    const token = authHeader.split(' ')[1]; // Lấy chuỗi Token đằng sau từ 'Bearer '
    return this.authService.verifyToken(token);
  }
}
