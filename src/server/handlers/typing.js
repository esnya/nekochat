import {
    update,
    UPDATE,
} from '../../actions/typing';

export default client => next => (action) => {
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
    default:
        break;
    }

    return next(action);
};
