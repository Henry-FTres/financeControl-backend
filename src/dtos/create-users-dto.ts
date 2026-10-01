import { IsDateString, IsEmail, IsNotEmpty, IsOptional, IsString, Length } from "class-validator";
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
    passwordHash: string = '';

    @IsString()
    @IsNotEmpty()
    cpf: string = '';

    @IsString()
    @IsNotEmpty()
    @IsDateString()
    birthDate: string = '';

    @IsString()
    @IsOptional()
    phone?: string;

}
