import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { AccountType } from '../../prisma/generated/prisma/client';

// [LOCAL] Validação da edição de conta (sem o campo saldo)
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
