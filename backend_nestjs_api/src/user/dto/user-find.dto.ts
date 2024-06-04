import { BlogEntry } from "src/blog/interfaces/blog-entry.interface";
import { UserRole } from "../interfaces/user.interface";

export interface IUserFindResponse {
    id : number;
    userName : string;
    email : string;
    role : UserRole;
    profileImage: string | null;
    blogEntries: BlogEntry[];
}

