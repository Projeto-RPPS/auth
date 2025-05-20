import { Injectable }       from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { ConfigService }    from '@nestjs/config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(cs: ConfigService) {
    const secret = cs.get<string>('JWT_SECRET');
    if (!secret) {
      throw new Error('JWT_SECRET não está definido no .env');
    }
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
      req => req?.cookies?.Authentication,
    ]),
      secretOrKey: secret,           // agora sempre string
      ignoreExpiration: false,
    });
  }

  async validate(payload: any) {
    return { userId: payload.sub, cpf: payload.cpf, role: payload.role };
  }
}