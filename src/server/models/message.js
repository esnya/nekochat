import { Model } from './model';

export const TEXT = 'NODE_TYPE_TEXT';

export class MessageModel extends Model {
    constructor() {
        super('messages');
    }

    transform(item) {
        if (item.message) {
            if (item.message.charAt(0) === '[') {
                return {
                    ...item,
                    message: JSON.parse(item.message),
                };
            }

            return {
                ...item,
                message: item.message.split(/\r\n|\n/g).map((line) => ([{
                    type: TEXT,
                    text: line,
                }])),
            };
        }

        return item;
    }

    findAllImpl(room_id, user_id, ...finder) {
        const query = super
            .findAll('room_id', room_id)
            .where(function() {
                this
                    .whereNull('whisper_to')
                    .orWhere('whisper_to', user_id)
                    .orWhere('user_id', user_id);
            });

        return finder.length === 0 ? query : query.where(...finder);
    }

    findAll(room_id, user_id, ...finder) {
        return this
            .findAllImpl(room_id, user_id, ...finder)
            .then((messages) => messages.map(this.transform));
    }

    findLimit(room_id, user_id, ...finder) {
        return this
            .findAllImpl(room_id, user_id, ...finder)
            .limit(20)
            .then((messages) => messages.map(this.transform));
    }

    find(...finder) {
        return super.find(...finder)
            .then(this.transform);
    }
}

export const Message = new MessageModel();
