// src/auth/auth.controller.ts
import {
  Controller,
  Post,
  Get,
  Body,
  Request,
  UseGuards,
  UnauthorizedException,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './guards/JwtAuthGuard';
import { CreateAuthDto } from './dto/create-auth.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @ApiOperation({ summary: 'Login com CPF e senha' })
  @ApiBody({ type: CreateAuthDto })
  @ApiResponse({
    status: 201,
    schema: { example: { access_token: 'eyJhbGci…' } },
  })
  async login(@Body() dto: CreateAuthDto) {
    const user = await this.authService.validateUser(dto.cpf, dto.password);
    return this.authService.login(user);
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Dados do usuário autenticado' })
  @ApiResponse({
    status: 200,
    schema: {
      example: { cpf: '12345678900', role: 'user' },
    },
  })
  me(@Request() req) {
    const { cpf, role } = req.user;
    return { cpf, role };
  }
}