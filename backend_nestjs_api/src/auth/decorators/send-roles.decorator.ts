import { SetMetadata } from "@nestjs/common";
import { UserRole } from "src/user/interfaces/user.interface";

export function sendRoles(): any {
    return SetMetadata('roles', UserRole);
}