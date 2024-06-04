import { CanActivate, ExecutionContext, Inject, Injectable, forwardRef } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { Observable, map } from "rxjs";
import { IUser } from "src/user/interfaces/user.interface";
import { UserService } from "src/user/services/user.service";

@Injectable()
export class RolesGuard implements CanActivate {
    constructor(
        private reflector: Reflector,
        @Inject(forwardRef(() => UserService))
        private userService: UserService
        ) {}

    canActivate(
        context: ExecutionContext,
    ): boolean | Promise<boolean> | Observable<boolean> {
        const roles = this.reflector.get<string[]>('roles', context.getHandler());
        try {
            if (!roles) return true;

            const request = context.switchToHttp().getRequest();
            const user: IUser = request.user;
        
            return this.userService.findOneById(user.id).pipe(
                map((user: IUser) => {
                    const hasRole = () => roles.indexOf(user.role) > -1;
                    let hasPermission = false;
                    if(hasRole()) {
                        hasPermission = true;
                    }

                    return user && hasPermission;
                } ),
            );
        }catch (err) {
            throw err;
        }
    }    
}