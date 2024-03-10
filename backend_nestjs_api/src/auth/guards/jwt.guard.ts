import { Injectable } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";


@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
    // no hace falta implementarlo por que acepta la estrategia que tenemos en el jwt-strategy
}
