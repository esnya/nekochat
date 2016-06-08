import {createAction} from 'redux-actions';

export const JOINED = 'USER_JOINED';
export const joined = createAction(JOINED, (user) => user, (user) => ({
    notify: {
        title: '${state.room.get("title")}',
        body: `${user.name}@${user.id} joined`,
        force: true,
    },
}));

export const LEFT = 'USER_LEFT';
export const left = createAction(LEFT, (user) => user, (user) => ({
    notify: {
        title: '${state.room.get("title")}',
        body: `${user.name}@${user.id} left`,
        force: true,
    },
}));

export const FETCH = 'USER_FETCH';
export const fetch = createAction(FETCH);

export const LIST = 'USER_LIST';
export const list = createAction(LIST, (users) => users);
