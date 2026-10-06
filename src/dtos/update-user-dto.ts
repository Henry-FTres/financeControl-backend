import { IsEmail, IsNotEmpty, IsOptional, IsString, Length, IsDateString } from "class-validator";

export class UpdateUserDTO {

    @IsOptional()
    @IsString()
    @IsNotEmpty()
    @Length(3, 100)
    name?: string;

    @IsOptional()
    @IsEmail()
    email?: string;

    @IsOptional()
    @IsString()
    phone?: string;

    @IsString()
    @Length(3, 100)
    @IsOptional()
    legalName?: string;

    @IsDateString()
    @IsOptional()
    birthDate?: string;

}