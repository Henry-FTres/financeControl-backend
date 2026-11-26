import { IsNotEmpty, IsString, Length } from 'class-validator';

// Dados para renomear a categoria
export class UpdateCategoryDTO {
  @IsString()
  @IsNotEmpty()
  @Length(3, 50)
  name: string = '';
}
