import {
  IsDateString,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
  ValidateIf,
} from 'class-validator';
import { PersonType } from '../../prisma/generated/prisma/client';

export class CreateUserDTO {
  @IsString()
  @IsNotEmpty()
  @Length(3, 100)
  name: string = '';

  @IsString()
  @IsEmail()
  @IsNotEmpty()
  email: string = '';

  @IsString()
  @IsNotEmpty()
  password: string = '';

  @IsEnum(PersonType)
  personType!: PersonType;

  // Pessoa física
  @ValidateIf((o) => o.personType === PersonType.FISICA)
  @IsString()
  @IsNotEmpty()
  cpf?: string;

  @ValidateIf((o) => o.personType === PersonType.FISICA)
  @IsDateString()
  birthDate?: string;

  // Pessoa jurídica
  @ValidateIf((o) => o.personType === PersonType.JURIDICA)
  @IsString()
  @IsNotEmpty()
  cnpj?: string;

  @ValidateIf((o) => o.personType === PersonType.JURIDICA)
  @IsString()
  @IsNotEmpty()
  legalName?: string;

  @IsString()
  @IsOptional()
  phone?: string;
}
