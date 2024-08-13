export interface User {
    id: string,
    name: string,
    lastname: string,
    email: string,
    token: string,
    [key: string]: any; 
}

export interface newUser {
    
    name: string,
    lastname: string,
    email: string,
    password: string,
    group: string,
    [key: string]: any; 
}