// src/users/user.entity.ts
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

export type UserRole = 'user' | 'admin';

@Entity('usuario')
export class Usuario {
  @ApiProperty({ example: '1', description: 'ID auto-increment' })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ example: '12345678900', description: 'CPF sem formatação' })
  @Column({ unique: true })
  cpf: string;

  @ApiProperty({ example: 'senha123!', description: 'Hash da senha' })
  @Column()
  password: string;

  @ApiProperty({ example: 'user', enum: ['user','admin'] })
  @Column({ default: 'user' })
  role: UserRole;
}