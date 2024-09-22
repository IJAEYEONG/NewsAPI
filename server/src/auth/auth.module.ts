import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../users/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User])], // User 엔티티 임포트
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
