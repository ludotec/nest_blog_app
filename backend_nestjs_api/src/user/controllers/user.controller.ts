import { Body, Controller, Get, Param, Post, Put, Delete, UseGuards, Query, UploadedFile, Request, UseInterceptors, Response } from '@nestjs/common';
import { UserService } from '../services/user.service';
import { IUser, UserRole, File } from '../interfaces/user.interface';
import { Observable, catchError, map, of, switchMap, from, tap } from 'rxjs';
import { AuthService } from 'src/auth/services/auth.service';
import { hasRoles } from 'src/auth/decorators/roles.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { sendRoles } from 'src/auth/decorators/send-roles.decorator';
import { UserIsUserGuard } from 'src/auth/guards/userIsUser.guard';
import { Pagination } from 'nestjs-typeorm-paginate';
import { ConfigService } from '@nestjs/config';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { v4 as uuiv4 } from 'uuid';
import path = require('path');
import { IUserCreateResponse, UserCreateDto } from '../dto/user-create.dto';
import { IUserLoginResponse, UserLoginDto } from '../dto/user-login.dto';
import { IUserFindResponse } from '../dto/user-find.dto';

export const storage = {
    storage: diskStorage({
        destination: './uploads/profileImages',
        filename: (req, file, cb) => {
            const filename: string = path.parse(file.originalname).name.replace(/\s/g, '') + uuiv4();
            const extension: string = path.parse(file.originalname).ext;
            cb(null, `${filename}${extension}`);
        }
    })
} 

@Controller('users')
export class UserController {
    constructor(
        private userService: UserService,
        private readonly authService: AuthService,
        private configService: ConfigService
        ) {}

    @Post()
    create(@Body() user: UserCreateDto): Observable<
        {
            user: IUserCreateResponse,
            access_token: string
        }
        | { error: any }
        > {
        try {
            return this.userService.create(user).pipe(
                map(({user, token}) => {
                    return {
                        user: user,
                        access_token : token,
                    }
                } ),
            )
        }catch (err) {
            throw err;   
        }
    }

    @Post('login')
    login(@Body() user: UserLoginDto): Observable<IUserLoginResponse> {
        try {
            return this.userService.login(user).pipe(
                map((jwt: string)=> {
                    return { access_token: jwt };
                }),
            )
        }catch (err) {
            throw err;   
        }
    }


    // TODO user is user or user is Admin
    @Get(':id')
    findOneById(@Param() params): Observable<IUserFindResponse> {
        try {
            return this.userService.findOneById(params.id);
        }catch (err) {
            throw err;   
        }
    }

   // @hasRoles(UserRole.ADMIN)
    //@UseGuards(JwtAuthGuard, RolesGuard)
    @Post('email')
    findOneByEmail(@Body() user: IUser): Observable<IUser> {
        try {
            return this.userService.findOneByEmail(user);
        }catch (err) {
            throw err;   
        }
    }

    @Post('exist')
    emailExist(@Body() user: IUser): Observable<boolean> {
        try {
            return this.userService.emailExist(user);
        }catch (err) {
            throw err;   
        }
    }

    // @hasRoles(UserRole.ADMIN)
    // @UseGuards(JwtAuthGuard, RolesGuard)
    // @Get()
    // findAll(): Observable<IUser[]> {
    //     return this.userService.findAll();
    // }
    @Get()
    index(
        @Query('page') page = 1,
        @Query('limit') limit =  10,
        @Query('userName') userName: string,
    ): Observable<Pagination<IUser>> {
        limit = limit > 100 ? 100 : limit;
        
        const route = `${process.env.API_URL}:${process.env.API_PORT}/api/users`;
        console.log('#### route', route);
        try {
            if (userName === null || userName === undefined) {
                return this.userService.paginate({
                    page: Number(page),
                    limit: Number(limit),
                    route: route,
                });
            }else {
                return this.userService.paginateFilterByName(
                    {
                    page: Number(page),
                    limit: Number(limit),
                    route: route,
                    },
                    { userName }, 
                );
            }
        }catch (err) {
            throw err;   
        }
    }

    @UseGuards(JwtAuthGuard, UserIsUserGuard)
    @Put(':id')
    updateOne(@Param('id') id: string, @Body() user: IUser): Observable<any> {
        try {
            return this.userService.updateOne(Number(id), user);
        }catch (err) {
            throw err;   
        }
    }

    @UseGuards(JwtAuthGuard, UserIsUserGuard)
    @Put(':id/password')
    updatePassword(@Param('id') id: string, @Body() user: IUser): Observable<any> {
        try {
            return this.userService.updatePassword(Number(id), user);
        }catch (err) {
            throw err;   
        }
    }

    @UseGuards(JwtAuthGuard)
    @Post('upload')
    @UseInterceptors(FileInterceptor('file', storage))
    uploadFile(@UploadedFile() file, @Request() req): Observable<File> {
        const user: IUser = req.user;
        console.log('### Upload', this.configService.get('UPLOAD_IMAGE_URL')); 
        console.log('### file name: ', file.filename);
        
        try {
            return this.userService.updateOne(user.id, { profileImage: file.filename}).pipe(
            tap((user: IUser) => console.log(user.id)),
            map((user: IUser) => ({ profileImage: user.profileImage })),
            )
        }catch (err) {
            throw err;   
        }
    }

    @Get('profile-image/:imageName')
    findProfileImage(
        @Param('imageName') imageName, 
        @Response() resp
        ): Observable<unknown> {
        try {
            return of(
                resp.sendFile(
                    path.join(process.cwd(), 'uploads/profileImages', imageName),
                ),
            );
        }catch (err) {
            throw err;   
        }
    }

    // #################### ADMIN ######################################

    @hasRoles(UserRole.ADMIN)
    @UseGuards(JwtAuthGuard, RolesGuard)
    @sendRoles()
    @Put(':id/role')
    updateRoleOfUser(@Param('id') id: string, @Body() user: IUser): Observable<any> {
        const roles = Object.values(UserRole);
        try {
            if (roles.includes(user.role)) {
                return this.userService.updateRoleOfUser(Number(id), user);
            }else {
                return of({error: `Role '${user.role}' not allowed`});
            }
        }catch (err) {
            throw err;   
        }
    }
    
    @hasRoles(UserRole.ADMIN)
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Delete(':id')
    deleteOne(@Param('id') id: string): Observable<any> {
        try {
            return this.userService.deleteOne(Number(id));
        }catch (err) {
            throw err;   
        }
    }
}
