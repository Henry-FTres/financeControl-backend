import { IsEmail, IsNotEmpty, IsOptional, IsString, Length } from "class-validator";

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

}