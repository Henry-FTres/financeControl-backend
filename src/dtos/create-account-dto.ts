import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { AccountType } from '../../prisma/generated/prisma/client';

export class CreateAccountDTO {
  @IsString()
  @IsNotEmpty()
  accountNumber!: string;

  @IsString()
  @IsNotEmpty()
  institution!: string;

  @IsOptional()
  @IsString()
  pixKey?: string;

  @IsEnum(AccountType)
  accountType!: AccountType;

  // saldo inicial da conta; depois da criação, só as transações alteram o saldo
  @IsNumber({ maxDecimalPlaces: 2 })
  balance!: number;
}
