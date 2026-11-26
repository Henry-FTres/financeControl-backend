import { IsNotEmpty, IsString, Length } from 'class-validator';

// Dados para criar uma categoria
export class CreateCategoryDTO {
  @IsString()
  @IsNotEmpty()
  @Length(3, 50)
  name: string = '';
}
