import {
  Controller,
  Post,
  Body,
  HttpException,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from '../dto/create-user.dto';
import { LoginUserDto } from 'src/dto/LoginUserDto';
import { JwtAuthGuard } from 'src/users/jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
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

  @Post('login')
  async login(@Body() loginUserDto: LoginUserDto) {
    try {
      const result = await this.authService.login(loginUserDto);
      return { userId: result.userId, access_token: result.access_token };
    } catch (error) {
      throw new HttpException(
        '로그인에 실패했습니다.',
        HttpStatus.UNAUTHORIZED,
      );
    }
  }

  @Post('validate-token')
  @UseGuards(JwtAuthGuard)
  async validateToken() {
    return { valid: true };
  }
}
