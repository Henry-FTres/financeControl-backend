import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { AccountType } from '../../prisma/generated/prisma/client';

// Dados para editar a conta, sem o saldo
export class UpdateAccountDTO {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  accountNumber?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  institution?: string;

  @IsOptional()
  @IsString()
  pixKey?: string;

  @IsOptional()
  @IsEnum(AccountType)
  accountType?: AccountType;
}
