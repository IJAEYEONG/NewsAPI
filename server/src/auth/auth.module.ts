import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm'; // TypeOrmModule 추가
import { User } from '../users/user.entity'; // User 엔티티 임포트
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from 'src/users/jwt.strategy';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]), // UserRepository 임포트
    JwtModule.register({
      secret: 'your_jwt_secret', // 비밀키 설정
      signOptions: { expiresIn: '1h' }, // 토큰 만료 시간 설정
    }),
  ],
  providers: [AuthService, JwtStrategy],
  controllers: [AuthController],
})
export class AuthModule {}
