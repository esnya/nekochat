import { Map } from 'immutable';
import { combineReducers } from 'redux';
import { routerStateReducer } from 'redux-router';
import User from '../browser/user';
import characters from './characters';
import dialogs from './dialogs';
import dom from './dom';
import icons from './icons';
import immutable from './immutable';
import messages from './messages';
import names from './names';
import room from './room';
import rooms from './rooms';
import toasts from './toasts';
import typings from './typings';
import ui from './ui';
import users from './users';

export default combineReducers({
    router: routerStateReducer,
    characters,
    dialogs,
    dom,
    icons,
    messages,
    names,
    room,
    rooms,
    toasts,
    typings,
    ui,
    user: immutable(new Map(User)),
    users,
});
