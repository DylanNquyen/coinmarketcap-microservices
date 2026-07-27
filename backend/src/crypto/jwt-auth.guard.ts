import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers.authorization;

    if (!authHeader) {
      throw new UnauthorizedException('Thiếu Token xác thực (Authorization header)!');
    }

    try {
      // BE-ms gọi sang auth-ms (Port 3002) để xác minh Token
      const response = await axios.post(
        'http://localhost:3002/api/auth/verify',
        {},
        {
          headers: { Authorization: authHeader },
        },
      );

      // Gán thông tin user đã verified vào request
      request.user = response.data.user;
      return true;
    } catch (error) {
      throw new UnauthorizedException('Token không hợp lệ hoặc đã hết hạn!');
    }
  }
}