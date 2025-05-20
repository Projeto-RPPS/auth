import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService }       from '@nestjs/jwt';
import * as bcrypt          from 'bcrypt';
import { UsuarioService }   from '../usuario/usuario.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly users: UsuarioService,
    private readonly jwt: JwtService,
  ) {}

  async validateUser(cpf: string, plain: string) {
    const user = await this.users.findByCpf(cpf);
    if (!user) throw new UnauthorizedException('Usuário não encontrado');
    const match = await bcrypt.compare(plain, user.password);
    if (!match) throw new UnauthorizedException('Senha inválida');
    return user;
  }

  async login(user: any) {
    const payload = { sub: user.id, cpf: user.cpf, role: user.role };
    return { access_token: this.jwt.sign(payload) };
  }
}