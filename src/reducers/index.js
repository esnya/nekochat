import { Map } from 'immutable';
import { combineReducers } from 'redux';
import { reducer as routerReducer } from 'redux-tower';
import User from '../browser/user';
import characters from './characters';
import dialogs from './dialogs';
import dom from './dom';
import gameTypes from './gameTypes';
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
    router: routerReducer,
    characters,
    dialogs,
    dom,
    gameTypes,
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
