import { Catch, HttpException, HttpStatus, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '../models/user.entity';
import { Like, Repository } from 'typeorm';
import { IUser, UserRole } from '../interfaces/user.interface';
import { Observable, from, throwError } from 'rxjs';
import { map, switchMap, catchError } from 'rxjs/operators';
import { AuthService } from 'src/auth/services/auth.service';
import {
    paginate,
    Pagination,
    IPaginationOptions,
} from 'nestjs-typeorm-paginate';
import { ErrorHandler } from 'src/core/errors/error.handler';
import { IUserCreateResponse, UserCreateDto } from '../dto/user-create.dto';
import { IUserLoginResponse, UserLoginDto } from '../dto/user-login.dto';
import { IUserFindResponse } from '../dto/user-find.dto';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(UserEntity) private readonly userRepository: Repository<UserEntity>,
        private readonly authService: AuthService
    ) { }


    login(user: UserLoginDto): Observable<string> {
        // console.log('### user: ', user);
        try {
            return this.validateUser(user.email, user.password).pipe(
                switchMap((user: UserLoginDto) => {
                    if (user) {
                        return this.authService
                        .generateJWT(user)
                        .pipe(map((jwt: string) => jwt)
                        );
                    } else {
                        ErrorHandler.handleUnauthorizedError('Wrong credentials')
                    }
                }),
            );
        }catch(err) {
            throw err;
        }
    }

    private validateUser(email: string, password: string): Observable<IUser> {
        try {
            return from(
                this.findByEmail(email.toLowerCase()).pipe(
                    switchMap((user: IUser) => {
                        return this.authService
                            .comparePasswords(password, user.password).pipe(
                                map((match: boolean) => {
                                    if (match) {
                                        const { password, ...result } = user;
                                        return result;
                                    } else {
                                        ErrorHandler.handleUnauthorizedError('Wrong Credntials');
                                    }
                                })
                            )
                    })
                ),
            );
        }catch (err) {
            throw err;
        }
    }

    private findByEmail(email: string): Observable<IUser> {
        try {
            return from(
                this.userRepository.findOne({
                    select: ['id', 'userName', 'email', 'role', 'password'],
                    where: { email: email },
                }).then((user: IUser) => {
                    if (!user) {
                        ErrorHandler.handleNotFoundError('User not found');
                    } else {
                        return user;
                    }
                }),
            );
        }catch (err) {
            throw err;
        }
    }

    create(user: UserCreateDto): Observable<{ user: IUserCreateResponse, token: string }> {
        // TODO validar todos los campos
        try {
            return this.authService.hashPassword(user.password).pipe(
                switchMap((passwordHash: string) => {
                    if (passwordHash.length === 0) {
                        ErrorHandler.handleBadRequestError('Password not valid, something is wrong')
                    }
                    const newUser = new UserEntity();
                    newUser.userName = user.userName;
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
                            if (!createdUser) {
                                ErrorHandler.handleBadRequestError('User not created, something is wrong');
                            }
                            const { password, ...result } = createdUser;

                            const userResponseDto: IUserCreateResponse = {
                                id: result.id!,
                                name: result.userName!,
                                email: result.email!,
                                role: result.role!,
                                profileImage: result.profileImage,
                                blogEntries: result.blogEntries,
                            }
                            return this.authService.generateJWT(createdUser).pipe(
                                map((token: string) => ({
                                    user: userResponseDto,
                                    token: token,
                                })),
                                catchError(() => {
                                    throw ErrorHandler.handleBadRequestError('Token not created, something went wrong ##');
                                }),
                            );
                        }),
                    );
                }),
            );
        } catch (err) {
            throw err;
        }
    }

    findAll(): Observable<IUserFindResponse[]> {
        try {   
            return from(this.userRepository.find()).pipe(
                map((users: IUser[]) => {
                    return users.map((user) => this.transformUserToResponse(user));
                }),
            );
        }catch (err) {
            throw err;
        }
    }

    paginate(options: IPaginationOptions): Observable<Pagination<IUser>> {
        try {
            return from(paginate<IUser>(this.userRepository, options)).pipe(
                map((usersPageable: Pagination<IUser>) => {
                    usersPageable.items.forEach((user) => {
                        delete user.password;
                    });
                    return usersPageable;
                }),
            );
        }catch (err) {
            throw err;
        }
    }

    paginateFilterByName(options: IPaginationOptions, user: IUser) {
        try {
            return from(this.userRepository.findAndCount({
                skip: Number(options.page) * Number(options.limit) || 0,
                take: Number(options.limit) || 10,
                order: { id: 'ASC' },
                select: ['id', 'userName', 'email', 'role'],
                where: [
                    { userName: Like(`%${user.userName}%`), },
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
                            last: options.route + `?limit=${options.limit}&page=${Math.ceil(totalUsers / Number(options.page)) + 1}`,
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
        }catch (err) {
            throw err;
        }
    }

    findOneById(id: number): Observable<IUserFindResponse> {
        try {
            return from(this.userRepository.findOneBy({ id })).pipe(
                map((user: IUserFindResponse) => {
                    if (!user) {
                        ErrorHandler.handleNotFoundError('user not found');
                    }
                    return this.transformUserToResponse(user);
                }),
            );
        }
        catch (err) {
            throw err;
        }
        
    }

    private transformUserToResponse(user: IUser): IUserFindResponse {
        const {password, ...result } = user;
        return  {
                    id: result.id,
                    userName: result.userName,
                    email: result.email,
                    role: result.role,                   
                    profileImage: result.profileImage,
                    blogEntries: result.blogEntries,
                 }
    }

    findOneByEmail(user: IUser): Observable<IUserFindResponse> {
        try {
            return from(this.userRepository.findOne({
                where: { email: user.email }
            })).pipe(
                map((user: IUser) => {
                    if (!user) {
                        ErrorHandler.handleNotFoundError('User not found')
                    } else {
                        return this.transformUserToResponse(user);
                    }
                })
            );
        }catch (err) {
            throw err;
        }
    }

    findOneByUserName(user: IUser): Observable<IUserFindResponse> {
        try {
            return from(this.userRepository.findOne({
                where: { userName: user.userName }
            })).pipe(
                map((user: IUser) => {
                    if (!user) {
                        ErrorHandler.handleNotFoundError('User not found')
                    } else {
                        return this.transformUserToResponse(user);
                    }
                })
            );
        }catch (err) {
            throw err;
        }
    }

    emailExist(user: IUser): Observable<boolean> {
        try {
            return from(this.userRepository.findOne({
                where: {
                    email: Like(`%${user.email}%`)
                }
                }).then((resp) => {
                    if (resp !== null) {
                        return true;
                    } else {
                        return false;
                    }
                }),
            );
        }catch (err) {
            throw err;
        }
    }

    updateOne(id: number, user: IUser): Observable<any> {
        delete user.email;
        delete user.password;
        delete user.role;
        delete user.id;

        try {
            return from(this.userRepository.update(Number(id), user)).pipe(
                switchMap(() => this.findOneById(id)),
            );
        }catch (err) {
            throw err;
        }
    }

    updatePassword(id: number, user: IUser): Observable<any> {
        delete user.email;
        delete user.userName;
        delete user.role;
        delete user.id;

        try {
            return from(this.authService.hashPassword(user.password)).pipe(
                switchMap((passwordHash: string) => {
                    const newUser = new UserEntity();
                    newUser.password = passwordHash;

                    return from(this.userRepository.update(Number(id), newUser)).pipe(
                        switchMap(() => this.findOneById(id)),
                    )
                }),
            );
        }catch (err) {
            throw err;
        }
    }

    updateRoleOfUser(id: number, user: IUser): Observable<any> {
        delete user.email;
        delete user.password;
        delete user.userName;
        try {
            return from(this.userRepository.update(Number(id), user));
        }catch (err) {
            throw err;
        }
        
    }

    deleteOne(id: number): Observable<any> {
        try {
            return from(this.userRepository.delete(id));
        }catch (err) {
            throw err;
        }
    }

}
