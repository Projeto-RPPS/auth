import { Strategy }           from 'passport-local';
import { PassportStrategy }   from '@nestjs/passport';
import { Injectable }         from '@nestjs/common';
import { AuthService } from '../auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private auth: AuthService) {
    super({ usernameField: 'cpf', passwordField: 'password' });
  }

  async validate(cpf: string, password: string) {
    return this.auth.validateUser(cpf, password);
  }
}
