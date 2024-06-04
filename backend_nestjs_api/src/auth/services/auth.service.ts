import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { Observable, from } from 'rxjs';
import { IUser } from 'src/user/interfaces/user.interface';

@Injectable()
export class AuthService {

    constructor(
        private readonly jwtService: JwtService) {}

    generateJWT(user: IUser): Observable<string> {
        try {
            return from(this.jwtService.signAsync({ user }));
        }catch (err) {
            throw err;
        }
    }

    hashPassword(password: string): Observable<string> {
        try {
            return from<string>(bcrypt.hash(password, 12));
        }catch (err) {
            throw err;
        }
    }

    comparePasswords( passwordSended: string, passwordHash: string): Observable<any> {
        const match= bcrypt.compare(passwordSended, passwordHash);
        try {
            return from<any | boolean>(match);
        }catch (err) {
            throw err;
        }
    }  
}
