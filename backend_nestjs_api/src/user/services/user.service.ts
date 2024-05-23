import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '../models/user.entity';
import { Like, Repository } from 'typeorm';
import { IUser, UserRole } from '../interfaces/user.interface';
import { Observable,  from, throwError } from 'rxjs';
import { map, switchMap, catchError } from 'rxjs/operators';
import { AuthService } from 'src/auth/services/auth.service';
import {
    paginate,
    Pagination,
    IPaginationOptions,
  } from 'nestjs-typeorm-paginate';

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
            }),
        );
    } 

    private validateUser(email: string, password: string): Observable<IUser> {
        return from(
            this.findByEmail(email.toLowerCase()).pipe(
                switchMap((user: IUser)=> {
                    return this.authService
                        .comparePasswords(password, user.password).pipe(
                            map((match: boolean)=> {
                                if(match) {
                                    const {password, ...result} = user;
                                    return result;
                                }else {
                                    throw new UnauthorizedException('Wrong Credntials');
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
                select: ['id', 'name', 'email', 'role', 'password'],
                where: { email: email }, 
            }).then((user: IUser) => {
                if (!user) {
                    throw new NotFoundException('User not found');
                }else {
                    return user;
                }
            }),
        );
    }

    create(user: IUser): Observable<{ user: IUser, token: string  }> {
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
                    switchMap((createdUser: IUser) => {
                        const {password, ...result} = createdUser;
                        return this.authService.generateJWT(createdUser).pipe(
                            map((token: string) => ({
                                user: result,
                                token: token,
                            })),
                        );
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

    paginate(options: IPaginationOptions): Observable<Pagination<IUser>> {
        return from(paginate<IUser>(this.userRepository, options)).pipe(
            map((usersPageable: Pagination<IUser>) => {
                usersPageable.items.forEach((user) => {
                    delete user.password;
                });
                return usersPageable;
            }),
            
        );
    }

    paginateFilterByName(options: IPaginationOptions, user: IUser) {
        return from(this.userRepository.findAndCount({
            skip: Number(options.page) * Number(options.limit) || 0,
            take: Number(options.limit) || 10,
            order: {id: 'ASC'},
            select: ['id', 'name', 'email', 'role'],
            where: [
                { name: Like(`%${user.name}%`), },
            ],
        })
        ).pipe(
            map(([users, totalUsers]) => {
                const usersPageable: Pagination<IUser> = {
                    items: users,
                    links: {
                        first: options.route + `?limit=${options.limit}`,
                        previous: options.route + '',
                        next: options.route + `?limit=${options.limit}&page=${Number(options.page) + 1}`,
                        last: options.route + `?limit=${options.limit}&page=${Math.ceil(totalUsers / Number(options.page)) +1 }`,
                    },
                    meta: {
                        currentPage: Number(options.page),
                        itemCount: totalUsers,
                        itemsPerPage: Number(options.limit),
                        totalItems: totalUsers,
                        totalPages: Math.ceil(totalUsers / Number(options.page))
                    },
                };
                return usersPageable;
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
                const newUser = new UserEntity();
                newUser.password = passwordHash;

                return from(this.userRepository.update(Number(id), newUser)).pipe(
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
