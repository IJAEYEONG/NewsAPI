import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../users/user.entity'; // User 엔티티 임포트
import { CreateUserDto } from '../dto/create-user.dto';
import { LoginUserDto } from 'src/dto/LoginUserDto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt'; // JwtService 임포트 추가

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService, // JwtService 주입
  ) {}

  // 회원가입 함수
  async register(createUserDto: CreateUserDto) {
    const { name, email, password } = createUserDto; // name 필드 추가

    // 이메일 중복 확인
    const existingUser = await this.userRepository.findOne({
      where: { email },
    });
    if (existingUser) {
      throw new Error('이미 존재하는 이메일입니다.');
    }

    // 비밀번호 해싱
    const hashedPassword = await bcrypt.hash(password, 10);

    // 새로운 사용자 생성
    const newUser = this.userRepository.create({
      name, // name 필드 추가
      email,
      password: hashedPassword,
    });

    console.log('새 사용자 생성: ', newUser); // 로그 추가

    // 사용자 저장
    try {
      await this.userRepository.save(newUser);
      console.log('사용자 저장 성공');
    } catch (error) {
      console.error('사용자 저장 실패: ', error);
      throw new Error('사용자 저장 중 오류가 발생했습니다.');
    }

    return newUser;
  }

  // 로그인 함수 - 로그인 성공 시 userId와 access_token을 반환
  async login(loginUserDto: LoginUserDto) {
    try {
      const user = await this.userRepository.findOne({
        where: { email: loginUserDto.email },
      });

      if (!user) {
        console.log('유저를 찾을 수 없습니다.');
        throw new Error('유저를 찾을 수 없습니다.');
      }

      const isPasswordValid = await bcrypt.compare(
        loginUserDto.password,
        user.password,
      );

      if (!isPasswordValid) {
        console.log('비밀번호가 틀렸습니다.');
        throw new Error('비밀번호가 틀렸습니다.');
      }

      // JWT 토큰 생성 시 만료 시간 설정
      const accessToken = this.jwtService.sign(
        { userId: user.id }, // 페이로드에 userId 포함
        { expiresIn: '1h' }, // 토큰의 만료 시간을 1시간으로 설정
      );

      return { userId: user.id, access_token: accessToken }; // userId와 access_token 함께 반환
    } catch (error) {
      console.error('로그인 에러:', error.message);
      throw new HttpException(
        '로그인에 실패했습니다.',
        HttpStatus.UNAUTHORIZED,
      );
    }
  }
}
