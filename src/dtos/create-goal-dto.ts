import {
  IsDateString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
} from 'class-validator';

// [LOCAL] Validação da criação de meta: valor alvo, prazo e descrição
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
