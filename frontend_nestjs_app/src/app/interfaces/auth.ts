export interface LoginForm {
    email: string;
    password: string;
}

export interface RegisterForm {
    name: string;
    email: string;
    password: string;
    role?: string;
}

export interface IJWT {
    header: {
        alg: string;
        typ: string;
    };
    payload: {
        sub: string;
        exp: number;
        iat: number;
    }
    signature: string;
}

export interface IJwtDecoded {
    user: {
        id: number;
        name: string;
        email: string;
    }
}
