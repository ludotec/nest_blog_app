import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '../models/user.entity';
import { Repository } from 'typeorm';
import { User } from '../interfaces/user.interface';
import { Observable, from, map, switchMap } from 'rxjs';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(UserEntity) private readonly userRepository: Repository<UserEntity>
    ) {}

    create(user: User): Observable<User> {
        return from(this.userRepository.save(user));
    }

    findAll(): Observable<User[]> {
        return from(this.userRepository.find()).pipe(
         map((users: User[])=> {
             users.forEach((user)=> {
                 // delete user.password
             });
             return users;
         }),
        );
     
     }

     finOne(id: number): Observable<User> {
        return from(this.userRepository.findOneBy({ id })).pipe(
            map((user: User)=> {
                if(user) {
                    // const { password, ...result } = user;
                    return user;
                }else {
                    return null;
                }
            }),
        );
    }

    updateOne(id: number, user: User): Observable<any> {
        delete user.email;

        return from(this.userRepository.update(Number(id), user)).pipe(
            switchMap(()=> this.finOne(id)),
        );
    }

    deleteOne(id: number): Observable<any> {
        return from(this.userRepository.delete(id));
    }

}
