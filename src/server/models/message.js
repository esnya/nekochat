import { Model } from './model';

export class MessageModel extends Model {
    constructor() {
        super('messages');
    }

    findAll(room_id, user_id, ...finder) {
        const query = super
            .findAll('room_id', room_id)
            .where(function() {
                this
                    .whereNull('whisper_to')
                    .orWhere('whisper_to', user_id)
                    .orWhere('user_id', user_id);
            })
            .limit(20);

        if (finder.length === 0) return query;
        return query.where(...finder);
    }
}

export const Message = new MessageModel();