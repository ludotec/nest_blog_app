import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '../models/user.entity';
import { Like, Repository } from 'typeorm';
import { IUser, UserRole } from '../interfaces/user.interface';
import { Observable,  from, throwError } from 'rxjs';
import { map, switchMap, catchError } from 'rxjs/operators';
import { AuthService } from 'src/auth/services/auth.service';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(UserEntity) private readonly userRepository: Repository<UserEntity>,
        private readonly authService: AuthService
    ) {}

    login(user: IUser): Observable<string> {
        console.log('### user: ', user);
        return this.validateUser(user.email, user.password).pipe(
            switchMap((user: IUser)=> {
                if (user) {
                    return this.authService.generateJWT(user).pipe(
                        map((jwt: string)=> jwt )
                    );
                }else {
                    return 'Wrong credentials';
                }
            })
        )
    }

    private validateUser(email: string, password: string): Observable<IUser> {
        return from(
            this.findByEmail(email).pipe(
                switchMap((user: IUser)=> {
                    return this.authService
                        .comparePasswords(password, user.password).pipe(
                            map((match: boolean)=> {
                                if(match) {
                                    const {password, ...result} = user;
                                    return result;
                                }else {
                                    throw Error;
                                }
                            })
                        )
                })
            ),
        );
    }

    private findByEmail(email: string): Observable<IUser> {
        return from(
            this.userRepository.findOne({
                select: ['id', 'name', 'email', 'password'],
                where: { email: email }, 
            })
        )
    }

    create(user: IUser): Observable<IUser> {
        return this.authService.hashPassword(user.password).pipe(
            switchMap((passwordHash: string) => {
                const newUser = new UserEntity();
                newUser.name = user.name;
                newUser.email = user.email;
                newUser.password = passwordHash;
                
                // only for dev/test mode
                if (process.env.CONTROL === 'prod' || process.env.CONTROL === 'dev') {
                    newUser.role = UserRole.USER;
                }

                if (user.email == 'admin@admin.com' && process.env.NODE_ENV !== 'prod') {
                    newUser.role = UserRole.ADMIN;
                    console.log('#### ADMIN REGISTER ####', newUser);
                }
                // #################################################
                return from(this.userRepository.save(newUser)).pipe(
                    map((user: IUser) => {
                        const {password, ...result} = user;
                        return result;
                    }),
                    catchError((err) => throwError(() => err))
                );
            }),
        );
        
    }

    findAll(): Observable<IUser[]> {
        return from(this.userRepository.find()).pipe(
         map((users: IUser[])=> {
             users.forEach((user)=> {
                 delete user.password
             });
             return users;
         }),
        );
     
     }

     findOne(id: number): Observable<IUser> {
        return from(this.userRepository.findOneBy({ id })).pipe(
            map((user: IUser)=> {
                if(user) {
                    const { password, ...result } = user;
                    return result;
                }else {
                    return null;
                }
            }),
        );
    }

    findOneByEmail(user: IUser): Observable<IUser> {
        return from(this.userRepository.findOne({
            select: ['id', 'name', 'email', 'role'],
            where: {email: user.email}}));
    }

    emailExist(user: IUser): Observable<boolean> {
        return from(this.userRepository.findOne({
            where: {
                email: Like(`%${user.email}%`)
            }
        }).then((resp) => {
            if (resp !== null){
                return true;
            } else {
                return false;
            } 
        } ),
        );
    }

    updateOne(id: number, user: IUser): Observable<any> {
        delete user.email;
        delete user.password;
        delete user.role;
        delete user.id;

        return from(this.userRepository.update(Number(id), user)).pipe(
            switchMap(()=> this.findOne(id)),
        );
    }

    updatePassword(id: number, user: IUser): Observable<any> {
        delete user.email;
        delete user.name;
        delete user.role;
        delete user.id;


        return from(this.authService.hashPassword(user.password)).pipe(
            switchMap((passwordHash: string) => {
                //const newUser = new UserEntity();
                //newUser.password = passwordHash;
                user.password = passwordHash;
                return from(this.userRepository.update(Number(id), user)).pipe(
                    switchMap(() => this.findOne(id)),
                )
            }),
        );
    }
 
    updateRoleOfUser(id: number, user: IUser): Observable<any> {
        delete user.email;
        delete user.password;
        delete user.name;

        return from(this.userRepository.update(Number(id), user));
    }

    deleteOne(id: number): Observable<any> {
        return from(this.userRepository.delete(id));
    }

}
