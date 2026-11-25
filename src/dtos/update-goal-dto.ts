import {
  IsDateString,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  Min,
} from 'class-validator';

// [LOCAL] Validação da edição de meta (inclui o valor já guardado)
export class UpdateGoalDTO {
  @IsNumber()
  @IsPositive()
  @IsOptional()
  targetAmount?: number;

  @IsDateString()
  @IsOptional()
  deadline?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsNumber()
  @IsOptional()
  @Min(0)
  currentAmount?: number;
}
