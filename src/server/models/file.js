import { Model } from './model';

export class FileModel extends Model {
    constructor() {
        super('files');
    }
}

export const File = new FileModel();
