import {
    update,
    UPDATE,
} from '../../actions/typing';

export const typing = (client) => (next) => (action) => {
    const { type, payload } = action;

    switch (type) {
        case UPDATE: {
            client.publish(update({
                id: client.socket.id,
                user_id: client.user.id,
                name: payload.name,
                message: payload.message,
                timestamp: Date.now(),
            }));
            client.touch();
            break;
        }
    }

    return next(action);
};
