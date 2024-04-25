import { User } from '../models/User';

export class UserService {
    static currentUser: User = {
        id: '1',
        firstName: 'Jan',
        lastName: 'Kowalski'
    };

    static getCurrentUser(): User {
        return this.currentUser;
    }
}
