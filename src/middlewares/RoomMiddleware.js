import * as Dialog from '../actions/DialogActions';
import * as ROOM from '../constants/RoomActions';

export const room = ({ dispatch }) => (next) => (action) => {
    switch (action.type) {
        case ROOM.PASSWORD:
            dispatch(Dialog.open('room-password', action.id));
            break;
    }

    return next(action);
};
