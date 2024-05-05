import { User } from '../models/User';

export class UserService {
    static users: User[] = [
        { id: '1', firstName: 'Jan', lastName: 'Kowalski', role: 'admin' },
        { id: '2', firstName: 'Anna', lastName: 'Nowak', role: 'developer' },
        { id: '3', firstName: 'Piotr', lastName: 'Wiśniewski', role: 'devops' },
    ];

    static currentUser: User = UserService.users.find(user => user.role === 'admin')!;

    static getUsers(): User[] {
        return this.users;
    }

    static getCurrentUser(): User {
        return this.currentUser;
    }
}