import { join, leave, fetch } from '../actions/room';

export const Routes = [
    {
        path: '/', route: 'lobby',
        onEnter: (dispatch) => () => {
            dispatch(leave());
            dispatch(fetch());
        },
    },
    {
        path: '/guest', route: 'guest',
    },
    {
        path: '/:roomId', route: 'chat',
        onEnter: (dispatch) => ({ roomId }) => dispatch(join({ id: roomId })),
    },
];
