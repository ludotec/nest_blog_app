import { Body, Controller, Get, Param, Post, Put, Delete } from '@nestjs/common';
import { UserService } from '../services/user.service';
import { User } from '../interfaces/user.interface';
import { Observable, catchError, map, of } from 'rxjs';

@Controller('users')
export class UserController {
    constructor(private userService: UserService) {}

    @Post()
    create(@Body() user: User): Observable<User | { error: any }> {
        return this.userService.create(user).pipe(
            map((user: User)=> user ),
            catchError((err)=> of({ error: err.message })),            
        )
    }

    @Get(':id')
    findOne(@Param() params): Observable<User> {
        return this.userService.finOne(params.id)
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
