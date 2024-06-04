import { IsEmail, IsString, MaxLength, MinLength } from "class-validator";

export class UserLoginDto {
    @IsEmail({}, { message: 'Must be a valid email' })
    email: string;
    
    @MaxLength(50, {message: 'Password must be less than 50 characters'})
    @MinLength(8, {message: 'Password must be at least 8 characters'})
    @IsString({message: 'Password must be a string'})
    password: string;
 
}

export interface IUserLoginResponse {
    access_token: string;
}