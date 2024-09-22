import {
  Controller,
  Get,
  Post,
  Body,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from '../dto/create-user.dto';
import { LoginUserDto } from 'src/dto/LoginUserDto';

@Controller('auth')
export class AuthController {
  userRepository: any;
  constructor(private readonly authService: AuthService) {}

  // 회원가입 엔드포인트
  @Post('register')
  async register(@Body() createUserDto: CreateUserDto) {
    try {
      const user = await this.authService.register(createUserDto);
      return user;
    } catch (error) {
      throw new HttpException(
        '이미 존재하는 이메일입니다.',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  // 로그인 엔드포인트
  @Post('login')
  async login(@Body() loginUserDto: LoginUserDto) {
    try {
      const result = await this.authService.login(loginUserDto);

      // 로그인 성공 시 userId 반환
      return { userId: result.userId };
    } catch (error) {
      throw new HttpException(
        '로그인에 실패했습니다.',
        HttpStatus.UNAUTHORIZED,
      );
    }
  }

  // 카카오 로그인 엔드포인트 (임시)
  @Get('kakao-login')
  async kakaoLogin() {
    // 카카오톡 OAuth 로그인 처리
  }
}
