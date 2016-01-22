import * as Message from '../actions/MessageActions';
import * as Room from '../actions/RoomActions';

export const Routes = [
    { path: '/', route: 'lobby' },
    { path: '/:roomId', route: 'chat' },
];