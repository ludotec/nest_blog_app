import { IUser } from "src/user/interfaces/user.interface";

export interface BlogEntry {
    id?: number;
    title?: string;
    slug?: string;
    description: string;
    body: string;
    createdAt?: Date;
    updatedAt?: Date;
    likes?: number;
    author: IUser;
    headerImage?: string;
    publishedDate?: Date;
    isPublished?: boolean;

}
