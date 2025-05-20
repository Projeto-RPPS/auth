import { Module }               from '@nestjs/common';
import { JwtModule }            from '@nestjs/jwt';
import { PassportModule }       from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { AuthService }          from './auth.service';
import { AuthController }       from './auth.controller';
import { UsuarioModule }        from '../usuario/usuario.module';
import { LocalStrategy } from './local/LocalStrategy';
import { JwtStrategy } from './jwt/JwtStrategy';

@Module({
  imports: [
    UsuarioModule,
    PassportModule,
    ConfigModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (cs: ConfigService) => ({
        secret: cs.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: cs.get<string>('JWT_EXPIRES_IN') },
      }),
    }),
  ],
  providers: [AuthService, LocalStrategy, JwtStrategy],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
