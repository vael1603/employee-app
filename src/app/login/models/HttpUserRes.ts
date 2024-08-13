import { User } from "./User";

export interface HttpUserRes {
    status: boolean,
    message: string,
    data:  User
} 