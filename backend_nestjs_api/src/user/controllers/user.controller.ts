import { Body, Controller, Get, Param, Post, Put, Delete } from '@nestjs/common';
import { UserService } from '../services/user.service';
import { User } from '../interfaces/user.interface';
import { Observable, catchError, map, of, switchMap, from } from 'rxjs';
import { AuthService } from 'src/auth/services/auth.service';
import { UserEntity } from '../models/user.entity';

@Controller('users')
export class UserController {
    constructor(
        private userService: UserService,
        private readonly authService: AuthService
        ) {}

    @Post()
    create(@Body() user: User): Observable<User | { error: any }> {
        return this.userService.create(user).pipe(
            map((user: User)=> user ),
            catchError((err)=> of({ error: err.message })),            
        )
    }

    @Post('login')
    login(@Body() user: User): Observable<{ access_token: any }> {
        return this.userService.login(user).pipe(
            map((jwt: string)=> {
                return { access_token: jwt };
            }),
        )
    }

    @Get(':id')
    findOne(@Param() params): Observable<User> {
        return this.userService.findOne(params.id)
    }

    @Get()
    findAll(): Observable<User[]> {
        return this.userService.findAll();
    }

    @Put(':id')
    updateOne(@Param('id') id: string, @Body() user: User): Observable<any> {
        return this.userService.updateOne(Number(id), user);
    }

    @Delete(':id')
    deleteOne(@Param('id') id: string): Observable<any> {
        return this.userService.deleteOne(Number(id));
    }
}
