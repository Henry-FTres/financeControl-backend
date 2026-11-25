import { IsNotEmpty, IsString, Length } from 'class-validator';

// [LOCAL] Validação da edição de categoria: nome
export class UpdateCategoryDTO {
  @IsString()
  @IsNotEmpty()
  @Length(3, 50)
  name: string = '';
}
