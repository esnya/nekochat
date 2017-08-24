// @flow
import { fork, put } from 'redux-saga/effects';
import { actions } from 'redux-tower';
import * as RoomActions from '../../actions/room';
import * as UIActions from '../../actions/ui';
import Chat from '../../components/Chat';
import Guest from '../../components/Guest';
import Lobby from '../../components/Lobby';

function* closeDrawer() {
    yield put(UIActions.drawer(false));
}

export default {
    '/': function* lobby() {
        yield fork(closeDrawer);

        yield put(RoomActions.leave());
        yield put(RoomActions.fetch());

        yield put(actions.changeComponent(Lobby));
    },
    '/guest': function* guest() {
        yield fork(closeDrawer);
        yield put(actions.changeComponent(Guest));
    },
    '/:roomId': function* chat({ params: { roomId } }: { params: { roomId: string }}) {
        yield fork(closeDrawer);
        yield put(RoomActions.join({ id: roomId }));
        yield put(actions.changeComponent(Chat));
    },
};
