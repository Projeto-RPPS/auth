// src/auth/auth.controller.ts
import {
  Controller,
  Post,
  Get,
  Body,
  Request,
  UseGuards,
  Res,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';               // ← importe isso
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiBearerAuth,
  ApiCookieAuth,
} from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './guards/JwtAuthGuard';
import { CreateAuthDto } from './dto/create-auth.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Login com CPF e senha' })
  @ApiBody({ type: CreateAuthDto })
  @ApiResponse({
    status: 200,
    schema: { example: { success: true } },
  })
  async login(
    @Body() dto: CreateAuthDto,
    @Res({ passthrough: true }) res: Response,   // ← aqui use o tipo do express
  ) {
    const user = await this.authService.validateUser(dto.cpf, dto.password);
    const { access_token } = await this.authService.login(user);
    res.cookie('Authentication', access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 1_200_000, // 20m
    });
    return { success: true };
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Logout (limpa o cookie)' })
  @ApiCookieAuth('cookieAuth')
  @ApiResponse({
    status: 200,
    schema: { example: { success: true } },
  })
  async logout(@Res({ passthrough: true }) res: Response) {
    res.clearCookie('Authentication');             // ← agora existe
    return { success: true };
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  @ApiCookieAuth('cookieAuth')
  @ApiOperation({ summary: 'Dados do usuário autenticado' })
  @ApiResponse({
    status: 200,
    schema: { example: { cpf: '12345678900', role: 'user' } },
  })
  me(@Request() req) {
    const { cpf, role } = req.user;
    return { cpf, role };
  }
}