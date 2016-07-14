import { Model } from './model';

export class IconModel extends Model {
    constructor() {
        super('icons', 'name', 'ASC');
    }

    findAll(...finder) {
        return super
            .findAll(...finder)
            .select('id', 'user_id', 'name', 'type', 'created', 'modified');
    }
}

export const Icon = new IconModel();
