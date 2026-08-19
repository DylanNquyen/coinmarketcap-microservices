import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import axios from 'axios';
import type { Request } from 'express';

interface VerifiedUser {
  sub: number;
  email: string;
  [claim: string]: unknown;
}

interface AuthVerificationResponse {
  user: VerifiedUser;
}

interface AuthenticatedRequest extends Request {
  user?: VerifiedUser;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function isAuthVerificationResponse(
  value: unknown,
): value is AuthVerificationResponse {
  if (!isRecord(value) || !isRecord(value.user)) {
    return false;
  }

  return (
    typeof value.user.sub === 'number' && typeof value.user.email === 'string'
  );
}

@Injectable()
export class JwtAuthGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();
    const authHeader = request.headers.authorization;

    if (!authHeader) {
      throw new UnauthorizedException(
        'Thiếu Token xác thực (Authorization header)!',
      );
    }

    try {
      // BE-ms gọi sang auth-ms (Port 3002) để xác minh Token
      const response = await axios.post<unknown>(
        'http://localhost:3002/api/auth/verify',
        {},
        {
          headers: { Authorization: authHeader },
        },
      );

      if (!isAuthVerificationResponse(response.data)) {
        throw new UnauthorizedException('Token không hợp lệ hoặc đã hết hạn!');
      }

      // Gán thông tin user đã verified vào request
      request.user = response.data.user;
      return true;
    } catch {
      throw new UnauthorizedException('Token không hợp lệ hoặc đã hết hạn!');
    }
  }
}
