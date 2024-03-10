import {
    Injectable,
    CanActivate,
    ExecutionContext,
    Inject,
    forwardRef,
} from '@nestjs/common';
import { Observable, map } from 'rxjs';
import { IUser } from 'src/user/interfaces/user.interface';
import { UserService } from 'src/user/services/user.service';

@Injectable()
export class UserIsUserGuard implements CanActivate {
    constructor(@Inject(forwardRef(() => UserService))
    private userService: UserService,) {}
    
    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        const request = context.switchToHttp().getRequest();
        const params = request.params;
        const user: IUser = request.user;
        console.log('### user:', user );
        
        return this.userService.findOne(user.id).pipe(
            map((user: IUser) => {
                let hasPermission = false;

                console.log('### USER IS USER GUARD:', user.id, params.id);
                if (user.id === Number(params.id)) {
                    hasPermission = true;
                }
                return user && hasPermission;
            }),
        );
        
    }
}
