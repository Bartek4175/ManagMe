export interface User {
    _id: string;
    login: string;
    password: string;
    firstName: string;
    lastName: string;
    role: 'admin' | 'devops' | 'developer';
}
