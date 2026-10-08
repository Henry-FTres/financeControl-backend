import {
  IsBoolean,
  IsDateString,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
} from 'class-validator';
import { TransactionType } from '../../prisma/generated/prisma/client';

export class CreateTransactionDTO {
  @IsInt()
  accountId!: number;

  @IsDateString()
  date!: string;

  // sempre positivo: o tipo (ENTRADA/SAIDA) define se soma ou subtrai do saldo
  @IsNumber({ maxDecimalPlaces: 2 })
  @IsPositive()
  amount!: number;

  @IsEnum(TransactionType)
  transactionType!: TransactionType;

  @IsOptional()
  @IsString()
  description?: string;

  // quem pagou ou recebeu (ex.: "Supermercado X", "Empresa Y")
  @IsString()
  @IsNotEmpty()
  counterparty!: string;

  // se é uma movimentação fixa/recorrente (ex.: aluguel, salário)
  @IsOptional()
  @IsBoolean()
  fixed?: boolean;

  @IsOptional()
  @IsInt()
  categoryId?: number;
}
