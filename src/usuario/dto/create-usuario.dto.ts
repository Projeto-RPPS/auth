import { ApiProperty } from '@nestjs/swagger';
import { IsString, Length, IsOptional, IsIn } from 'class-validator';
import { UserRole } from '../entities/usuario.entity';

export class CreateUsuarioDto {
  @ApiProperty({ example: '12345678900', description: 'CPF sem formatação (11 dígitos)' })
  @IsString()
  @Length(11, 11)
  cpf: string;

  @ApiProperty({ example: 'Senha@123', description: 'Senha em texto plano' })
  @IsString()
  password: string;

  @ApiProperty({ example: 'user/admin', enum: ['user','admin'], default: 'user', required: false })
  @IsOptional()
  @IsIn(['user','admin'])
  role?: UserRole;
}