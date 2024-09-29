import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false, // 만료된 토큰은 유효하지 않게 설정
      secretOrKey: 'your_jwt_secret', // 비밀키 설정
    });
  }

  async validate(payload: any) {
    return { userId: payload.sub, email: payload.email }; // 토큰이 유효할 경우 사용자 정보 반환
  }
}
