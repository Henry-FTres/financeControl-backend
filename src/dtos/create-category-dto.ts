import { IsNotEmpty, IsString, Length } from 'class-validator';

// [LOCAL] Validação da criação de categoria: nome
export class CreateCategoryDTO {
  @IsString()
  @IsNotEmpty()
  @Length(3, 50)
  name: string = '';
}
