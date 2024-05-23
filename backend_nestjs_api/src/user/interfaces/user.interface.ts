export interface IUser {
    id? : number;
    name? : string,
    email? : string,
    password? : string,
    role? : UserRole,
    profileImage?: string;
}

export enum UserRole {
    ADMIN = 'admin',
    CHIEFEDITOR = 'chiefeditor',
    EDITOR = 'editor',
    USER = 'user'
}

export interface File {
    profileImage: string;
}