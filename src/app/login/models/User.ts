export interface User {
    id: string,
    name: string,
    lastname: string,
    email: string,
    token: string,
    [key: string]: any; 
}