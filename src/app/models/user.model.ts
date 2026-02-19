export interface User {
    name: string;
    email: string;
    password: string;
}

export interface LoginResponse {
    _id: string,
    name: string,
    email: string,
    role: string,
    token: string
}

export interface LoginCredentials {
    email: string;
    password: string;
}

export type UserInfo = Omit<LoginResponse, 'token'>;