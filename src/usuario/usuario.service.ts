// src/users/usuario.service.ts
import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Usuario } from './entities/usuario.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsuarioService {
  constructor(@InjectRepository(Usuario) private repo: Repository<Usuario>) {}

  async create(cpf: string, plain: string, role: Usuario['role'] = 'user') {
    if (await this.repo.findOne({ where: { cpf } }))
      throw new BadRequestException('CPF já cadastrado');
    const password = await bcrypt.hash(plain, 10);
    return this.repo.save(this.repo.create({ cpf, password, role }));
  }

  async createAdmin(cpf: string, plain: string, role: Usuario['role'] = 'admin') {
    if (await this.repo.findOne({ where: { cpf } }))
      throw new BadRequestException('CPF já cadastrado');
    const password = await bcrypt.hash(plain, 10);
    return this.repo.save(this.repo.create({ cpf, password, role }));
  }

  findByCpf(cpf: string) {
    return this.repo.findOne({ where: { cpf } });
  }

  async findById(id: number) {
    const user = await this.repo.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException(`Usuário com id ${id} não encontrado`);
    }
    return user;
  }

  findAll(): Promise<Usuario[]> {
    return this.repo.find();
  }
}