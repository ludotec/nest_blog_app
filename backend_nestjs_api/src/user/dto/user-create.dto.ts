import { BlogEntry } from "src/blog/interfaces/blog-entry.interface";
import { UserRole } from "../interfaces/user.interface";
import {
    MaxLength,
    MinLength,
    IsString,
    IsEmail,
    IsOptional,
    Matches,
} from 'class-validator';

export class UserCreateDto {
    @IsString({message: 'Name must be a string'})
    @MinLength(3, { message: 'Name must be at least 3 characters' })
    @MaxLength(50, { message: 'Name must be less than 50 characters' })
    userName: string;
    
    @IsEmail({}, { message: 'Must be a valid email' })
    email: string;
    
    @MaxLength(50, { message: 'Password must be less than 50 characters' })
    @MinLength(8, { message: 'Password must be at least 8 characters' })
    @IsString({message: 'Password must be a string'})
    password: string;

    @MaxLength(50, {message: 'Password must be less than 50 characters'})
    @MinLength(8, {message: 'Confirm Password must be at least 8 characters'})
    @IsString({message: 'Confirm Password must be a string'})
    confirmPassword: string;
    
    @IsOptional()
    @IsString({message: 'Must be a string'})
    @Matches(/^https?:\/\/assets\/images\/[\w.-_]+(png|jpg)$/,{
        message: 'Invalid image URL'
    })
    profileImage: string | null;
    
 }

 export interface IUserCreateResponse {
    id: number;
    name: string;
    email: string;
    role: string;
    profileImage: string | null;
    blogEntries: BlogEntry[];
 }