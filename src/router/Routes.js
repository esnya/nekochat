import { join, leave } from '../actions/RoomActions';

export const Routes = [
    {
        path: '/', route: 'lobby',
        onEnter: (dispatch) => () => dispatch(leave()),
    },
    {
        path: '/:roomId', route: 'chat',
        onEnter: (dispatch) => ({roomId}) => dispatch(join(roomId)),
    },
];
