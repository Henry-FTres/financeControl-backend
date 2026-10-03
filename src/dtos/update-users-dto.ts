import { IsEmail, IsOptional, IsString, Length } from "class-validator";
export class UpdateUserDTO {

    @IsString()
    @Length(3, 100)
    @IsOptional()
    name?: string;

    @IsString()
    @IsEmail()
    @IsOptional()
    email?: string;

    @IsString()
    @IsOptional()
    phone?: string;

}
