export interface IUser {
    id? : number;
    name? : string,
    email? : string,
    password? : string,
    role? : UserRole,
}

export enum UserRole {
    ADMIN = 'admin',
    CHIEFEDITOR = 'chiefeditor',
    EDITOR = 'editor',
    USER = 'user'
}

export interface IUsersPaginated {
    items: IUser[];
    meta: {
        totalItems: number,
        itemCount: number,
        itemsPerPage: number,
        totalPages: number,
        currentPage: number,
    };
    links: {
        first: string,
        previous: string,
        next: string,
        last: string,
    }
}