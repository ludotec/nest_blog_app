import { Body, Controller, Get, Param, Post, Put, Delete, UseGuards } from '@nestjs/common';
import { UserService } from '../services/user.service';
import { IUser, UserRole } from '../interfaces/user.interface';
import { Observable, catchError, map, of, switchMap, from } from 'rxjs';
import { AuthService } from 'src/auth/services/auth.service';
import { hasRoles } from 'src/auth/decorators/roles.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { sendRoles } from 'src/auth/decorators/send-roles.decorator';
import { UserIsUserGuard } from 'src/auth/guards/userIsUser.guard';

@Controller('users')
export class UserController {
    constructor(
        private userService: UserService,
        private readonly authService: AuthService
        ) {}

    @Post()
    create(@Body() user: IUser): Observable<IUser | { error: any }> {
        return this.userService.create(user).pipe(
            map((user: IUser)=> user ),
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

    @hasRoles(UserRole.ADMIN)
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Get()
    findAll(): Observable<IUser[]> {
        return this.userService.findAll();
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
