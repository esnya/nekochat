import { Model } from './model';

export class UserModel extends Model {
    constructor() {
        super('users');
    }
}

export const User = new UserModel();
