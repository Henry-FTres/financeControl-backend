import { IsDateString, IsNotEmpty, IsNumber, IsOptional, IsPositive, IsString } from 'class-validator';

export class CreateGoalDTO {

    @IsNumber()
    @IsNotEmpty()
    @IsPositive()
    targetAmount: number = 0;

    @IsDateString()
    @IsNotEmpty()
    deadline: string = '';

    @IsString()
    @IsOptional()
    description?: string;

}