import { Injectable, BadRequestException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { User } from './user.entity';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  // 1. Logic Đăng ký
  async register(body: any) {
    const { email, password } = body;

    // Kiểm tra trùng email
    const existingUser = await this.userRepository.findOne({ where: { email } });
    if (existingUser) {
      throw new BadRequestException('Email này đã được sử dụng!');
    }

    // Mã hóa mật khẩu
    const hashedPassword = await bcrypt.hash(password, 10);

    // Lưu vào Database
    const user = this.userRepository.create({
      email,
      password: hashedPassword,
    });
    await this.userRepository.save(user);

    return { message: 'Đăng ký tài khoản thành công!' };
  }

  // 2. Logic Đăng nhập
  async login(body: any) {
    const { email, password } = body;

    // Tìm user
    const user = await this.userRepository.findOne({ where: { email } });
    if (!user) {
      throw new UnauthorizedException('Email hoặc mật khẩu không chính xác!');
    }

    // So sánh mật khẩu
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Email hoặc mật khẩu không chính xác!');
    }

    // Tạo JWT Token
    const payload = { sub: user.id, email: user.email };
    const accessToken = this.jwtService.sign(payload);

    return {
      message: 'Đăng nhập thành công!',
      accessToken,
      user: { id: user.id, email: user.email },
    };
  }
  
  // Thêm hàm này vào trong AuthService (tuần 2)
  verifyToken(token: string) {
    try {
      const secretKey = 'MY_SECRET_KEY_123'; // Trùng với secret khi đăng ký JwtModule
      const payload = this.jwtService.verify(token, { secret: secretKey });
      return { valid: true, user: payload };
    } catch (error) {
      throw new UnauthorizedException('Token không hợp lệ!');
    }
  }
}