import { ExtractJwt, Strategy } from 'passport-jwt';
import { Injectable, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { ErrorHandler } from 'src/core/errors/error.handler';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(private configService: ConfigService) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: configService.get('JWT_SECRET'),
        });
    }

    async validate(payload: any) : Promise<any> {
        // console.log('### payload: ', payload);
        const user = { ...payload.user }; 
        try {
            if (!user) {
                ErrorHandler.handleUnauthorizedError('Not authorized');
            }
            return user;
        }catch (err) {
            throw err;
        }
    }
}