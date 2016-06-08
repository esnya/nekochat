import { Map } from 'immutable';
import { combineReducers } from 'redux';
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
import route from './route';
import toasts from './toasts';
import typings from './typings';
import ui from './ui';
import users from './users';

export default combineReducers({
    characters,
    dialogs,
    dom,
    icons,
    messages,
    names,
    room,
    rooms,
    route,
    toasts,
    typings,
    ui,
    user: immutable(new Map(User)),
    users,
});
