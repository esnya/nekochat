import * as Input from '../../actions/InputActions';
import * as INPUT from '../../constants/InputActions';

export const input = (client) => (next) => (action) => {
    switch (action.type) {
        case INPUT.BEGIN: {
            client.publish(Input.began({
                id: client.socket.id,
                user_id: client.user.id,
                name: action.name,
                message: action.message,
            }));
            client.touch();
            break;
        }
        case INPUT.END: {
            client.publish(Input.ended({
                id: client.socket.id,
                user_id: client.user.id,
                name: action.name,
            }));
            client.touch();
            break;
        }
    }

    return next(action);
};
