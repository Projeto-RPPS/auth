// src/users/usuario.controller.ts
import {
  Controller, Post, Body, UseGuards, Get, Param
} from '@nestjs/common';
import {
  ApiTags, ApiOperation, ApiBearerAuth, ApiResponse, ApiBody
} from '@nestjs/swagger';
import { UsuarioService }  from './usuario.service';
import { CreateUsuarioDto } from './dto/create-usuario.dto';

@ApiTags('users')
@Controller('users')
export class UsuarioController {
  constructor(private readonly users: UsuarioService) {}

  // — Registro público de “user”
  @Post('register')
  @ApiOperation({ summary: 'Registrar usuário (role=user)' })
  @ApiResponse({ status: 201, description: 'Usuário criado.' })
  @ApiBody({ type: CreateUsuarioDto })
  register(@Body() dto: CreateUsuarioDto) {
    return this.users.create(dto.cpf, dto.password, 'user');
  }

  @Post('registerAdmin')
  @ApiOperation({ summary: 'Registrar usuário (role=admin)' })
  @ApiResponse({ status: 201, description: 'Admin criado.' })
  @ApiBody({ type: CreateUsuarioDto })
  registerAdmin(@Body() dto: CreateUsuarioDto) {
    return this.users.createAdmin(dto.cpf, dto.password, 'admin');
  }

  // opcional: buscar um usuário
  @Get()
  @ApiOperation({ summary: 'Listar todos os usuários' })
  @ApiResponse({
    status: 200,
    description: 'Retorna a lista de todos os usuários.',
  })
  findAll() {
    return this.users.findAll();
  }
}