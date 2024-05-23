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
    create(@Body() user: IUser): Observable<{user: IUser, access_token: string} | { error: any }> {
        return this.userService.create(user).pipe(
            map(({user, token}) => {
                return {
                    user: user,
                    access_token : token,
                }
            } ),
            catchError((err)=> of({ error: err.message })),            
        )
    }

    @Post('login')
    login(@Body() user: IUser): Observable<{ access_token: any }> {
        return this.userService.login(user).pipe(
            map((jwt: string)=> {
                return { access_token: jwt };
            }),
        )
    }


    // TODO user is user or user is Admin
    @Get(':id')
    findOne(@Param() params): Observable<IUser> {
        return this.userService.findOne(params.id)
    }

    @hasRoles(UserRole.ADMIN)
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Post('email')
    findOneByEmail(@Body() user: IUser): Observable<IUser> {
        return this.userService.findOneByEmail(user);
    }

    @Post('exist')
    emailExist(@Body() user: IUser): Observable<boolean> {
        return this.userService.emailExist(user);
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
        @Query('name') name: string,
    ): Observable<Pagination<IUser>> {
        limit = limit > 100 ? 100 : limit;
        
        const route = `${process.env.API_URL}:${process.env.API_PORT}/api/users`;
        console.log('#### route', route);
        if (name === null || name === undefined) {
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
                { name }, 
            );
        }
        
    }

    @UseGuards(JwtAuthGuard, UserIsUserGuard)
    @Put(':id')
    updateOne(@Param('id') id: string, @Body() user: IUser): Observable<any> {
        return this.userService.updateOne(Number(id), user);
    }

    @UseGuards(JwtAuthGuard, UserIsUserGuard)
    @Put(':id/password')
    updatePassword(@Param('id') id: string, @Body() user: IUser): Observable<any> {
        return this.userService.updatePassword(Number(id), user);
    }

    @UseGuards(JwtAuthGuard)
    @Post('upload')
    @UseInterceptors(FileInterceptor('file', storage))
    uploadFile(@UploadedFile() file, @Request() req): Observable<File> {
        const user: IUser = req.user;
        console.log('### Upload', this.configService.get('UPLOAD_IMAGE_URL')); 
        console.log('### file name: ', file.filename);
        
        return this.userService.updateOne(user.id, { profileImage: file.filename}).pipe(
            tap((user: IUser) => console.log(user.id)),
            map((user: IUser) => ({ profileImage: user.profileImage })),
        )
    }

    @Get('profile-image/:imageName')
    findProfileImage(
        @Param('imageName') imageName, 
        @Response() resp
        ): Observable<unknown> {
        return of(
            resp.sendFile(
                path.join(process.cwd(), 'uploads/profileImages', imageName),
            ),
        );
    }

    // #################### ADMIN ######################################

    @hasRoles(UserRole.ADMIN)
    @UseGuards(JwtAuthGuard, RolesGuard)
    @sendRoles()
    @Put(':id/role')
    updateRoleOfUser(@Param('id') id: string, @Body() user: IUser): Observable<any> {
        const roles = Object.values(UserRole);
        if (roles.includes(user.role)) {
            return this.userService.updateRoleOfUser(Number(id), user);
        }else {
            return of({error: `Role '${user.role}' not allowed`});
        }
    }
    
    @hasRoles(UserRole.ADMIN)
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Delete(':id')
    deleteOne(@Param('id') id: string): Observable<any> {
        return this.userService.deleteOne(Number(id));
    }
}
