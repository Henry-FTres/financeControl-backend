import { IsNotEmpty, IsString, Length } from 'class-validator';

export class CreateCategoryDTO {
  @IsString()
  @IsNotEmpty()
  @Length(3, 50)
  name: string = '';
}
