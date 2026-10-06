import { IsBoolean, IsDateString, IsEnum, IsInt, IsNotEmpty, IsNumber, IsOptional, IsPositive, IsString } from "class-validator";
import { TransactionType } from "../../prisma/generated/prisma/client";

export class UpdateTransactionDTO {

    @IsOptional()
    @IsDateString()
    date?: string;

    @IsOptional()
    @IsNumber({ maxDecimalPlaces: 2 })
    @IsPositive()
    amount?: number;

    @IsOptional()
    @IsEnum(TransactionType)
    transactionType?: TransactionType;

    @IsOptional()
    @IsString()
    description?: string;

    @IsOptional()
    @IsString()
    @IsNotEmpty()
    counterparty?: string;

    @IsOptional()
    @IsBoolean()
    fixed?: boolean;

    @IsOptional()
    @IsInt()
    categoryId?: number;

}