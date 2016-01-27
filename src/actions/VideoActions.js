import * as VIDEO from '../constants/VideoActions';

export const create = () => ({
    type: VIDEO.CREATE,
    server: true,
});
export const created = (id) => ({
    type: VIDEO.CREATED,
    id,
});
export const push = (id) => ({
    type: VIDEO.PUSH,
    id,
});
export const request = (to, callme) => ({
    type: VIDEO.REQUEST,
    server: true,
    to,
    callme,
});
export const requested = (to, callme) => ({
    type: VIDEO.REQUESTED,
    to,
    callme,
});

export const remove = (id) => ({
    type: VIDEO.REMOVE,
    server: true,
    id,
});
export const removed = (id) => ({
    type: VIDEO.REMOVED,
    id,
});
export const end = () => ({
    type: VIDEO.END,
});